<template>
  <div class="w-full flex flex-col gap-3">
    <div class="flex items-center justify-between">
      <div>
        <p class="text-base md:text-lg font-bold uppercase tracking-widest text-[#f0ede8] leading-none">
          {{ capitalizedEntityType }}
        </p>
        <p class="text-[10px] tracking-[0.2em] uppercase text-[#555] mt-0.5">
          {{ statusText }}
        </p>
      </div>
      <div class="text-right">
        <div class="text-xl font-bold text-[#e8c84a] tracking-wide">
          {{ openCosts?.toFixed(2) }} €
        </div>
        <div class="text-[10px] tracking-[0.15em] uppercase text-[#555]">total</div>
      </div>
    </div>
    <div class="w-full h-0.5 bg-[#1f1f1f] rounded-full overflow-hidden">
      <div
        class="h-full rounded-full transition-all duration-700"
        :class="progressBarColor"
        :style="{ width: progressInPercent + '%' }"
      ></div>
    </div>
    <div class="text-[10px] tracking-[0.15em] uppercase text-[#444]">
      {{ entitiesDoneCount }} / {{ totalEntitiesCount }} done
    </div>
    <div class="flex flex-col gap-1 overflow-y-auto max-h-80 md:max-h-[280px] pr-1
      [&::-webkit-scrollbar]:w-0.5
      [&::-webkit-scrollbar-track]:bg-transparent
      [&::-webkit-scrollbar-thumb]:bg-[#2a2a2a]">

      <div v-if="entities.length === 0" class="text-xs text-[#444] tracking-widest uppercase py-6 text-center border border-dashed border-[#222] rounded-sm">
        No {{ props.entityType }} {{ showDoneEntities ? "done" : "planned" }}
      </div>
      <div
        v-for="entity in entities"
        :key="entity.id"
        class="relative rounded-sm"
      >
        <div
          class="absolute inset-0 flex items-center px-4 transition-opacity duration-150"
          :class="showDoneEntities ? 'bg-red-950/60 justify-end' : 'bg-green-950/60 justify-start'"
          :style="{ opacity: Math.min(Math.abs(swipeOffset[entity.id] || 0) / 60, 1) }"
        >
          <svg v-if="!showDoneEntities" class="w-4 h-4 text-[#4ade80]" fill="none" viewBox="0 0 24 24">
            <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M5 13l4 4L19 7"/>
          </svg>
          <svg v-else class="w-4 h-4 text-[#ef4444]" fill="none" viewBox="0 0 24 24">
            <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"/>
          </svg>
        </div>
        <div
          class="group relative flex items-center justify-between px-3 py-2.5 bg-[#141414] border border-[#1f1f1f] hover:border-[#2a2a2a] transition-colors duration-150 touch-pan-y"
          :style="{ transform: `translateX(${swipeOffset[entity.id] || 0}px)`, transition: swipingId === entity.id ? 'none' : 'transform 0.3s ease' }"
          @mousedown="onDragStart($event, entity.id)"
          @touchstart.passive="onDragStart($event, entity.id)"
          @mousemove="onDragMove($event, entity.id)"
          @touchmove="onDragMove($event, entity.id)"
          @mouseup="onDragEnd(entity.id)"
          @mouseleave="onDragEnd(entity.id)"
          @touchend="onDragEnd(entity.id)"
        >
          <div class="flex items-center gap-3 min-w-0 flex-1">
            <div class="w-1 h-4 bg-[#2a2a2a] group-hover:bg-[#e8c84a] transition-colors duration-150 rounded-full shrink-0"></div>
            <span class="text-sm text-[#c0bdb8] truncate">{{ entity.Name }}</span>
          </div>
          <div class="flex items-center gap-3 shrink-0 ml-2">
            <span v-if="entity.Costs !== ''" class="text-sm font-semibold text-[#888] tabular-nums">
              {{ entity.Costs.toFixed(2) }} €
            </span>
            <button
              v-if="!showDoneEntities"
              @click="setEntityToDone(entity.id)"
              class="hidden md:flex opacity-0 group-hover:opacity-100 transition-opacity duration-150 w-6 h-6 items-center justify-center rounded-sm border border-[#2a2a2a] hover:border-[#4ade80] hover:text-[#4ade80] text-[#444]"
            >
              <svg class="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24">
                <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M5 13l4 4L19 7"/>
              </svg>
            </button>
            <button
              v-if="showDoneEntities"
              @click="deactivateEntity(entity.id)"
              class="hidden md:flex opacity-0 group-hover:opacity-100 transition-opacity duration-150 w-6 h-6 items-center justify-center rounded-sm border border-[#2a2a2a] hover:border-[#ef4444] hover:text-[#ef4444] text-[#444]"
            >
              <svg class="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24">
                <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"/>
              </svg>
            </button>
          </div>
        </div>
      </div>
    </div>
    <div v-if="!showDoneEntities" class="mt-1">
      <AddEntity :entityType="props.entityType" />
    </div>
    <button
      @click="toggleShowDoneEntities"
      class="mt-2 text-[10px] tracking-[0.2em] uppercase text-[#444] hover:text-[#888] transition-colors duration-150 text-left"
    >
      {{ showDoneEntities ? 'Show open' : 'Show done' }} &rarr;
    </button>
  </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted, watch, computed } from "vue";
import { collection, query, where, onSnapshot, doc, updateDoc } from "firebase/firestore";
import { db } from "../firebase.js";
import AddEntity from "./AddEntity.vue";

var showDoneEntities = ref(false);
var openCosts = ref(null);
var entities = ref([]);
var totalEntitiesCount = ref(null);
var entitiesDoneCount = ref(null);
var entitiesOpenCount = ref(null);

var swipeOffset = ref({});
var swipingId = ref(null);
var startX = ref(0);
var startY = ref(0);
const SWIPE_THRESHOLD = 80;

function getClientX(event) {
  return event.touches ? event.touches[0].clientX : event.clientX;
}

var isHorizontalSwipe = ref({});

function onDragStart(event, id) {
  swipingId.value = id;
  startX.value = getClientX(event);
  startY.value = event.touches ? event.touches[0].clientY : event.clientY;
  isHorizontalSwipe.value[id] = null;
  if (!swipeOffset.value[id]) swipeOffset.value[id] = 0;
}

function onDragMove(event, id) {
  if (swipingId.value !== id) return;

  var delta = getClientX(event) - startX.value;
  var deltaY = (event.touches ? event.touches[0].clientY : event.clientY) - startY.value;

  if (isHorizontalSwipe.value[id] === null) {
    isHorizontalSwipe.value[id] = Math.abs(delta) > Math.abs(deltaY);
  }

  if (!isHorizontalSwipe.value[id]) return;

  event.preventDefault();

  if (!showDoneEntities.value && delta > 0) return;
  if (showDoneEntities.value && delta < 0) return;

  var resistance = Math.abs(delta) > 60 ? 60 + (Math.abs(delta) - 60) * 0.3 : Math.abs(delta);
  swipeOffset.value = { ...swipeOffset.value, [id]: delta < 0 ? -resistance : resistance };
}

function onDragEnd(id) {
  if (swipingId.value !== id) return;
  swipingId.value = null;

  var offset = swipeOffset.value[id] || 0;

  if (Math.abs(offset) >= SWIPE_THRESHOLD) {
    if (!showDoneEntities.value && offset < 0) {
      setEntityToDone(id);
    } else if (showDoneEntities.value && offset > 0) {
      deactivateEntity(id);
    }
  }

  swipeOffset.value = { ...swipeOffset.value, [id]: 0 };
}

const progressInPercent = computed(() => {
  var total = totalEntitiesCount.value;
  var done = entitiesDoneCount.value;
  return total > 0 ? (done / total) * 100 : 0;
});

const progressBarColor = computed(() => {
  if (progressInPercent.value < 25) return 'bg-red-500';
  if (progressInPercent.value < 50) return 'bg-yellow-400';
  return 'bg-[#4ade80]';
});

const statusText = computed(() => {
  return showDoneEntities.value ? 'Already done' : 'To do';
});

const props = defineProps({
  userUID: String,
  entityType: String
});

var capitalizedEntityType = props.entityType.charAt(0).toUpperCase() + props.entityType.slice(1);
var unsubscribe = null;

onMounted(() => fetchEntities(props.userUID, props.entityType, showDoneEntities.value));
onUnmounted(() => { if (unsubscribe) unsubscribe(); });

const fetchEntities = (userUID, entityType, showDone) => {
  if (!userUID) return;
  if (unsubscribe) unsubscribe();

  var entitiesQuery = query(
    collection(db, entityType),
    where("UserUID", "==", userUID),
    where("IsDone", "==", showDone),
    where("IsDeactivated", "==", false)
  );

  unsubscribe = onSnapshot(entitiesQuery, (snapshot) => {
    var fetchedEntities = snapshot.docs.map((doc) => ({ ...doc.data(), id: doc.id }));
    openCosts.value = fetchedEntities.reduce((sum, e) => sum + (Number(e.Costs) || 0), 0);
    totalEntitiesCount.value = fetchedEntities.length;

    var done = fetchedEntities.filter(e => e.IsDone === true);
    var open = fetchedEntities.filter(e => e.IsDone === false);
    
    entities.value = showDone ? done : open;
    entitiesDoneCount.value = done.length;
    entitiesOpenCount.value = open.length;
  });
};

const setEntityToDone = async (entityId) => {
  try {
    await updateDoc(doc(db, props.entityType, entityId), { IsDone: true });
  } catch (error) {
    console.error("Error updating:", props.entityType);
  }
};

const deactivateEntity = async (entityId) => {
  try {
    await updateDoc(doc(db, props.entityType, entityId), { IsDeactivated: true });
  } catch (error) {
    console.error("Error updating:", props.entityType);
  }
};

watch(showDoneEntities, (newValue) => fetchEntities(props.userUID, props.entityType, newValue));

function toggleShowDoneEntities() {
  showDoneEntities.value = !showDoneEntities.value;
}
</script>
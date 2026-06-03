<template>
  <div class="min-h-screen bg-[#0e0e0e] px-4 pt-6 pb-10">
    <div class="mb-6">
      <Dashboard :userUID="userUID" />
    </div>
    <div class="relative overflow-hidden">
      <div class="flex gap-1 mb-4">
        <button
          v-for="(entityType, index) in types"
          :key="entityType"
          @click="show(index)"
          :class="[
            'flex-1 py-2 text-xs tracking-[0.15em] uppercase font-semibold border-b-2 transition-all duration-200',
            index === currentIndex
              ? 'border-[#e8c84a] text-[#e8c84a]'
              : 'border-[#2a2a2a] text-[#555] hover:text-[#888]'
          ]"
        >
          {{ entityType }}
        </button>
      </div>
      <div class="relative h-[520px] md:h-[480px]">
        <div
          v-for="(entityType, index) in types"
          :key="entityType"
          :class="panelClass(index)"
          class="absolute inset-0 flex justify-center items-start"
        >
          <ItemList :userUID="userUID" :entityType="entityType" />
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { useRoute } from "vue-router";
import { ref, onMounted, onBeforeUnmount } from 'vue'
import ItemList from '../components/ItemList.vue'
import Dashboard from '../components/Dashboard.vue'

var route = useRoute();
var userUID = route.meta.userUID;
var types = ['repairs', 'mods', 'codings']
var currentIndex = ref(0)
var direction = ref(1)

function show(index) {
  if (index === currentIndex.value) return
  direction.value = index > currentIndex.value ? 1 : -1
  currentIndex.value = index
}

function next() {
  direction.value = 1
  currentIndex.value = Math.min(types.length - 1, currentIndex.value + 1)
}

function previous() {
  direction.value = -1
  currentIndex.value = Math.max(0, currentIndex.value - 1)
}

function onKey(e) {
  if (e.key === 'ArrowLeft') previous()
  if (e.key === 'ArrowRight') next()
}
onMounted(() => window.addEventListener('keydown', onKey))
onBeforeUnmount(() => window.removeEventListener('keydown', onKey))

function panelClass(index) {
  var isActive = index === currentIndex.value
  var isLeft = index < currentIndex.value
  var base = 'absolute inset-0 will-change-transform motion-duration-500 motion-ease-out'
  if (isActive) {
    var inFrom = direction.value === 1 ? 'motion-translate-x-in-[100%]' : 'motion-translate-x-in-[-100%]'
    return `${base} translate-x-0 ${inFrom}`
  } else if (isLeft) {
    return `${base} -translate-x-full motion-translate-x-out-[-100%]`
  } else {
    return `${base} translate-x-full motion-translate-x-out-[100%]`
  }
}
</script>
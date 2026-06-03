<template>
  <div class="w-full border border-[#2a2a2a] bg-[#141414] rounded-sm overflow-hidden">
    <div class="flex items-center gap-4 p-4">
      <div class="w-24 h-16 md:w-32 md:h-20 shrink-0 overflow-hidden rounded-sm bg-[#1a1a1a]">
        <img src="/bmw.png" class="w-full h-full object-contain" alt="BMW" />
      </div>
      <div class="flex flex-col gap-0.5 flex-1 min-w-0">
        <h2 class="text-lg md:text-2xl font-bold tracking-wider uppercase text-[#f0ede8] leading-none">
          BMW 325i E90
        </h2>
        <p class="text-[10px] md:text-xs tracking-[0.2em] text-[#555] uppercase truncate">
          WBAPH31060E125026
        </p>
        <div class="mt-2 inline-flex items-center gap-1.5">
          <span class="text-[10px] uppercase tracking-[0.15em] text-[#888]">Invested</span>
          <span class="text-base font-bold text-[#e8c84a] tracking-wide">{{ formattedTotal }} €</span>
        </div>
      </div>
    </div>
    <div class="border-t border-[#1f1f1f] px-4 py-2 flex items-center gap-3">
      <span class="w-2 h-2 rounded-full bg-[#4ade80] shrink-0"></span>
      <span class="text-[10px] tracking-[0.15em] uppercase text-[#555]">Active tracking</span>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, watch, onBeforeUnmount } from 'vue'
import { collection, query, where, onSnapshot } from 'firebase/firestore'
import { db } from "../firebase.js";

const props = defineProps({
  userUID: {
    type: String,
    default: null
  }
})

const entityTypes = ['repairs', 'mods', 'codings']
const totalCosts = ref(0)

const formattedTotal = computed(() =>
  totalCosts.value.toLocaleString('de-DE')
)

const unsubscribes = []
const collectionTotals = ref({
  repairs: 0,
  mods: 0,
  codings: 0
})

function setupListeners(userUID) {
  unsubscribes.forEach(fn => fn())
  unsubscribes.length = 0

  if (!userUID) {
    totalCosts.value = 0
    return
  }

  entityTypes.forEach(entityType => {
    const q = query(
      collection(db, entityType),
      where('UserUID', '==', userUID),
      where('IsDone', '==', true),
      where('IsDeactivated', '==', false)
    )

    const unsub = onSnapshot(q, (snapshot) => {
      const sum = snapshot.docs.reduce((acc, doc) => {
        return acc + (Number(doc.data().Costs) || 0)
      }, 0)

      collectionTotals.value[entityType] = sum
      totalCosts.value = Object.values(collectionTotals.value).reduce((a, b) => a + b, 0)
    })

    unsubscribes.push(unsub)
  })
}

watch(() => props.userUID, (uid) => setupListeners(uid), { immediate: true })

onBeforeUnmount(() => {
  unsubscribes.forEach(fn => fn())
})
</script>
<template>
  <div class="flex items-center gap-2 border border-dashed border-[#2a2a2a] hover:border-[#3a3a3a] transition-colors duration-200 rounded-sm px-3 py-2">
    <svg class="w-4 h-4 text-[#444] shrink-0" fill="none" viewBox="0 0 24 24">
      <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 12h14m-7 7V5"/>
    </svg>
    <input
      class="flex-1 bg-transparent text-sm text-[#c0bdb8] placeholder:text-[#3a3a3a] focus:outline-none min-w-0"
      type="text"
      v-model="entity.Name"
      placeholder="Name"
      required
      @keyup.enter="addEntity"
    />
    <input
      class="w-20 bg-transparent text-sm text-[#888] placeholder:text-[#3a3a3a] focus:outline-none text-right tabular-nums"
      type="number"
      min="0"
      v-model="entity.Costs"
      placeholder="0.00 €"
      @keyup.enter="addEntity"
    />
    <button
      @click="addEntity"
      class="shrink-0 w-6 h-6 flex items-center justify-center text-[#444] hover:text-[#e8c84a] transition-colors duration-150"
    >
      <svg class="w-4 h-4" fill="none" viewBox="0 0 24 24">
        <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8"/>
      </svg>
    </button>
  </div>
</template>

<script setup>
import { ref } from "vue";
import { collection, addDoc } from "firebase/firestore";
import { db } from "../firebase.js";
import { getAuth } from "firebase/auth";
import { defineEmits } from "vue";

var props = defineProps({ entityType: String });
var entity = ref({ Name: "", Costs: "" });
var emit = defineEmits(["entityAdded"]);

var addEntity = async () => {
  var user = getAuth().currentUser;
  if (!user) return alert("You must be logged in!");
  if (entity.value.Name === "") return alert("You must provide a name!");

  try {
    await addDoc(collection(db, props.entityType), {
      Name: entity.value.Name,
      Costs: entity.value.Costs,
      Month: new Date().toISOString().slice(0, 7),
      UserUID: user.uid,
      Timestamp: new Date(),
      IsDone: false,
      IsDeactivated: false
    });
    entity.value = {
      Name: "",
      Costs: "",
      Month: null
    };
    emit("entityAdded");
  } catch (error) {
    console.error("Error adding:", error);
  }
};
</script>
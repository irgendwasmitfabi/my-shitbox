<template>
    <div class="flex flex-row">
        <form @submit="addEntity" class="flex flex-row gap-2">
            <div class="flex items-center border-b border-gray-700 py-2 text-white">
              <input class="appearance-none bg-transparent border-none w-full mr-3 py-1 px-2 leading-tight focus:outline-none text-white"
                type="text"
                v-model="entity.Name"
                placeholder="Name"
                required
                @keyup.enter="addEntity"
              />
            </div>
            <div class="flex items-center border-b border-gray-700 py-2 text-white">
              <input class="appearance-none bg-transparent border-none w-full mr-3 py-1 px-2 leading-tight focus:outline-none"
                type="number"
                v-model="entity.Costs"
                placeholder="Costs"
                required
                @keyup.enter="addEntity"
              />
            </div>
          </form>
    </div>
</template>

<script setup>
    import { ref } from "vue";
    import { collection, addDoc } from "firebase/firestore";
    import { db } from "../firebase.js";
    import { getAuth } from "firebase/auth";
    import { defineEmits } from "vue";

    var props = defineProps({
        entityType: String
    });

    var entity = ref({ Name: "", Costs: "" });
    var emit = defineEmits(["entityAdded"]);

    var addEntity = async () => {
        var user = getAuth().currentUser;
        if (!user) {
            alert("You must be logged in!");
            return;
        }

        if (entity.value.Name === "") {
            return alert("You must provide a name!");
        }
        
        try {
            await addDoc(collection(db, props.entityType), {
                Name: entity.value.Name,
                Costs: entity.value.Costs,
                UserUID: user.uid,
                Timestamp: new Date(),
                IsDone: false,
                IsDeactivated: false
            });

            entity.value = { Name: "", Costs: "" };

            emit("entityAdded");
        } catch (error) {
            console.error("Error adding modification:", error);
        }
    };
</script>
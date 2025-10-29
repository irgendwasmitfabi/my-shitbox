<template>
    <div class="flex flex-row h-full">
        <div class="flex flex-col items-center justify-center border-2 w-96 rounded-l-md">
            <div class="h-24 flex items-center text-xl">
                <h1>{{capitalizedEntityType}}</h1>
            </div>
            <div class="w-80">
                <div class="mb-1 text-base font-medium">{{ openCosts?.toFixed(2) }} €</div>
                <div class="w-full rounded-full h-2.5 mb-4 dark:bg-gray-700">
                    <div class="h-2.5 rounded-full" :class="progressBarColor" :style="{ width: progressInPercent + '%' }"></div>
                </div>
            </div>
            <div class="h-1/2 w-90">
                <div class="overflow-auto h-full max-h-80 overflow-y-auto [&::-webkit-scrollbar]:w-2 [&::-webkit-scrollbar-track]:rounded-full [&::-webkit-scrollbar-track]:bg-gray-100 [&::-webkit-scrollbar-thumb]:rounded-full [&::-webkit-scrollbar-thumb]:bg-gray-300 dark:[&::-webkit-scrollbar-track]:bg-neutral-700 dark:[&::-webkit-scrollbar-thumb]:bg-neutral-500">
                    <div v-if="entities.length === 0">You currently have no {{props.entityType}} {{showDoneEntities ? "done" : "planned" }}</div>
                    <ul class="max-w-md space-y-1 list-disc list-inside">
                        <li class="flex flex-row align-middle justify-between group h-8" v-for="entity in entities" :key="entity.id">
                            <div class="flex w-80">
                                <p class="truncate w-2/3 text-left max-w-52" :class="primaryTextColor"> Name: <span :class="secondaryTextColor"> {{ entity.Name }} </span></p>
                                <p v-if="entity.Costs !== ''" class="w-1/3 text-left truncate" :class="primaryTextColor"> &nbsp;Costs: <span :class="secondaryTextColor"> {{ entity.Costs.toFixed(2) }}€ </span></p>
                            </div>
                            <div v-if="!showDoneEntities" class="flex items-center">
                                <button @click="setEntityToDone(entity.id)" type="button" class="hidden w-6 h-6 group-hover:block text-blue-700 border-blue-700 hover:bg-blue-700 hover:text-white focus:outline-none focus:ring-blue-300 font-medium rounded-full text-center items-center">
                                    <svg class="w-6 h-6 text-gray-800 dark:text-white" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none" viewBox="0 0 24 24">
                                        <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8.5 11.5 11 14l4-4m6 2a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z"/>
                                    </svg>
                                </button>
                            </div>
                            <div v-if="showDoneEntities" class="flex items-center">
                                <button @click="deactivateEntity(entity.id)" type="button" class="hidden w-6 h-6 group-hover:block text-blue-700 border-blue-700 hover:bg-blue-700 hover:text-white focus:outline-none focus:ring-blue-300 font-medium rounded-full text-center items-center">
                                    <svg class="w-6 h-6 text-gray-800 dark:text-white" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none" viewBox="0 0 24 24">
                                        <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8.5 11.5 11 14l4-4m6 2a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z"/>
                                    </svg>
                                </button>
                            </div>
                        </li>
                    </ul>
                </div>
                <div>
                    <AddEntity :entityType="props.entityType" v-if="!showDoneEntities"/>
                </div>
            </div>
        </div>
        <div @click="toggleShowDoneEntities" class="border-2 w-5 rounded-r-md h-auto hover:shadow-[6px_0_12px_-4px_rgba(255,255,255,0.3)]"></div>
    </div>
</template>

<script setup>
    import { ref, onMounted, onUnmounted, defineProps, watch, computed } from "vue";
    import { collection, query, where, onSnapshot, doc, updateDoc } from "firebase/firestore";
    import { db } from "../firebase.js";
    import AddEntity from "./AddEntity.vue";
    
    var showDoneEntities = ref(false);

    var openCosts = ref(null);
    var entities = ref([]);

    var totalEntitiesCount = ref(null);
    var entitiesDoneCount = ref(null);
    var entitiesOpenCount = ref(null);

    const progressInPercent = computed(() => {
        var total = totalEntitiesCount.value;
        var done = entitiesDoneCount.value;
        return total > 0 ? (done / total) * 100 : 0;
    });

    const progressBarColor = computed(() => {
        if (progressInPercent.value < 25) return 'bg-red-500';
        if (progressInPercent.value < 50) return 'bg-yellow-400';
        return 'bg-green-500';
    });

    const primaryTextColor = computed(() => {
        if (showDoneEntities.value === false) return 'text-blue-600';
        if (showDoneEntities.value === true) return 'text-green-600';
    });

    const secondaryTextColor = computed(() => {
        if (showDoneEntities.value === false) return 'text-blue-300';
        if (showDoneEntities.value === true) return 'text-green-300';
    });

    const props = defineProps({
        userUID: String,
        entityType: String
    });
    
    var capitalizedEntityType = props.entityType.charAt(0).toUpperCase() + props.entityType.slice(1);

    var unsubscribe = null;

    onMounted(() => {
        fetchEntities(props.userUID, props.entityType, showDoneEntities.value);
    });

    onUnmounted(() => {
        if (unsubscribe) unsubscribe();
    });

    const fetchEntities = (userUID, entityType, showDoneEntities) => {
        if (!userUID) return;

        if (unsubscribe) unsubscribe();

        var entitiesQuery = query(
            collection(db, entityType),
            where("UserUID", "==", userUID),
            where("IsDone", "==", showDoneEntities),
            where("IsDeactivated", "==", false)
        );

        unsubscribe = onSnapshot(entitiesQuery, (snapshot) => {
            var fetchedEntities = snapshot.docs.map((doc) => ({
                ...doc.data(),
                id: doc.id,
            }));

            var total = fetchedEntities
                .reduce((sum, entity) => {
                    var cost = Number(entity.Costs) || 0;
                    return sum + cost;
                }, 0);

            openCosts.value = total;

            totalEntitiesCount.value = fetchedEntities.length;

            var entitiesDone = fetchedEntities
                .filter(entity => entity.IsDone === true);

            var entitiesOpen = fetchedEntities
                .filter(entity => entity.IsDone === false);

            entities.value = showDoneEntities ? entitiesDone : entitiesOpen;

            entitiesDoneCount.value = entitiesDone.length;
            entitiesOpenCount.value = entitiesOpen.length;
        });
    };

    const setEntityToDone = async (entityId) => {
        try {
            var entityRef = doc(db, props.entityType, entityId); //TODO: Rename to full name
            await updateDoc(entityRef, {
                IsDone: true
            });
        } catch (error) {
            console.error("Error updating modification: ", props.entityType);
        }
    };

    const deactivateEntity = async (entityId) => {
        try {
            var entityRef = doc(db, props.entityType, entityId);
            await updateDoc(entityRef, {
                IsDeactivated: true
            });
        } catch (error) {
            console.error("Error updating modification: ", props.entityType);
        }
    };

    watch(showDoneEntities, async (newValue) => {
        fetchEntities(props.userUID, props.entityType, newValue);
    });

    function toggleShowDoneEntities() {
        showDoneEntities.value = !showDoneEntities.value;
    }
</script>
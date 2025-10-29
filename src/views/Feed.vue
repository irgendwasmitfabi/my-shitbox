<template>
    <div class="flex justify-center min-h-[550px]">
        <div class="p-10">
            <ItemList :userUID="userUID" :entityType="'repairs'"/>
        </div>
        <div class="p-10">
            <ItemList :userUID="userUID" :entityType="'modifications'"/>
        </div>
    </div>
</template>

<script setup>
    import { useRoute } from "vue-router";
    
    import ItemList from '../components/ItemList.vue'

    var route = useRoute();
    var userUID = route.meta.userUID;
</script>

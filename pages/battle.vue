<script setup>
import BattleTimelineDynamic from '~~/components/BattleTimelineDynamic.vue';
 const route = useRoute();

 const id = route.query.id;
</script>

<template>
    <BattleTimelineDynamic :id="id" />
</template>

  
<script setup lang="ts">
import { RouterView } from 'vue-router'
</script>

<template>
  <Suspense>
    <RouterView :key="$route.fullPath" class="bg-gray-900 text-gray-200 min-h-screen"/>
  </Suspense>
</template>
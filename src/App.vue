<script setup lang="ts">
import { RouterView } from 'vue-router'
import {onBeforeMount} from "vue";
import {ethers} from "ethers";


</script>

<template>
  <Suspense>
    <RouterView class="bg-gray-900 text-gray-200 min-h-screen"/>
  </Suspense>
</template>

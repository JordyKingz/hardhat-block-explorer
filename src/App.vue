<script setup lang="ts">
import { RouterView } from 'vue-router'
import {onBeforeMount} from "vue";
import {ethers} from "ethers";

onBeforeMount(() => {
  // @ts-ignore
  const provider = new ethers.providers.Web3Provider(window.ethereum);
  const signer = provider.getSigner();
  console.log(provider)
});
</script>

<template>
  <RouterView class="bg-gray-900 text-gray-200 min-h-screen"/>
</template>

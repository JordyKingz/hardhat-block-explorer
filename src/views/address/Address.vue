<script setup lang="ts">
import {RouterLink, useRoute} from 'vue-router'
import {ethers} from "ethers";
import {onBeforeMount, reactive, ref} from "vue";
import type {Block} from "@/types/Block";

const seconds = 1000;
const minute = 1000 * 60;
let state = reactive({
  ready: false,
});

let block = ref({} as Block);
const route = useRoute();
// @ts-ignore
const provider = new ethers.providers.Web3Provider(window.ethereum);
</script>

<template>
  <div>
    <div class="mx-auto max-w-7xl">
      <RouterLink to="/">Home</RouterLink>

      Address: {{route.params.address}}
    </div>
  </div>
</template>

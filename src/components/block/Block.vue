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

onBeforeMount(async () => {
  await getBlockchainData(Number(route.params.number));
});

async function getBlockchainData(blockNr: number) {
  // @ts-ignore
  block.value = await provider.getBlock(blockNr);

  if (!state.ready)
    state.ready = !state.ready;
}

function timePassed(timestamp: number) {
  const date = new Date(timestamp * 1000);
  const timePassed = new Date().getTime() - date.getTime();

  if (timePassed / minute < 1) {
    return "just now";
  } else if (timePassed / minute < 60) {
    return Math.floor(timePassed / minute) + " minutes ago";
  } else if (timePassed / minute < 1440) {
    return Math.floor(timePassed / minute / 60) + " hours ago";
  } else {
    return Math.floor(timePassed / minute / 1440) + " days ago";
  }
}

function formatDate(timestamp: number) {
  const options = { year: 'numeric', month: 'long', day: 'numeric' };
  const date = new Date(timestamp * 1000);
  // @ts-ignore
  return date.toLocaleString();
}

function calculateGasPercentage(gasUsed: number, gasLimit: number) {
  const percentage = (gasUsed / gasLimit) * 100;
  return percentage.toFixed(2);
}
</script>

<template>
  <div>
    <div class="mx-auto max-w-7xl">
      <div class="py-12 w-1/2">
        <RouterLink to="/">Home</RouterLink>
        <div>
          <h2 class="text-2xl font-medium">Local Block Explorer</h2>
        </div>
      </div>
      <div v-if="state.ready" class="mt-2">
        <h3 class="text-gray-200 text-2xl">
          Latest Block:
          <span class="text-xl text-gray-400">#{{block.number}}</span>
        </h3>
        <div class="mt-2 w-full bg-gray-800 px-4 py-3 rounded-lg">
          <div class="grid grid-cols-4 gap-4">
            <div class="col-span-1">
              Block Height
            </div>
            <div class="col-span-3">
              {{block.number}}
            </div>
          </div>
          <hr class="my-4 border-gray-500">
          <div class="grid grid-cols-4 gap-4">
            <div class="col-span-1">
              Timestamp
            </div>
            <div class="col-span-3">
              {{timePassed(block.timestamp)}} ({{formatDate(block.timestamp)}})
            </div>
          </div>
          <hr class="my-4 border-gray-500">
          <div class="grid grid-cols-4 gap-4">
            <div class="col-span-1">
              Mined By
            </div>
            <div class="col-span-3">
              <RouterLink :to="{name: 'address', params: {address: block.miner}}" class="text-blue-500 hover:text-purple-500">
                {{block.miner}}
              </RouterLink>
            </div>
          </div>
          <hr class="my-4 border-gray-500">
          <div class="grid grid-cols-4 gap-4">
            <div class="col-span-1">
              Gas Used
            </div>
            <div class="col-span-3">
              {{ block.gasUsed.toString() }}
              ({{ calculateGasPercentage(Number(block.gasUsed.toString()), Number(block.gasLimit.toString())) }}%)
            </div>
          </div>
          <hr class="my-4 border-gray-500">
          <div class="grid grid-cols-4 gap-4">
            <div class="col-span-1">
              Gas Limit
            </div>
            <div class="col-span-3">
              {{ block.gasLimit.toString() }}
            </div>
          </div>
          <hr class="my-4 border-gray-500">
          <div class="grid grid-cols-4 gap-4">
            <div class="col-span-1">
              Transactions
            </div>
            <div class="col-span-3">
              <div v-for="(tx, key) in block.transactions" :key="key" class="block">
                <RouterLink :to="{name: 'tx', params: {hash: tx}}">
                <span class="text-blue-500 hover:text-purple-500">
                  {{ tx }}
                </span>
                </RouterLink>
              </div>
            </div>
          </div>
<!--          <hr class="my-4 border-gray-500">-->
<!--          <div class="grid grid-cols-4 gap-4">-->
<!--            <div class="col-span-1">-->
<!--              Parent Hash-->
<!--            </div>-->
<!--            <div class="col-span-3">-->
<!--              <RouterLink :to="{name: 'tx', params: {hash: block.parentHash}}">-->
<!--                <span class="text-purple-500 hover:text-purple-400">-->
<!--                  {{block.parentHash}}-->
<!--                </span>-->
<!--              </RouterLink>-->
<!--            </div>-->
<!--          </div>-->
          <hr class="my-4 border-gray-500">
          <div class="grid grid-cols-4 gap-4">
            <div class="col-span-1">
              Nonce
            </div>
            <div class="col-span-3">
              {{ block.nonce }}
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

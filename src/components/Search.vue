<script setup lang="ts">
import {ethers} from "ethers";
import {useRouter} from "vue-router";
import {ref} from "vue";
const router = useRouter();
const searchQuery = ref('');

// @ts-ignore
const provider = new ethers.providers.Web3Provider(window.ethereum);

async function search() {
  const isAddress = ethers.utils.isAddress(searchQuery.value);
  if (isAddress) {
    await router.push({name: 'address', params: {address: searchQuery.value}});
  } else if (searchQuery.value.length === 66) {
    const isTx = await provider.getTransaction(searchQuery.value);
    if (isTx) {
      await router.push({name: 'tx', params: {hash: searchQuery.value}});
    }
  } else if (Number(searchQuery.value)) {
    const isBlock = await provider.getBlock(Number(searchQuery.value));
    if (isBlock) {
      await router.push({name: 'block', params: {number: searchQuery.value}});
    }
  }
}
</script>
<template>
  <div class="mt-4 grid grid-cols-3 gap-2">
    <div class="col-span-2">
      <input
          type="text"
          v-model="searchQuery"
          placeholder="Search by Address / Txn Hash / Block"
          class="w-full bg-gray-800 rounded-md border py-2 text-lg px-5 border-gray-900 outline-none focus:ring-purple-500">
    </div>
    <div>
      <button v-on:click="search" class="bg-gray-800 opacity-75 hover:bg-purple-500 hover:text-white rounded-md border py-2 px-4 font-medium text-lg border-gray-900">Search</button>
    </div>
  </div>
</template>
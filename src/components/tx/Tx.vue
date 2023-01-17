<script setup lang="ts">
import {RouterLink, useRoute} from 'vue-router'
import {ethers} from "ethers";
import {onMounted, reactive, ref} from "vue";
import type {Tx} from "@/types/Tx";

const seconds = 1000;
const minute = 1000 * 60;
let state = reactive({
  ready: false,
  formatData: false
});

let tx = ref({} as Tx);
const contractAbi = ref([]);
const route = useRoute();
// @ts-ignore
const provider = new ethers.providers.Web3Provider(window.ethereum);

onMounted(async () => {
  // @ts-ignore
  tx.value = await getTxData();

  if (tx.value) {
    // @ts-ignore
    contractAbi.value = await getContractAbi();

    if (tx.value && tx.value.data) {
      // @ts-ignore
      tx.value.data = await parseTxData();
    }
    state.ready = true;
  }
});

async function getTxData() {
  // @ts-ignore
  const response =  await provider.getTransaction(`${route.params.hash}`);
  // @ts-ignore
  return await provider.getTransaction(`${route.params.hash}`);
}

async function getContractAbi() {
  if (tx.value && tx.value.to) {
    try {
      const code = await provider.getCode(`${tx.value.to}`);
      if (code !== '0x') {
        const response = await fetch(`/configs/abis/${tx.value.to}.json`);
        const data = await response.json();
        return data.abi;
      }
    }
    catch(error){
      console.log(error)
    }
  } else if (tx.value && tx.value.creates) {
    try {
      const code = await provider.getCode(`${tx.value.creates}`);
      if (code !== '0x') {
        const response = await fetch(`/configs/abis/${tx.value.creates}.json`);
        const data = await response.json();
        return data.abi;
      }
    }
    catch(error){
      console.log(error)
    }
    return;
  }
}

async function parseTxData() {
  if (tx.value && !tx.value.creates && tx.value.data) {
    try {
      // @ts-ignore
      const _interface = new ethers.utils.Interface(contractAbi.value);
      // @ts-ignore
      const response = await _interface.parseTransaction({data: tx.value.data, value: tx.value.value});
      console.log(response);
      state.formatData = true;
      // @ts-ignore
      return _interface.parseTransaction({data: tx.value.data, value: tx.value.value});
    } catch (error) {
      console.log(error)
    }
  }
}
</script>

<template>
  <div>
    <div class="mx-auto max-w-7xl">
      <div class="py-12">
        <RouterLink to="/">Home</RouterLink>

        <div v-if="state.ready" class="mt-2">
          <h3 class="text-gray-200 text-2xl">
            Transaction Details
          </h3>
          <div class="mt-2 w-full bg-gray-800 px-4 py-3 rounded-lg">
            <div class="grid grid-cols-4 gap-4">
              <div class="col-span-1">
                Transaction Hash
              </div>
              <div class="col-span-3">
                {{tx.hash}}
              </div>
            </div>
            <hr class="my-4 border-gray-500">
            <div class="grid grid-cols-4 gap-4">
              <div class="col-span-1">
                Block
              </div>
              <div class="col-span-3">
                <div class="flex">
                  <RouterLink :to="{name: 'block', params: {number: tx.blockNumber}}">
                    <span class="text-blue-500 block hover:text-purple-500">
                      {{tx.blockNumber}}
                    </span>
                  </RouterLink>
                  <span class="ml-2 bg-gray-700 px-3 rounded-md">{{tx.confirmations}} Block Confirmation</span>
                </div>
              </div>
            </div>
            <hr class="my-4 border-gray-500">
            <div class="grid grid-cols-4 gap-4">
              <div class="col-span-1">
                From
              </div>
              <div class="col-span-3">
                <RouterLink v-if="tx.from" class="truncate" :to="{name: 'address', params: {address: tx.from}}">
                  <span class="text-blue-500 hover:text-purple-500">
                    {{tx.from}}
                  </span>
                </RouterLink>
              </div>
            </div>
            <hr v-if="tx.to" class="my-4 border-gray-500">
            <div v-if="tx.to" class="grid grid-cols-4 gap-4">
              <div class="col-span-1">
                Interacted with (to)
              </div>
              <div class="col-span-3">
                <RouterLink v-if="tx.to" class="truncate" :to="{name: 'address', params: {address: tx.to}}">
                  <span class="text-blue-500 hover:text-purple-500">
                    {{tx.to}}
                  </span>
                </RouterLink>
              </div>
            </div>
            <hr class="my-4 border-gray-500">
            <div class="grid grid-cols-4 gap-4">
              <div v-if="tx.to" class="col-span-1">
                Tokens Transferred
              </div>
              <div v-else-if="tx.creates" class="col-span-1">
                Contract created
              </div>
              <div class="col-span-3">
                From
                <RouterLink v-if="tx.from" class="truncate" :to="{name: 'address', params: {address: tx.from}}">
                  <span class="text-blue-500 pl-2 pr-1 hover:text-purple-500">
                    {{tx.from.substring(0, 10)}}...
                  </span>
                </RouterLink>
                <span v-if="tx.to">
                  To
                </span>
                <span v-else-if="tx.creates">
                  Created
                </span>
                <RouterLink v-if="tx.to" class="truncate" :to="{name: 'address', params: {address: tx.to}}">
                  <span class="text-blue-500 pl-2 pr-1 hover:text-purple-500">
                    {{tx.to.substring(0, 10)}}...
                  </span>
                </RouterLink>
                <RouterLink v-else-if="tx.creates" class="truncate" :to="{name: 'address', params: {address: tx.creates}}">
                  <span class="text-blue-500 pl-2 pr-1 hover:text-purple-500">
                    {{tx.creates.substring(0, 10)}}...
                  </span>
                </RouterLink>
                <span v-if="tx.data && tx.data.value">
                  {{ethers.utils.formatEther(`${tx.data.value}`)}}
                </span>
              </div>
            </div>
            <hr class="my-4 border-gray-500">
            <div class="grid grid-cols-4 gap-4">
              <div class="col-span-1">
                Value
              </div>
              <div class="col-span-3">
                <span v-if="tx.data">{{ethers.utils.formatEther(`${tx.data.value}`)}} Ether</span>
                <span v-else>{{ethers.utils.formatEther(`${tx.value.toString()}`)}}</span>
              </div>
            </div>
            <hr v-if="state.formatData" class="my-4 border-gray-500">
            <div v-if="state.formatData" class="grid grid-cols-4 gap-4">
              <div class="col-span-1">
                Input Data
              </div>
              <div class="col-span-3">
                <div class="bg-gray-600 px-4 py-3 rounded-md">
                  <code v-if="tx.data">
                    {{ tx.data.functionFragment.type }} {{ tx.data.functionFragment.name }}(
                      <span v-for="(input, key) in tx.data.functionFragment.inputs" :key="key">
                        {{ input.type }} {{ input.name }}<span v-if="key !== tx.data.functionFragment.inputs.length - 1">, </span>
                      </span>
                    )
                    <br>
                    <br>
                    MethodID: {{tx.data.sighash}}
                    <br>
                    <div v-for="(arg, i) in tx.data.args" :key="i">
                      [{{i}}]: {{arg}}
                    </div>
                  </code>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

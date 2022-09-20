<script setup lang="ts">
import {RouterLink, useRoute} from 'vue-router'
import {ethers} from "ethers";
import {onBeforeMount, onMounted, reactive, ref} from "vue";
import type {Tx} from "@/types/Tx";

const seconds = 1000;
const minute = 1000 * 60;
let state = reactive({
  ready: false,
});

let tx = ref({} as Tx);
const contractAbi = ref([]);
const route = useRoute();
// @ts-ignore
const provider = new ethers.providers.Web3Provider(window.ethereum);
// @ts-ignore
tx.value = await getTxData();
// @ts-ignore
contractAbi.value = await checkAddress();
// @ts-ignore
tx.value.data = await parseTxData();



onMounted(async () => {
  state.ready = true;
  console.log(tx.value.data);
});

async function getTxData() {
  // @ts-ignore
  return await provider.getTransaction(`${route.params.hash}`);
}


async function checkAddress() {
  try {
    const code = await provider.getCode(`${tx.value.to}`);
    if (code !== '0x') {
      // make an API call to the ABIs endpoint
      // const response = await fetch('https://api-ropsten.etherscan.io/api?module=contract&action=getabi&address=0xC1dcBB3E385Ef67f2173A375F63f5F4361C4d2f9&apikey=YourApiKeyToken');
      // const data = await response.json();
      // print the JSON response
      // return data.result;
      const response = await fetch(`/configs/abis/${tx.value.to}.json`);
      const data = await response.json();
      return JSON.stringify(data.abi);
    }
  } catch (error) {
    console.log(error)
  }
}

async function parseTxData() {
  try {
    // @ts-ignore
    const _interface = new ethers.utils.Interface(JSON.parse(contractAbi.value));

    // @ts-ignore
    return _interface.parseTransaction({data: tx.value.data, value: tx.value.value});
  } catch (error) {
    console.log(error)
  }
}
</script>

<template>
  <div v-if="state.ready">
    <div class="mx-auto max-w-7xl">
      <RouterLink to="/">Home</RouterLink>
      <div class="mt-2">
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
              From
            </div>
            <div class="col-span-3">
              <RouterLink v-if="tx.from !== ''" class="truncate" :to="{name: 'address', params: {address: tx.from}}">
                <span class="text-blue-500 pl-2 hover:text-purple-500">
                  {{tx.from}}
                </span>
              </RouterLink>
            </div>
          </div>
          <hr class="my-4 border-gray-500">
          <div class="grid grid-cols-4 gap-4">
            <div class="col-span-1">
              Interacted with (to)
            </div>
            <div class="col-span-3">
              <RouterLink v-if="tx.to !== ''" class="truncate" :to="{name: 'address', params: {address: tx.to}}">
                <span class="text-blue-500 pl-2 hover:text-purple-500">
                  {{tx.to}}
                </span>
              </RouterLink>
            </div>
          </div>
          <hr class="my-4 border-gray-500">
          <div class="grid grid-cols-4 gap-4">
            <div class="col-span-1">
              Tokens Transferred
            </div>
            <div class="col-span-3">
              From
              <RouterLink class="truncate" :to="{name: 'address', params: {address: tx.to}}">
                <span class="text-blue-500 pl-2 pr-1 hover:text-purple-500">
                  {{tx.from.substring(0, 10)}}...
                </span>
              </RouterLink>
              To
              <RouterLink class="truncate" :to="{name: 'address', params: {address: tx.to}}">
                <span class="text-blue-500 pl-2 pr-1 hover:text-purple-500">
                  {{tx.to.substring(0, 10)}}...
                </span>
              </RouterLink>
              {{ethers.utils.formatEther(`${tx.data.value}`)}}
            </div>
          </div>
          <hr class="my-4 border-gray-500">
          <div class="grid grid-cols-4 gap-4">
            <div class="col-span-1">
              Value
            </div>
            <div class="col-span-3">
              {{ethers.utils.formatEther(`${tx.data.value}`)}} Ether
            </div>
          </div>
          <hr class="my-4 border-gray-500">
          <div class="grid grid-cols-4 gap-4">
            <div class="col-span-1">
              Input Data
            </div>
            <div class="col-span-3">
              <div class="bg-gray-600 px-4 py-3 rounded-md">
                <code>
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
</template>

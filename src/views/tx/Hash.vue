<script setup lang="ts">
import {RouterLink, useRoute} from 'vue-router'
import {ethers} from "ethers";
import {onBeforeMount, reactive, ref} from "vue";
import type {Tx} from "@/types/Tx";

const seconds = 1000;
const minute = 1000 * 60;
let state = reactive({
  ready: false,
});

let tx = ref({} as Tx);
const route = useRoute();
// @ts-ignore
const provider = new ethers.providers.Web3Provider(window.ethereum);

onBeforeMount(async () => {
  await getTxData();
  await parseTxData();
});

async function getTxData() {
  // @ts-ignore
  tx.value = await provider.getTransaction(`${route.params.hash}`);
}

async function parseTxData() {
  // todo get abi when tx.to is to a contract. Needed to decode the data inputs of the tx
  // use etherscan api to get abi
  const ABI = [{"constant":true,"inputs":[],"name":"name","outputs":[{"internalType":"string","name":"","type":"string"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":false,"inputs":[{"internalType":"address","name":"spender","type":"address"},{"internalType":"uint256","name":"value","type":"uint256"}],"name":"approve","outputs":[{"internalType":"bool","name":"","type":"bool"}],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":true,"inputs":[],"name":"totalSupply","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":false,"inputs":[{"internalType":"address","name":"from","type":"address"},{"internalType":"address","name":"to","type":"address"},{"internalType":"uint256","name":"value","type":"uint256"}],"name":"transferFrom","outputs":[{"internalType":"bool","name":"","type":"bool"}],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":true,"inputs":[],"name":"decimals","outputs":[{"internalType":"uint8","name":"","type":"uint8"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":false,"inputs":[{"internalType":"address","name":"spender","type":"address"},{"internalType":"uint256","name":"addedValue","type":"uint256"}],"name":"increaseAllowance","outputs":[{"internalType":"bool","name":"","type":"bool"}],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":false,"inputs":[{"internalType":"address","name":"to","type":"address"},{"internalType":"uint256","name":"value","type":"uint256"}],"name":"mint","outputs":[{"internalType":"bool","name":"","type":"bool"}],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":true,"inputs":[{"internalType":"address","name":"owner","type":"address"}],"name":"balanceOf","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[],"name":"symbol","outputs":[{"internalType":"string","name":"","type":"string"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":false,"inputs":[{"internalType":"address","name":"account","type":"address"}],"name":"addMinter","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":false,"inputs":[],"name":"renounceMinter","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":false,"inputs":[{"internalType":"address","name":"spender","type":"address"},{"internalType":"uint256","name":"subtractedValue","type":"uint256"}],"name":"decreaseAllowance","outputs":[{"internalType":"bool","name":"","type":"bool"}],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":false,"inputs":[{"internalType":"address","name":"to","type":"address"},{"internalType":"uint256","name":"value","type":"uint256"}],"name":"transfer","outputs":[{"internalType":"bool","name":"","type":"bool"}],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":true,"inputs":[{"internalType":"address","name":"account","type":"address"}],"name":"isMinter","outputs":[{"internalType":"bool","name":"","type":"bool"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[{"internalType":"address","name":"owner","type":"address"},{"internalType":"address","name":"spender","type":"address"}],"name":"allowance","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"string","name":"_name","type":"string"},{"internalType":"string","name":"_symbol","type":"string"}],"payable":false,"stateMutability":"nonpayable","type":"constructor"},{"anonymous":false,"inputs":[{"indexed":true,"internalType":"address","name":"account","type":"address"}],"name":"MinterAdded","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"internalType":"address","name":"account","type":"address"}],"name":"MinterRemoved","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"internalType":"address","name":"from","type":"address"},{"indexed":true,"internalType":"address","name":"to","type":"address"},{"indexed":false,"internalType":"uint256","name":"value","type":"uint256"}],"name":"Transfer","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"internalType":"address","name":"owner","type":"address"},{"indexed":true,"internalType":"address","name":"spender","type":"address"},{"indexed":false,"internalType":"uint256","name":"value","type":"uint256"}],"name":"Approval","type":"event"}];
  const _interface = new ethers.utils.Interface(ABI);
  // @ts-ignore
  tx.value.data = await _interface.parseTransaction({data: tx.value.data, value: tx.value.value});
}
</script>

<template>
  <div>
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
                  {{tx.data.args.to.substring(0, 10)}}...
                </span>
              </RouterLink>
              {{ethers.utils.formatEther(`${tx.data.args.value}`)}}
            </div>
          </div>
          <hr class="my-4 border-gray-500">
          <div class="grid grid-cols-4 gap-4">
            <div class="col-span-1">
              Value
            </div>
            <div class="col-span-3">
              {{tx.value.toString()}} Ether
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

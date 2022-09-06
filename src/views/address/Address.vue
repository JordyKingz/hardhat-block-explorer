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

const route = useRoute();
// @ts-ignore
const provider = new ethers.providers.Web3Provider(window.ethereum);
const ethProvder = new ethers.providers.EtherscanProvider();

let address = reactive({transactions: <Tx[]>[]});
let contract = reactive({abi: []});

onBeforeMount(async () => {
  console.log(import.meta.env.VITE_ETHERSCAN_API)
  await checkAddress();
  await getAddress();
});

async function checkAddress() {
  try {
    const code = await provider.getCode(`${route.params.address}`);
    if (code !== '0x') {

      return true;
    }
  } catch (error) {
    console.log(error)
  }
}

async function getAddress() {
  console.log(route.params.address);
  // @ts-ignore
  address.transactions = await ethProvder.getHistory(`${route.params.address}`);
  console.log(address.transactions);
  // console.log(abiCoder.decode([''], tx.data));
  // console.log(ethers.utils.parseBytes32String(data));
}
</script>

<template>
  <div>
    <div class="mx-auto max-w-7xl">
      <RouterLink to="/">Home</RouterLink>

      Address: {{route.params.address}}
    </div>
  </div>
</template>

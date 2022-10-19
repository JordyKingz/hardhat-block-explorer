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
const ethProvider = new ethers.providers.EtherscanProvider('goerli');
// const ethProvider = new ethers.providers.EtherscanProvider('homestead', import.meta.env.VITE_ETHERSCAN_API);

let address = reactive({transactions: <Tx[]>[]});
let contract = reactive({abi: []});

onBeforeMount(async () => {
  await checkAddress();
  await getAddress();
});

async function checkAddress() {
  try {
    const code = await provider.getCode(`${route.params.address}`);
    if (code !== '0x') {
      console.log('contract');
      return true;
    }
  } catch (error) {
    console.log(error)
  }
}

async function getAddress() {
  console.log(route.params.address);
  // @ts-ignore
  address.transactions = await ethProvider.getHistory(`${route.params.address}`);
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
      <br>
      {{address.transactions.length}}

      <table class="min-w-full divide-y divide-gray-300">
        <thead>
          <tr>
            <th scope="col" class="py-3.5 pl-4 pr-3 text-left text-sm font-semibold text-white sm:pl-6">Tx hash</th>
            <th scope="col" class="px-3 py-3.5 text-left text-sm font-semibold text-white">Block nr</th>
            <th scope="col" class="px-3 py-3.5 text-left text-sm font-semibold text-white">Timestamp</th>
            <th scope="col" class="px-3 py-3.5 text-left text-sm font-semibold text-white">From</th>
            <th scope="col" class="px-3 py-3.5 text-left text-sm font-semibold text-white">To</th>
            <th scope="col" class="px-3 py-3.5 text-left text-sm font-semibold text-white">Value</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="(tx, key) in address.transactions">
            <td class="whitespace-nowrap py-4 pl-4 pr-3 text-sm font-medium text-white sm:pl-6">{{tx.hash}}</td>
            <td class="whitespace-nowrap px-3 py-4 text-sm text-white">{{ tx.blockNumber }}</td>
            <td class="whitespace-nowrap px-3 py-4 text-sm text-white">{{ tx.timestamp }}</td>
            <td class="whitespace-nowrap px-3 py-4 text-sm text-white">{{ tx.from }}</td>
            <td class="whitespace-nowrap px-3 py-4 text-sm text-white">{{ tx.to }}</td>
            <td class="whitespace-nowrap px-3 py-4 text-sm text-white">{{ ethers.utils.formatEther(tx.value.toString()) }}ETH</td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>

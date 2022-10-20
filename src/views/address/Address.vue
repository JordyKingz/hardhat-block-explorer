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
const ethProvider = new ethers.providers.EtherscanProvider('homestead');
// const ethProvider = new ethers.providers.JsonRpcProvider(`http://localhost:8545/`, 'homestead');

let address = reactive({transactions: <Tx[]>[]});
let contract = reactive({abi: []});
let tx = ref({} as Tx);

onBeforeMount(async () => {
  await checkAddress();
  await getTransactionsByAddress();
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

async function getTransactionsByAddress() {
  // @ts-ignore
  // const transactions = await ethProvider.getHistory(`${route.params.address}`);
  const txCount = await provider.getTransactionCount(`${route.params.address}`, 'latest');

  if (txCount > 0) {
    await getTxData();
  }
}

async function getTxData() {
  const transactionList = [];
  const txArray = [];

  const latestBlock = await provider.getBlockNumber();
  for(let i = 0; i < latestBlock; i++) {
    const tx = await provider.getBlockWithTransactions(i);
    transactionList.push(tx);
  }

  const transactions = transactionList;
  if (transactions) {
    for (let i = 0; i < transactions.length; i++) {
      if (transactions[i].transactions && transactions[i].transactions.length > 0) {
        for (let j = 0; j < transactions[i].transactions.length; j++) {
          const tx = await provider.getTransaction(transactions[i].transactions[j].hash);
          if ((String(tx.from).toLowerCase() === `${String(route.params.address).toLowerCase()}`) || (String(tx.to).toLowerCase() === `${String(route.params.address).toLowerCase()}`)) {
            const abi = await getTxAbi(tx);
            // @ts-ignore
            tx.data = await parseTxData(tx, abi);
            console.log(tx);
            txArray.push(tx);
          }
        }
      }
    }
    // @ts-ignore
    address.transactions = txArray;
  }
}

async function getTxAbi(tx: any) {
  if (tx && tx.to) {
    try {
      const code = await provider.getCode(`${tx.to}`);
      if (code !== '0x') {
        const response = await fetch(`/configs/abis/${tx.to}.json`);
        const data = await response.json();
        return data.abi;
      }
    }
    catch(error){
      console.log('error');
      console.log(error)
    }
  } else if (tx && tx.creates) {
    try {
      const code = await provider.getCode(`${tx.creates}`);
      if (code !== '0x') {
        const response = await fetch(`/configs/abis/${tx.creates}.json`);
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

async function parseTxData(tx: any, abi: any) {
  if (tx && tx.data && !tx.creates) {
    const _interface = new ethers.utils.Interface(abi);
    return _interface.parseTransaction({data: tx.data, value: tx.value});
  }
}

function formatHash(address: string, length: number) {
  return `${address.substring(0, length)}...`;
}
</script>

<template>
  <div>
    <div class="mx-auto max-w-7xl">
      <RouterLink to="/">Home</RouterLink>
      <table v-if="address.transactions.length > 0" class="min-w-full divide-y divide-gray-300">
        <thead>
          <tr>
            <th scope="col" class="py-3.5 pl-4 pr-3 text-left text-sm font-semibold text-white">Tx hash</th>
            <th scope="col" class="px-3 py-3.5 text-left text-sm font-semibold text-white">Method</th>
            <th scope="col" class="px-3 py-3.5 text-left text-sm font-semibold text-white">Block</th>
            <th scope="col" class="px-3 py-3.5 text-left text-sm font-semibold text-white">From</th>
            <th scope="col" class="px-3 py-3.5 text-left text-sm font-semibold text-white">To</th>
            <th scope="col" class="px-3 py-3.5 text-left text-sm font-semibold text-white">Value</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="(tx, key) in address.transactions">
            <td class="whitespace-nowrap py-4 pl-4 pr-3 text-sm font-medium">
              <RouterLink :to="{name: 'tx', params: {hash: tx.hash}}">
                <span class="text-blue-500 hover:text-purple-500">
                  {{ formatHash(tx.hash, 24) }}
                </span>
              </RouterLink>
            </td>
            <td class="whitespace-nowrap py-4 pl-4 pr-3 text-sm font-medium text-white">
              <span class="bg-gray-800 px-2 py-2 rounded-lg">{{tx.data.name}}</span>
            </td>
            <td class="whitespace-nowrap px-3 py-4 text-sm text-white">
              <RouterLink :to="{name: 'block', params: {number: tx.blockNumber}}">
                <span class="text-blue-500 block hover:text-purple-500">
                  {{tx.blockNumber}}
                </span>
              </RouterLink>
            </td>
            <td class="whitespace-nowrap px-3 py-4 text-sm">
              <span v-if="tx.from.toLowerCase() === String(route.params.address).toLowerCase()" >{{ formatHash(tx.from, 14) }}</span>
              <span v-else>
                <RouterLink :to="{name: 'address', params: {address: tx.from}}">
                  <span class="text-blue-500 block hover:text-purple-500">
                    {{ formatHash(tx.from, 14) }}
                  </span>
                </RouterLink>
              </span>
            </td>
            <td class="whitespace-nowrap px-3 py-4 text-sm">
              <span v-if="tx.to.toLowerCase() === String(route.params.address).toLowerCase()" >{{ formatHash(tx.to, 14) }}</span>
              <span v-else>
                <RouterLink v-if="tx.to && tx.to !== ''" class="truncate" :to="{name: 'address', params: {address: tx.to}}">
                <span class="text-blue-500 pl-2 hover:text-purple-500">
                  {{ formatHash(tx.to, 14) }}
                </span>
              </RouterLink>
              </span>
            </td>
            <td class="whitespace-nowrap px-3 py-4 text-sm text-white">{{ ethers.utils.formatEther(tx.value.toString()) }} Ether</td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>

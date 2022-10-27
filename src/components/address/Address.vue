<script setup lang="ts">
import {RouterLink, useRoute} from 'vue-router'
import {ethers} from "ethers";
import {onBeforeMount, reactive, ref, watch} from "vue";
import type {Tx} from "../../types/Tx";

const seconds = 1000;
const minute = 1000 * 60;
let state = reactive({
  ready: false,
});

const route = useRoute();
// @ts-ignore
const provider = new ethers.providers.Web3Provider(window.ethereum);
// @ts-ignore
let address = reactive({transactions: <Tx[]>[]});
let tx = ref({} as Tx);
const balance = ref(0);
const routerAddress = ref('');

onBeforeMount(async () => {
  routerAddress.value = `${route.params.address}`;
  await initPage();
});

async function initPage() {
  await checkAddress();
  await getTransactionsByAddress();
  await getAddressBalance();
}

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

async function getTransactionsByAddress() {
  // @ts-ignore
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
async function getAddressBalance() {
  const balanceInWei = await provider.getBalance(`${route.params.address}`);
  // @ts-ignore
  balance.value = ethers.utils.formatEther(balanceInWei);
}

</script>

<template>
  <div>
    <div class="mx-auto max-w-7xl">
      <div class="py-12">
        <RouterLink to="/">Home</RouterLink>
        <div class="mt-2">
          <div class="grid grid-cols-2 gap-5">
            <div class="bg-gray-800 px-4 py-3 rounded-lg">
              <span>Balance:</span>
              {{ balance }} Ether
            </div>
          </div>
        </div>
        <div class="bg-gray-800 px-4 py-3 rounded-lg mt-2">
          <table v-if="address.transactions.length > 0" class="min-w-full divide-y divide-gray-300">
            <thead>
              <tr>
                <th scope="col" class="py-3.5 pr-3 text-left text-sm font-semibold text-white">Tx hash</th>
                <th scope="col" class="px-3 py-3.5 text-left text-sm font-semibold text-white">Method</th>
                <th scope="col" class="px-3 py-3.5 text-left text-sm font-semibold text-white">Block</th>
                <th scope="col" class="px-3 py-3.5 text-left text-sm font-semibold text-white">From</th>
                <th scope="col" class="px-3 py-3.5 text-left text-sm font-semibold text-white">To</th>
                <th scope="col" class="px-3 py-3.5 text-left text-sm font-semibold text-white">Value</th>
              </tr>
            </thead>
            <tbody >
              <tr v-for="(tx, key) in address.transactions">
                <td class="whitespace-nowrap py-4 pr-3 text-sm font-medium">
                  <RouterLink :to="{name: 'tx', params: {hash: tx.hash}}">
                    <span class="text-blue-500 hover:text-purple-500">
                      {{ formatHash(tx.hash, 24) }}
                    </span>
                  </RouterLink>
                </td>
                <td class="whitespace-nowrap py-4 pl-4 pr-3 text-sm font-medium text-white">
                  <span v-if="tx.data" class="bg-gray-600 px-2 py-2 rounded-lg">{{tx.data.name}}</span>
                </td>
                <td class="whitespace-nowrap px-3 py-4 text-sm text-white">
                  <RouterLink :to="{name: 'block', params: {number: tx.blockNumber}}">
                    <span class="text-blue-500 block hover:text-purple-500">
                      {{tx.blockNumber}}
                    </span>
                  </RouterLink>
                </td>
                <td class="whitespace-nowrap px-3 py-4 text-sm">
                  <span v-if="tx.from && tx.from.toLowerCase() === String(route.params.address).toLowerCase()" >{{ formatHash(tx.from, 14) }}</span>
                  <span v-else>
                    <RouterLink :to="{name: 'address', params: {address: tx.from}}">
                      <span class="text-blue-500 cursor-pointer block hover:text-purple-500">
                        {{ formatHash(tx.from, 14) }}
                      </span>
                    </RouterLink>
                  </span>
                </td>
                <td class="whitespace-nowrap px-3 py-4 text-sm">
                  <span v-if="tx.to && tx.to.toLowerCase() === String(route.params.address).toLowerCase()" >{{ formatHash(tx.to, 14) }}</span>
                  <span v-else-if="tx.creates && tx.creates.toLowerCase() === String(route.params.address).toLowerCase()" >{{ formatHash(tx.creates, 14) }}</span>
                  <span v-else-if="tx.to">
                    <RouterLink v-if="tx.to && tx.to !== ''" class="truncate" :to="{name: 'address', params: {address: tx.to}}">
                      <span class="text-blue-500 pl-2 hover:text-purple-500">
                        {{ formatHash(tx.to, 14) }}
                      </span>
                    </RouterLink>
                  </span>
                  <span v-else-if="tx.creates">
                    <RouterLink v-if="tx.creates && tx.creates !== ''" class="truncate" :to="{name: 'address', params: {address: tx.creates}}">
                      <span class="text-blue-500 pl-2 hover:text-purple-500">
                        {{ formatHash(tx.creates, 14) }}
                      </span>
                    </RouterLink>
                  </span>
                </td>
                <td class="whitespace-nowrap px-3 py-4 text-sm text-white">{{ ethers.utils.formatEther(tx.value.toString()) }} Ether</td>
              </tr>
            </tbody>
          </table>
          <div v-if="address.transactions.length === 0" class="text-center">
            No Transactions To Show...
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

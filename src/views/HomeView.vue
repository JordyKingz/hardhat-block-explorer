<script setup lang="ts">

import {ethers} from "ethers";
import {onBeforeMount, reactive, ref} from "vue";

const seconds = 1000;
const minute = 1000 * 60;
let state = reactive({
  ready: false,
});


let chain = reactive({latestBlocks: [], latestTransactions: []});
// let latestBlocks = ref<ethers.providers.Block[]>([]);

// @ts-ignore
const provider = new ethers.providers.Web3Provider(window.ethereum);

onBeforeMount(async () => {
  await getBlockchainData();
});

async function getBlockchainData() {
  await provider.on('block', async (blockNumber: number) => {
    const block = await provider.getBlock(blockNumber);
    await getBlockData(block.number);
  });
}

async function getBlockData(blockNr: number) {
  const blockArray = [];

  const index = blockNr - 10;
  for (let i = index; i <= blockNr; i++) {
    const block = await provider.getBlock(i);
    blockArray.push(block);
  }

  // @ts-ignore
  chain.latestBlocks = blockArray.reverse();
  // @ts-ignore
  chain.latestTransactions = await getTransactions(chain.latestBlocks[0].transactions);

  if (!state.ready)
    state.ready = !state.ready;
}

async function getTransactions(txList: any) {
  const txArray = [];
  for (let i = 0; i < txList.length; i++) {
    const tx = await provider.getTransaction(txList[i]);
    txArray.push(tx);
  }
  return txArray;
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

function secondsPassed(timestamp: number) {
  const date = new Date(timestamp * 1000);
  const timePassed = new Date().getTime() - date.getTime();
  return Math.floor(timePassed / seconds);
}

function blockReward(gasUsed: string) {
    return `${Number(ethers.utils.formatEther(ethers.utils.parseUnits(gasUsed, 'gwei')).toString()).toFixed(5)}ETH`;
}

function parseEther(value: string) {
  return `${Number(ethers.utils.formatEther(ethers.utils.parseUnits(value, 'gwei')).toString()).toFixed(5)}ETH`;
}
</script>

<template>
<div>
  <div class="mx-auto max-w-7xl">
    <div class="py-12 w-1/2">
      <div>
        <h2 class="text-2xl font-medium">Local Block Explorer</h2>
      </div>
      <div class="mt-4 grid grid-cols-3 gap-2">
        <div class="col-span-2">
          <input
              type="text"
              placeholder="Search by Address / Txn Hash / Block / Token"
              class="w-full bg-gray-800 rounded-md border py-3 text-lg px-2 border-gray-900 outline-none focus:ring-purple-500">
        </div>
        <div>
          <button class="bg-gray-800 opacity-75 rounded-md border py-3 px-4 font-medium text-lg border-gray-900">Search</button>
        </div>
      </div>
    </div>
    <div v-if="state.ready" class="mt-2">
      <div class="grid grid-cols-2 gap-6">
        <div class="bg-gray-800 px-4 py-2 rounded-lg">
          <div class="pb-2 border-gray-600 border-b">
            Latest Blocks
          </div>
          <div class="h-96 overflow-auto">
            <div class="pt-6" v-for="(block, key) in chain.latestBlocks" :key="key">
              <div class="grid grid-cols-10 gap-3">
                <div class="col-span-1">
                  <button class="px-3 py-3 mt-1 text-xs bg-gray-600 rounded-lg">
                    Bk
                  </button>
                </div>
                <div class="col-span-2">
                  <span class="text-gray-500 block">
                    {{block.number}}
                  </span>
                  <span class="text-xs">
                    {{ timePassed(block.timestamp) }}
                  </span>
                </div>
                <div class="col-span-5">
                  <div class="flex">
                    Miner
                    <span class="text-gray-500 pl-1 truncate">
                      {{block.miner}}
                    </span>
                  </div>
                  <div class="block">
                    <span class="text-gray-500">
                      {{block.transactions.length}}txns
                      <span class="text-xs text-gray-200">
                        in {{ secondsPassed(block.timestamp) }}s
                      </span>
                    </span>
                  </div>
                </div>
                <div class="col-span-2">
                  <button class="px-2 py-1 mt-1 text-xs bg-gray-600 rounded-lg">
                    {{blockReward(block.gasUsed.toString())}}
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div class="bg-gray-800 px-4 py-2 rounded-lg">
          Latest Transactions
          <div class="h-96 overflow-auto">
            <div class="pt-6" v-for="(tx, key) in chain.latestTransactions" :key="key">
              <div class="grid grid-cols-10 gap-3">
                <div class="col-span-1">
                  <button class="px-3 py-3 mt-1 text-xs bg-gray-600 rounded-lg">
                    Tx
                  </button>
                </div>
                <div class="col-span-7 truncate">
                  <div class="block">
                    <div class="flex">
                      From <span class="pl-2 text-gray-500">{{tx.from}}</span>
                    </div>
                  </div>
                  <div class="block">
                    <div class="flex">
                      To <span class="pl-2 text-gray-500">{{tx.to}}</span>
                    </div>
                  </div>
                </div>
                <div class="col-span-2">
                  <button class="px-2 py-1 mt-1 text-xs bg-gray-600 rounded-lg">
<!--                    {{ parseEther(tx.value.toString())}}-->
                    0.005ETH
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</div>
</template>

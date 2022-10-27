<script setup lang="ts">
import {RouterLink} from 'vue-router'
import {ethers} from "ethers";
import {onBeforeMount, reactive} from "vue";
import type {Block} from "@/types/Block";
import Search from "@/components/search/Search.vue";

const seconds = 1000;
const minute = 1000 * 60;
let state = reactive({
  ready: false,
});
// @ts-ignore
let chain = reactive({latestBlocks: <Block>[], latestTransactions: []});
// @ts-ignore
const provider = new ethers.providers.Web3Provider(window.ethereum);

onBeforeMount(async () => {
  await getBlockchainData();
});

async function getBlockchainData() {
  await provider.on('block', async (blockNumber: number) => {
    await getBlockData(blockNumber);
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

function getBlockTimeStamp() {
  // @ts-ignore
  const latest = chain.latestBlocks[0];
  return timePassed(latest.timestamp);
}

function blockReward(block: Block) {
  return `${Number(ethers.utils.formatEther(ethers.utils.parseUnits(block.gasUsed.toString(), 'gwei')).toString()).toFixed(5)}ETH`;
}

</script>

<template>
<div>
  <div class="mx-auto max-w-7xl">
    <div class="py-12 w-1/2">
      <div>
        <h2 class="text-2xl font-medium">Local Block Explorer</h2>
      </div>
      <Search />
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
                  <RouterLink :to="{name: 'block', params: {number: block.number}}">
                    <span class="text-gray-500 block hover:text-purple-500">
                      {{block.number}}
                    </span>
                  </RouterLink>
                  <span class="text-xs">
                    {{ timePassed(block.timestamp) }}
                  </span>
                </div>
                <div class="col-span-5">
                  <div class="flex">
                    Miner
                      <RouterLink v-if="block.miner" class="truncate" :to="{name: 'address', params: {address: block.miner}}">
                        <span class="text-gray-500 pl-1 hover:text-purple-500">
                          {{block.miner}}
                        </span>
                      </RouterLink>
                  </div>
                  <div class="block">
                    <span class="text-gray-500">
                      {{block.transactions.length}}txns
                    </span>
                  </div>
                </div>
                <div class="col-span-2">
                  <button class="px-2 py-1 mt-1 text-xs bg-gray-600 rounded-lg">
                    {{blockReward(block)}}
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
                <div class="col-span-2 truncate">
                  <RouterLink :to="{name: 'tx', params: {hash: tx.hash}}">
                    <span class="text-gray-500 truncate hover:text-purple-500">
                      {{tx.hash}}
                    </span>
                  </RouterLink>
                  <span class="text-xs block">
                    {{ getBlockTimeStamp() }}
                  </span>
                </div>
                <div class="col-span-5 truncate">
                  <div class="block">
                    <div class="flex">
                      From
                      <RouterLink v-if="tx.from && tx.from !== ''" class="truncate" :to="{name: 'address', params: {address: tx.from}}">
                        <span class="text-gray-500 pl-2 hover:text-purple-500">
                          {{tx.from}}
                        </span>
                      </RouterLink>
                    </div>
                  </div>
                  <div class="block">
                    <div class="flex">
                      To
                      <RouterLink v-if="tx.to && tx.to !== ''" class="truncate" :to="{name: 'address', params: {address: tx.to}}">
                        <span class="text-gray-500 pl-2 hover:text-purple-500">
                          {{tx.to}}
                        </span>
                      </RouterLink>
                      <RouterLink v-else-if="tx.creates && tx.creates !== ''" class="truncate" :to="{name: 'address', params: {address: tx.creates}}">
                        <span class="text-gray-500 pl-2 hover:text-purple-500">
                          {{tx.creates}}
                        </span>
                      </RouterLink>
                    </div>
                  </div>
                </div>
                <div class="col-span-2">
                  <button class="px-2 py-1 mt-1 text-xs bg-gray-600 rounded-lg">
                    {{ ethers.utils.formatEther(tx.value.toString()) }} ETH
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

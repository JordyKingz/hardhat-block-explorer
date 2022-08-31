<script setup lang="ts">
</script>

<template>
<div>
  <div class="mx-auto max-w-7xl py-6">
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
    <div class="mt-12">
      <div class="grid grid-cols-2 gap-6">
        <div class="bg-gray-800 px-4 py-2 rounded-lg">
          Latest Blocks
        </div>
        <div class="bg-gray-800 px-4 py-2 rounded-lg">
          Latest Transactions
        </div>
      </div>
    </div>
  </div>
</div>
</template>

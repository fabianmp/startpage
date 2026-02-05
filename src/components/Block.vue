<script setup lang="ts">
import { Block } from "../model"
import { getBlockStyle } from "../style"
const { block } = defineProps<{
  block: Block
}>()

const ui = getBlockStyle(block.color)
</script>

<template>
  <UCard
    v-if="block.visible"
    :ui="ui"
    variant="subtle"
  >
    <template #header>
      <div class="flex flex-row items-center gap-1">
        <UIcon :name="block.icon" />
        {{ block.name }}
      </div>
    </template>
    <Group
      v-for="group in block.groups"
      :key="group.id"
      :group="group"
    />
  </UCard>
</template>

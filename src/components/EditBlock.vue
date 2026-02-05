<script setup lang="ts">
import { useColorMode } from "@vueuse/core"
import { Block, Container, Group } from "../model"
import { getBlockStyle, getGroupStyle } from "../style"
import { useDragState } from "../store"

const { block } = defineProps<{
  block: Block
  deleteBlock: (block: Block) => void
}>()

const toast = useToast()

const { dragData, dragStart, dragEnter, dragOver, dragEnd, drop } =
  useDragState()

const colorMode = useColorMode()
const ui = computed(() => getBlockStyle(block.color))
const uiNewGroup = computed(() => getGroupStyle("gray-300", colorMode.value))

function save({ name, icon, color }: Container) {
  block.name = name
  block.icon = icon
  block.color = color
}

function addGroup(container: Container) {
  block.groups.push(<Group>{ ...container, blockId: block.id, links: [] })
  toast.add({
    title: `Created group "${container.name}"`,
    icon: "fa7-solid:add",
    color: "success",
    duration: 3000,
    close: false,
  })
}

function deleteGroup(group: Group) {
  block.groups = block.groups.filter((g) => g.id !== group.id)
  toast.add({
    title: `Deleted group "${group.name}"`,
    icon: "fa7-solid:trash",
    color: "error",
    duration: 3000,
    close: false,
  })
}
</script>

<template>
  <UCard
    :ui="ui"
    variant="subtle"
    :draggable="true"
    :data-block-id="block.id"
    data-target-type="Block"
    @dragstart.self="dragStart"
    @dragend.self="dragEnd"
    @dragenter="dragEnter"
    @dragover="dragOver"
    @drop="drop"
  >
    <template #header>
      <div class="flex flex-row items-center gap-1">
        <UIcon :name="block.icon" />
        {{ block.name }}
      </div>
      <div
        v-if="!dragData"
        class="flex flex-row gap-2 items-center"
      >
        <USwitch
          v-model="block.visible"
          checked-icon="fa7-solid:eye"
          unchecked-icon="fa7-solid:eye-slash"
          class="cursor-pointer"
        />
        <ContainerPopover
          :data="block"
          :save="save"
        >
          <UButton
            icon="fa7-solid:pen"
            color="neutral"
            variant="subtle"
            size="xs"
            class="justify-self-end cursor-pointer"
          />
        </ContainerPopover>
        <UButton
          icon="fa7-solid:trash"
          color="error"
          variant="solid"
          size="xs"
          class="justify-self-end cursor-pointer"
          @click="deleteBlock(block)"
        />
      </div>
    </template>
    <EditGroup
      v-for="group in block.groups"
      :key="group.id"
      :group="group"
      :delete-group="deleteGroup"
    />
    <UPageLinks
      v-if="!dragData || dragData.dataType === 'Group'"
      variant="soft"
      :ui="uiNewGroup"
      class="min-w-15"
      :data-block-id="block.id"
      data-target-type="Group"
      @dragenter="dragEnter"
      @dragover="dragOver"
      @drop="drop"
    >
      <template #title>
        <ContainerPopover :save="addGroup">
          <UButton
            icon="fa7-solid:plus"
            color="neutral"
            variant="ghost"
            size="sm"
            class="cursor-pointer"
          />
        </ContainerPopover>
      </template>
      <div />
    </UPageLinks>
  </UCard>
</template>

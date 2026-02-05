<script setup lang="ts">
import { Container, Group, Link } from "../model"
import { useDragState } from "../store"
import { getGroupCardStyle } from "../style"

const { group, deleteGroup } = defineProps<{
  group: Group
  deleteGroup: (group: Group) => void
}>()

const { dragData, dragStart, dragEnter, dragOver, dragEnd, drop } =
  useDragState()

const ui = computed(() => getGroupCardStyle(group.color))

function saveGroup({ name, icon, color }: Container) {
  group.name = name
  group.icon = icon
  group.color = color
}

function saveLink(link: Link) {
  const update = group.links.find((l) => l.id == link.id)
  if (!update) return
  update.name = link.name
  update.icon = link.icon
  update.url = link.url
}

function addLink(link: Link) {
  link.blockId = group.blockId
  link.groupId = group.id
  group.links.push(link)
}

function deleteLink(link: Link) {
  group.links = group.links.filter((l) => l.id !== link.id)
}
</script>
<template>
  <UCard
    :ui="ui"
    variant="subtle"
    :draggable="true"
    :data-block-id="group.blockId"
    :data-group-id="group.id"
    data-target-type="Group"
    @dragstart.self="dragStart"
    @dragend.self="dragEnd"
    @dragenter="dragEnter"
    @dragover="dragOver"
    @drop="drop"
  >
    <template #header>
      <div class="flex flex-row gap-1 items-center">
        <UIcon :name="group.icon" />
        {{ group.name }}
      </div>
      <div
        v-if="!dragData"
        class="flex flex-row gap-2 items-center"
      >
        <ContainerPopover
          :data="group"
          :save="saveGroup"
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
          @click="deleteGroup(group)"
        />
      </div>
    </template>
    <div
      v-for="link in group.links"
      :key="link.id"
      class="flex justify-between"
      :draggable="true"
      :data-block-id="link.blockId"
      :data-group-id="link.groupId"
      :data-link-id="link.id"
      data-target-type="Link"
      @dragstart.self="dragStart"
      @dragend.self="dragEnd"
      @dragenter="dragEnter"
      @dragover="dragOver"
      @drop="drop"
    >
      <div
        class="flex items-center gap-1 overflow-hidden text-ellipsis whitespace-nowrap"
      >
        <UIcon
          :name="link.icon"
          class="flex-none"
        />{{ link.name }}
      </div>
      <div
        v-if="!dragData"
        class="flex flex-row gap-2 items-center"
      >
        <LinkPopover
          :link="link"
          :save="saveLink"
        >
          <UButton
            icon="fa7-solid:pen"
            color="neutral"
            variant="subtle"
            size="xs"
            class="justify-self-end cursor-pointer"
          />
        </LinkPopover>
        <UButton
          icon="fa7-solid:trash"
          color="error"
          variant="subtle"
          size="xs"
          class="justify-self-end cursor-pointer"
          @click="deleteLink(link)"
        />
      </div>
    </div>
    <LinkPopover
      v-if="!dragData || dragData.dataType === 'Link'"
      :save="addLink"
    >
      <UButton
        icon="fa7-solid:plus"
        color="neutral"
        variant="subtle"
        size="sm"
        class="cursor-pointer justify-center"
        :data-block-id="group.blockId"
        :data-group-id="group.id"
        data-target-type="Link"
        @dragenter="dragEnter"
        @dragover="dragOver"
        @drop="drop"
      />
    </LinkPopover>
  </UCard>
</template>

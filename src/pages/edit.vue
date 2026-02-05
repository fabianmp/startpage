<script setup lang="ts">
import { useDragState, useVersionStore } from "../store"
import { useLocalStorage } from "@vueuse/core"
import { getBlockStyle } from "../style"
import { Block, Container, Version } from "../model"

const toast = useToast()

const { dragData, dragEnter, dragOver, drop, setData } = useDragState()
const { addVersion, getVersion } = await useVersionStore()

const data = ref<Version>({ timestamp: new Date(), blocks: [] })
const title = useLocalStorage("startpage-title", "Startpage")
const newTitle = ref(title.value)

onMounted(async () => {
  newTitle.value = title.value
  const latestVersion = await getVersion()
  await selectVersion(latestVersion.timestamp)
})

function saveTitle(newTitle: string) {
  title.value = newTitle
}

async function selectVersion(version: Date) {
  data.value = await getVersion(version)
  setData(data.value)
  toast.add({
    title: `Loaded version from ${version.toLocaleString()}`,
    icon: "fa7-solid:file-upload",
    duration: 3000,
    close: false,
  })
}

function addBlock(container: Container) {
  data.value.blocks.push(<Block>{ ...container, visible: true, groups: [] })
  toast.add({
    title: `Created container "${container.name}"`,
    icon: "fa7-solid:add",
    color: "success",
    duration: 3000,
    close: false,
  })
}

function deleteBlock(block: Block) {
  data.value.blocks = data.value.blocks.filter((b) => b.id !== block.id)
  toast.add({
    title: `Deleted container "${block.name}"`,
    icon: "fa7-solid:trash",
    color: "error",
    duration: 3000,
    close: false,
  })
}

function saveJson(version: Version) {
  data.value = version
}

function saveVersion() {
  addVersion(data.value)
}
</script>

<template>
  <div class="flex flex-row">
    <VersionTimeline :select-version="selectVersion" />
    <div class="grow space-y-2 p-5 overflow-x-auto">
      <div class="flex flex-row gap-2 pb-2">
        <h1 class="font-bold text-xl">
          {{ title }}
        </h1>
        <EditTitle
          :title="title"
          :save="saveTitle"
        >
          <UButton
            icon="fa7-solid:pen"
            label="Edit title"
            color="neutral"
            variant="subtle"
            size="sm"
            class="cursor-pointer"
          />
        </EditTitle>
        <div class="grow" />
        <JsonEditor
          :content="data"
          :save="saveJson"
        />
        <UButton
          label="Cancel"
          icon="fa7-solid:cancel"
          class="cursor-pointer"
          color="error"
          variant="subtle"
          to="/"
        />
        <UButton
          label="Save"
          icon="fa7-solid:save"
          class="cursor-pointer"
          color="success"
          to="/"
          @click="saveVersion"
        />
      </div>
      <div class="space-y-6 contents">
        <EditBlock
          v-for="block in data.blocks"
          v-if="data"
          :key="block.id"
          :block="block"
          :delete-block="deleteBlock"
        />
        <UCard
          v-if="!dragData || dragData.dataType === 'Block'"
          variant="soft"
          :ui="getBlockStyle('gray-300')"
          data-target-type="Block"
          @dragenter="dragEnter"
          @dragover="dragOver"
          @drop="drop"
        >
          <template #header>
            <ContainerPopover :save="addBlock">
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
        </UCard>
      </div>
    </div>
  </div>
</template>

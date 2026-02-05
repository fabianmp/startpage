<script setup lang="ts">
import type { TimelineItem } from "@nuxt/ui"
import { useVersionStore } from "../store"
import { computedAsync } from "@vueuse/core"

const { versions, getVersion, deleteVersion } = await useVersionStore()
const toast = useToast()

const { selectVersion } = defineProps<{
  selectVersion: (version: Date) => void
}>()

const versionRange = ref(versions.value.slice(-7))

const items = computedAsync(async () => {
  return await Promise.all(
    versionRange.value.map(async (v, i) => {
      const entry = await getVersion(v)
      const links = entry?.blocks.reduce(
        (c, b) => c + b.groups.reduce((x, g) => x + g.links.length, 0),
        0,
      )
      return <TimelineItem>{
        date: entry?.timestamp.toLocaleString(),
        title: `${links} links`,
        icon: "fa7-solid:calendar-alt",
        value: i,
      }
    }),
  )
}, [versions])

const current = ref(versionRange.value.length - 1)
function setCurrent(item: TimelineItem) {
  current.value = item.value as number
  selectVersion(versionRange.value[current.value])
}

function loadMore() {
  current.value =
    current.value + versions.value.length - versionRange.value.length
  versionRange.value = versions.value
}

function deleteHandler(item: TimelineItem) {
  const timestamp = versionRange.value[item.value]
  deleteVersion(timestamp)
  versionRange.value.splice(item.value, 1)
  toast.add({
    title: `Deleted version from ${timestamp.toLocaleString()}`,
    icon: "fa7-solid:trash",
    color: "error",
    duration: 3000,
    close: false,
  })
}
</script>

<template>
  <div class="w-3xs flex-none grow-0 h-full max-h-250 overflow-y-auto">
    <div class="flex justify-center">
      <UButton
        v-if="versionRange.length !== versions.length"
        class="w-40 mt-2 justify-center cursor-pointer"
        icon="fa7-solid:arrow-rotate-back"
        :label="`Load more (${versions.length - versionRange.length}) ...`"
        variant="subtle"
        @click="loadMore"
      />
    </div>
    <UTimeline
      :items="items"
      :model-value="current"
      class="p-5"
    >
      <template #indicator="{ item }">
        <UIcon
          :name="item.icon"
          class="cursor-pointer"
          @click="setCurrent(item)"
        />
      </template>
      <template #title="{ item }">
        <div
          class="cursor-pointer"
          @click="setCurrent(item)"
        >
          {{ item.title }}
        </div>
      </template>
      <template #date="{ item }">
        <div
          class="cursor-pointer"
          @click="setCurrent(item)"
        >
          {{ item.date }}
        </div>
      </template>
      <template #description="{ item }">
        <UButton
          v-if="item.value !== current"
          icon="fa7-solid:trash"
          class="cursor-pointer mt-1 w-20"
          label="Delete"
          size="xs"
          color="error"
          variant="outline"
          @click="deleteHandler(item)"
        />
        <UButton
          v-if="item.value === current"
          icon="fa7-solid:arrow-rotate-back"
          class="cursor-pointer mt-1 w-20"
          label="Reset"
          size="xs"
          variant="outline"
          @click="setCurrent(item)"
        />
      </template>
    </UTimeline>
  </div>
</template>

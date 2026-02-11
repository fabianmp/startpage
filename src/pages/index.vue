<script setup lang="ts">
import { useLocalStorage } from "@vueuse/core"
import { useVersionStore } from "../store"
import { Version } from "../model"

const toast = useToast()
const { getVersion, versions } = await useVersionStore()

const data = ref<Version>({ timestamp: new Date(), blocks: [] })
onMounted(async () => {
  data.value = await getVersion()
})

watch(versions, async (_) => {
  data.value = await getVersion()
})

const dismissedStorage = useLocalStorage("startpage-dismissed-messages", "[]")
const dismissed = ref(JSON.parse(dismissedStorage.value))

const messages: Toast[] = [
  <Toast>{
    id: "1",
    icon: "fa7-solid:circle-info",
    color: "info",
    duration: 10000,
    title: "You can now add icons to groups and links",
  },
  <Toast>{
    id: "2",
    icon: "fa7-solid:circle-info",
    duration: 10000,
    title: "You can now choose to open all links in a new tab",
  },
  <Toast>{
    id: "3",
    icon: "fa7-solid:bullhorn",
    duration: 10000,
    title: "Welcome to the new implementation using NuxtUI",
  },
]
const newMessages = messages.filter((x) => !dismissed.value.includes(x.id))
newMessages.forEach((m) =>
  toast.add({
    ...m,
    close: false,
    orientation: "horizontal",
    actions: [
      {
        icon: "fa7-solid:eye-slash",
        class: "cursor-pointer",
        label: "Hide",
        color: "neutral",
        variant: "subtle",
        onClick: (e) => {
          e?.stopPropagation()
          dismissed.value.push(m.id)
          dismissedStorage.value = JSON.stringify(dismissed.value)
        },
      },
    ],
  }),
)
</script>

<template>
  <div class="flex flex-col px-20 py-5 gap-6">
    <Block
      v-for="block in data.blocks"
      v-if="data"
      :key="block.id"
      :block="block"
    />
    <UEmpty
      v-else
      title="No data"
    />
  </div>
</template>

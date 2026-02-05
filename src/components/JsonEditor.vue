<script setup lang="ts">
import JsonEditor from "vue3-ts-jsoneditor"
import { Version } from "../model"
import { addUUIDs, removeUUIDs } from "../helper"

const { content, save } = defineProps<{
  content: Version
  save: (version: Version) => void
}>()

const data = ref("")
const open = ref(false)
watch(open, (isOpen) => {
  data.value = isOpen ? JSON.stringify(removeUUIDs(content), null, 2) : "{}"
})

function handleSave() {
  save(addUUIDs(JSON.parse(data.value) as Version))
  open.value = false
}
</script>

<template>
  <UModal
    v-model:open="open"
    title="Edit JSON"
    :scrollable="true"
    :dismissible="false"
    :close="false"
    :ui="{ footer: 'justify-end', content: 'max-w-full' }"
  >
    <UButton
      icon="fa7-solid:code"
      label="Edit JSON"
      color="neutral"
      variant="subtle"
      size="sm"
      class="cursor-pointer"
    />
    <template #body>
      <json-editor
        v-model:text="data"
        mode="text"
        :indentation="2"
        :full-width-button="false"
        height="800"
      />
    </template>
    <template #footer>
      <UButton
        icon="fa7-solid:cancel"
        label="Cancel"
        variant="outline"
        color="error"
        class="cursor-pointer"
        @click="open = false"
      />
      <UButton
        icon="fa7-solid:save"
        label="OK"
        color="success"
        class="cursor-pointer"
        @click="handleSave"
      />
    </template>
  </UModal>
</template>

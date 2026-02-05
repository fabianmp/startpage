<script setup lang="ts">
const { title, save } = defineProps<{
  title: string
  save: (title: string) => void
}>()

const tempTitle = ref(title)
const open = ref(false)
watch(open, (isOpen) => {
  tempTitle.value = isOpen ? title : ""
})

function handleSave() {
  save(tempTitle.value)
  open.value = false
}
</script>

<template>
  <UModal
    v-model:open="open"
    title="Edit title"
    :dismissible="false"
    :close="false"
    :ui="{ footer: 'justify-end' }"
  >
    <slot />
    <template #body>
      <UInput
        v-model="tempTitle"
        class="w-100"
      />
    </template>
    <template #footer>
      <UButton
        label="Cancel"
        variant="outline"
        color="error"
        class="cursor-pointer"
        @click="open = false"
      />
      <UButton
        label="OK"
        color="success"
        class="cursor-pointer"
        @click="handleSave"
      />
    </template>
  </UModal>
</template>

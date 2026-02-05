<script setup lang="ts">
import { Link } from "../model"

const { link, save } = defineProps<{
  link?: Link
  save: (link: Link) => void
}>()

const temp = ref(link || <Link>{ id: crypto.randomUUID(), name: "", url: "" })

const open = ref(false)
watch(open, (isOpen) => {
  temp.value =
    isOpen && link
      ? { ...link }
      : { id: crypto.randomUUID(), name: "", url: "" }
})

function handleSave() {
  save(temp.value)
  open.value = false
}
</script>

<template>
  <UPopover
    v-model:open="open"
    arrow
    modal
    portal
  >
    <slot />
    <template #content>
      <div class="space-y-2 p-3">
        <div class="flex flex-row w-100 items-center px-3">
          <UIcon
            name="fa7-solid:tag"
            class="mr-3"
          />
          <UInput
            v-model="temp.name"
            :required="true"
            autocomplete="off"
            class="flex-grow"
          />
        </div>
        <div class="flex flex-row w-100 items-center px-3">
          <UIcon
            name="fa7-solid:icons"
            class="mr-3"
          />
          <IconPicker :select="(icon) => (temp.icon = icon)">
            <UInput
              ref="icon"
              v-model="temp.icon"
              :trailing-icon="temp.icon"
              autocomplete="off"
              class="flex-grow"
              :ui="{ base: 'text-left' }"
            />
          </IconPicker>
        </div>
        <div class="flex flex-row w-100 items-center px-3">
          <UIcon
            name="fa7-solid:link"
            class="mr-3"
          />
          <UInput
            v-model="temp.url"
            autocomplete="off"
            class="flex-grow"
          />
        </div>
      </div>
      <div class="flex px-3 py-2 space-x-2 justify-end">
        <UButton
          color="error"
          variant="ghost"
          icon="fa7-solid:cancel"
          class="cursor-pointer"
          @click="open = false"
        />
        <UButton
          color="success"
          icon="fa7-solid:save"
          class="cursor-pointer"
          :disabled="!Boolean(temp.name && temp.url)"
          @click="handleSave"
        />
      </div>
    </template>
  </UPopover>
</template>

<script setup lang="ts">
import { Container } from "../model"

const { data, save } = defineProps<{
  data?: Container
  save: (data: Container) => void
}>()

const baseColors = ["red", "yellow", "green", "blue", "purple", "gray"]
const colors = baseColors.flatMap((c) =>
  [300, 600, 800].map((w) => `${c}-${w}`),
)
const temp = ref<Container>({ name: "", color: "" })

const open = ref(false)
watch(open, (isOpen) => {
  temp.value =
    isOpen && data
      ? { ...data }
      : <Container>{
          id: crypto.randomUUID(),
          name: "",
          color: colors[Math.floor(Math.random() * colors.length)],
        }
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
              v-model="temp.icon"
              :trailing-icon="temp.icon"
              class="flex-grow"
              :ui="{ base: 'text-left' }"
            />
          </IconPicker>
        </div>
        <div class="flex flex-row w-100 items-center px-3">
          <UIcon
            name="fa7-solid:palette"
            class="mr-3"
          />
          <UInput
            v-model="temp.color"
            class="flex-grow"
          >
            <template #trailing>
              <UIcon
                name="fa7-solid:droplet"
                :class="`bg-${temp.color} text-white w-6 h-6 px-1`"
              />
            </template>
          </UInput>
        </div>
        <div class="ml-10">
          <button
            v-for="c in colors"
            :key="c"
            class="w-3 h-3 m-0.5"
            :class="`bg-${c} cursor-pointer`"
            @click="temp.color = c"
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
          :disabled="!Boolean(temp.name && temp.color)"
          @click="handleSave"
        />
      </div>
    </template>
  </UPopover>
</template>

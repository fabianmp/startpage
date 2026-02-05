<script setup lang="ts">
import fa7_solid from "@iconify/json/json/fa7-solid.json"
import fa7_brands from "@iconify/json/json/fa7-brands.json"

const { select } = defineProps<{
  select: (icon: string | undefined) => void
}>()

const allIcons = [
  ...Object.keys(fa7_solid.icons).map((i) => `fa7-solid:${i}`),
  ...Object.keys(fa7_brands.icons).map((i) => `fa7-brands:${i}`),
]

const iconFilter = ref("")
const filteredIcons = computed(() =>
  allIcons.filter((i) => i.includes(iconFilter.value)),
)

const open = ref(false)

function handleSelect(value: string | undefined) {
  select(value)
  iconFilter.value = ""
  open.value = false
}
</script>

<template>
  <UPopover
    v-model:open="open"
    arrow
    modal
    portal
    :ui="{ content: 'space-y-1' }"
  >
    <slot />
    <template #content>
      <UInput
        v-model="iconFilter"
        placeholder="Filter icons..."
        class="w-full"
      >
        <template
          v-if="iconFilter?.length"
          #trailing
        >
          <UButton
            color="neutral"
            variant="link"
            icon="fa7-solid:circle-xmark"
            aria-label="Clear input"
            @click="iconFilter = ''"
          />
        </template>
      </UInput>
      <UButton
        class="w-full justify-center"
        label="No icon"
        variant="ghost"
        color="neutral"
        @click="handleSelect(undefined)"
      />
      <UScrollArea
        v-slot="{ item: icon }"
        :items="filteredIcons"
        class="w-80 h-60 p-2"
        :virtualize="{
          gap: 4,
          lanes: 8,
          estimateSize: allIcons.length,
        }"
      >
        <UButton
          :icon="icon"
          class="cursor-pointer"
          variant="ghost"
          color="neutral"
          @click="handleSelect(icon)"
        />
      </UScrollArea>
    </template>
  </UPopover>
</template>

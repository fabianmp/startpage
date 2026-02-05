<script setup lang="ts">
import { useLocalStorage } from "@vueuse/core"

const tabOptions = ref([
  {
    label: "Open in new tab",
    value: true,
    icon: "fa7-solid:external-link",
  },
  {
    label: "Open in same tab",
    value: false,
    icon: "fa7-solid:window-maximize",
  },
])
const newTab = useLocalStorage("startpage-open-new-tab", false)
const title = useLocalStorage("startpage-title", "Startpage")
const icon = computed(
  () => tabOptions.value.find((item) => item.value === newTab.value)?.icon,
)
</script>
<template>
  <UHeader :title="title">
    <template #right>
      <USelect
        v-model="newTab"
        :items="tabOptions"
        value-key="value"
        :icon="icon"
      />
      <UButton
        v-if="$route.path !== '/edit'"
        label="Edit page"
        to="/edit"
        icon="fa7-solid:edit"
        aria-label="Settings"
        color="neutral"
        variant="ghost"
      />
      <UButton
        label="View on GitHub"
        to="https://github.com/fabianmp/startpage"
        target="_blank"
        icon="fa7-brands:github"
        aria-label="GitHub"
        color="neutral"
        variant="ghost"
      />
      <UColorModeButton
        title="Swich color mode"
        class="cursor-pointer"
      />
    </template>
  </UHeader>
</template>

<script setup lang="ts">
import { Group } from "../model"
import { PageLink } from "@nuxt/ui"
import { useColorMode, useLocalStorage } from "@vueuse/core"
import { getGroupStyle } from "../style"

const colorMode = useColorMode()
const newTab = useLocalStorage("startpage-open-new-tab", false)

const { group } = defineProps<{
  group: Group
}>()

const links = computed(() =>
  group.links.map(
    (l) =>
      <PageLink>{
        label: l.name,
        to: l.url,
        icon: l.icon,
        target: newTab.value ? "_blank" : "_self",
        external: true,
      },
  ),
)

const ui = computed(() => getGroupStyle(group.color, colorMode.value))
</script>
<template>
  <UPageLinks
    :links="links"
    :ui="ui"
  >
    <template #title>
      <div class="flex flex-row items-center gap-1">
        <UIcon :name="group.icon" />
        {{ group.name }}
      </div>
    </template>
  </UPageLinks>
</template>

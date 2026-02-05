import { createGlobalState } from "@vueuse/core"
import { openDB, DBSchema } from "idb"
import { Version } from "./model"
import { addUUIDs, DragData, parseUUIDs, removeUUIDs } from "./helper"

interface StartpageSchema extends DBSchema {
  data: {
    key: Date
    value: Version
  }
}

function updateFontAwesomeName(name: string | undefined) {
  return name
    ?.replace("fa-brands fa-", "fa7-brands:")
    .replace("fa-", "fa7-solid:")
}

export const useVersionStore = createGlobalState(async () => {
  const db = await openDB<StartpageSchema>("Startpage", 1, {
    upgrade(db, _oldVersion, _newVersion, _transaction, _event) {
      db.createObjectStore("data", { keyPath: "timestamp" })
    },
  })

  if ((await db.count("data")) === 0) {
    const blocks = JSON.parse(
      window.localStorage.getItem("startpage-data") ?? "[]",
    )
    await db.put("data", { timestamp: new Date(), blocks: blocks })
    window.localStorage.removeItem("startpage-data")
  }

  const versions = shallowRef(await db.getAllKeys("data"))

  async function getVersion(version: Date | undefined = undefined) {
    const data =
      (version !== undefined
        ? await db.get("data", version)
        : await db.get("data", versions.value[versions.value.length - 1])) ??
      <Version>{ timestamp: new Date(), blocks: [] }

    data?.blocks.forEach((b) => {
      b.icon = updateFontAwesomeName(b.icon)
      b.groups.forEach((g) => {
        g.icon = updateFontAwesomeName(g.icon)
        g.links.forEach((l) => {
          l.icon = updateFontAwesomeName(l.icon)
        })
      })
    })
    addUUIDs(data)
    return data || <Version>{ timestamp: new Date(), blocks: [] }
  }

  async function deleteVersion(version: Date) {
    await db.delete("data", version)
    versions.value = await db.getAllKeys("data")
  }

  async function addVersion(version: Version) {
    const s = JSON.stringify(removeUUIDs(version))
    const cleanVersion = JSON.parse(s)
    cleanVersion.timestamp = new Date()
    await db.put("data", cleanVersion)
    versions.value = await db.getAllKeys("data")
  }

  return {
    versions,
    getVersion,
    deleteVersion,
    addVersion,
  }
})

export const useDragState = createGlobalState(() => {
  const data = ref<Version>()
  const dragData = ref<DragData>()
  const placeholder = ref<HTMLElement>()

  function setData(version: Version) {
    data.value = version
  }

  async function dragStart(event: DragEvent) {
    const source = event.currentTarget as HTMLElement
    const sourceData = parseUUIDs(event.currentTarget as HTMLElement)
    event.dataTransfer!.effectAllowed = "move"
    event.dataTransfer!.dropEffect = "move"
    dragData.value = sourceData
    setTimeout(() => {
      if (!dragData.value) {
        return
      }
      placeholder.value = source!.cloneNode(true) as HTMLElement
      placeholder.value.classList.add("opacity-60", "bg-gray-300")
      placeholder.value.addEventListener("dragenter", dragEnter)
      placeholder.value.addEventListener("dragover", dragOver)
      placeholder.value.addEventListener("drop", drop)
      source.classList.add("hidden")
    }, 1)
  }

  function dragEnter(event: DragEvent) {
    const sourceData = dragData.value!
    const targetData = parseUUIDs(event.currentTarget as HTMLElement)
    if (sourceData.dataType !== targetData.dataType) {
      return
    }
    if (
      sourceData.blockId === targetData.blockId &&
      sourceData.groupId === targetData.groupId &&
      sourceData.linkId === targetData.linkId
    ) {
      return
    }
    event.preventDefault()

    if (placeholder.value?.parentNode) {
      placeholder.value = placeholder.value?.parentNode?.removeChild(
        placeholder.value,
      )
    }
    const eventTarget = event.currentTarget as HTMLElement
    eventTarget?.parentNode?.insertBefore(
      placeholder.value as HTMLElement,
      eventTarget,
    )
  }

  function dragOver(event: DragEvent) {
    const sourceData = dragData.value!
    const targetData = parseUUIDs(event.currentTarget as HTMLElement)
    if (sourceData.dataType !== targetData.dataType) {
      return
    }
    event.preventDefault()
  }

  function drop(event: DragEvent) {
    const sourceData = dragData.value
    const target = event.currentTarget as HTMLElement
    let targetData = parseUUIDs(target)
    if (sourceData?.dataType !== targetData.dataType) {
      return
    }
    if (
      sourceData.blockId === targetData.blockId &&
      sourceData.groupId === targetData.groupId &&
      sourceData.linkId === targetData.linkId
    ) {
      targetData = parseUUIDs(target?.nextSibling as HTMLElement)
    }
    event.preventDefault()

    const blocks = data.value!.blocks
    if (sourceData.dataType === "Block") {
      const idx = blocks.findIndex((b) => b.id === sourceData.blockId)
      const [block] = blocks.splice(idx, 1)
      const idxTarget = targetData.blockId
        ? blocks.findIndex((b) => b.id === targetData.blockId)
        : blocks.length
      blocks.splice(idxTarget, 0, block)
    } else if (sourceData.dataType === "Group") {
      const sourceBlock = blocks.find((b) => b.id == sourceData.blockId)
      const idx = sourceBlock!.groups.findIndex(
        (g) => g.id === sourceData.groupId,
      )
      const [group] = sourceBlock!.groups.splice(idx, 1)
      const targetBlock = blocks.find((b) => b.id == targetData.blockId)
      const idxTarget = targetData.groupId
        ? targetBlock!.groups.findIndex((g) => g.id === targetData.groupId)
        : targetBlock!.groups.length
      group.blockId = targetBlock?.id
      targetBlock!.groups.splice(idxTarget, 0, group)
    } else if (sourceData.dataType === "Link") {
      const sourceGroup = blocks
        .find((b) => b.id === sourceData.blockId)
        ?.groups.find((g) => g.id === sourceData.groupId)
      const idx = sourceGroup!.links.findIndex(
        (l) => l.id === sourceData.linkId,
      )
      const [link] = sourceGroup!.links.splice(idx, 1)
      const targetGroup = blocks
        .find((b) => b.id === targetData.blockId)
        ?.groups.find((g) => g.id === targetData.groupId)
      const idxTarget = targetData.linkId
        ? targetGroup!.links.findIndex((l) => l.id === targetData.linkId)
        : targetGroup!.links.length
      link.blockId = targetGroup?.blockId
      link.groupId = targetGroup?.id
      targetGroup!.links.splice(idxTarget, 0, link)
    }

    if (placeholder.value?.parentNode) {
      placeholder.value = placeholder.value?.parentNode?.removeChild(
        placeholder.value,
      )
    }
    placeholder.value?.remove()
    placeholder.value = undefined
    dragData.value = undefined
  }

  function dragEnd(event: DragEvent) {
    if (!placeholder.value) {
      dragData.value = undefined
    }
    ;(event.currentTarget as HTMLElement).classList.remove("hidden")
  }

  return {
    dragData,
    dragStart,
    dragEnter,
    dragOver,
    dragEnd,
    drop,
    setData,
  }
})

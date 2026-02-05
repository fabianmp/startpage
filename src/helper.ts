import { Version } from "./model"

export function addUUIDs(data: Version) {
  data.blocks.forEach((b) => {
    b.id = crypto.randomUUID()
    b.groups.forEach((g) => {
      g.id = crypto.randomUUID()
      g.blockId = b.id
      g.links.forEach((l) => {
        l.id = crypto.randomUUID()
        l.blockId = b.id
        l.groupId = g.id
      })
    })
  })
  return data
}

export function removeUUIDs(data: Version) {
  data.blocks.forEach((b) => {
    delete b.id
    b.groups.forEach((g) => {
      delete g.id
      delete g.blockId
      g.links.forEach((l) => {
        delete l.id
        delete l.blockId
        delete l.groupId
      })
    })
  })
  return data
}

export type DragDataType = "Block" | "Group" | "Link"

export interface DragData {
  dataType: DragDataType
  blockId?: string
  groupId?: string
  linkId?: string
}

export function parseUUIDs(element: HTMLElement) {
  return <DragData>{
    dataType: element.dataset.targetType,
    blockId: element.dataset.blockId,
    groupId: element.dataset.groupId,
    linkId: element.dataset.linkId,
  }
}

export interface Link {
  id?: string
  blockId?: string
  groupId?: string
  name: string
  url: string
  icon?: string
}

export interface Container {
  id?: string
  name: string
  color: string
  icon?: string
}

export interface Group extends Container {
  links: Link[]
  blockId?: string
}

export interface Block extends Container {
  groups: Group[]
  visible?: boolean
}

export interface Version {
  timestamp: Date
  blocks: Block[]
}

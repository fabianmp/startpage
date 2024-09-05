const baseColors = ['red', 'yellow', 'green', 'blue', 'purple', 'gray']
const colors = baseColors.flatMap(c => [300, 600, 800].map(w => `${c}-${w}`))

const app = Vue.createApp({
  data() {
    return {
      localStorage: true,
      lastUpdated: null,
      blocks: [],
      edit: false,
      openNewTab: false,
      popupData: null,
      dragData: null,
      dragSource: null,
      placeholder: null,
      placeholderTemplate: null,
      showPopup: false,
      showJson: false
    }
  },
  async mounted() {
    if (data !== undefined && data.length !== 0) {
      this.blocks.splice(0, this.blocks.length, ...data)
      this.localStorage = false
    } else {
      const db = await idb.openDB("Startpage", 1, {
        upgrade(db, oldVersion, newVersion, transaction, event) {
          db.createObjectStore("data", { keyPath: "timestamp" })
        }
      })
      if (await db.count("data") === 0) {
        const blocks = JSON.parse(window.localStorage.getItem('startpage-data') ?? '[]')
        await db.put("data", {timestamp: new Date(), blocks: blocks})
        window.localStorage.removeItem('startpage-data')
      }
      const versions = await db.getAllKeys("data")
      const latest = versions[versions.length-1]
      await this.loadVersion(latest)
      this.openNewTab = JSON.parse(window.localStorage.getItem('startpage-open-new-tab', 'false'))
      this.localStorage = true
    }
    tippy.createSingleton(tippy('[data-tippy-content]'), {
      appendTo: () => document.body,
      delay: [500, 0]
    })
  },
  methods: {
    openPopup(target) {
      this.popupTippy?.destroy()
      this.popupTippy = tippy(target, {
        appendTo: () => document.getElementById('app'),
        content: '<div id="popup"></div>',
        allowHTML: true,
        hideOnClick: false,
        interactive: true,
        ignoreAttributes: true,
        showOnCreate: true,
        sticky: 'popper',
        trigger: 'manual',
        onHidden: () => {
          this.showPopup = false
        },
        onMount: () => {
          this.showPopup = true
        }
      })
    },
    hidePopup() {
      this.popupTippy?.destroy()
      this.popupData = null
      this.showPopup = false
    },
    editLink(block, group, link, event) {
      this.popupData = { block, group, link, type: 'link' }
      this.openPopup(event.currentTarget)
    },
    deleteLink(block, group, link) {
      this.blocks[block].groups[group].links.splice(link, 1)
    },
    dragType() {
      if (this.dragData.group === undefined && this.dragData.link === undefined)
      {
        return "block"
      }
      if (this.dragData.link === undefined)
      {
        return "group"
      }
      return "link"
    },
    dragMatch(group, link) {
      if (this.dragType() === "link" && link !== undefined) {
        return true
      }
      if (this.dragType() === "group" && group !== undefined && link === undefined) {
        return true
      }
      if (this.dragType() === "block" && group === undefined && link === undefined) {
        return true
      }
      return false
    },
    onDragStart(event, block, group, link) {
      this.hidePopup()
      event.dataTransfer.effectAllowed = "move"
      if (!this.dragData) {
        this.dragData = {block, group, link}
        this.dragSource = event.currentTarget
        setTimeout(() => {
          this.placeholderTemplate = this.dragSource.cloneNode(true)
          this.placeholderTemplate.classList.add("opacity-60")
          this.dragSource.classList.add("hidden")
        }, 1)
      }
    },
    onDragEnd() {
      this.dragSource?.classList.remove("hidden")
      this.dragSource = null
      this.dragData = null
      this.placeholder?.remove()
      this.placeholder = null
      this.placeholderTemplate = null
      this.$forceUpdate()
    },
    onDragOver(event, block, group, link) {
      if (!this.dragMatch(group, link)) {
        return
      }
      event.preventDefault()
    },
    onDragEnter(event, block, group, link, temporary) {
      if (!this.dragMatch(group, link)) {
        return
      }
      event.preventDefault()
      if (temporary) {
        return
      }
      this.placeholder?.remove()
      this.placeholder = this.placeholderTemplate.cloneNode(true)
      this.placeholder.addEventListener("dragover", e => this.onDragOver(e, block, group, link))
      this.placeholder.addEventListener("dragenter", e => this.onDragEnter(e, block, group, link, true))
      this.placeholder.addEventListener("dragleave", e => this.onDragLeave(e, block, group, link))
      this.placeholder.addEventListener("drop", e => this.onDrop(e, block, group, link))
      event.currentTarget.parentNode.insertBefore(this.placeholder, event.currentTarget)
    },
    onDragLeave(event, block, group, link) {
      if (!this.dragMatch(group, link)) {
        return
      }
      event.preventDefault()
    },
    onDrop(event, block, group, link) {
      if (!this.dragMatch(group, link)) {
        return
      }
      event.preventDefault()
      event.dataTransfer.dropEffect = "move"

      if (this.dragType() === "link") {
        const data = this.blocks[this.dragData.block].groups[this.dragData.group].links[this.dragData.link]
        if (link === -1) {
          this.blocks[block].groups[group].links.push(data)
        } else {
          this.blocks[block].groups[group].links.splice(link, 0, data)
        }
        if (this.dragData.block === block && this.dragData.group === group && this.dragData.link > link && link !== -1) {
          this.blocks[this.dragData.block].groups[this.dragData.group].links.splice(this.dragData.link + 1, 1)
        } else {
          this.blocks[this.dragData.block].groups[this.dragData.group].links.splice(this.dragData.link, 1)
        }
      } else if (this.dragType() === "group") {
        const data = this.blocks[this.dragData.block].groups[this.dragData.group]
        if (group === -1) {
          this.blocks[block].groups.push(data)
        } else {
          this.blocks[block].groups.splice(group, 0, data)
        }
        if (this.dragData.block === block && this.dragData.group > group && group !== -1) {
          this.blocks[this.dragData.block].groups.splice(this.dragData.group + 1, 1)
        } else {
          this.blocks[this.dragData.block].groups.splice(this.dragData.group, 1)
        }
      } else {
        const data = this.blocks[this.dragData.block]
        if (block === -1) {
          this.blocks.push(data)
        } else {
          this.blocks.splice(block, 0, data)
        }
        if (this.dragData.block > block && block !== -1) {
          this.blocks.splice(this.dragData.block + 1, 1)
        } else {
          this.blocks.splice(this.dragData.block, 1)
        }
      }

      this.placeholder?.remove()
      this.placeholder = null
    },
    editGroup(block, group, event) {
      this.popupData = { block, group, type: 'title' }
      this.openPopup(event.currentTarget)
    },
    deleteGroup(block, group) {
      this.blocks[block].groups.splice(group, 1)
    },
    editBlock(block, event) {
      this.popupData = { block, group: undefined, type: 'title' }
      this.openPopup(event.currentTarget)
    },
    deleteBlock(block) {
      this.blocks.splice(block, 1)
    },
    async cancel() {
      const db = await idb.openDB("Startpage")
      const versions = await db.getAllKeys("data")
      const latest = versions[versions.length-1]
      await this.loadVersion(latest)
      this.hidePopup()
      this.edit = false
    },
    editJson() {
      this.showJson = true
      Vue.nextTick(() => document.getElementById("editor").json_value = this.blocks)
    },
    acceptJson() {
      this.blocks = document.getElementById("editor").json_value
      this.showJson = false
    },
    cancelJson() {
      this.showJson = false
    },
    async accept() {
      const data = JSON.parse(JSON.stringify(this.blocks))
      const db = await idb.openDB("Startpage")
      const timestamp = new Date()
      await db.put("data", {timestamp: timestamp, blocks: data})
      this.lastUpdated = timestamp
      this.hidePopup()
      this.edit = false
    },
    async showVersions(event) {
      if (this.showPopup && this.popupData.type === 'versions') {
        this.hidePopup()
      } else {
        const db = await idb.openDB("Startpage")
        const versions = await db.getAllKeys("data")
        this.popupData = { versions, type: 'versions' }
        this.openPopup(event.target)
      }
    },
    async loadVersion(version) {
      const db = await idb.openDB("Startpage")
      const dataFromDb = await db.get("data", version)
      this.lastUpdated = dataFromDb.timestamp
      this.blocks.splice(0, this.blocks.length, ...dataFromDb.blocks)
    },
    async deleteVersion(version) {
      const db = await idb.openDB("Startpage")
      await db.delete("data", version)
      if (await db.count("data") === 0) {
        await db.put("data", {timestamp: new Date(), blocks: []})
      }
      const versions = await db.getAllKeys("data")
      this.popupData = { versions, type: 'versions' }
      if (version.valueOf() === this.lastUpdated.valueOf()) {
        const latest = versions[versions.length-1]
        const dataFromDb = await db.get("data", latest)
        this.lastUpdated = dataFromDb.timestamp
        this.blocks.splice(0, this.blocks.length, ...dataFromDb.blocks)
      }
    },
    toggleNewTab() {
      this.openNewTab = !this.openNewTab
      window.localStorage.setItem('startpage-open-new-tab', JSON.stringify(this.openNewTab))
    }
  }
})

app.component("tooltip-dummy", {
  template: '<span></span>',
  mounted() {
    this.allTooltips = tippy('[data-tippy-content]')
    this.singletonTooltip = tippy.createSingleton(this.allTooltips, {
      appendTo: () => document.body,
      delay: [500, 0]
    })
  },
  unmounted() {
    this.allTooltips.forEach(t => t.destroy())
    this.singletonTooltip.destroy()
  }
})

function createIconPicker() {
  return new IconPicker('#icon', {
    theme: "default",
    iconSource: [{
      key: 'fa6-solid',
      prefix: 'fa-',
      url: 'https://raw.githubusercontent.com/iconify/icon-sets/master/json/fa6-solid.json'
    }],
    closeOnSelect: true
  });
}

app.component("edit-title", {
  template: "#edit-title-template",
  data() {
    return {
      name: '',
      icon: null,
      color: '',
      colors: colors
    }
  },
  props: {
    block: Number,
    group: Number
  },
  methods: {
    close() {
      this.$root.hidePopup()
    },
    save() {
      if (this.block < 0) {
        this.$root.blocks.push({ name: this.name, icon: this.icon, color: this.color, groups: [], visible: true })
      } else if (this.group < 0) {
        this.$root.blocks[this.block].groups.push({ name: this.name, icon: this.icon, color: this.color, links: [] })
      } else if (this.group === undefined) {
        this.$root.blocks[this.block].name = this.name
        this.$root.blocks[this.block].icon = this.icon
        this.$root.blocks[this.block].color = this.color
      } else {
        this.$root.blocks[this.block].groups[this.group].name = this.name
        this.$root.blocks[this.block].groups[this.group].icon = this.icon
        this.$root.blocks[this.block].groups[this.group].color = this.color
      }
      this.close()
    }
  },
  mounted() {
    const iconPicker = createIconPicker();
    iconPicker.on('save', i => {
      this.icon = i.value;
    });
  },
  created() {
    if (this.block < 0 || this.group < 0) {
      this.color = this.colors[Math.floor(Math.random() * this.colors.length)]
      return
    }

    if (this.group === undefined) {
      this.name = this.$root.blocks[this.block].name
      this.icon = this.$root.blocks[this.block].icon
      this.color = this.$root.blocks[this.block].color
    } else {
      this.name = this.$root.blocks[this.block].groups[this.group].name
      this.icon = this.$root.blocks[this.block].groups[this.group].icon
      this.color = this.$root.blocks[this.block].groups[this.group].color
    }
  }
})

app.component("edit-link", {
  template: "#edit-link-template",
  data() {
    return {
      name: '',
      icon: null,
      url: ''
    }
  },
  props: {
    block: Number,
    group: Number,
    link: Number
  },
  methods: {
    close() {
      this.$root.hidePopup()
    },
    save() {
      if (this.link < 0) {
        this.$root.blocks[this.block].groups[this.group].links.push({ name: this.name, icon: this.icon, url: this.url })
      } else {
        this.$root.blocks[this.block].groups[this.group].links[this.link].name = this.name
        this.$root.blocks[this.block].groups[this.group].links[this.link].icon = this.icon
        this.$root.blocks[this.block].groups[this.group].links[this.link].url = this.url
      }
      this.close()
    }
  },
  mounted() {
    const iconPicker = createIconPicker();
    iconPicker.on('save', i => {
      this.icon = i.value;
    });
  },
  created() {
    if (this.link < 0) return

    this.name = this.$root.blocks[this.block].groups[this.group].links[this.link].name
    this.icon = this.$root.blocks[this.block].groups[this.group].links[this.link].icon
    this.url = this.$root.blocks[this.block].groups[this.group].links[this.link].url
  }
})

app.component("show-versions", {
  template: "#versions-template",
  props: {
    versions: Array
  },
  computed: {
    lastUpdated() {
      return this.$root.lastUpdated
    }
  },
  methods: {
    loadVersion(version) {
      this.$root.loadVersion(version)
    },
    deleteVersion(version) {
      this.$root.deleteVersion(version)
    },
  },
})

const vm = app.mount('#app')

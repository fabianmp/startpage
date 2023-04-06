const baseColors = ['red', 'yellow', 'green', 'blue', 'purple', 'gray']
const colors = baseColors.flatMap(c => [300, 600, 800].map(w => `${c}-${w}`))

const app = Vue.createApp({
  data() {
    return {
      localStorage: true,
      blocks: [],
      edit: false,
      editData: null,
      dragData: null,
      dragSource: null,
      placeholder: null,
      placeholderTemplate: null,
      showPopup: false,
      showJson: false
    }
  },
  mounted() {
    if (data !== undefined && data.length !== 0) {
      this.blocks.splice(0, this.blocks.length, ...data)
      this.localStorage = false
    } else {
      const data = JSON.parse(window.localStorage.getItem('startpage-data') ?? '[]')
      this.blocks.splice(0, this.blocks.length, ...data)
      this.localStorage = true
    }
    tippy.createSingleton(tippy('[data-tippy-content]'), {
      appendTo: () => document.body,
      delay: [500, 0]
    })
  },
  methods: {
    showEditPopup(target) {
      this.editTippy?.destroy()
      this.editTippy = tippy(target, {
        appendTo: () => document.getElementById('app'),
        content: '<div id="edit-popup"></div>',
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
    hideEditPopup() {
      this.editTippy?.destroy()
      this.editData = null
      this.showPopup = false
    },
    editLink(block, group, link, event) {
      this.editData = { block, group, link, type: 'link' }
      this.showEditPopup(event.currentTarget)
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
      this.hideEditPopup()
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
      this.editData = { block, group, type: 'title' }
      this.showEditPopup(event.currentTarget)
    },
    deleteGroup(block, group) {
      this.blocks[block].groups.splice(group, 1)
    },
    editBlock(block, event) {
      this.editData = { block, group: undefined, type: 'title' }
      this.showEditPopup(event.currentTarget)
    },
    deleteBlock(block) {
      this.blocks.splice(block, 1)
    },
    reset() {
      this.blocks = JSON.parse(window.localStorage.getItem('startpage-data') ?? '[]')
    },
    cancel() {
      this.reset()
      this.hideEditPopup()
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
    accept() {
      window.localStorage.setItem('startpage-data', JSON.stringify(this.blocks))
      this.hideEditPopup()
      this.edit = false
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

app.component("edit-title", {
  template: "#edit-title-template",
  data() {
    return {
      name: '',
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
      this.$root.hideEditPopup()
    },
    save() {
      if (this.block < 0) {
        this.$root.blocks.push({ name: this.name, color: this.color, groups: [], visible: true })
      } else if (this.group < 0) {
        this.$root.blocks[this.block].groups.push({ name: this.name, color: this.color, links: [] })
      } else if (this.group === undefined) {
        this.$root.blocks[this.block].name = this.name
        this.$root.blocks[this.block].color = this.color
      } else {
        this.$root.blocks[this.block].groups[this.group].name = this.name
        this.$root.blocks[this.block].groups[this.group].color = this.color
      }
      this.close()
    }
  },
  created() {
    if (this.block < 0 || this.group < 0) {
      this.color = this.colors[Math.floor(Math.random() * this.colors.length)]
      return
    }

    if (this.group === undefined) {
      this.name = this.$root.blocks[this.block].name
      this.color = this.$root.blocks[this.block].color
    } else {
      this.name = this.$root.blocks[this.block].groups[this.group].name
      this.color = this.$root.blocks[this.block].groups[this.group].color
    }
  }
})

app.component("edit-link", {
  template: "#edit-link-template",
  data() {
    return {
      name: '',
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
      this.$root.hideEditPopup()
    },
    save() {
      if (this.link < 0) {
        this.$root.blocks[this.block].groups[this.group].links.push({ name: this.name, url: this.url })
      } else {
        this.$root.blocks[this.block].groups[this.group].links[this.link].name = this.name
        this.$root.blocks[this.block].groups[this.group].links[this.link].url = this.url
      }
      this.close()
    }
  },
  created() {
    if (this.link < 0) return

    this.name = this.$root.blocks[this.block].groups[this.group].links[this.link].name
    this.url = this.$root.blocks[this.block].groups[this.group].links[this.link].url
  }
})

const vm = app.mount('#app')

const baseColors = ['red', 'yellow', 'green', 'blue', 'purple', 'gray']
const colors = baseColors.flatMap(c => [300, 600, 800].map(w => `${c}-${w}`))

const app = Vue.createApp({
  data() {
    return {
      localStorage: true,
      blocks: [],
      edit: false,
      editData: null,
      showPopup: false
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
    moveLinkUp(block, group, link) {
      if (link === 0) return

      const data = this.blocks[block].groups[group].links[link]
      this.blocks[block].groups[group].links.splice(link, 1)
      this.blocks[block].groups[group].links.splice(link - 1, 0, data)
    },
    moveLinkDown(block, group, link) {
      if (link === this.blocks[block].groups[group].links.length - 1) return

      const data = this.blocks[block].groups[group].links[link]
      this.blocks[block].groups[group].links.splice(link, 1)
      this.blocks[block].groups[group].links.splice(link + 1, 0, data)
    },
    editGroup(block, group, event) {
      this.editData = { block, group, type: 'title' }
      this.showEditPopup(event.currentTarget)
    },
    deleteGroup(block, group) {
      this.blocks[block].groups.splice(group, 1)
    },
    moveGroupLeft(block, group) {
      if (group === 0) return

      const data = this.blocks[block].groups[group]
      this.blocks[block].groups.splice(group, 1)
      this.blocks[block].groups.splice(group - 1, 0, data)
    },
    moveGroupRight(block, group) {
      if (group === this.blocks[block].groups.length - 1) return

      const data = this.blocks[block].groups[group]
      this.blocks[block].groups.splice(group, 1)
      this.blocks[block].groups.splice(group + 1, 0, data)
    },
    editBlock(block, event) {
      this.editData = { block, group: undefined, type: 'title' }
      this.showEditPopup(event.currentTarget)
    },
    deleteBlock(block) {
      this.blocks.splice(block, 1)
    },
    moveBlockUp(block) {
      if (block === 0) return

      const data = this.blocks[block]
      this.blocks.splice(block, 1)
      this.blocks.splice(block - 1, 0, data)
    },
    moveBlockDown(block) {
      if (block === this.blocks.length - 1) return

      const data = this.blocks[block]
      this.blocks.splice(block, 1)
      this.blocks.splice(block + 1, 0, data)
    },
    reset() {
      this.blocks = JSON.parse(window.localStorage.getItem('startpage-data') ?? '[]')
    },
    importFile() {
      document.querySelector("#file-input").click()
    },
    loadFileContent(event) {
      if (event.target.files.length !== 1) {
        return
      }
      const file = event.target.files[0]
      var reader = new FileReader()
      reader.addEventListener('load', function (e) {
        const data = JSON.parse(e.target.result)
        vm.blocks.splice(0, vm.blocks.length, ...data)
      })
      reader.readAsText(file)
      event.target.value = null
    },
    download() {
      const jsonData = JSON.stringify(JSON.parse(window.localStorage.getItem('startpage-data')), null, 2)
      var element = document.createElement('a')
      element.style.display = 'none'
      element.setAttribute('href', 'data:application/jsoncharset=utf-8,' + encodeURIComponent(jsonData))
      element.setAttribute('download', 'startpage.json')
      document.body.appendChild(element)
      element.click()
      document.body.removeChild(element)
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

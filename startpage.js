var data = {
  groups: [
    {
      name: "First Group",
      color: ["bg-gray-700", "text-white"],
      linkGroups: [
        {
          name: "Sub Group 1.1",
          title: ["bg-blue-500", "text-white"],
          border: ["border-blue-500"],
          links: [
            {
              name: "Vue.js",
              url: "https://vuejs.org/"
            },
            {
              name: "tailwindcss",
              url: "https://tailwindcss.com/"
            }
          ]
        },
        {
          name: "Sub Group 1.2",
          title: ["bg-red-500", "text-white"],
          border: ["border-red-500"],
          links: [
            {
              name: "Apple",
              url: "https://www.apple.com/"
            },
            {
              name: "Android",
              url: "https://www.android.com/"
            }
          ]
        },
        {
          name: "Sub Group 1.3",
          title: ["bg-yellow-700", "text-white"],
          border: ["border-yellow-700"],
          links: [
            {
              name: "Google",
              url: "https://www.google.com/"
            },
            {
              name: "Microsoft",
              url: "https://www.microsoft.com"
            }
          ]
        }
      ]
    },
    {
      name: "Second Group",
      color: ["bg-blue-400", "text-white"],
      linkGroups: [
        {
          name: "Sub Group 2.1",
          title: ["bg-blue-700", "text-white"],
          border: ["border-blue-700"],
          links: [
            {
              name: "Netflix",
              url: "https://www.netflix.com/"
            }
          ]
        }
      ]
    }
  ]
};

var app = new Vue({
  el: '#app',
  data: data
});

import { defineConfig } from "astro/config";
import starlight from "@astrojs/starlight";
import tailwind from "@astrojs/tailwind";
import vue from "@astrojs/vue";

// https://astro.build/config
export default defineConfig({
  site: "https://vue-simple-dnd.netlify.app",
  integrations: [
    starlight({
      title: "vue-simple-dnd",
      customCss: ["./src/style.css"],
      social: {
        github: "https://github.com/florian-lefebvre/vue-simple-dnd",
      },
      sidebar: [
        {
          label: "Getting Started",
          items: [
            {
              label: "Installation",
              link: "/getting-started/installation/",
            },
            {
              label: "Usage",
              link: "/getting-started/usage/",
            },
          ],
        },
        {
          label: "Components",
          items: [
            {
              label: "DragContext",
              link: "/components/drag-context/",
            },
            {
              label: "Draggable",
              link: "/components/draggable/",
            },
            {
              label: "Droppable",
              link: "/components/droppable/",
            },
          ],
        },
        {
          label: "Composables",
          items: [
            {
              label: "provideDragContext",
              link: "/composables/provide-drag-context/",
            },
            {
              label: "useDraggable",
              link: "/composables/use-draggable/",
            },
            {
              label: "useDroppable",
              link: "/composables/use-droppable/",
            },
          ],
        },
        {
          label: "Demo",
          link: "/demo/",
        },
      ],
    }),
    tailwind({
      applyBaseStyles: false,
    }),
    vue(),
  ],
  redirects: {
    "/": "/getting-started/installation/",
  },
});

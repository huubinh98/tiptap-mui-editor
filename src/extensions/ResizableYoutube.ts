import { Node, NodeViewProps } from "@tiptap/core";
import { Youtube, YoutubeOptions } from "@tiptap/extension-youtube";
import { ReactNodeViewRenderer } from "@tiptap/react";
import ResizableYoutubeComponent from "./ResizableYoutubeComponent";

interface YoutubeAttributes extends YoutubeOptions {
  ChildComponent?: React.ElementType<NodeViewProps>;
  width: number;
  height: number;
  textAlign?: "left" | "center" | "right" | "justify";
}

declare module "@tiptap/core" {
  interface Commands<ReturnType> {
    resizableYoutube: {
      setYoutubeVideo: (options: YoutubeAttributes) => ReturnType;
      updateYoutubeVideo: (options: Partial<YoutubeAttributes>) => ReturnType;
    };
  }
}

export const ResizableYoutube = Node.create<YoutubeAttributes>({
  name: "youtube",
  group: "block",
  atom: true,

  addOptions() {
    return {
      ...Youtube.options,
      HTMLAttributes: {
        ...Youtube.options.HTMLAttributes,
        width: "100%",
        height: "auto",
      },
    };
  },

  addAttributes() {
    return {
      src: { default: null },
      width: { default: "100%" },
      height: { default: "auto" },
      controls: { default: true },
      allowFullscreen: { default: true },
      textAlign: { default: "center" },
    };
  },

  // parseHTML() {
  //   return [{ tag: "div[data-youtube-video]" }];
  // },

  parseHTML() {
    return [
      {
        tag: "div[data-youtube-video]",
        getAttrs: (dom: HTMLElement) => {
          const iframe = dom.querySelector("iframe");
          return {
            src: iframe?.getAttribute("src") || null,
            width: dom.style.width || "100%",
            height:
              (iframe?.getAttribute("height") as unknown as number) || 360,
            controls: true,
            allowFullscreen: dom.hasAttribute("allowfullscreen"),
            textAlign: dom.style.textAlign || "center", // Lấy textAlign từ style
          };
        },
      },
    ];
  },

  // renderHTML({ HTMLAttributes }) {
  //   return [
  //     "div",
  //     {
  //       "data-youtube-video": "",
  //       ...HTMLAttributes,
  //       style: { textAlign: HTMLAttributes.textAlign },
  //     },
  //     ["iframe", HTMLAttributes],
  //   ];
  // },

  renderHTML({ HTMLAttributes }) {
    return [
      "div",
      { "data-youtube-video": "", ...HTMLAttributes, style: { textAlign: HTMLAttributes.textAlign || "center" } },
      ["iframe", { ...HTMLAttributes, width: HTMLAttributes.width || 640, height: HTMLAttributes.height || 360 }],
    ];
  },

  addNodeView() {
    // In order to add interactive functionality for a user to resize the image
    // (and set the `width` attribute as it does so), use a Node View. See
    // https://tiptap.dev/guide/custom-extensions#node-views and
    // https://tiptap.dev/guide/node-views/react
    // @ts-expect-error Our ResizableImageComponent component overrides the
    // NodeViewProps to specify that the `node`'s `attrs` contains the
    // attributes added above and in the base Image extension (src, width,
    // aspectRatio, etc.), but `ReactNodeViewRenderer`'s type doesn't account
    // for this.
    return ReactNodeViewRenderer(ResizableYoutubeComponent);
  },

  addCommands() {
    return {
      setYoutubeVideo:
        (options) =>
        ({ commands }) => {
          return commands.insertContent({
            type: this.name,
            attrs: options,
          });
        },
      updateYoutubeVideo:
        (options) =>
        ({ commands }) => {
          return commands.updateAttributes(this.name, options);
        },
    };
  },
});

export default ResizableYoutube;

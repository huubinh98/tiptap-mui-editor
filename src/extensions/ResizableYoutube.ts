import { Node } from "@tiptap/core";
import { Youtube, YoutubeOptions } from "@tiptap/extension-youtube";
import { ReactNodeViewRenderer } from "@tiptap/react";
import ResizableYoutubeComponent from "./ResizableYoutubeComponent";

interface YoutubeAttributes extends YoutubeOptions {
  width: number;
  height: number;
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
    };
  },

  parseHTML() {
    return [{ tag: "div[data-youtube-video]" }];
  },

  renderHTML({ HTMLAttributes }) {
    return ["div", { "data-youtube-video": "", ...HTMLAttributes }, ["iframe", HTMLAttributes]];
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
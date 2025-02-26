import { Node } from "@tiptap/core";

export interface VideoOptions {
  HTMLAttributes: Record<string, unknown>;

    /**
   * Controls if base64 images are allowed. Enable this if you want to allow
   * base64 image urls in the `src` attribute.
   * @default false
   * @example true
   */
    allowBase64: boolean,
}

declare module "@tiptap/core" {
  interface Commands<ReturnType> {
    video: {
      setVideo: (options: { src: string; controls?: boolean; width?: string; height?: string }) => ReturnType;
    };
  }
}

export const Video = Node.create<VideoOptions>({
  name: "video",
  group: "block",
  atom: true,

  addOptions() {
    return {
      HTMLAttributes: {},
      allowBase64: false,
    };
  },

  addAttributes() {
    return {
      src: { default: null },
      controls: { default: true },
      width: { default: "100%" },
      height: { default: "auto" },
    };
  },

  parseHTML() {
    return [{ tag: "video" }];
  },

  renderHTML({ HTMLAttributes }) {
    return ["video", HTMLAttributes];
  },

  addCommands() {
    return {
      setVideo:
        (options) =>
        ({ commands }) => {
          return commands.insertContent({
            type: this.name,
            attrs: options,
          });
        },
    };
  },
});

export default Video;
import {
  ExtendedRegExpMatchArray,
  InputRule,
  mergeAttributes,
  NodeViewProps,
} from "@tiptap/core";
import { ReactNodeViewRenderer } from "@tiptap/react";
import ResizableImageComponent from "./ResizableImageComponent";
import Video, { VideoOptions } from "./Video";


export type ResizableVideoOptions = VideoOptions & {
  /**
   * Return true if this is an img src we will permit to be created/rendered.
   *
   * If not provided, defaults to allowing all non-empty image `src` values.
   *
   * This option can be used to restrict which images are permitted. For
   * instance, this can be set such that only images from a certain set of
   * hostnames are allowed.
   */
  isAllowedVideoSrc(src: string | null): boolean;

  /**
   * Optional React component to pass in as a child component to ResizableImage,
   * as a sibling placed after the img element.
   * This component will be rendered with the NodeViewProps passed from TipTap.
   */
  ChildComponent?: React.ElementType<NodeViewProps>;
  
  inline?: boolean;
};

const ResizableVideo = Video.extend<ResizableVideoOptions>({
  addOptions() {
    return {
      ...this.parent?.(),
      isAllowedVideoSrc: (src: string | null) => {
        if (!src) {
          return false;
        }
        return true;
      },
    };
  },
  addAttributes() {
    return {
      ...this.parent?.(),
      width: {
        default: null,
        renderHTML: (attributes) => ({
          width: attributes.width as string | number | undefined,
        }),
        parseHTML: (element) => element.getAttribute("width"),
      },
      aspectRatio: {
        default: null,
        renderHTML: (attributes) => {
          if (!attributes.aspectRatio) {
            return {};
          }

          return {
            style: `aspect-ratio: ${attributes.aspectRatio as string}`,
          };
        },
        parseHTML: (element) => element.style.aspectRatio,
      },
    };
  },

  renderHTML({ HTMLAttributes }) {
    return [
      "video",
      mergeAttributes(
        // Always render the `height="auto"` attribute by default, since we control the
        // width with resizing (and this maintains the image aspect ratio)
        {
          height: "auto",
        },
        this.options.HTMLAttributes,
        HTMLAttributes
      ),
    ];
  },

  parseHTML() {
    return [
      {
        // This default tag-parsing rule is taken directly from the builtin Video
        // extension
        // (https://github.com/ueberdosis/tiptap/blob/4108e9f991522b5ac8f669ae2d24cfe9f91780ba/packages/extension-image/src/image.ts#L61-L69)
        tag: this.options.allowBase64
          ? "video[src]"
          : 'video[src]:not([src^="data:"])',
        getAttrs: (node) => {
          if (!(node instanceof Element)) {
            return false;
          }
          const src = node.getAttribute("src");
          return this.options.isAllowedVideoSrc(src) && null;
        },
      },
    ];
  },

  addInputRules() {
    const parentInputRules = this.parent?.();
    if (!parentInputRules) {
      return [];
    }

    // This `getAttributes` definition comes from the default implementation here
    // https://github.com/ueberdosis/tiptap/blob/4108e9f991522b5ac8f669ae2d24cfe9f91780ba/packages/extension-image/src/image.ts#L91-L95
    const getAttributes = (match: ExtendedRegExpMatchArray) => {
      const [, , alt, src, title] = match;
      return { src, alt, title };
    };

    // Unlike for `parseHTML` above, we can't simply override the `getAttributes`
    // function passed to `nodeInputRule`, since returning false there does not prevent
    // usage of the input rule (see
    // https://github.com/ueberdosis/tiptap/blob/f5c6fabbce534561cfe18012e48a5b6b406923bc/packages/core/src/inputRules/nodeInputRule.ts#L23).
    // Instead, we have to update the handler of the InputRule itself, which is
    // generated from the config passed to the `nodeInputRule`
    // (https://github.com/ueberdosis/tiptap/blob/4108e9f991522b5ac8f669ae2d24cfe9f91780ba/packages/extension-image/src/image.ts#L86-L98).
    // So iterate through each InputRule (should be just one in practice), and form an
    // alternate version which performs nothing if the image src is not permissable.
    return parentInputRules.map(
      (rule) =>
        new InputRule({
          find: rule.find,
          handler: (props) => {
            const attributes = getAttributes(props.match);
            if (!this.options.isAllowedVideoSrc(attributes.src)) {
              // Skip this and don't transform the text into an Image
              return;
            }

            // Since the image src is valid, let the normal handler run
            return rule.handler(props);
          },
        })
    );
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
    return ReactNodeViewRenderer(ResizableImageComponent);
  },
});

export default ResizableVideo;

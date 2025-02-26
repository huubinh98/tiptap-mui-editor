import type { NodeViewProps } from "@tiptap/core";
import type { Node as ProseMirrorNode } from "@tiptap/pm/model";
import { NodeViewWrapper } from "@tiptap/react";
import throttle from "lodash/throttle";
import { useMemo, useRef, useState } from "react";
import { makeStyles } from "tss-react/mui";
import type ResizableVideo from "../extensions/ResizableVideo";
import { ResizableImageResizer } from "./ResizableImageResizer";

interface VideoNodeAttributes extends Record<string, unknown> {
  src: string;
  alt?: string | null;
  title?: string | null;
}

interface ResizableVideoNodeAttributes extends VideoNodeAttributes {
  width: string | number | null;
  aspectRatio: string | null;
}

interface ResizableVideoNode extends ProseMirrorNode {
  attrs: ResizableVideoNodeAttributes;
}

interface Props extends NodeViewProps {
  node: ResizableVideoNode;
  extension: typeof ResizableVideo;
}

const VIDEO_MINIMUM_WIDTH_PIXELS = 100;

const useStyles = makeStyles({ name: { ResizableVideoComponent } })(
  (theme) => ({
    videoContainer: {
      display: "inline-flex",
      position: "relative",
    },
    video: {
      display: "block",
      objectFit: "contain",
    },
    videoSelected: {
      outline: `3px solid ${theme.palette.primary.main}`,
    },
    resizer: {
      '.ProseMirror[contenteditable="false"] &': {
        display: "none",
      },
    },
  })
);

function ResizableVideoComponent(props: Props) {
  const { node, selected, updateAttributes, extension } = props;
  const { classes, cx } = useStyles();
  const { attrs } = node;

  const videoRef = useRef<HTMLVideoElement | null>(null);
  const [resizerMouseDown, setResizerMouseDown] = useState(false);
  const selectedOrResizing = selected || resizerMouseDown;

  const handleResize = useMemo(
    () =>
      throttle(
        (event: MouseEvent) => {
          if (!videoRef.current) return;

          const originalBoundingRect = videoRef.current.getBoundingClientRect();
          const resizedWidth = event.clientX - originalBoundingRect.x;
          const resizedHeight = event.clientY - originalBoundingRect.y;

          // Giữ tỷ lệ 16:9 cho video
          const aspectRatio = 16 / 9;
          const resultantWidth = Math.max(
            resizedWidth,
            resizedHeight * aspectRatio,
            VIDEO_MINIMUM_WIDTH_PIXELS
          );
          const resultantHeight = Math.round(resultantWidth / aspectRatio);

          updateAttributes({
            width: Math.round(resultantWidth),
            height: Math.round(resultantHeight),
          });
        },
        50,
        { trailing: true }
      ),
    [updateAttributes]
  );

  return (
    <NodeViewWrapper
      style={{
        // Handle @tiptap/extension-text-align. Ideally we'd be able to inherit
        // this style from TextAlign's GlobalAttributes directly, but those are
        // only applied via `renderHTML` and not the `NodeView` renderer
        // (https://github.com/ueberdosis/tiptap/blob/6c34dec33ac39c9f037a0a72e4525f3fc6d422bf/packages/extension-text-align/src/text-align.ts#L43-L49),
        // so we have to do this manually/redundantly here.
        textAlign: attrs.textAlign,
        width: "100%",
      }}
      // Change the outer component's component to a "span" if the `inline`
      // extension option is enabled, to ensure it can appear alongside other
      // inline elements like text.
      as={extension.options.inline ? "span" : "div"}
    >
      <div className={classes.videoContainer}>
        <video
          ref={videoRef}
          src={attrs.src}
          controls={attrs.controls as boolean | undefined}
          width={typeof attrs.width === "number" ? attrs.width : undefined}
          height={typeof attrs.height === "number" ? attrs.height : undefined}
          className={cx(
            classes.video,
            selectedOrResizing && "ProseMirror-selectednode",
            selectedOrResizing && classes.videoSelected
          )}
          style={{
            maxWidth: attrs.width ? undefined : "100%",
            aspectRatio:
              attrs.width && attrs.height
                ? `${attrs.width}/${attrs.height}`
                : "16/9",
          }}
          data-drag-handle
        />

        {selectedOrResizing && (
          <ResizableImageResizer
            onResize={handleResize}
            className={classes.resizer}
            mouseDown={resizerMouseDown}
            setMouseDown={setResizerMouseDown}
          />
        )}
      </div>
    </NodeViewWrapper>
  );
}

export default ResizableVideoComponent;

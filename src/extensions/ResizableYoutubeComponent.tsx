import type { NodeViewProps } from "@tiptap/core";
import type { Node as ProseMirrorNode } from "@tiptap/pm/model";
import { NodeViewWrapper } from "@tiptap/react";
import throttle from "lodash/throttle";
import { useMemo, useRef, useState } from "react";
import { makeStyles } from "tss-react/mui";
import { ResizableImageResizer } from "./ResizableImageResizer";
import ResizableYoutube from "./ResizableYoutube";

interface YoutubeNodeAttributes {
  src: string;
  width?: string | number;
  height?: string | number;
  controls?: boolean;
  allowFullscreen?: boolean;
  textAlign?: string;
}

interface ResizableYoutubeNode extends ProseMirrorNode {
  attrs: YoutubeNodeAttributes;
}

interface Props extends NodeViewProps {
  node: ResizableYoutubeNode;
  extension: typeof ResizableYoutube;
}

const YOUTUBE_MINIMUM_WIDTH_PIXELS = 200;

const useStyles = makeStyles({ name: { ResizableYoutubeComponent } })((theme) => ({
  youtubeContainer: {
    display: "inline-flex",
    position: "relative",
  },
  youtube: {
    display: "block",
    border: "none",
  },
  youtubeSelected: {
    outline: `3px solid ${theme.palette.primary.main}`,
  },
  resizer: {
    '.ProseMirror[contenteditable="false"] &': {
      display: "none",
    },
  },
}));

function ResizableYoutubeComponent(props: Props) {
  const { node, selected, updateAttributes, extension } = props;
  const { classes, cx } = useStyles();
  const { attrs } = node;

  const iframeRef = useRef<HTMLIFrameElement | null>(null);
  const [resizerMouseDown, setResizerMouseDown] = useState(false);
  const selectedOrResizing = selected || resizerMouseDown;

  const handleResize = useMemo(
    () =>
      throttle(
        (event: MouseEvent) => {
          if (!iframeRef.current) return;

          const originalBoundingRect = iframeRef.current.getBoundingClientRect();
          const resizedWidth = event.clientX - originalBoundingRect.x;
          const resizedHeight = event.clientY - originalBoundingRect.y;

          // Giữ tỷ lệ 16:9 cho YouTube
          const aspectRatio = 16 / 9;
          const resultantWidth = Math.max(
            resizedWidth,
            resizedHeight * aspectRatio,
            YOUTUBE_MINIMUM_WIDTH_PIXELS
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
        textAlign: attrs.textAlign,
        width: "100%",
      }}
      as={extension.options.inline ? "span" : "div"}
    >
      <div className={classes.youtubeContainer}>
        <iframe
          ref={iframeRef}
          src={`https://www.youtube.com/embed/${new URL(attrs.src).searchParams.get("v")}`}
          width={attrs.width ? Number(attrs.width) || undefined : undefined}
          height={attrs.height ? Number(attrs.height) || undefined : undefined}
          frameBorder="0"
          allowFullScreen={attrs.allowFullscreen}
          className={cx(
            classes.youtube,
            selectedOrResizing && "ProseMirror-selectednode",
            selectedOrResizing && classes.youtubeSelected
          )}
          style={{
            maxWidth: attrs.width ? undefined : "100%",
            aspectRatio: attrs.width && attrs.height ? `${attrs.width}/${attrs.height}` : "16/9",
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

export default ResizableYoutubeComponent;
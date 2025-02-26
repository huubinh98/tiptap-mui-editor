import TheatersIcon from "@mui/icons-material/Theaters";
import type { Editor } from "@tiptap/core";
import { useRef, type ComponentPropsWithoutRef } from "react";
import type { SetOptional, SetRequired } from "type-fest";
import { useRichTextEditorContext } from "../context";
import MenuButton, { MenuButtonProps } from "./MenuButton";
import { type MenuButtonAddImageProps } from "./MenuButtonAddImage";

export interface VideoNodeAttributes {
  src: string;
  controls?: boolean;
  width?: string;
  height?: string;
}

export type MenuButtonAddVideoProps = SetRequired<
  Partial<MenuButtonProps>,
  "onClick"
>;

export interface MenuButtonVideoUploadProps
  extends SetOptional<MenuButtonAddImageProps, "onClick"> {
  /**
   * Callback to handle uploaded video files and return their attributes.
   * Should typically be async to upload files to a server and return URLs.
   */
  onUploadFiles: (
    files: File[]
  ) => VideoNodeAttributes[] | Promise<VideoNodeAttributes[]>;
  /**
   * Optional handler to insert videos into the editor. Defaults to inserting
   * at the current caret position.
   */
  insertVideos?: ({
    videos,
    editor,
  }: {
    videos: VideoNodeAttributes[];
    editor: Editor | null;
  }) => void;
  /**
   * Props for the hidden file input (e.g., multiple, accept).
   */
  inputProps?: Partial<ComponentPropsWithoutRef<"input">>;
}

/**
 * Default utility to insert videos into the editor.
 */
export const insertVideosDefault = ({
  videos,
  editor,
}: {
  videos: VideoNodeAttributes[];
  editor: Editor | null;
}) => {
  if (!editor || editor.isDestroyed) return;
  videos.forEach((video) => {
    editor.chain().focus().setVideo(video).run();
  });
};

/**
 * Render a button for uploading videos to insert into the editor content.
 * Requires `onUploadFiles` to handle the upload process.
 */
const MenuButtonVideoUpload: React.FC<MenuButtonVideoUploadProps> = ({
  onUploadFiles,
  inputProps,
  insertVideos = insertVideosDefault,
  ...props
}) => {
  const editor = useRichTextEditorContext();
  const fileInput = useRef<HTMLInputElement | null>(null);

  const handleAndInsertNewFiles = async (files: FileList) => {
    if (!editor || editor.isDestroyed || files.length === 0) {
      return;
    }
    const attributesForVideos = await onUploadFiles(Array.from(files));
    insertVideos({
      editor,
      videos: attributesForVideos,
    });
  };

  return (
    <>
      <MenuButton
        tooltipLabel="Upload videos"
        IconComponent={TheatersIcon}
        disabled={
          !editor?.isEditable ||
          !editor.can().setVideo({ src: "http://example.com" })
        }
        onClick={() => fileInput.current?.click()}
        {...props}
      />
      <input
        ref={fileInput}
        type="file"
        accept="video/*"
        multiple
        onChange={async (event) => {
          if (event.target.files) {
            await handleAndInsertNewFiles(event.target.files);
          }
          event.target.value = ""; // Clear input for re-upload
        }}
        style={{ display: "none" }}
        {...inputProps}
      />
    </>
  );
};

export default MenuButtonVideoUpload;

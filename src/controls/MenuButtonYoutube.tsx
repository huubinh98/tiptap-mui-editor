/// <reference types="@tiptap/extension-youtube" />

import YouTubeIcon from "@mui/icons-material/YouTube";
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  TextField,
} from "@mui/material";
import type { Editor } from "@tiptap/core";
import React, { useState } from "react";
import { useRichTextEditorContext } from "../context";
import MenuButton, { type MenuButtonProps } from "./MenuButton";

export interface MenuButtonYoutubeProps extends Partial<MenuButtonProps> {
  /**
   * Optional override for the editor instance (defaults to context).
   */
  editor?: Editor | null;
}

/**
 * Render a button that opens a dialog for inserting a YouTube video URL into the editor.
 */
const MenuButtonYoutube: React.FC<MenuButtonYoutubeProps> = ({
  editor: editorProp,
  ...props
}) => {
  const contextEditor = useRichTextEditorContext();
  const editor = editorProp ?? contextEditor; // Use prop if provided, else context
  const [open, setOpen] = useState(false);
  const [url, setUrl] = useState("");

  const handleOpen = () => {
    if (editor && editor.isEditable) {
      setOpen(true);
    }
  };

  const handleClose = () => {
    setOpen(false);
    setUrl("");
  };

  const handleInsert = () => {
    if (url && editor && !editor.isDestroyed) {
      editor
        .chain()
        .focus()
        .setYoutubeVideo({
          src: url,
        })
        .run();
    }
    handleClose();
  };

  return (
    <>
      <MenuButton
        tooltipLabel="Insert YouTube video"
        IconComponent={YouTubeIcon}
        onClick={handleOpen}
        disabled={!editor?.isEditable}
        {...props}
      />
      <Dialog open={open} onClose={handleClose}>
        <DialogTitle>Nhúng video YouTube</DialogTitle>
        <DialogContent>
          <TextField
            autoFocus
            label="URL YouTube"
            fullWidth
            value={url}
            onChange={(e) => setUrl(e.target.value)}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose}>Hủy</Button>
          <Button onClick={handleInsert}>Chèn</Button>
        </DialogActions>
      </Dialog>
    </>
  );
};

export default MenuButtonYoutube;

import { Box, Button, Divider } from "@mui/material";
import { Blockquote } from "@tiptap/extension-blockquote";
import { Bold } from "@tiptap/extension-bold";
import { BulletList } from "@tiptap/extension-bullet-list";
import { Code } from "@tiptap/extension-code";
import { CodeBlock } from "@tiptap/extension-code-block";
import { Document } from "@tiptap/extension-document";
import { Dropcursor } from "@tiptap/extension-dropcursor";
import { Gapcursor } from "@tiptap/extension-gapcursor";
import { HardBreak } from "@tiptap/extension-hard-break";
import { History } from "@tiptap/extension-history";
import { Italic } from "@tiptap/extension-italic";
import { Link } from "@tiptap/extension-link";
import { ListItem } from "@tiptap/extension-list-item";
import { OrderedList } from "@tiptap/extension-ordered-list";
import { Paragraph } from "@tiptap/extension-paragraph";
import { Placeholder } from "@tiptap/extension-placeholder";
import { Strike } from "@tiptap/extension-strike";
import { Subscript } from "@tiptap/extension-subscript";
import { Superscript } from "@tiptap/extension-superscript";
import { TableCell } from "@tiptap/extension-table-cell";
import { TableHeader } from "@tiptap/extension-table-header";
import { TableRow } from "@tiptap/extension-table-row";
import { TaskItem } from "@tiptap/extension-task-item";
import { TaskList } from "@tiptap/extension-task-list";
import { Text } from "@tiptap/extension-text";
import TextAlign from "@tiptap/extension-text-align";
import Youtube from "@tiptap/extension-youtube";
import { useRef, useState } from "react";
import {
  HeadingWithAnchor,
  LinkBubbleMenu,
  LinkBubbleMenuHandler,
  MenuButtonAddTable,
  MenuButtonBlockquote,
  MenuButtonBold,
  MenuButtonBulletedList,
  MenuButtonCode,
  MenuButtonCodeBlock,
  MenuButtonEditLink,
  MenuButtonImageUpload,
  MenuButtonItalic,
  MenuButtonOrderedList,
  MenuButtonRemoveFormatting,
  MenuButtonStrikethrough,
  MenuButtonSubscript,
  MenuButtonSuperscript,
  MenuButtonTaskList,
  MenuButtonVideoUpload,
  MenuButtonYoutube,
  MenuControlsContainer,
  MenuDivider,
  MenuSelectHeading,
  MenuSelectTextAlign,
  ResizableImage,
  ResizableVideo,
  RichTextEditor,
  RichTextEditorRef,
  TableBubbleMenu,
  TableImproved
} from "../../dist";

const exampleContent =
  '<h2>Hey there 👋</h2><p>This is a <em>basic</em> example of using <a target="_blank" rel="noopener noreferrer nofollow" href="https://tiptap.dev/">Tiptap</a> with <a target="_blank" rel="noopener noreferrer nofollow" href="https://mui.com/">MUI (Material-UI)</a>. Sure, there are all kind of <strong>basic text styles</strong> you’d probably expect from a text editor. But wait until you see the lists:</p><ul><li><p>That’s a bullet list with one …</p></li><li><p>… or two list items.</p></li></ul><p>Isn’t that great? And all of that is editable. But wait, there’s more. Let’s try <code>inline code</code> and a code block:</p><pre><code class="language-css">body {\n  display: none;\n}</code></pre><p></p><p>It’s only the tip of the iceberg though. Give it a try and click a little bit around. And feel free to add and resize images:</p><img height="auto" src="https://picsum.photos/600/400" alt="random image" width="350" style="aspect-ratio: 3 / 2"><p></p><p>Organize information in tables:</p><table><tbody><tr><th colspan="1" rowspan="1"><p>Name</p></th><th colspan="1" rowspan="1"><p>Role</p></th><th colspan="1" rowspan="1"><p>Team</p></th></tr><tr><td colspan="1" rowspan="1"><p>Alice</p></td><td colspan="1" rowspan="1"><p>PM</p></td><td colspan="1" rowspan="1"><p>Internal tools</p></td></tr><tr><td colspan="1" rowspan="1"><p>Bob</p></td><td colspan="1" rowspan="1"><p>Software</p></td><td colspan="1" rowspan="1"><p>Infrastructure</p></td></tr></tbody></table><p></p><p>Or write down your groceries:</p><ul data-type="taskList"><li data-checked="true" data-type="taskItem"><label><input type="checkbox" checked="checked"><span></span></label><div><p>Milk</p></div></li><li data-checked="false" data-type="taskItem"><label><input type="checkbox"><span></span></label><div><p>Eggs</p></div></li><li data-checked="false" data-type="taskItem"><label><input type="checkbox"><span></span></label><div><p>Sriracha</p></div></li></ul><blockquote><p>Wow, that’s amazing. Good work, boy! 👏 <br>— Mom</p></blockquote><p>Give it a try!</p>';

const CustomLinkExtension = Link.extend({
  inclusive: false,
});

const CustomSubscript = Subscript.extend({
  excludes: "superscript",
});

const CustomSuperscript = Superscript.extend({
  excludes: "subscript",
});

const extensions = [
  // We use some but not all of the extensions from
  // https://tiptap.dev/api/extensions/starter-kit, plus a few additional ones

  // Note that the Table extension must come before other nodes. See README
  TableImproved.configure({
    resizable: true,
  }),
  TableRow,
  TableHeader,
  TableCell,

  BulletList,
  CodeBlock,
  Document,
  HardBreak,
  ListItem,
  OrderedList,
  Paragraph,
  CustomSubscript,
  CustomSuperscript,
  Text,

  // Blockquote must come after Bold, since we want the "Cmd+B" shortcut to
  // have lower precedence than the Blockquote "Cmd+Shift+B" shortcut. See
  // README
  Bold,
  Blockquote,

  Code,
  Italic,
  Strike,
  CustomLinkExtension.configure({
    autolink: true,
    linkOnPaste: true,
    openOnClick: false,
  }),
  LinkBubbleMenuHandler,

  // Extensions
  Gapcursor,
  HeadingWithAnchor.configure({
    // People shouldn't typically need more than 3 levels of headings, so
    // keep a more minimal set (than the default 6) to keep things simpler
    // and less chaotic.
    levels: [1, 2, 3],
  }),

  ResizableImage,
  ResizableVideo,
  // ResizableYoutube,

  // When images are dragged, we want to show the "drop cursor" for where they'll
  // land
  Dropcursor,

  TaskList,
  TaskItem.configure({
    nested: true,
  }),

  TextAlign.configure({
    types: ["heading", "paragraph", "image", "video", "youtube"],
  }),

  Placeholder.configure({
    placeholder: "Add your own content here...",
  }),
  Youtube.configure({ controls: true }),
  // Video,

  // We use the regular `History` (undo/redo) extension when not using
  // collaborative editing
  History,
];

export default function PageContentWithEditor() {
  const rteRef = useRef<RichTextEditorRef>(null);

  const [htmlResult, setHtmlResult] = useState("");
  // interface UploadedVideo {
  //   src: string;
  //   controls: boolean;
  // }

  // const handleUploadVideo = async (files: File[]): Promise<UploadedVideo[]> => {
  //   console.log("object :>> ", files);
  //   // Giả lập upload
  //   const videoUrl = "https://youtu.be/_kQJbMOGB20"; // Thay bằng logic thực tế
  //   return [{ src: videoUrl, controls: true }];
  // };

  return (
    <Box sx={{
      "& [data-youtube-video]": {
        textAlign: "center",
      }
    }}>
      <Box mb={2}>Try the editor below!</Box>

      <RichTextEditor
        ref={rteRef}
        content={exampleContent}
        extensions={extensions}
        renderControls={() => (
          <MenuControlsContainer>
            <MenuSelectHeading />

            <MenuDivider />

            <MenuButtonBold />
            <MenuButtonItalic />
            <MenuButtonStrikethrough />
            <MenuButtonSubscript />
            <MenuButtonSuperscript />

            <MenuDivider />

            <MenuButtonEditLink />

            <MenuDivider />

            <MenuButtonOrderedList />
            <MenuButtonBulletedList />
            <MenuButtonTaskList />

            <MenuDivider />

            <MenuButtonBlockquote />

            <MenuDivider />

            <MenuButtonCode />

            <MenuButtonCodeBlock />

            <MenuDivider />

            <MenuButtonAddTable />

            <MenuDivider />

            <MenuButtonRemoveFormatting />

          <MenuSelectTextAlign />
            <MenuButtonYoutube editor={rteRef.current?.editor} />
            <MenuButtonImageUpload
              onUploadFiles={(files) =>
                // For the sake of a demo, we don't have a server to upload the files
                // to, so we'll instead convert each one to a local "temporary" object
                // URL. This will not persist properly in a production setting. You
                // should instead upload the image files to your server, or perhaps
                // convert the images to bas64 if you would like to encode the image
                // data directly into the editor content, though that can make the
                // editor content very large.
                files.map((file) => ({
                  src: URL.createObjectURL(file),
                  alt: file.name,
                }))
              }
            />

            <MenuButtonVideoUpload
              onUploadFiles={(files) => {
                console.log("files :>> ", files);
                return files.map((file) => ({
                  src: URL.createObjectURL(file),
                  controls: true,
                }));
              }}
            />
          </MenuControlsContainer>
        )}
      >
        {() => (
          <>
            <LinkBubbleMenu />
            <TableBubbleMenu />
          </>
        )}
      </RichTextEditor>

      <Divider sx={{ mt: 5, mb: 2 }} />

      <Button
        onClick={() => {
          setHtmlResult(rteRef.current?.editor?.getHTML() ?? "");
        }}
      >
        Save and display HTML
      </Button>
      {htmlResult && (
        <pre style={{ marginTop: 10, overflow: "scroll", maxWidth: "100%" }}>
          <code>{htmlResult}</code>
        </pre>
      )}
    </Box>
  );
}

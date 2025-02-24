<p align="center">
  <a href="https://github.com/huubinh98/tiptap-mui-editor" target="_blank">
    <img src="https://github.com/sjdemartini/mui-tiptap/assets/1647130/e1f01441-c74a-410c-b25d-5a58615d3e6a" alt="mui-tiptap logo" width="350" />
  </a>
</p>

<p align="center">
  <b>tiptap-mui-editor</b>: A customizable <a href="https://mui.com/material-ui/getting-started/overview/">Material UI</a> styled WYSIWYG rich text editor, using <a href="https://tiptap.dev/">Tiptap</a>. It's in the process of being completed, coming soon.
</p>

<p align="center">
  <a href="https://www.npmjs.com/package/tiptap-mui-editor">
    <img alt="npm tiptap-mui-editor package" src="https://img.shields.io/npm/v/mui-tiptap">
  </a>
  <a href="https://www.npmjs.com/package/tiptap-mui-editor">
    <img alt="npm type definitions" src="https://img.shields.io/npm/types/mui-tiptap">
  </a>
  <a href="https://github.com/huubinh98/tiptap-mui-editor/actions">
    <img alt="GitHub Workflow Status" src="https://img.shields.io/github/actions/workflow/status/sjdemartini/mui-tiptap/build-test.yml">
  </a>
  <a href="https://github.com/sjdemartini/mui-tiptap/blob/main/LICENSE">
    <img alt="project license" src="https://img.shields.io/npm/l/mui-tiptap">
  </a>
</p>
<!-- 
- :sparkles: Styled based on your own MUI theme (colors, fonts, light vs dark mode, etc.)
- :hammer_and_wrench: Built on powerful Tiptap and ProseMirror foundations (extensible, real-time collaborative editing, cross-platform support, etc.)

**Features:**

- :toolbox: An all-in-one `RichTextEditor` component to get started immediately (no other components or hooks needed!), or individual modular components to customize to your needs
- :sunglasses: Built-in styles for Tiptap’s extensions (text formatting, lists, tables, Google Docs-like collaboration cursors; you name it!)
- :arrow_forward: Composable and extendable menu buttons and controls for the standard Tiptap extensions
- :framed_picture: [`ResizableImage` extension](#resizableimage) for adding and resizing images directly in the editor
- :anchor: [`HeadingWithAnchor` extension](#headingwithanchor) for dynamic GitHub-like anchor links for every heading you add
- :link: [`LinkBubbleMenu`](#components) so adding and editing links is a breeze
- :1234: [`FontSize` extension](#fontsize) for controlling text sizes
- :white_square_button: [`TableImproved` extension](#tableimproved) that [fixes](https://github.com/ueberdosis/tiptap/issues/2041) [problems](https://github.com/ueberdosis/tiptap/issues/2301) in the underlying Tiptap `Table` extension
- :pencil: [`TableBubbleMenu`](#components) for interactively editing your rich text tables
- :speech_balloon: General-purpose [`ControlledBubbleMenu`](#components) for building your own custom menus, [solving some shortcomings](https://github.com/ueberdosis/tiptap/issues/2305#issuecomment-1020665146) of the Tiptap `BubbleMenu`
- And more!

<details>
<summary><b>README Table of Contents</b></summary>

- [Demo](#demo)
- [Installation](#installation)
- [Get started](#get-started)
  - [Use the all-in-one component](#use-the-all-in-one-component)
  - [Create and provide the `editor` yourself](#create-and-provide-the-editor-yourself)
  - [Render read-only rich text content](#render-read-only-rich-text-content)
- [tiptap-mui-editor extensions and components](#tiptap-mui-extensions-and-components)
  - [Tiptap extensions](#tiptap-extensions)
    - [`HeadingWithAnchor`](#headingwithanchor)
    - [`FontSize`](#fontsize)
    - [`LinkBubbleMenuHandler`](#linkbubblemenuhandler)
    - [`ResizableImage`](#resizableimage)
    - [`TableImproved`](#tableimproved)
  - [Components](#components)
    - [Controls components](#controls-components)
- [Localization](#localization)
- [Tips and suggestions](#tips-and-suggestions)
  - [Choosing your editor `extensions`](#choosing-your-editor-extensions)
    - [Extension precedence and ordering](#extension-precedence-and-ordering)
    - [Other extension tips](#other-extension-tips)
  - [Drag-and-drop and paste for images](#drag-and-drop-and-paste-for-images)
  - [Re-rendering `RichTextEditor` when `content` changes](#re-rendering-richtexteditor-when-content-changes)
- [Contributing](#contributing)

</details>

## Demo

Try it yourself in this **[CodeSandbox live demo](https://codesandbox.io/p/sandbox/mui-tiptap-demo-3zl2l6)**!

![mui-tiptap demo](https://github.com/sjdemartini/mui-tiptap/assets/1647130/b25d33e0-4cdc-4fde-95bc-ec8403da7ccd)

## Installation

```shell
npm install tiptap-mui-editor
```

or

```shell
yarn add tiptap-mui-editor
```

There are peer dependencies on [`@mui/material`](https://www.npmjs.com/package/@mui/material) and [`@mui/icons-material`](https://www.npmjs.com/package/@mui/icons-material) (and their `@emotion/` peers), and [`@tiptap/`](https://tiptap.dev/installation/react) packages. These should be installed automatically by default if you’re using npm 7+ or pnpm. Otherwise, if your project doesn’t already use those, you can install them with:

```shell
npm install @mui/material @mui/icons-material @emotion/react @emotion/styled @tiptap/react @tiptap/extension-heading @tiptap/extension-image @tiptap/extension-table @tiptap/pm @tiptap/core
```

or

````shell
yarn add @mui/material @mui/icons-material @emotion/react @emotion/styled @tiptap/react @tiptap/extension-heading @tiptap/extension-image @tiptap/extension-table @tiptap/pm @tiptap/core
``` -->
````

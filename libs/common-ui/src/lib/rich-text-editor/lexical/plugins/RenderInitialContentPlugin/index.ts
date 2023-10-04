import { useLexicalComposerContext } from '@lexical/react/LexicalComposerContext';
import { $generateNodesFromDOM } from '@lexical/html';
import { $getRoot, $insertNodes } from 'lexical';
import { useEffect } from 'react';

export type RenderExistingTextPluginProps = {
  htmlString: string;
};

export const RenderInitialContentPlugin = ({
  htmlString,
}: RenderExistingTextPluginProps) => {
  const [editor] = useLexicalComposerContext();
  useEffect(() => {
    editor.update(() => {
      // Remove all existing nodes
      $getRoot()
        .getChildren()
        .forEach((node) => node.remove());
      const parser = new DOMParser();
      const dom = parser.parseFromString(htmlString, 'text/html');
      const nodes = $generateNodesFromDOM(editor, dom);
      $getRoot().select();
      $insertNodes(nodes);
    });
  }, []);

  return null;
};

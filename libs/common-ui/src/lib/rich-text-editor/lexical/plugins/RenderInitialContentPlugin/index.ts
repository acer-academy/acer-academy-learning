import { useLexicalComposerContext } from '@lexical/react/LexicalComposerContext';
import { $generateNodesFromDOM } from '@lexical/html';
import {
  $createParagraphNode,
  $getRoot,
  $insertNodes,
  LexicalNode,
  NodeSelection,
  ParagraphNode,
} from 'lexical';
import { useEffect } from 'react';
import { useEditorEventContext } from '../../context/EventContext';

export type RenderExistingTextPluginProps = {
  htmlString: string;
};

export const RenderInitialContentPlugin = ({
  htmlString,
}: RenderExistingTextPluginProps) => {
  const { isContentLoaded, setIsContentLoaded } = useEditorEventContext();
  const [editor] = useLexicalComposerContext();
  useEffect(() => {
    editor.update(() => {
      // Remove all existing nodes
      $getRoot()
        .getChildren()
        .forEach((node) => node.remove());
      const parser = new DOMParser();
      const dom = parser.parseFromString(htmlString, 'text/html');
      const adjustedNodes: LexicalNode[] = [];
      let currentAdditionalParagraphNode: ParagraphNode | null = null;
      const nodes = $generateNodesFromDOM(editor, dom);
      nodes.forEach((node) => {
        if (!node.getParent()) {
          const nodeType = node.getType();
          // Process text types since they dont render
          if (nodeType === 'text') {
            if (node.getTextContent().trim() === '') {
              return;
            }

            if (!currentAdditionalParagraphNode) {
              // Create a paragraph on the first layer
              currentAdditionalParagraphNode = $createParagraphNode();
              adjustedNodes.push(currentAdditionalParagraphNode);
            }

            if (currentAdditionalParagraphNode) {
              currentAdditionalParagraphNode.append(node);
            }
          } else {
            currentAdditionalParagraphNode = null;
            if (nodeType === 'linebreak') {
              return;
            } else {
              adjustedNodes.push(node);
            }
          }
        }
      });
      console.log('GENERATED');
      console.log(nodes);

      $getRoot().select();
      $insertNodes(nodes);
      // console.log(adjustedNodes);
      // $insertNodes(adjustedNodes);
      if (!isContentLoaded) {
        setIsContentLoaded(true);
      }
    });
  }, [htmlString, isContentLoaded, setIsContentLoaded]);

  return null;
};

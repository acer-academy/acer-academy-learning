import { useLexicalComposerContext } from '@lexical/react/LexicalComposerContext';
import { SerializedEditorState, SerializedLexicalNode } from 'lexical';
import { useEditorEventContext } from '../../context/EventContext';
import { cloneDeep } from 'lodash';
import useLayoutEffectImpl from '../../../../utils/useLayoutEffect';

export type RenderExistingTextPluginProps = {
  editorStateStr: string;
  shorten?: boolean;
};

export type SerializedLexicalNodeWithChildren = {
  children?: SerializedLexicalNodeWithChildren[];
  src?: string;
} & SerializedLexicalNode;

const IMAGE_TYPE = 'image';
const PARAGRAPH_TYPE = 'paragraph';
const IMAGE_PLACEHOLDER =
  'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAAABHNCSVQICAgIfAhkiAAAAAlwSFlzAAAAdgAAAHYBTnsmCAAAABl0RVh0U29mdHdhcmUAd3d3Lmlua3NjYXBlLm9yZ5vuPBoAAAKkSURBVDiNlZNPaFRnFMV/3/e9NzN5MyRjQpLG2BDFGKNuRJC6kLpphdaF4rKbLLpQN7qyXboR6spN9iKIC8WMGxdSCtJCUVulFsSiYCQTZRKpf2bmzXsz7333djGxtu68cDhcuOdczuLAR87CyuLI+aVa9d1uVHXQP7x42DZuH8cFLTWFl7hyQwqDa6+GRnUtqg69iQY+iUVnUjGzXXVjbbVv68V06szIV02TdrK/usLs4966pfZhBPQDRmDYKWOhoX7v0s3td67OB6p+5sQLx09tGKbJdurc681hvMF6cALW6zpDqHBtJ8QaHUTMD1ZRu5qDFbha+J5rnGQ+W8R5CDy4XHEebN430BxeZ4bGYBVymwbGWLEe6zzEnRDaHRJfxLn3X628g2J9P8qrKAJvVgIUNaK4HOblHJO6yrL9FOfBeTg6cYsD479x+enX3F+bwwoYhWYY0oo1tSgarB9neZE678X7hx9waPIXrDMc3vIz05VVnAc8iBp+3bM/s0g/X1l6fFH9nVHbxHmYjep8M32TllRoS4WEEgdnbjMYJICiGB7s2FMJVMCp59TUFTaXG+yuPqX27HO+3VojoUiiAyRaItUSGlr2zf2B+H2IGp6PjG0KUPhyw49sjF6znE4Q+4hj22rYwNLWAVIt/muQaolixdNqJiiGblDYFaioKYctVpJx/u4NMRU1CEKhreX/CPsmXS3S1QIiFsQg2F0WgVZvC43uKENhTKWQ0JaI+AMk0o8SZ2UmwxBjjAI3TNzo3FEX7n2TeTxd8AbVPoz0GQURMGqIrKPocwrXF66Xvzt9JIjGBz67u3p3+ok8+TPTsNLzwUuxpUdC8Kjazpa3Pl5e2/1wKXdxuhEvm0wuEybplMm6Z/9X0wtLterCyuLIx9b7H39xZ6TvsuLBAAAAAElFTkSuQmCC';

const recursiveReplaceImage = (
  nodes: SerializedLexicalNodeWithChildren[],
): SerializedLexicalNodeWithChildren[] => {
  return (
    nodes
      // Filter out empty paragraph nodes
      .filter(
        (node) =>
          node.type !== PARAGRAPH_TYPE ||
          (node.children && node.children.length > 0),
      )
      // Map images to placeholder
      .map((node) => {
        if (node.type === IMAGE_TYPE) {
          node.src = IMAGE_PLACEHOLDER;
        }
        if (node.children) {
          node.children = recursiveReplaceImage(node.children);
        }
        return node;
      })
  );
};

export const RenderInitialContentPlugin = ({
  editorStateStr,
  shorten,
}: RenderExistingTextPluginProps) => {
  const { setIsContentLoaded } = useEditorEventContext();
  const [editor] = useLexicalComposerContext();
  useLayoutEffectImpl(() => {
    let timerId: NodeJS.Timeout | null = null;
    timerId = setTimeout(() => {
      // Shorten the structure if to long
      const shortened: SerializedEditorState<SerializedLexicalNode> =
        JSON.parse(editorStateStr);
      if (shorten) {
        const formattedChildren = recursiveReplaceImage(
          cloneDeep(shortened.root.children),
        );
        // Slice it
        shortened.root.children = formattedChildren;
        if (shortened.root.children.length > 2) {
          shortened.root.children = shortened.root.children.slice(0, 2);
        }
        const jsonStr = JSON.stringify(shortened);
        const modifiedEditorState = editor.parseEditorState(jsonStr);
        editor.setEditorState(modifiedEditorState);
      } else {
        // If nothing
        const editorState = editor.parseEditorState(editorStateStr);
        editor.setEditorState(editorState);
      }
      if (setIsContentLoaded) {
        setIsContentLoaded(true);
      }
    });

    return () => {
      if (timerId) {
        clearTimeout(timerId);
      }
    };
  }, []);

  return null;
};

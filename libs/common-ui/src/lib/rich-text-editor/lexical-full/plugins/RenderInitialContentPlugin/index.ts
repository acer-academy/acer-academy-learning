import { useLexicalComposerContext } from '@lexical/react/LexicalComposerContext';
import { SerializedEditorState, SerializedLexicalNode } from 'lexical';
import { useEffect } from 'react';
import { useEditorEventContext } from '../../context/EventContext';

export type RenderExistingTextPluginProps = {
  editorStateStr: string;
  shorten?: boolean;
};

export const RenderInitialContentPlugin = ({
  editorStateStr,
  shorten,
}: RenderExistingTextPluginProps) => {
  const { setIsContentLoaded } = useEditorEventContext();
  const [editor] = useLexicalComposerContext();
  useEffect(() => {
    editor.update(() => {
      // Shorten the structure if to long
      const shortened: SerializedEditorState<SerializedLexicalNode> =
        JSON.parse(editorStateStr);
      if (shorten && shortened.root.children.length > 2) {
        // Slice it
        shortened.root.children = shortened.root.children.slice(0, 2);
        // console.log(shortened);
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
  }, [shorten]);

  return null;
};

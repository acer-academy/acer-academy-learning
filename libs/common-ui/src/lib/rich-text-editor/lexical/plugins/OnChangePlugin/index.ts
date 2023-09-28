import { useLexicalComposerContext } from '@lexical/react/LexicalComposerContext';
import { EditorState, LexicalEditor } from 'lexical';
import { useEffect } from 'react';

export type OnChangePluginType = {
  onChange: (editorState: LexicalEditor) => void;
};

export const OnChangePlugin = ({ onChange }: OnChangePluginType) => {
  const [editor] = useLexicalComposerContext();
  useEffect(() => {
    return editor.registerUpdateListener(({ editorState }) => {
      onChange(editor);
    });
  }, [editor, onChange]);
};

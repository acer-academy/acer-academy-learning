import { useLexicalComposerContext } from '@lexical/react/LexicalComposerContext';
import React, { useLayoutEffect } from 'react';
import { useEditorEventContext } from '../../context/EventContext';
import { mergeRegister } from '@lexical/utils';
import { BLUR_COMMAND, COMMAND_PRIORITY_LOW, FOCUS_COMMAND } from 'lexical';

const FocusPlugin = () => {
  const { setIsFocused } = useEditorEventContext();
  const [editor] = useLexicalComposerContext();
  useLayoutEffect(() => {
    return mergeRegister(
      editor.registerCommand(
        FOCUS_COMMAND,
        () => {
          setIsFocused(true);
          return false;
        },
        COMMAND_PRIORITY_LOW,
      ),
      editor.registerCommand(
        BLUR_COMMAND,
        () => {
          setIsFocused(false);
          return false;
        },
        COMMAND_PRIORITY_LOW,
      ),
    );
  }, [editor, setIsFocused]);
  return null;
};

export default FocusPlugin;

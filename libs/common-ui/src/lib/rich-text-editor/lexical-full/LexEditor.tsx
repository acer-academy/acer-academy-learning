/**
 * Copyright (c) Meta Platforms, Inc. and affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import { LexicalComposer } from '@lexical/react/LexicalComposer';
import * as React from 'react';

import { SettingsContext, useSettings } from './context/SettingsContext';
import { SharedAutocompleteContext } from './context/SharedAutocompleteContext';
import { SharedHistoryContext } from './context/SharedHistoryContext';
import Editor from './Editor';
import PlaygroundNodes from './nodes/PlaygroundNodes';
import { TableContext } from './plugins/TablePlugin';
import Settings from './Settings';
import PlaygroundEditorTheme from './themes/PlaygroundEditorTheme';
import { OnChangePlugin } from '@lexical/react/LexicalOnChangePlugin';
import { EditorState, LexicalEditor } from 'lexical';
import { Spinner } from '../../wrapper/Spinner';
import { EditorEventContextProvider } from './context/EventContext';
import { RenderInitialContentPlugin } from './plugins/RenderInitialContentPlugin';
import './index.css';

// console.warn(
//   'If you are profiling the playground app, please ensure you turn off the debug view. You can disable it by pressing on the settings control in the bottom-left of your screen and toggling the debug view setting.',
// );

export type LexEditorProps = {
  editorStateStr?: string;
  onChange: (val: string) => void;
  hasError?: boolean;
  onBlur: () => void;
};

export const LexEditor = ({
  editorStateStr,
  onChange,
  hasError,
  onBlur,
}: LexEditorProps): JSX.Element => {
  // States
  const [isFocused, setIsFocused] = React.useState(false);
  const [isContentLoaded, setIsContentLoaded] = React.useState(
    !editorStateStr || false,
  );
  const {
    settings: { measureTypingPerf },
  } = useSettings();

  const onEditorChange = (
    editorState: EditorState,
    editor: LexicalEditor,
    tags: Set<string>,
  ) => {
    const json = editorState.toJSON();
    const jsonString = JSON.stringify(json);
    onChange(jsonString);
  };

  const initialConfig = {
    namespace: 'LexEditor',
    nodes: [...PlaygroundNodes],
    onError: (error: Error) => {
      throw error;
    },
    theme: PlaygroundEditorTheme,
  };

  return (
    <EditorEventContextProvider
      value={{
        isFocused,
        setIsFocused,
        hasError,
        isContentLoaded,
        setIsContentLoaded,
      }}
    >
      <SettingsContext>
        <LexicalComposer initialConfig={initialConfig}>
          <OnChangePlugin onChange={onEditorChange} ignoreSelectionChange />
          <SharedHistoryContext>
            <TableContext>
              <SharedAutocompleteContext>
                {editorStateStr && (
                  <RenderInitialContentPlugin editorStateStr={editorStateStr} />
                )}
                <div
                  className={`editor-shell border-solid border-[1px] rounded-t-[10px] ${
                    hasError
                      ? 'border-red-500'
                      : isFocused
                      ? 'border-black'
                      : 'border-[#eee]'
                  } flex-grow-0`}
                >
                  {(isContentLoaded && <Editor />) || <Spinner />}
                </div>
                <Settings />
              </SharedAutocompleteContext>
            </TableContext>
          </SharedHistoryContext>
        </LexicalComposer>
      </SettingsContext>
    </EditorEventContextProvider>
  );
};

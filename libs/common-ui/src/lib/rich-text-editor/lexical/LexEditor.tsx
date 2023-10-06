/**
 * Copyright (c) Meta Platforms, Inc. and affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import { LexicalComposer } from '@lexical/react/LexicalComposer';
import * as React from 'react';

import { SettingsContext } from './context/SettingsContext';
import { SharedAutocompleteContext } from './context/SharedAutocompleteContext';
import { SharedHistoryContext } from './context/SharedHistoryContext';
import Editor from './Editor';
import PlaygroundNodes from './nodes/PlaygroundNodes';
import { TableContext } from './plugins/TablePlugin';
import PlaygroundEditorTheme from './themes/PlaygroundEditorTheme';
import './index.css';
import { OnChangePlugin } from '@lexical/react/LexicalOnChangePlugin';
import { EditorState, LexicalEditor } from 'lexical';
import { $generateHtmlFromNodes } from '@lexical/html';
import { EditorEventContextProvider } from './context/EventContext';
import { RenderInitialContentPlugin } from './plugins/RenderInitialContentPlugin';
import { Spinner } from '../../wrapper/Spinner';
import { TestEditor } from './TestEditor';

// console.warn(
//   'If you are profiling the playground app, please ensure you turn off the debug view. You can disable it by pressing on the settings control in the bottom-left of your screen and toggling the debug view setting.',
// );

export type LexEditorProps = {
  htmlString?: string;
  onChange: (val: string) => void;
  errorMessage?: string;
  onBlur: () => void;
};

export const LexEditor = ({
  htmlString,
  onChange,
  errorMessage,
  onBlur,
}: LexEditorProps): JSX.Element => {
  // States
  const [isFocused, setIsFocused] = React.useState(false);
  const [isContentLoaded, setIsContentLoaded] = React.useState(
    !htmlString || false,
  );
  // Context
  const initialConfig = {
    namespace: 'LexEditor',
    nodes: [...PlaygroundNodes],
    onError: (error: Error) => {
      throw error;
    },
    theme: PlaygroundEditorTheme,
  };

  const onEditorChange = (
    editorState: EditorState,
    editor: LexicalEditor,
    tags: Set<string>,
  ) => {
    editor.update(() => {
      const rawHtmlString = $generateHtmlFromNodes(editor);
      onChange(rawHtmlString);
    });
  };

  return (
    <EditorEventContextProvider
      value={{
        isFocused,
        setIsFocused,
        errorMessage,
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
                <div
                  // onFocus={() => setIsFocused(true)}
                  // onBlur={() => {
                  //   onBlur();
                  //   setIsFocused(false);
                  // }}
                  className={`editor-shell border-solid border-[1px] rounded-t-[10px] ${
                    errorMessage
                      ? 'border-red-500'
                      : isFocused
                      ? 'border-black'
                      : 'border-[#eee]'
                  } flex-grow-0`}
                >
                  {htmlString && (
                    <RenderInitialContentPlugin htmlString={htmlString} />
                  )}
                  {(isContentLoaded && <Editor />) || <Spinner />}
                </div>
                <span className="text-xs text-red-500 font-semibold">
                  {errorMessage}
                </span>
              </SharedAutocompleteContext>
            </TableContext>
          </SharedHistoryContext>
        </LexicalComposer>
      </SettingsContext>
    </EditorEventContextProvider>
  );
};

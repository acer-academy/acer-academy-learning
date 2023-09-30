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
import Settings from './Settings';
import PlaygroundEditorTheme from './themes/PlaygroundEditorTheme';
import './index.css';
import { OnChangePlugin } from '@lexical/react/LexicalOnChangePlugin';
import { EditorState, LexicalEditor } from 'lexical';
import { $generateHtmlFromNodes } from '@lexical/html';

// console.warn(
//   'If you are profiling the playground app, please ensure you turn off the debug view. You can disable it by pressing on the settings control in the bottom-left of your screen and toggling the debug view setting.',
// );

export type LexEditorProps = {
  value: string;
  onChange: (val: string) => void;
};

export const LexEditor = ({ value, onChange }: LexEditorProps): JSX.Element => {
  const initialConfig = {
    editorState: undefined,
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
    // .update is the ONLY place that the editor state can be safely mutated
    editor.update(() => {
      const rawHtmlString = $generateHtmlFromNodes(editor);
      console.log(onChange);
      onChange(rawHtmlString);
      // @TODO: Update state here
      console.log(rawHtmlString);
    });
  };

  return (
    <SettingsContext>
      <LexicalComposer initialConfig={initialConfig}>
        {/* To update changes */}
        <OnChangePlugin onChange={onEditorChange} ignoreSelectionChange />
        <SharedHistoryContext>
          <TableContext>
            <SharedAutocompleteContext>
              <div className="editor-shell border-solid border-2 rounded-t-[10px] border-[#eee]">
                <Editor />
              </div>
              <Settings />
            </SharedAutocompleteContext>
          </TableContext>
        </SharedHistoryContext>
      </LexicalComposer>
    </SettingsContext>
  );
};

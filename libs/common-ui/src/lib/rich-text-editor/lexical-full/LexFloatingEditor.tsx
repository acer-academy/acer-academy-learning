import {
  InitialConfigType,
  LexicalComposer,
} from '@lexical/react/LexicalComposer';
import { ContentEditable } from '@lexical/react/LexicalContentEditable';
import LexicalErrorBoundary from '@lexical/react/LexicalErrorBoundary';
import { RichTextPlugin } from '@lexical/react/LexicalRichTextPlugin';
import React, { HTMLProps, forwardRef, useEffect, useState } from 'react';
import CustomFloatingTextFormatToolbarPlugin from '../lexical/plugins/CustomFloatingTextFormatToolbarPlugin';
import EquationsPlugin from '../lexical/plugins/EquationsPlugin';
import { EquationNode } from '../lexical/nodes/EquationNode';
import { OnChangePlugin } from '@lexical/react/LexicalOnChangePlugin';
import { EditorState, LexicalEditor } from 'lexical';
import { $generateHtmlFromNodes } from '@lexical/html';
import FocusPlugin from '../lexical/plugins/FocusPlugin';
import { EditorEventContextProvider } from './context/EventContext';
import { RenderInitialContentPlugin } from './plugins/RenderInitialContentPlugin';

export type LexFloatingEditorProps = {
  className?: string;
  onChange: (val: string) => void;
  onBlur: () => void;
  editorStateStr?: string;
  placeholder?: string;
};

export const LexFloatingEditor = forwardRef<
  HTMLDivElement,
  HTMLProps<HTMLDivElement> & LexFloatingEditorProps
>(
  (
    {
      className = '',
      onChange,
      onBlur,
      editorStateStr,
      placeholder,
    }: LexFloatingEditorProps,
    ref,
  ) => {
    const initialConfig: InitialConfigType = {
      editable: true,
      namespace: 'Floating Editor',
      nodes: [EquationNode],
      onError: (error: Error) => {
        throw error;
      },
    };
    const [floatingAnchorElem, setFloatingAnchorElem] =
      useState<HTMLDivElement | null>(null);
    const [isFocused, setIsFocused] = useState<boolean>(false);
    const [isContentLoaded, setIsContentLoaded] = useState<boolean>(
      !editorStateStr || false,
    );

    const onRef = (_floatingAnchorElem: HTMLDivElement) => {
      if (_floatingAnchorElem !== null) {
        setFloatingAnchorElem(_floatingAnchorElem);
      }
    };

    const onEditorChange = (
      editorState: EditorState,
      editor: LexicalEditor,
      tags: Set<string>,
    ) => {
      editor.update(() => {
        const json = editorState.toJSON();
        const jsonString = JSON.stringify(json);
        onChange(jsonString);
      });
    };

    useEffect(() => {
      if (!isFocused && isContentLoaded) {
        onBlur();
      }
    }, [isFocused, onBlur, isContentLoaded]);

    return (
      <LexicalComposer initialConfig={initialConfig}>
        <EditorEventContextProvider
          value={{
            isFocused,
            setIsFocused,
            isContentLoaded,
            setIsContentLoaded,
          }}
        >
          {editorStateStr && (
            <RenderInitialContentPlugin editorStateStr={editorStateStr} />
          )}
          <div
            ref={ref}
            className={`${className} ${
              isContentLoaded ? 'opacity-100' : 'opacity-0'
            } transition-opacity duration-75 ease-in relative outline-none border-solid ${
              isFocused
                ? 'border-teacher-primary-500'
                : 'border-teacher-primary-300'
            } border-b-2 mb-[-1px]`}
          >
            {/* <FocusPlugin /> */}
            <OnChangePlugin onChange={onEditorChange} />
            <RichTextPlugin
              contentEditable={
                <div ref={onRef}>
                  <ContentEditable className="outline-none" />
                </div>
              }
              placeholder={
                <span className="absolute top-0 text-gray-400 select-none pointer-events-none ">
                  {placeholder ?? 'Enter rich text here...'}
                </span>
              }
              ErrorBoundary={LexicalErrorBoundary}
            />
            <EquationsPlugin />
            {floatingAnchorElem && (
              <CustomFloatingTextFormatToolbarPlugin
                anchorElem={floatingAnchorElem}
              />
            )}
          </div>
        </EditorEventContextProvider>
      </LexicalComposer>
    );
  },
);

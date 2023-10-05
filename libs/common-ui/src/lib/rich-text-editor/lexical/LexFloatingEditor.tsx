import {
  InitialConfigType,
  LexicalComposer,
} from '@lexical/react/LexicalComposer';
import { ContentEditable } from '@lexical/react/LexicalContentEditable';
import LexicalErrorBoundary from '@lexical/react/LexicalErrorBoundary';
import { RichTextPlugin } from '@lexical/react/LexicalRichTextPlugin';
import React, { HTMLProps, forwardRef, useEffect, useState } from 'react';
import CustomFloatingTextFormatToolbarPlugin from './plugins/CustomFloatingTextFormatToolbarPlugin';
import EquationsPlugin from './plugins/EquationsPlugin';
import { EquationNode } from './nodes/EquationNode';
import { OnChangePlugin } from '@lexical/react/LexicalOnChangePlugin';
import { EditorState, LexicalEditor } from 'lexical';
import { $generateHtmlFromNodes } from '@lexical/html';
import { RenderInitialContentPlugin } from './plugins/RenderInitialContentPlugin';
import { EditorEventContextProvider } from './context/EventContext';
import { Spinner } from '../../wrapper/Spinner';

export type LexFloatingEditorProps = {
  className?: string;
  onChange: (val: string) => void;
  onBlur: () => void;
  value: string;
  htmlString?: string;
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
      value,
      htmlString,
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
      !htmlString || false,
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
        const rawHtmlString = $generateHtmlFromNodes(editor);
        onChange(rawHtmlString);
      });
    };

    useEffect(() => {
      if (!isFocused) {
        onBlur();
      }
    }, [isFocused, onBlur, value]);

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
          {htmlString && <RenderInitialContentPlugin htmlString={htmlString} />}
          {(isContentLoaded && (
            <div
              ref={ref}
              onFocus={() => setIsFocused(true)}
              onBlur={() => setIsFocused(false)}
              className={`${className} relative outline-none border-solid ${
                isFocused
                  ? 'border-teacher-primary-500'
                  : 'border-teacher-primary-300'
              } border-b-2 mb-[-1px]`}
            >
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
          )) || <Spinner />}
        </EditorEventContextProvider>
      </LexicalComposer>
    );
  },
);

import {
  InitialConfigType,
  LexicalComposer,
} from '@lexical/react/LexicalComposer';
import { ContentEditable } from '@lexical/react/LexicalContentEditable';
import LexicalErrorBoundary from '@lexical/react/LexicalErrorBoundary';
import { RichTextPlugin } from '@lexical/react/LexicalRichTextPlugin';
import React, {
  HTMLProps,
  forwardRef,
  useEffect,
  useRef,
  useState,
} from 'react';
import CustomFloatingTextFormatToolbarPlugin from './plugins/CustomFloatingTextFormatToolbarPlugin';
import EquationsPlugin from './plugins/EquationsPlugin';
import { EquationNode } from './nodes/EquationNode';
import { OnChangePlugin } from '@lexical/react/LexicalOnChangePlugin';
import { EditorState, LexicalEditor } from 'lexical';
import { $generateHtmlFromNodes } from '@lexical/html';

export type LexFloatingEditorProps = {
  className?: string;
  onChange: (val: string) => void;
  onBlur: (val: string) => void;
  value: string;
};

export const LexFloatingEditor = forwardRef<
  HTMLDivElement,
  HTMLProps<HTMLDivElement> & LexFloatingEditorProps
>(
  (
    { className = '', onChange, onBlur, value }: LexFloatingEditorProps,
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
      // .update is the ONLY place that the editor state can be safely mutated
      editor.update(() => {
        const rawHtmlString = $generateHtmlFromNodes(editor);
        onChange(rawHtmlString);
      });
    };

    useEffect(() => {
      if (!isFocused) {
        onBlur(value);
      }
    }, [isFocused, onBlur, value]);

    return (
      <LexicalComposer initialConfig={initialConfig}>
        <div
          ref={ref}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
          className={`${className} relative outline-none border-solid ${
            isFocused
              ? 'border-teacher-primary-500'
              : 'border-teacher-primary-200'
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
              <span className="absolute top-0 text-gray-300 select-none pointer-events-none ">
                Enter rich text here...
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
      </LexicalComposer>
    );
  },
);

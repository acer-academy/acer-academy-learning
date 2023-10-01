import {
  InitialConfigType,
  LexicalComposer,
} from '@lexical/react/LexicalComposer';
import { ContentEditable } from '@lexical/react/LexicalContentEditable';
import LexicalErrorBoundary from '@lexical/react/LexicalErrorBoundary';
import { RichTextPlugin } from '@lexical/react/LexicalRichTextPlugin';
import React, { useRef, useState } from 'react';
import CustomFloatingTextFormatToolbarPlugin from './plugins/CustomFloatingTextFormatToolbarPlugin';
import EquationsPlugin from './plugins/EquationsPlugin';
import { EquationNode } from './nodes/EquationNode';

export const LexFloatingEditor = () => {
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

  return (
    <LexicalComposer initialConfig={initialConfig}>
      <div
        onFocus={() => setIsFocused(true)}
        onBlur={() => setIsFocused(false)}
        className={`relative outline-none border-solid ${
          isFocused
            ? 'border-teacher-primary-500'
            : 'border-teacher-primary-200'
        } border-b-2 mb-[-1px]`}
      >
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
};

import {
  InitialConfigType,
  LexicalComposer,
} from '@lexical/react/LexicalComposer';
import { ContentEditable } from '@lexical/react/LexicalContentEditable';
import { RichTextPlugin } from '@lexical/react/LexicalRichTextPlugin';
import React, { useEffect, useState } from 'react';
import Placeholder from './ui/Placeholder';
import LexicalErrorBoundary from '@lexical/react/LexicalErrorBoundary';
import { RenderInitialContentPlugin } from './plugins/RenderInitialContentPlugin';
import EquationsPlugin from './plugins/EquationsPlugin';
import { EquationNode } from './nodes/EquationNode';
import { EditorEventContextProvider } from './context/EventContext';

export type LexOutputProps = {
  htmlString: string;
  onChange?: (val: string) => void;
};

export const LexOutput = ({ htmlString, onChange }: LexOutputProps) => {
  useEffect(() => {
    if (onChange) {
      onChange(htmlString);
    }
  }, []);
  const initialConfig: InitialConfigType = {
    namespace: 'Output',
    editable: false,
    nodes: [EquationNode],
    onError: (error: Error) => {
      throw error;
    },
  };
  const [isContentLoaded, setIsContentLoaded] = useState<boolean>(false);
  const [isFocused, setIsFocused] = useState<boolean>(false);
  return (
    <EditorEventContextProvider
      value={{ isContentLoaded, setIsContentLoaded, isFocused, setIsFocused }}
    >
      <LexicalComposer initialConfig={initialConfig}>
        <RenderInitialContentPlugin htmlString={htmlString} />
        <EquationsPlugin />
        <RichTextPlugin
          contentEditable={<ContentEditable />}
          placeholder={<Placeholder>No content to render</Placeholder>}
          ErrorBoundary={LexicalErrorBoundary}
        />
      </LexicalComposer>
    </EditorEventContextProvider>
  );
};

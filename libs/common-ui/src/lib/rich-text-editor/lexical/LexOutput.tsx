import {
  InitialConfigType,
  LexicalComposer,
} from '@lexical/react/LexicalComposer';
import { ContentEditable } from '@lexical/react/LexicalContentEditable';
import { RichTextPlugin } from '@lexical/react/LexicalRichTextPlugin';
import React from 'react';
import Placeholder from './ui/Placeholder';
import LexicalErrorBoundary from '@lexical/react/LexicalErrorBoundary';
import { RenderInitialContentPlugin } from './plugins/RenderInitialContentPlugin';
import EquationsPlugin from './plugins/EquationsPlugin';
import { EquationNode } from './nodes/EquationNode';

export type LexOutputProps = {
  htmlString: string;
};

export const LexOutput = ({ htmlString }: LexOutputProps) => {
  const initialConfig: InitialConfigType = {
    namespace: 'Output',
    editable: false,
    nodes: [EquationNode],
    onError: (error: Error) => {
      throw error;
    },
  };
  return (
    <LexicalComposer initialConfig={initialConfig}>
      <RenderInitialContentPlugin htmlString={htmlString} />
      <EquationsPlugin />
      <RichTextPlugin
        contentEditable={<ContentEditable />}
        placeholder={<Placeholder>No content to render</Placeholder>}
        ErrorBoundary={LexicalErrorBoundary}
      />
    </LexicalComposer>
  );
};

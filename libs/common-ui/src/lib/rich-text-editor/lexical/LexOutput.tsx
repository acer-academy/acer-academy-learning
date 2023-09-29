import {
  InitialConfigType,
  LexicalComposer,
} from '@lexical/react/LexicalComposer';
import { ContentEditable } from '@lexical/react/LexicalContentEditable';
import { RichTextPlugin } from '@lexical/react/LexicalRichTextPlugin';
import React from 'react';
import Placeholder from './ui/Placeholder';
import LexicalErrorBoundary from '@lexical/react/LexicalErrorBoundary';

export type LexOutputProps = {
  initialState: string;
};

export const LexOutput = ({ initialState = '' }: LexOutputProps) => {
  const initialConfig: InitialConfigType = {
    editorState: initialState,
    namespace: 'Output',
    editable: false,
    onError: (error: Error) => {
      throw error;
    },
  };
  return (
    <LexicalComposer initialConfig={initialConfig}>
      <RichTextPlugin
        contentEditable={<ContentEditable />}
        placeholder={<Placeholder>No content to render</Placeholder>}
        ErrorBoundary={LexicalErrorBoundary}
      />
    </LexicalComposer>
  );
};

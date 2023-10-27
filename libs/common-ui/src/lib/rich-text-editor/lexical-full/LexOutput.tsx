import {
  InitialConfigType,
  LexicalComposer,
} from '@lexical/react/LexicalComposer';
import { ContentEditable } from '@lexical/react/LexicalContentEditable';
import { RichTextPlugin } from '@lexical/react/LexicalRichTextPlugin';
import React, { useEffect, useState } from 'react';
import Placeholder from './ui/Placeholder';
import LexicalErrorBoundary from '@lexical/react/LexicalErrorBoundary';
import EquationsPlugin from './plugins/EquationsPlugin';
import { EditorEventContextProvider } from './context/EventContext';
import PlaygroundNodes from './nodes/PlaygroundNodes';
import { LayoutPlugin } from './plugins/LayoutPlugin/LayoutPlugin';
import { RenderInitialContentPlugin } from '../lexical-full/plugins/RenderInitialContentPlugin';

export type LexOutputProps = {
  editorStateStr: string;
  onChange?: (val: string) => void;
  shorten?: boolean;
};

export const LexOutput = ({
  editorStateStr,
  onChange,
  shorten,
}: LexOutputProps) => {
  useEffect(() => {
    if (onChange) {
      onChange(editorStateStr);
    }
  }, []);
  const initialConfig: InitialConfigType = {
    namespace: 'Output',
    editable: false,
    nodes: [...PlaygroundNodes],
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
        {editorStateStr && (
          <RenderInitialContentPlugin
            shorten={shorten}
            editorStateStr={editorStateStr}
          />
        )}
        <EquationsPlugin />
        {(isContentLoaded && (
          <RichTextPlugin
            contentEditable={<ContentEditable />}
            placeholder={<Placeholder> </Placeholder>}
            ErrorBoundary={LexicalErrorBoundary}
          />
        )) ||
          ''}
        <LayoutPlugin />
      </LexicalComposer>
    </EditorEventContextProvider>
  );
};

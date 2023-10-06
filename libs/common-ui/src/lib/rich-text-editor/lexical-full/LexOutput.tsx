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
import { EquationNode } from './nodes/EquationNode';
import { EditorEventContextProvider } from './context/EventContext';
import { HeadingNode, QuoteNode } from '@lexical/rich-text';
import PlaygroundNodes from './nodes/PlaygroundNodes';
import { LayoutPlugin } from './plugins/LayoutPlugin/LayoutPlugin';
import { RenderInitialContentPlugin } from '../lexical-full/plugins/RenderInitialContentPlugin';
import { Hmac } from 'crypto';

export type LexOutputProps = {
  htmlString: string;
  onChange?: (val: string) => void;
  shorten?: boolean;
};

export const LexOutput = ({
  htmlString,
  onChange,
  shorten,
}: LexOutputProps) => {
  useEffect(() => {
    if (onChange) {
      onChange(htmlString);
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
        {htmlString && (
          <RenderInitialContentPlugin
            shorten={shorten}
            editorStateStr={htmlString}
          />
        )}
        <EquationsPlugin />
        <RichTextPlugin
          contentEditable={<ContentEditable />}
          placeholder={<Placeholder>No content to render</Placeholder>}
          ErrorBoundary={LexicalErrorBoundary}
        />
        <LayoutPlugin />
      </LexicalComposer>
    </EditorEventContextProvider>
  );
};

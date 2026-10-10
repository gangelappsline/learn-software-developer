import { useMemo } from 'react';
import type { Extension } from '@codemirror/state';
import { javascript } from '@codemirror/lang-javascript';
import { python } from '@codemirror/lang-python';
import { html } from '@codemirror/lang-html';
import { rust } from '@codemirror/lang-rust';
import { sql } from '@codemirror/lang-sql';
import CodeMirror from '@uiw/react-codemirror';
import type { LanguageId } from '@/types';
import { LANGUAGE_LABELS } from '@/lib/constants';

interface CodeMirrorWrapperProps {
  language: LanguageId;
  value: string;
  onChange: (value: string) => void;
}

function extensionsFor(language: LanguageId): Extension[] {
  switch (language) {
    case 'javascript':
    case 'blockly':
      return [javascript()];
    case 'typescript':
      return [javascript({ typescript: true })];
    case 'python':
      return [python()];
    case 'htmlcss':
      return [html()];
    case 'sql':
      return [sql()];
    case 'rust':
      return [rust()];
    case 'scratch':
    case 'kotlin':
    case 'go':
      return [];
  }
}

export function CodeMirrorWrapper({ language, value, onChange }: CodeMirrorWrapperProps) {
  const extensions = useMemo(() => extensionsFor(language), [language]);
  return (
    <CodeMirror
      value={value}
      height="310px"
      theme="dark"
      extensions={extensions}
      onChange={onChange}
      basicSetup={{
        lineNumbers: true,
        foldGutter: true,
        highlightActiveLine: true,
        autocompletion: true,
        bracketMatching: true,
        closeBrackets: true,
        indentOnInput: true,
      }}
      aria-label={`Editor ${LANGUAGE_LABELS[language]}`}
    />
  );
}

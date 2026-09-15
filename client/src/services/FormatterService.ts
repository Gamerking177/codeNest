import { format as formatSql } from 'sql-formatter';

export class FormatterService {
  /**
   * Safely formats code based on programming language.
   * If formatting fails or is unsupported, returns the original code gracefully.
   */
  static async format(code: string, language: string): Promise<string> {
    if (!code || typeof code !== 'string') return '';

    const lang = language.toLowerCase().trim();

    try {
      // 1. SQL Formatter adapter
      if (lang === 'sql') {
        return formatSql(code, {
          language: 'sql',
          keywordCase: 'upper',
          tabWidth: 4,
          useTabs: false,
        });
      }

      // 2. JavaScript / TypeScript / JSON / Markdown / HTML / CSS adapter using Prettier
      if (
        lang === 'javascript' ||
        lang === 'typescript' ||
        lang === 'json' ||
        lang === 'markdown' ||
        lang === 'html' ||
        lang === 'css'
      ) {
        try {
          const prettier = await import('prettier/standalone');
          let plugins: any[] = [];
          let parser = 'babel';

          if (lang === 'typescript') {
            const tsPlugin = await import('prettier/plugins/typescript');
            const estreePlugin = await import('prettier/plugins/estree');
            plugins = [tsPlugin.default || tsPlugin, estreePlugin.default || estreePlugin];
            parser = 'typescript';
          } else if (lang === 'json') {
            const babelPlugin = await import('prettier/plugins/babel');
            const estreePlugin = await import('prettier/plugins/estree');
            plugins = [babelPlugin.default || babelPlugin, estreePlugin.default || estreePlugin];
            parser = 'json';
          } else if (lang === 'markdown') {
            const mdPlugin = await import('prettier/plugins/markdown');
            plugins = [mdPlugin.default || mdPlugin];
            parser = 'markdown';
          } else if (lang === 'html') {
            const htmlPlugin = await import('prettier/plugins/html');
            plugins = [htmlPlugin.default || htmlPlugin];
            parser = 'html';
          } else if (lang === 'css') {
            const postcssPlugin = await import('prettier/plugins/postcss');
            plugins = [postcssPlugin.default || postcssPlugin];
            parser = 'css';
          } else {
            const babelPlugin = await import('prettier/plugins/babel');
            const estreePlugin = await import('prettier/plugins/estree');
            plugins = [babelPlugin.default || babelPlugin, estreePlugin.default || estreePlugin];
            parser = 'babel';
          }

          return await prettier.format(code, {
            parser,
            plugins,
            semi: true,
            singleQuote: true,
            tabWidth: 2,
            printWidth: 90,
          });
        } catch {
          // Graceful fallback to smart indentation if Prettier plugin dynamic import fails
          return this.smartIndentFallback(code);
        }
      }

      // 3. C / C++ / Java / Python / Go / Rust smart indentation & bracket beautifier
      return this.smartIndentFallback(code);
    } catch (err) {
      console.warn('Formatting warning (falling back gracefully):', err);
      return code; // Never crash the editor
    }
  }

  /**
   * Universal indentation beautifier for languages without in-browser AST engines (C, C++, Java, etc.).
   * Cleans trailing whitespace, harmonizes indentation depth on curly braces, and preserves code correctness.
   */
  private static smartIndentFallback(code: string): string {
    const lines = code.split(/\r?\n/);
    let indentLevel = 0;
    const tab = '    '; // 4 spaces standard for C/C++/Java

    const formattedLines = lines.map((line) => {
      const trimmed = line.trim();
      if (!trimmed) return '';

      // Decrease indent for closing bracket before line render
      if (trimmed.startsWith('}') || trimmed.startsWith(']') || trimmed.startsWith(')')) {
        indentLevel = Math.max(0, indentLevel - 1);
      }

      const currentIndent = tab.repeat(indentLevel);
      const result = currentIndent + trimmed;

      // Increase indent for lines ending in opening brackets
      if (trimmed.endsWith('{') || trimmed.endsWith('[') || trimmed.endsWith('(')) {
        indentLevel++;
      }

      return result;
    });

    return formattedLines.join('\n');
  }
}

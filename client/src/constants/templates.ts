export const STARTER_TEMPLATES: Record<string, string> = {
  python: `# Solution code here
def main():
    print("Hello CodeNest!")

if __name__ == "__main__":
    main()
`,
  cpp: `// Solution code here
#include <iostream>

int main() {
    std::cout << "Hello CodeNest!" << std::endl;
    return 0;
}
`,
  c: `// Solution code here
#include <stdio.h>

int main() {
    printf("Hello CodeNest!\\n");
    return 0;
}
`,
  java: `// Solution code here
public class Main {
    public static void main(String[] args) {
        System.out.println("Hello CodeNest!");
    }
}
`,
  sql: `-- Solution query here
SELECT 'Hello CodeNest!' AS greeting;
`,
  javascript: `// Solution code here
function main() {
  console.log("Hello CodeNest!");
}

main();
`,
  typescript: `// Solution code here
function main(): void {
  console.log("Hello CodeNest!");
}

main();
`,
  go: `// Solution code here
package main

import "fmt"

func main() {
    fmt.Println("Hello CodeNest!")
}
`,
  rust: `// Solution code here
fn main() {
    println!("Hello CodeNest!");
}
`,
  html: `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <title>CodeNest Solution</title>
</head>
<body>
  <h1>Hello CodeNest!</h1>
</body>
</html>
`,
  css: `/* Stylesheet */
body {
  font-family: system-ui, -apple-system, sans-serif;
  margin: 0;
  padding: 1rem;
}
`,
  json: `{
  "message": "Hello CodeNest!"
}
`,
};

export function getStarterTemplate(language: string): string {
  const normalized = (language || '').toLowerCase().trim();
  return STARTER_TEMPLATES[normalized] || `// Solution code for ${language}\n`;
}

export function isStarterTemplate(code: string): boolean {
  const trimmed = code.trim();
  if (!trimmed) return true;
  return Object.values(STARTER_TEMPLATES).some(
    (tmpl) => tmpl.trim() === trimmed
  );
}

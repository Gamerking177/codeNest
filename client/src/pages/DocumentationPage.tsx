import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import {
  BookOpen,
  Code2,
  FolderCode,
  Share2,
  Sparkles,
  Keyboard,
  Shield,
  Layers,
  ArrowRight,
} from 'lucide-react';
import { Logo } from '../components/ui/Logo';
import { Button } from '../components/ui/Button';

export const DocumentationPage: React.FC = () => {
  const [activeSection, setActiveSection] = useState('getting-started');

  const sections = [
    { id: 'getting-started', title: 'Getting Started', icon: BookOpen },
    { id: 'programs', title: 'Managing Programs', icon: FolderCode },
    { id: 'subjects', title: 'Subjects & Tags', icon: Layers },
    { id: 'editor', title: 'Monaco Code Editor', icon: Code2 },
    { id: 'formatting', title: 'Automatic Formatting', icon: Sparkles },
    { id: 'sharing', title: 'Cryptographic Sharing', icon: Share2 },
    { id: 'shortcuts', title: 'Keyboard Shortcuts', icon: Keyboard },
    { id: 'security', title: 'Security & Privacy', icon: Shield },
  ];

  return (
    <div className="min-h-screen bg-dark-bg text-gray-100 flex flex-col">
      {/* Header */}
      <header className="sticky top-0 z-30 bg-dark-surface/90 backdrop-blur border-b border-dark-border px-4 sm:px-8 h-14 flex items-center justify-between">
        <Logo size="md" to="/" />
        <div className="flex items-center gap-3">
          <Link to="/dashboard">
            <Button variant="primary" size="sm" rightIcon={<ArrowRight className="w-3.5 h-3.5" />}>
              Open Workspace
            </Button>
          </Link>
        </div>
      </header>

      {/* Main Documentation Body */}
      <div className="flex-1 max-w-7xl mx-auto w-full px-4 sm:px-8 py-8 flex flex-col md:flex-row gap-8">
        {/* Left Side Navigation */}
        <aside className="w-full md:w-60 shrink-0">
          <div className="sticky top-20 space-y-1">
            <div className="text-[10px] font-mono uppercase tracking-wider text-gray-500 px-3 py-2">
              Documentation Index
            </div>
            {sections.map((sec) => {
              const Icon = sec.icon;
              const isActive = activeSection === sec.id;
              return (
                <button
                  key={sec.id}
                  onClick={() => setActiveSection(sec.id)}
                  className={`w-full flex items-center gap-2.5 px-3 py-2 rounded-lg text-xs font-medium transition-colors text-left ${
                    isActive
                      ? 'bg-brand-500/10 text-brand-300 border border-brand-500/20'
                      : 'text-gray-400 hover:text-white hover:bg-dark-surface'
                  }`}
                >
                  <Icon className="w-4 h-4 shrink-0" />
                  <span>{sec.title}</span>
                </button>
              );
            })}
          </div>
        </aside>

        {/* Right Content Area */}
        <main className="flex-1 min-w-0 bg-dark-surface border border-dark-border rounded-xl p-6 sm:p-10 space-y-8">
          {activeSection === 'getting-started' && (
            <div className="space-y-4">
              <h2 className="text-2xl font-bold text-white tracking-tight">Getting Started</h2>
              <p className="text-sm text-gray-300 leading-relaxed">
                CodeNest is your personal developer workspace and college programming notebook. It provides one organized home to create, write, format, test, and manage college programming assignments and lab exercises.
              </p>

              <div className="p-4 rounded-lg bg-dark-panel border border-dark-border text-xs text-gray-300 space-y-2">
                <h4 className="font-semibold text-brand-400">Quick Start Flow:</h4>
                <ol className="list-decimal list-inside space-y-1 text-gray-400">
                  <li>Navigate to <strong>Dashboard</strong> or press <code className="text-brand-300 font-mono">Ctrl+K</code> to open the command palette.</li>
                  <li>Click <strong>New Program</strong> and enter your assignment title, subject (e.g., DSA), and programming language.</li>
                  <li>Write your code in the Monaco Editor with real-time syntax highlighting and line numbers.</li>
                  <li>Press <code className="text-brand-300 font-mono">Ctrl+S</code> or click <strong>Format</strong> to automatically clean up your indentation and code style.</li>
                </ol>
              </div>
            </div>
          )}

          {activeSection === 'programs' && (
            <div className="space-y-4">
              <h2 className="text-2xl font-bold text-white tracking-tight">Managing Programs</h2>
              <p className="text-sm text-gray-300 leading-relaxed">
                Each program in CodeNest encapsulates the complete context of an assignment or algorithm:
              </p>
              <ul className="list-disc list-inside text-xs text-gray-400 space-y-1.5 leading-relaxed">
                <li><strong className="text-gray-200">Title & Subject</strong>: e.g., "Binary Search" under "DSA".</li>
                <li><strong className="text-gray-200">Programming Language</strong>: C, C++, Java, Python, SQL, TypeScript, JavaScript, Go, Rust, and more.</li>
                <li><strong className="text-gray-200">Problem / Question</strong>: The original assignment prompt or lab challenge.</li>
                <li><strong className="text-gray-200">Personal Notes & Complexity</strong>: Hints, edge cases, time/space complexity analysis.</li>
                <li><strong className="text-gray-200">Tags & Favorites</strong>: Star key programs for rapid review before exams.</li>
              </ul>
            </div>
          )}

          {activeSection === 'subjects' && (
            <div className="space-y-4">
              <h2 className="text-2xl font-bold text-white tracking-tight">Subjects & Tags</h2>
              <p className="text-sm text-gray-300 leading-relaxed">
                Subjects allow grouping programs according to your college curriculum (e.g. Data Structures, C Programming, Object Oriented Java, DBMS).
              </p>
              <p className="text-xs text-gray-400 leading-relaxed">
                Tags can be added to individual programs (e.g., <code className="font-mono text-brand-300">#searching</code>, <code className="font-mono text-brand-300">#pointers</code>, <code className="font-mono text-brand-300">#joins</code>) for cross-subject filtering and instant search discovery.
              </p>
            </div>
          )}

          {activeSection === 'editor' && (
            <div className="space-y-4">
              <h2 className="text-2xl font-bold text-white tracking-tight">Monaco Code Editor</h2>
              <p className="text-sm text-gray-300 leading-relaxed">
                CodeNest embeds the official VS Code Monaco Editor with first-class developer tooling:
              </p>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs text-gray-300">
                <div className="p-3 rounded-lg bg-dark-panel border border-dark-border">
                  <span className="font-semibold text-white">Syntax Highlighting</span>
                  <p className="text-[11px] text-gray-400 mt-1">First-class syntax colorization for all supported languages.</p>
                </div>
                <div className="p-3 rounded-lg bg-dark-panel border border-dark-border">
                  <span className="font-semibold text-white">Bracket Matching</span>
                  <p className="text-[11px] text-gray-400 mt-1">Automatic pair colorization and auto-closing quotes/brackets.</p>
                </div>
                <div className="p-3 rounded-lg bg-dark-panel border border-dark-border">
                  <span className="font-semibold text-white">Word Wrap & Font Controls</span>
                  <p className="text-[11px] text-gray-400 mt-1">Toggle word wrap and adjust font size on the fly.</p>
                </div>
                <div className="p-3 rounded-lg bg-dark-panel border border-dark-border">
                  <span className="font-semibold text-white">Fullscreen Mode</span>
                  <p className="text-[11px] text-gray-400 mt-1">Expand the editor into a distraction-free full-screen workspace.</p>
                </div>
              </div>
            </div>
          )}

          {activeSection === 'formatting' && (
            <div className="space-y-4">
              <h2 className="text-2xl font-bold text-white tracking-tight">Automatic Code Formatting</h2>
              <p className="text-sm text-gray-300 leading-relaxed">
                Formatting in CodeNest uses a client-side <code className="font-mono text-brand-300">FormatterService</code> that operates entirely within your browser. There is zero risk of untrusted arbitrary code execution on the server.
              </p>
              <div className="p-4 rounded-lg bg-dark-panel border border-dark-border text-xs text-gray-300 space-y-2">
                <p><strong>Supported Formatter Adapters:</strong></p>
                <ul className="list-disc list-inside space-y-1 text-gray-400 font-mono text-[11px]">
                  <li>JavaScript & TypeScript &rarr; Prettier</li>
                  <li>SQL Queries &rarr; SQL Formatter</li>
                  <li>JSON / Markdown &rarr; Prettier</li>
                  <li>C, C++, Java, Python &rarr; Smart indentation & bracket beautifier fallback</li>
                </ul>
              </div>
            </div>
          )}

          {activeSection === 'sharing' && (
            <div className="space-y-4">
              <h2 className="text-2xl font-bold text-white tracking-tight">Cryptographic Program Sharing</h2>
              <p className="text-sm text-gray-300 leading-relaxed">
                CodeNest provides secure, revocable read-only share links for individual programs:
              </p>
              <ul className="list-disc list-inside text-xs text-gray-400 space-y-2 leading-relaxed">
                <li><strong className="text-gray-200">High-Entropy Tokens</strong>: 64-character unpredictable cryptographic tokens generated with secure randomness.</li>
                <li><strong className="text-gray-200">Hashed Storage</strong>: The server stores only a SHA-256 hash of the token. MongoDB IDs are never exposed.</li>
                <li><strong className="text-gray-200">Strict Read-Only Enforcement</strong>: Shared viewers can only view and copy code; they cannot edit, delete, alter notes, or create further shares.</li>
                <li><strong className="text-gray-200">Configurable Expiration</strong>: Expire after 1 hour, 1 day, 7 days, 30 days, or never.</li>
                <li><strong className="text-gray-200">Instant Revocation</strong>: You can revoke any active share link at any time with immediate effect.</li>
              </ul>
            </div>
          )}

          {activeSection === 'shortcuts' && (
            <div className="space-y-4">
              <h2 className="text-2xl font-bold text-white tracking-tight">Keyboard Shortcuts</h2>
              <p className="text-sm text-gray-300 leading-relaxed">
                Work at full speed with keyboard-driven commands:
              </p>
              <div className="divide-y divide-dark-border text-xs">
                <div className="py-2.5 flex items-center justify-between">
                  <span className="text-gray-300">Open Command Palette & Global Search</span>
                  <kbd className="font-mono text-[11px] bg-dark-panel px-2 py-0.5 rounded border border-dark-border text-brand-300">
                    Ctrl + K / Cmd + K
                  </kbd>
                </div>
                <div className="py-2.5 flex items-center justify-between">
                  <span className="text-gray-300">Save & Auto-format Program</span>
                  <kbd className="font-mono text-[11px] bg-dark-panel px-2 py-0.5 rounded border border-dark-border text-brand-300">
                    Ctrl + S / Cmd + S
                  </kbd>
                </div>
                <div className="py-2.5 flex items-center justify-between">
                  <span className="text-gray-300">Search Within Code in Monaco Editor</span>
                  <kbd className="font-mono text-[11px] bg-dark-panel px-2 py-0.5 rounded border border-dark-border text-brand-300">
                    Ctrl + F / Cmd + F
                  </kbd>
                </div>
                <div className="py-2.5 flex items-center justify-between">
                  <span className="text-gray-300">Replace Within Code in Monaco Editor</span>
                  <kbd className="font-mono text-[11px] bg-dark-panel px-2 py-0.5 rounded border border-dark-border text-brand-300">
                    Ctrl + H / Cmd + H
                  </kbd>
                </div>
              </div>
            </div>
          )}

          {activeSection === 'security' && (
            <div className="space-y-4">
              <h2 className="text-2xl font-bold text-white tracking-tight">Security & Privacy</h2>
              <p className="text-sm text-gray-300 leading-relaxed">
                CodeNest is built with strict security controls:
              </p>
              <ul className="list-disc list-inside text-xs text-gray-400 space-y-2 leading-relaxed">
                <li><strong className="text-gray-200">Strict Query-Level Ownership</strong>: Database queries bind `{`_id, userId`}` so changing an ID in requests cannot access another student's code (IDOR protection).</li>
                <li><strong className="text-gray-200">Role-Based Access Control (RBAC)</strong>: Multi-tier permission checks for User, Admin, and Super Admin.</li>
                <li><strong className="text-gray-200">Redacted Logging & Correlation IDs</strong>: Every request is assigned a unique `X-Request-ID`. Passwords, tokens, and cookies are automatically redacted from logs.</li>
                <li><strong className="text-gray-200">Zero Third-Party Trackers</strong>: No external OAuth tracking or analytics scripts.</li>
              </ul>
            </div>
          )}
        </main>
      </div>
    </div>
  );
};

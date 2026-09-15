import React from 'react';
import { Link } from 'react-router-dom';
import {
  ArrowRight,
  Code2,
  FolderCode,
  Share2,
  Sparkles,
  Search,
  BookMarked,
  CheckCircle2,
  Lock,
  Terminal,
  FileCode2,
  Cpu,
  Layers,
} from 'lucide-react';
import { Logo } from '../components/ui/Logo';
import { Button } from '../components/ui/Button';
import { Badge, LanguageBadge } from '../components/ui/Badge';
import { useAuth } from '../context/AuthContext';

export const LandingPage: React.FC = () => {
  const { isAuthenticated } = useAuth();

  return (
    <div className="min-h-screen bg-dark-bg text-gray-100 flex flex-col selection:bg-brand-500/20 selection:text-brand-300">
      {/* 1. Public Navbar */}
      <header className="sticky top-0 z-40 bg-dark-bg/85 backdrop-blur-md border-b border-dark-border px-4 sm:px-6 lg:px-12 h-16 flex items-center justify-between">
        <Logo size="md" to="/" />

        <nav className="hidden md:flex items-center gap-8 text-xs font-medium text-gray-300">
          <a href="#features" className="hover:text-white transition-colors">Features</a>
          <a href="#workflow" className="hover:text-white transition-colors">Workflow</a>
          <a href="#sharing" className="hover:text-white transition-colors">Secure Sharing</a>
          <a href="#editor" className="hover:text-white transition-colors">Monaco Editor</a>
          <Link to="/docs" className="hover:text-white transition-colors">Documentation</Link>
        </nav>

        <div className="flex items-center gap-3">
          {isAuthenticated ? (
            <Link to="/dashboard">
              <Button variant="primary" size="sm" rightIcon={<ArrowRight className="w-3.5 h-3.5" />}>
                Go to Workspace
              </Button>
            </Link>
          ) : (
            <>
              <Link to="/login">
                <Button variant="ghost" size="sm">Sign In</Button>
              </Link>
              <Link to="/register">
                <Button variant="primary" size="sm" rightIcon={<ArrowRight className="w-3.5 h-3.5" />}>
                  Create Account
                </Button>
              </Link>
            </>
          )}
        </div>
      </header>

      {/* 2. Hero Section */}
      <section className="relative pt-16 pb-20 px-4 sm:px-6 lg:px-12 max-w-7xl mx-auto w-full">
        <div className="flex flex-col items-center text-center max-w-3xl mx-auto">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-brand-500/10 border border-brand-500/30 text-brand-400 text-xs font-mono mb-6">
            <Terminal className="w-3.5 h-3.5" />
            <span>Built for Computer Science & Engineering Students</span>
          </div>

          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-white leading-tight">
            Your personal <span className="text-brand-400 underline decoration-brand-500/40 underline-offset-8">home for code</span>.
          </h1>

          <p className="text-base sm:text-lg text-gray-400 mt-6 leading-relaxed max-w-2xl font-normal">
            Organize college programming assignments, lab exercises, and algorithms. Write and format code with Monaco, preserve problem statements and notes, and securely share your work.
          </p>

          <div className="flex flex-wrap items-center justify-center gap-3 mt-8">
            <Link to={isAuthenticated ? "/dashboard" : "/register"}>
              <Button size="lg" variant="primary" rightIcon={<ArrowRight className="w-4 h-4" />}>
                {isAuthenticated ? "Open Workspace" : "Create your workspace"}
              </Button>
            </Link>
            <Link to="/login">
              <Button size="lg" variant="secondary">
                Sign in to existing
              </Button>
            </Link>
          </div>
        </div>

        {/* 3. Product Preview / Developer Workspace Visual */}
        <div className="mt-14 relative rounded-xl border border-dark-border bg-dark-surface shadow-2xl overflow-hidden">
          {/* Mock Window Titlebar */}
          <div className="flex items-center justify-between px-4 py-2.5 bg-dark-panel border-b border-dark-border text-xs text-gray-400">
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-red-500/80" />
              <div className="w-3 h-3 rounded-full bg-yellow-500/80" />
              <div className="w-3 h-3 rounded-full bg-green-500/80" />
              <span className="font-mono text-[11px] text-gray-400 ml-2">CodeNest — DSA / Binary Search.cpp</span>
            </div>
            <div className="flex items-center gap-2 font-mono text-[11px]">
              <span className="w-2 h-2 rounded-full bg-brand-400 animate-pulse" />
              <span className="text-brand-300">Saved</span>
              <span className="text-gray-600">|</span>
              <span>C++ (clang-format)</span>
            </div>
          </div>

          {/* Split Workspace Mockup */}
          <div className="grid grid-cols-1 lg:grid-cols-12 min-h-[420px]">
            {/* Left Panel: Problem Statement & Notes (40%) */}
            <div className="lg:col-span-5 p-5 border-b lg:border-b-0 lg:border-r border-dark-border bg-dark-surface flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between gap-2 mb-3">
                  <div className="flex items-center gap-2">
                    <LanguageBadge language="cpp" />
                    <Badge variant="default" size="xs">DSA</Badge>
                  </div>
                  <span className="font-mono text-[11px] text-gray-500">Updated 10m ago</span>
                </div>

                <h3 className="text-base font-bold text-white mb-2">
                  Binary Search on Sorted Array
                </h3>

                <div className="text-xs text-gray-300 space-y-2 leading-relaxed bg-dark-panel/40 p-3 rounded-lg border border-dark-border mb-4">
                  <div className="font-semibold text-brand-400 text-[11px] uppercase tracking-wider font-mono">
                    Problem Objective:
                  </div>
                  <p>
                    Given a sorted array of <code className="text-brand-300 font-mono">n</code> integers, return the index of target value <code className="text-brand-300 font-mono">k</code> in <code className="text-brand-300 font-mono">O(log n)</code> time.
                  </p>
                </div>

                {/* Personal Notes */}
                <div className="bg-dark-panel/60 p-3 rounded-lg border border-dark-border text-xs text-gray-300">
                  <div className="font-semibold text-amber-400 text-[11px] uppercase tracking-wider font-mono mb-1">
                    Lab Notes & Observations:
                  </div>
                  <ul className="list-disc list-inside space-y-1 text-gray-400 text-[11px]">
                    <li>Use <code className="text-gray-200">left + (right - left) / 2</code> to avoid overflow.</li>
                    <li>Iterative is preferred over recursive for <code className="text-gray-200">O(1)</code> space.</li>
                  </ul>
                </div>
              </div>

              {/* Tags */}
              <div className="flex flex-wrap gap-1.5 pt-4 mt-4 border-t border-dark-border">
                {['#dsa', '#searching', '#algorithms', '#arrays'].map((tag) => (
                  <span key={tag} className="font-mono text-[10px] px-2 py-0.5 rounded bg-dark-panel border border-dark-border text-gray-400">
                    {tag}
                  </span>
                ))}
              </div>
            </div>

            {/* Right Panel: Monaco Code Editor Visual (60%) */}
            <div className="lg:col-span-7 bg-[#0d1117] p-4 font-mono text-xs text-gray-200 overflow-x-auto flex flex-col justify-between">
              <pre className="leading-relaxed">
                <code>
                  <span className="text-gray-500">// Iterative Binary Search implementation</span>{'\n'}
                  <span className="text-purple-400">#include</span> <span className="text-green-300">&lt;vector&gt;</span>{'\n'}
                  <span className="text-purple-400">#include</span> <span className="text-green-300">&lt;iostream&gt;</span>{'\n\n'}
                  <span className="text-blue-400">int</span> <span className="text-yellow-300">binarySearch</span>(<span className="text-blue-400">const</span> std::vector&lt;<span className="text-blue-400">int</span>&gt;&amp; arr, <span className="text-blue-400">int</span> target) {'{\n'}
                  {'    '}<span className="text-blue-400">int</span> left = <span className="text-amber-300">0</span>;{'\n'}
                  {'    '}<span className="text-blue-400">int</span> right = arr.size() - <span className="text-amber-300">1</span>;{'\n\n'}
                  {'    '}<span className="text-purple-400">while</span> (left &lt;= right) {'{\n'}
                  {'        '}<span className="text-blue-400">int</span> mid = left + (right - left) / <span className="text-amber-300">2</span>;{'\n'}
                  {'        '}<span className="text-purple-400">if</span> (arr[mid] == target) <span className="text-purple-400">return</span> mid;{'\n'}
                  {'        '}<span className="text-purple-400">else if</span> (arr[mid] &lt; target) left = mid + <span className="text-amber-300">1</span>;{'\n'}
                  {'        '}<span className="text-purple-400">else</span> right = mid - <span className="text-amber-300">1</span>;{'\n'}
                  {'    }'}{'\n'}
                  {'    '}<span className="text-purple-400">return</span> -<span className="text-amber-300">1</span>;{'\n'}
                  {'}'}
                </code>
              </pre>

              <div className="flex items-center justify-between text-[11px] text-gray-500 pt-3 border-t border-dark-border mt-4">
                <span>Ln 14, Col 2</span>
                <div className="flex items-center gap-3">
                  <span>UTF-8</span>
                  <span>Spaces: 4</span>
                  <span className="text-brand-400">Prettier / Formatter Ready</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 4. Core Features */}
      <section id="features" className="py-20 bg-dark-surface/40 border-y border-dark-border px-4 sm:px-6 lg:px-12">
        <div className="max-w-7xl mx-auto">
          <div className="text-center max-w-2xl mx-auto mb-14">
            <span className="text-xs font-mono uppercase tracking-widest text-brand-400">Features</span>
            <h2 className="text-2xl sm:text-3xl font-bold text-white mt-2 tracking-tight">
              Crafted specifically for writing and managing solutions
            </h2>
            <p className="text-sm text-gray-400 mt-3">
              No generic notes. No messy text files scattered on your desktop. One clean home.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {[
              {
                num: '01',
                title: 'Organize Your Code',
                desc: 'Organize assignments by college subject (DSA, C, Java, DBMS) with tags and favorites.',
                icon: FolderCode,
              },
              {
                num: '02',
                title: 'Developer Editor',
                desc: 'Powered by Monaco Editor with syntax highlighting, bracket matching, line numbers, and dark/light themes.',
                icon: Code2,
              },
              {
                num: '03',
                title: 'Automatic Formatting',
                desc: 'Client-side FormatterService auto-formats on save for JS, TS, SQL, C++, and Python.',
                icon: Sparkles,
              },
              {
                num: '04',
                title: 'Personal Notes & Constraints',
                desc: 'Keep teacher questions, time/space complexity, constraints, and test notes alongside your code.',
                icon: BookMarked,
              },
              {
                num: '05',
                title: 'Secure Sharing',
                desc: 'Generate cryptographically high-entropy share links with customizable expiration and one-click revocation.',
                icon: Share2,
              },
              {
                num: '06',
                title: 'Fast Search & Filtering',
                desc: 'Debounced search across titles, problems, and notes with instant subject and language filters.',
                icon: Search,
              },
            ].map((f) => {
              const Icon = f.icon;
              return (
                <div
                  key={f.num}
                  className="p-5 sm:p-6 rounded-lg bg-dark-surface border border-dark-border hover:border-gray-600 transition-all flex flex-col justify-between"
                >
                  <div>
                    <div className="flex items-center justify-between mb-4">
                      <div className="p-2 rounded-lg bg-brand-500/10 text-brand-400 border border-brand-500/20">
                        <Icon className="w-4 h-4" />
                      </div>
                      <span className="font-mono text-xs text-gray-600 font-semibold">{f.num}</span>
                    </div>
                    <h3 className="text-base font-semibold text-white mb-2">{f.title}</h3>
                    <p className="text-xs text-gray-400 leading-relaxed">{f.desc}</p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* 5. Developer Workflow */}
      <section id="workflow" className="py-20 px-4 sm:px-6 lg:px-12 max-w-7xl mx-auto w-full">
        <div className="text-center max-w-2xl mx-auto mb-14">
          <span className="text-xs font-mono uppercase tracking-widest text-cyanAccent-500">Workflow</span>
          <h2 className="text-2xl sm:text-3xl font-bold text-white mt-2 tracking-tight">
            The Complete Student Coding Lifecycle
          </h2>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-7 gap-3 text-center">
          {[
            { step: 'Create', desc: 'New problem' },
            { step: 'Organize', desc: 'Subject & tags' },
            { step: 'Write', desc: 'Monaco Editor' },
            { step: 'Format', desc: 'Auto on save' },
            { step: 'Save', desc: 'Debounced sync' },
            { step: 'Review', desc: 'Notes & analysis' },
            { step: 'Share', desc: 'Secure view link' },
          ].map((item, index) => (
            <div
              key={item.step}
              className="p-3.5 rounded-lg bg-dark-surface border border-dark-border flex flex-col items-center justify-center"
            >
              <div className="w-5 h-5 rounded-full bg-brand-500/15 text-brand-400 text-[10px] font-mono font-bold flex items-center justify-center mb-2">
                {index + 1}
              </div>
              <h4 className="text-xs font-semibold text-white">{item.step}</h4>
              <span className="text-[11px] text-gray-500 mt-0.5">{item.desc}</span>
            </div>
          ))}
        </div>
      </section>

      {/* 6. Secure Sharing Section */}
      <section id="sharing" className="py-20 bg-dark-surface/40 border-y border-dark-border px-4 sm:px-6 lg:px-12">
        <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-10 items-center">
          <div>
            <div className="inline-flex items-center gap-2 px-2.5 py-1 rounded-md bg-brand-500/10 border border-brand-500/30 text-brand-400 text-xs font-mono mb-4">
              <Lock className="w-3.5 h-3.5" />
              <span>Strict Read-Only Protection</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-bold text-white tracking-tight">
              Share your work without giving away control.
            </h2>
            <p className="text-sm text-gray-400 mt-4 leading-relaxed">
              When a lab partner or professor asks to view your solution, generate a secure read-only link. The original program remains private in your workspace.
            </p>

            <ul className="mt-6 space-y-3 text-xs text-gray-300">
              <li className="flex items-center gap-2.5">
                <CheckCircle2 className="w-4 h-4 text-brand-400 shrink-0" />
                <span>View-only permission: viewers cannot edit, delete, or alter notes.</span>
              </li>
              <li className="flex items-center gap-2.5">
                <CheckCircle2 className="w-4 h-4 text-brand-400 shrink-0" />
                <span>Time-based expiration (1 hour, 1 day, 7 days, 30 days, or never).</span>
              </li>
              <li className="flex items-center gap-2.5">
                <CheckCircle2 className="w-4 h-4 text-brand-400 shrink-0" />
                <span>One-click instant revocation halts access immediately.</span>
              </li>
              <li className="flex items-center gap-2.5">
                <CheckCircle2 className="w-4 h-4 text-brand-400 shrink-0" />
                <span>SHA-256 token hashing: raw tokens are never persisted in the database.</span>
              </li>
            </ul>
          </div>

          {/* Sharing Card Preview */}
          <div className="p-6 rounded-lg bg-dark-surface border border-dark-border shadow-elevated">
            <div className="flex items-center justify-between border-b border-dark-border pb-3 mb-4">
              <div className="flex items-center gap-2 text-xs font-semibold text-white">
                <Share2 className="w-4 h-4 text-brand-400" />
                <span>Share Program: Binary Search</span>
              </div>
              <Badge variant="brand" size="xs">VIEW_ONLY</Badge>
            </div>

            <div className="space-y-3 text-xs">
              <div className="p-2.5 rounded bg-dark-panel border border-dark-border font-mono text-[11px] text-gray-300 flex items-center justify-between">
                <span className="truncate">https://codenest.dev/s/7f9a2b8c4d1e...</span>
                <span className="text-brand-400 ml-2">Active</span>
              </div>
              <div className="flex items-center justify-between text-[11px] text-gray-400">
                <span>Expires in: 7 days</span>
                <span className="text-red-400 hover:underline cursor-pointer">Revoke Access</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 7. Final Call to Action */}
      <section className="py-20 px-4 sm:px-6 lg:px-12 max-w-4xl mx-auto text-center">
        <h2 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
          Build your personal coding workspace.
        </h2>
        <p className="text-sm sm:text-base text-gray-400 mt-4 max-w-xl mx-auto">
          Start writing, organizing, and mastering your college programming assignments in a modern developer environment.
        </p>
        <div className="mt-8 flex justify-center gap-3">
          <Link to="/register">
            <Button size="lg" variant="primary" rightIcon={<ArrowRight className="w-4 h-4" />}>
              Create your CodeNest →
            </Button>
          </Link>
          <Link to="/login">
            <Button size="lg" variant="outline">
              Sign In
            </Button>
          </Link>
        </div>
      </section>

      {/* 8. Footer */}
      <footer className="mt-auto border-t border-dark-border py-8 px-4 sm:px-6 lg:px-12 bg-dark-surface/50 text-xs text-gray-500">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <Logo size="sm" asLink={false} />
            <span className="text-gray-600">|</span>
            <span>Your personal home for code.</span>
          </div>

          <div className="flex items-center gap-6">
            <Link to="/docs" className="hover:text-gray-300 transition-colors">Documentation</Link>
            <Link to="/login" className="hover:text-gray-300 transition-colors">Sign In</Link>
            <Link to="/register" className="hover:text-gray-300 transition-colors">Register</Link>
            <a href="https://github.com/Gamerking177/codeNest" target="_blank" rel="noopener noreferrer" className="hover:text-gray-300 transition-colors">
              GitHub
            </a>
          </div>
        </div>
      </footer>
    </div>
  );
};

import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Save, Plus, FileCode, Tag } from 'lucide-react';
import { apiClient } from '../api/client';
import { Input } from '../components/ui/Input';
import { Textarea } from '../components/ui/Textarea';
import { Button } from '../components/ui/Button';
import { CodeEditor } from '../components/editor/CodeEditor';
import { SUPPORTED_LANGUAGES } from '../components/editor/EditorToolbar';
import { useToast } from '../context/ToastContext';

export const CreateProgramPage: React.FC = () => {
  const navigate = useNavigate();
  const { toast } = useToast();

  const [title, setTitle] = useState('');
  const [subject, setSubject] = useState('');
  const [language, setLanguage] = useState('cpp');
  const [question, setQuestion] = useState('');
  const [notes, setNotes] = useState('');
  const [tagsInput, setTagsInput] = useState('');
  const [code, setCode] = useState(`// Solution code here\n#include <iostream>\n\nint main() {\n    std::cout << "Hello CodeNest!" << std::endl;\n    return 0;\n}`);

  const [subjectsList, setSubjectsList] = useState<string[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function loadExistingSubjects() {
      try {
        const res = await apiClient.get('/programs/subjects');
        if (res.data?.success) {
          setSubjectsList(res.data.data.subjects || []);
        }
      } catch {
        // Ignore
      }
    }
    loadExistingSubjects();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) {
      setError('Please provide a title for your program.');
      return;
    }
    if (!subject.trim()) {
      setError('Please provide a subject (e.g. DSA, C Programming).');
      return;
    }
    if (!code.trim()) {
      setError('Code cannot be empty.');
      return;
    }

    const parsedTags = tagsInput
      .split(/[,#\s]+/)
      .map((t) => t.trim().toLowerCase())
      .filter((t) => t.length > 0);

    setError(null);
    setIsSubmitting(true);
    try {
      const response = await apiClient.post('/programs', {
        title: title.trim(),
        subject: subject.trim(),
        language,
        question: question.trim(),
        notes: notes.trim(),
        tags: parsedTags,
        code,
      });

      if (response.data?.success) {
        toast.success('Program created successfully!');
        const newId = response.data.data.program.id;
        navigate(`/programs/${newId}`);
      }
    } catch (err: any) {
      setError(err?.response?.data?.error?.message || 'Failed to create program.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between gap-4 border-b border-dark-border/70 pb-4">
        <div className="flex items-center gap-3">
          <Button
            type="button"
            variant="ghost"
            size="sm"
            onClick={() => navigate(-1)}
            aria-label="Back"
          >
            <ArrowLeft className="w-4 h-4" />
          </Button>
          <div>
            <h1 className="text-xl font-bold tracking-tight text-white">Create New Program</h1>
            <p className="text-xs text-gray-400">Save an assignment or code exercise to your notebook.</p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <Button
            type="button"
            variant="ghost"
            size="sm"
            onClick={() => navigate(-1)}
            disabled={isSubmitting}
          >
            Cancel
          </Button>
          <Button
            type="submit"
            variant="primary"
            size="sm"
            isLoading={isSubmitting}
            leftIcon={<Save className="w-4 h-4" />}
          >
            Create Program
          </Button>
        </div>
      </div>

      {error && (
        <div className="p-3 rounded-lg bg-red-500/10 border border-red-500/30 text-xs text-red-300">
          {error}
        </div>
      )}

      {/* Form Fields & Split Editor */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Side: Metadata Form Fields (40%) */}
        <div className="lg:col-span-5 space-y-4">
          <Input
            label="Program / Assignment Title *"
            required
            placeholder="e.g. Binary Search Tree Insertion"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
          />

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-xs font-medium text-gray-300 select-none block mb-1.5">
                Subject *
              </label>
              <input
                type="text"
                list="subjects-datalist"
                required
                placeholder="e.g. DSA"
                value={subject}
                onChange={(e) => setSubject(e.target.value)}
                className="w-full bg-dark-surface text-gray-100 placeholder:text-gray-500 text-sm rounded-lg border border-dark-border py-2 px-3 focus:border-brand-500 focus:outline-none"
              />
              <datalist id="subjects-datalist">
                {subjectsList.map((s) => (
                  <option key={s} value={s} />
                ))}
              </datalist>
            </div>

            <div>
              <label className="text-xs font-medium text-gray-300 select-none block mb-1.5">
                Language *
              </label>
              <select
                value={language}
                onChange={(e) => setLanguage(e.target.value)}
                className="w-full bg-dark-surface text-gray-100 text-sm rounded-lg border border-dark-border py-2 px-3 focus:border-brand-500 focus:outline-none font-mono"
              >
                {SUPPORTED_LANGUAGES.map((lang) => (
                  <option key={lang.value} value={lang.value}>
                    {lang.label}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <Textarea
            label="Problem Prompt / Question (Optional)"
            placeholder="Paste your college assignment question or problem statement here..."
            rows={4}
            value={question}
            onChange={(e) => setQuestion(e.target.value)}
          />

          <Textarea
            label="Personal Notes & Observations (Optional)"
            placeholder="Algorithm hints, time/space complexity notes, constraints..."
            rows={3}
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
          />

          <Input
            label="Tags (Optional)"
            placeholder="searching, arrays, binary-tree (comma separated)"
            value={tagsInput}
            onChange={(e) => setTagsInput(e.target.value)}
            leftIcon={<Tag className="w-4 h-4" />}
          />
        </div>

        {/* Right Side: Monaco Code Editor (60%) */}
        <div className="lg:col-span-7 flex flex-col">
          <div className="mb-1.5 flex items-center justify-between">
            <label className="text-xs font-medium text-gray-300">Solution Source Code *</label>
            <span className="text-[11px] font-mono text-brand-400">Auto-formatting enabled</span>
          </div>
          <CodeEditor
            code={code}
            onChange={setCode}
            language={language}
            onLanguageChange={setLanguage}
            minHeight="500px"
          />
        </div>
      </div>
    </form>
  );
};

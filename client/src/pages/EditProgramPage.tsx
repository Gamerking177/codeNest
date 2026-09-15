import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, Save, Tag } from 'lucide-react';
import { apiClient } from '../api/client';
import { Program } from '../types';
import { Input } from '../components/ui/Input';
import { Textarea } from '../components/ui/Textarea';
import { Button } from '../components/ui/Button';
import { CodeEditor } from '../components/editor/CodeEditor';
import { SUPPORTED_LANGUAGES } from '../components/editor/EditorToolbar';
import { Skeleton } from '../components/ui/Skeleton';
import { ErrorState } from '../components/ui/ErrorState';
import { useToast } from '../context/ToastContext';

export const EditProgramPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { toast } = useToast();

  const [title, setTitle] = useState('');
  const [subject, setSubject] = useState('');
  const [language, setLanguage] = useState('cpp');
  const [question, setQuestion] = useState('');
  const [notes, setNotes] = useState('');
  const [tagsInput, setTagsInput] = useState('');
  const [code, setCode] = useState('');

  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function loadProgram() {
      if (!id) return;
      setIsLoading(true);
      setError(null);
      try {
        const res = await apiClient.get(`/programs/${id}`);
        if (res.data?.success && res.data?.data?.program) {
          const prog: Program = res.data.data.program;
          setTitle(prog.title);
          setSubject(prog.subject);
          setLanguage(prog.language);
          setQuestion(prog.question || '');
          setNotes(prog.notes || '');
          setTagsInput(prog.tags.join(', '));
          setCode(prog.code);
        }
      } catch (err: any) {
        setError(err?.response?.data?.error?.message || 'Failed to load program for editing.');
      } finally {
        setIsLoading(false);
      }
    }
    loadProgram();
  }, [id]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !subject.trim() || !code.trim()) {
      setError('Title, subject, and code are required.');
      return;
    }

    const parsedTags = tagsInput
      .split(/[,#\s]+/)
      .map((t) => t.trim().toLowerCase())
      .filter((t) => t.length > 0);

    setError(null);
    setIsSubmitting(true);
    try {
      await apiClient.patch(`/programs/${id}`, {
        title: title.trim(),
        subject: subject.trim(),
        language,
        question: question.trim(),
        notes: notes.trim(),
        tags: parsedTags,
        code,
      });

      toast.success('Program successfully updated!');
      navigate(`/programs/${id}`);
    } catch (err: any) {
      setError(err?.response?.data?.error?.message || 'Failed to update program.');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (error && !title) {
    return <ErrorState message={error} onRetry={() => navigate(-1)} />;
  }

  if (isLoading) {
    return (
      <div className="space-y-4">
        <Skeleton className="h-14 w-full" />
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          <Skeleton className="lg:col-span-5 h-96 w-full" />
          <Skeleton className="lg:col-span-7 h-96 w-full" />
        </div>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between gap-4 border-b border-dark-border/70 pb-4">
        <div className="flex items-center gap-3">
          <Button
            type="button"
            variant="ghost"
            size="sm"
            onClick={() => navigate(`/programs/${id}`)}
            aria-label="Back to Program"
          >
            <ArrowLeft className="w-4 h-4" />
          </Button>
          <div>
            <h1 className="text-xl font-bold tracking-tight text-white">Edit Program</h1>
            <p className="text-xs text-gray-400">Modify metadata, question, notes, or code solution.</p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <Button
            type="button"
            variant="ghost"
            size="sm"
            onClick={() => navigate(`/programs/${id}`)}
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
            Save Changes
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
            label="Program Title *"
            required
            value={title}
            onChange={(e) => setTitle(e.target.value)}
          />

          <div className="grid grid-cols-2 gap-3">
            <Input
              label="Subject *"
              required
              value={subject}
              onChange={(e) => setSubject(e.target.value)}
            />

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
            label="Problem Prompt / Question"
            rows={4}
            value={question}
            onChange={(e) => setQuestion(e.target.value)}
          />

          <Textarea
            label="Personal Notes & Observations"
            rows={3}
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
          />

          <Input
            label="Tags"
            placeholder="searching, arrays, tree (comma separated)"
            value={tagsInput}
            onChange={(e) => setTagsInput(e.target.value)}
            leftIcon={<Tag className="w-4 h-4" />}
          />
        </div>

        {/* Right Side: Monaco Code Editor (60%) */}
        <div className="lg:col-span-7 flex flex-col">
          <div className="mb-1.5 flex items-center justify-between">
            <label className="text-xs font-medium text-gray-300">Source Code *</label>
            <span className="text-[11px] font-mono text-brand-400">Ctrl+S to format</span>
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

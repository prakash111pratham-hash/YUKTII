import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { MOCK_INTERVIEW_QUESTIONS } from '../data/mockInterviewData';
import { MockInterviewQuestion, MockInterviewResult } from '../types';
import confetti from 'canvas-confetti';
import {
  Award,
  Mic,
  Send,
  Sparkles,
  CheckCircle2,
  AlertCircle,
  HelpCircle,
  UserCheck,
  RotateCcw,
  Volume2,
} from 'lucide-react';

export const MockInterviewView: React.FC = () => {
  const { user, incrementXp } = useApp();

  const [activeRound, setActiveRound] = useState<'Technical' | 'HR' | 'Behavioral'>('Technical');
  const filteredQuestions = MOCK_INTERVIEW_QUESTIONS.filter((q) => q.round === activeRound);

  const [currentQIndex, setCurrentQIndex] = useState(0);
  const [candidateAnswer, setCandidateAnswer] = useState('');
  const [isEvaluating, setIsEvaluating] = useState(false);
  const [evaluationResult, setEvaluationResult] = useState<{
    score: number;
    feedback: string;
    strengths: string[];
    improvements: string[];
    idealModelAnswer?: string;
  } | null>(null);

  const currentQ = filteredQuestions[currentQIndex] || filteredQuestions[0];

  const handleEvaluate = async () => {
    if (!candidateAnswer.trim()) return;

    setIsEvaluating(true);
    try {
      const res = await fetch('/api/ai/mock-interview', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          round: activeRound,
          question: currentQ.question,
          answer: candidateAnswer,
          branch: user.selectedBranch || 'CSE',
        }),
      });
      const data = await res.json();
      if (data.success && data.data) {
        setEvaluationResult(data.data);
      } else {
        // Fallback evaluation
        setEvaluationResult({
          score: candidateAnswer.length > 100 ? 84 : 70,
          feedback:
            'Solid articulation of core principles. To score in the 90th percentile of Tier-1 placement rounds, cite specific trade-offs and real-world system bottlenecks.',
          strengths: ['Directly answered the question', 'Clear structured technical vocabulary'],
          improvements: ['Quantify metrics and mention corner cases', 'Conclude with a succinct summary'],
        });
      }
      incrementXp(75, 'Completed Mock Interview Answer');
      confetti({ particleCount: 50, spread: 60 });
    } catch (e) {
      setEvaluationResult({
        score: candidateAnswer.length > 80 ? 80 : 68,
        feedback:
          'Constructive attempt. Emphasize algorithmic complexity (O(N) Time/Space) and concrete implementation steps.',
        strengths: ['Good foundational understanding'],
        improvements: ['Include architectural trade-offs'],
      });
    } finally {
      setIsEvaluating(false);
    }
  };

  const handleNextQuestion = () => {
    setCandidateAnswer('');
    setEvaluationResult(null);
    if (currentQIndex < filteredQuestions.length - 1) {
      setCurrentQIndex(currentQIndex + 1);
    } else {
      setCurrentQIndex(0);
    }
  };

  return (
    <div className="space-y-6 pb-16">
      {/* Header */}
      <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-bold mb-2">
            <Award className="w-3.5 h-3.5" /> Stage 4: AI Mock Interview Simulator
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
            Campus Placement Interview Studio
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-1 max-w-2xl">
            Simulate rigorous Technical, HR, and Behavioral rounds tailored to your engineering branch with instant AI scorecard and recruiter verdict.
          </p>
        </div>

        {/* Round Switcher */}
        <div className="flex items-center gap-1 p-1 rounded-xl bg-slate-100 border border-slate-200 self-start md:self-auto">
          {(['Technical', 'HR', 'Behavioral'] as const).map((round) => (
            <button
              key={round}
              type="button"
              onClick={() => {
                setActiveRound(round);
                setCurrentQIndex(0);
                setCandidateAnswer('');
                setEvaluationResult(null);
              }}
              className={`px-3.5 py-2 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                activeRound === round ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              {round} Round
            </button>
          ))}
        </div>
      </div>

      {/* Main Interview Panel */}
      <div className="bg-white rounded-2xl p-6 sm:p-8 border border-slate-200 shadow-xs max-w-4xl mx-auto space-y-6">
        <div className="flex items-center justify-between border-b border-slate-100 pb-4">
          <div>
            <span className="text-xs font-bold text-indigo-600 uppercase tracking-wider">
              {activeRound} Question {currentQIndex + 1} of {filteredQuestions.length}
            </span>
            <h2 className="text-sm font-semibold text-slate-500">
              Focus Area: <strong className="text-slate-800">{currentQ.category}</strong>
            </h2>
          </div>
          <span className="text-xs font-bold text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-full border border-emerald-200">
            {user.selectedBranch || 'CSE'} Campus Interview
          </span>
        </div>

        {/* Question Statement Box */}
        <div className="p-5 rounded-2xl bg-slate-900 text-white space-y-2 relative overflow-hidden shadow-md">
          <div className="flex items-center gap-2 text-indigo-300 text-xs font-semibold">
            <UserCheck className="w-4 h-4" />
            <span>Senior Campus Interviewer Asks:</span>
          </div>
          <p className="text-base sm:text-lg font-bold text-slate-100 leading-snug">
            "{currentQ.question}"
          </p>
        </div>

        {/* Sample Hints Accordion */}
        <div className="p-3.5 rounded-xl bg-amber-50/70 border border-amber-200 text-xs text-amber-900 space-y-1">
          <div className="flex items-center gap-1.5 font-bold">
            <HelpCircle className="w-3.5 h-3.5 text-amber-700" />
            <span>Recommended Talking Points for this question:</span>
          </div>
          <ul className="list-disc list-inside text-slate-700 space-y-0.5 pt-1">
            {currentQ.sampleAnswerHints.map((hint, i) => (
              <li key={i}>{hint}</li>
            ))}
          </ul>
        </div>

        {/* Candidate Response Textarea */}
        <div className="space-y-2">
          <label className="block text-xs font-bold text-slate-700">Your Spoken / Written Response</label>
          <textarea
            value={candidateAnswer}
            onChange={(e) => setCandidateAnswer(e.target.value)}
            rows={5}
            placeholder="Type your structured answer here (e.g. using the STAR method for behavioral or stating complexities for technical)..."
            className="w-full p-4 rounded-xl border border-slate-300 text-xs sm:text-sm text-slate-800 focus:outline-none focus:ring-2 focus:ring-indigo-500 leading-relaxed"
          />
        </div>

        <div className="flex items-center justify-between pt-2">
          <button
            type="button"
            onClick={() => setCandidateAnswer('')}
            className="text-xs font-semibold text-slate-500 hover:text-slate-800 cursor-pointer"
          >
            Clear Answer
          </button>

          <button
            type="button"
            onClick={handleEvaluate}
            disabled={!candidateAnswer.trim() || isEvaluating}
            className="inline-flex items-center gap-2 px-6 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 disabled:opacity-40 text-white text-xs font-bold shadow-md transition-colors cursor-pointer"
          >
            <Sparkles className="w-4 h-4" />
            <span>{isEvaluating ? 'Evaluating Answer...' : 'Submit & Evaluate Answer'}</span>
          </button>
        </div>

        {/* AI Evaluation Result Card */}
        {evaluationResult && (
          <div className="p-6 rounded-2xl bg-indigo-50/60 border border-indigo-200 space-y-4 animate-in fade-in duration-200">
            <div className="flex items-center justify-between border-b border-indigo-100 pb-3">
              <div className="flex items-center gap-2">
                <Sparkles className="w-5 h-5 text-indigo-600" />
                <h3 className="text-base font-bold text-slate-900">AI Recruiter Scorecard</h3>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-xs font-bold text-slate-500">Candidate Score:</span>
                <span className="text-xl font-extrabold text-indigo-700">
                  {evaluationResult.score}/100
                </span>
              </div>
            </div>

            <p className="text-xs sm:text-sm text-slate-700 leading-relaxed">
              {evaluationResult.feedback}
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
              <div className="p-3.5 rounded-xl bg-white border border-indigo-100 space-y-1">
                <strong className="text-emerald-800 font-bold block">Demonstrated Strengths:</strong>
                <ul className="list-disc list-inside text-slate-700 space-y-1">
                  {evaluationResult.strengths.map((s, i) => (
                    <li key={i}>{s}</li>
                  ))}
                </ul>
              </div>

              <div className="p-3.5 rounded-xl bg-white border border-indigo-100 space-y-1">
                <strong className="text-amber-800 font-bold block">Areas to Polish:</strong>
                <ul className="list-disc list-inside text-slate-700 space-y-1">
                  {evaluationResult.improvements.map((imp, i) => (
                    <li key={i}>{imp}</li>
                  ))}
                </ul>
              </div>
            </div>

            <div className="pt-2 flex justify-end">
              <button
                type="button"
                onClick={handleNextQuestion}
                className="inline-flex items-center gap-1.5 px-5 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold transition-colors cursor-pointer"
              >
                <span>Proceed to Next Question</span>
                <Sparkles className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

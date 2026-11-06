import React, { useState, useRef, useEffect } from 'react';
import { useApp } from '../context/AppContext';
import {
  MessageSquare,
  Sparkles,
  Send,
  X,
  Minimize2,
  Maximize2,
  Globe,
  HelpCircle,
  ExternalLink,
  Flame,
  Zap,
  Music,
  Smile,
  Move,
  Anchor,
  Volume2,
  VolumeX,
} from 'lucide-react';
import confetti from 'canvas-confetti';

interface ChatMessage {
  id: string;
  role: 'user' | 'model';
  content: string;
  sources?: { title: string; url: string }[];
  timestamp: string;
}

type DanceStyle = 'disco' | 'robot' | 'breakdance' | 'salsa' | 'bounce';
type FacialExpression = 'happy' | 'wink' | 'cool' | 'dizzy' | 'surprised' | 'giggle';

const FUNNY_QUIPS = [
  'Optimized my dance moves to O(1) runtime! ⚡',
  'Whoops! Caught in an infinite loop of placement joy! 🎉',
  'My neural net predicts a 100% chance of you getting placed! 🚀',
  'Doing placement pushups before your Tier-1 interview! 💪',
  'Warming up the Placement Salsa for TCS & Amazon drives! 💃',
  'Don’t forget to hydrate, Future Senior SDE-1! ☕',
  'Analyzing 10,000 resumes... yours is looking top tier! ✨',
];

export const AiChatbot: React.FC = () => {
  const { user } = useApp();

  // Chat window state
  const [isOpen, setIsOpen] = useState(false);
  const [inputText, setInputText] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: 'm-1',
      role: 'model',
      content: `Namaste ${user.name}! I am Yuki, your witty AI Engineering & Campus Placement Companion! Ask me about JEE branch cutoffs, TCS NQT/Infosys preparation, DSA roadmaps, LPA package benchmarks, or test my placement dance moves!`,
      timestamp: 'Just now',
    },
  ]);

  // Mascot animation & roaming states
  const [isDancing, setIsDancing] = useState(true);
  const [currentDance, setCurrentDance] = useState<DanceStyle>('disco');
  const [expression, setExpression] = useState<FacialExpression>('happy');
  const [isWandering, setIsWandering] = useState(true);
  const [showQuip, setShowQuip] = useState(true);
  const [quipText, setQuipText] = useState(FUNNY_QUIPS[0]);
  const [showDanceMenu, setShowDanceMenu] = useState(false);

  // Position coordinates (for floating & wandering "here and there")
  // 0 = bottom-right, 1 = mid-right, 2 = bottom-center, 3 = bottom-left
  const [wanderIndex, setWanderIndex] = useState(0);

  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Periodic Funny Moments & Wandering Effect
  useEffect(() => {
    if (!isWandering || isOpen) return;

    const wanderInterval = setInterval(() => {
      setWanderIndex((prev) => (prev + 1) % 4);

      // Random funny quip
      const randomQuip = FUNNY_QUIPS[Math.floor(Math.random() * FUNNY_QUIPS.length)];
      setQuipText(randomQuip);
      setShowQuip(true);

      // Random quick expression
      const expressions: FacialExpression[] = ['happy', 'wink', 'cool', 'giggle'];
      setExpression(expressions[Math.floor(Math.random() * expressions.length)]);

      // Auto-hide quip after 4 seconds
      setTimeout(() => setShowQuip(false), 4500);
    }, 9000);

    return () => clearInterval(wanderInterval);
  }, [isWandering, isOpen]);

  // Wandering position styles
  const positionClasses = [
    'bottom-6 right-6', // 0: bottom-right
    'bottom-28 right-8', // 1: floating up-right
    'bottom-6 right-64', // 2: bottom-center-right
    'bottom-6 right-96', // 3: wandered leftward
  ];

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    if (isOpen) {
      scrollToBottom();
    }
  }, [messages, isOpen]);

  const handleSendMessage = async (textToSend?: string) => {
    const text = textToSend || inputText;
    if (!text.trim() || isTyping) return;

    const userMsg: ChatMessage = {
      id: `usr-${Date.now()}`,
      role: 'user',
      content: text,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    setMessages((prev) => [...prev, userMsg]);
    setInputText('');
    setIsTyping(true);
    setExpression('wink');

    try {
      const history = [...messages, userMsg].map((m) => ({
        role: m.role,
        content: m.content,
      }));

      const res = await fetch('/api/ai/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          messages: history,
          studentContext: {
            year: user.currentYear,
            branch: user.selectedBranch || 'CSE',
            college: user.college,
            targetLPA: user.targetLPA,
          },
        }),
      });

      const data = await res.json();
      if (data.success && data.content) {
        setMessages((prev) => [
          ...prev,
          {
            id: `bot-${Date.now()}`,
            role: 'model',
            content: data.content,
            sources: data.sources || [],
            timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          },
        ]);
        setExpression('cool');
      } else {
        setMessages((prev) => [
          ...prev,
          {
            id: `bot-${Date.now()}`,
            role: 'model',
            content: `For Indian campus recruitment in ${user.selectedBranch || 'CSE'} targeting ₹${user.targetLPA || 18} LPA: Focus heavily on Core DSA (Arrays, Graphs, DP) and CS Fundamentals (OS threads, DBMS indexing). Taking company mocks regularly in YUKTI gives a 75%+ shortlist advantage!`,
            timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          },
        ]);
      }
    } catch (e) {
      setMessages((prev) => [
        ...prev,
        {
          id: `bot-${Date.now()}`,
          role: 'model',
          content: 'Here are the key takeaways for Indian campus placement success: Maintain a CGPA above 8.0, complete 2 substantial capstone projects with live demo links, and practice 1 mock interview weekly.',
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        },
      ]);
    } finally {
      setIsTyping(false);
    }
  };

  const triggerDance = (dance: DanceStyle) => {
    setCurrentDance(dance);
    setIsDancing(true);
    setExpression(dance === 'breakdance' ? 'cool' : dance === 'robot' ? 'wink' : 'happy');

    confetti({
      particleCount: 35,
      spread: 50,
      origin: { x: 0.9, y: 0.85 },
      colors: ['#f97316', '#eab308', '#6366f1', '#ec4899'],
    });

    setQuipText(`Dancing the ${dance.toUpperCase()} for placement good luck! 💃`);
    setShowQuip(true);
    setTimeout(() => setShowQuip(false), 3500);
  };

  const handleMascotClick = () => {
    // Play funny giggling animation on click
    setExpression('giggle');
    confetti({ particleCount: 20, spread: 40, origin: { x: 0.9, y: 0.85 } });
    setShowDanceMenu((prev) => !prev);
  };

  const samplePrompts = [
    'How do I crack TCS Digital vs Ninja?',
    'Top 5 DSA topics for Amazon SDE-1?',
    'Tips for technical HR round intro',
    'Do a funny placement dance!',
  ];

  return (
    <>
      {/* CREATIVE DANCING FLOATING MASCOT ("Yuki") */}
      {!isOpen && (
        <div
          className={`fixed z-40 transition-all duration-1000 ease-out select-none ${positionClasses[wanderIndex]}`}
        >
          {/* Funny Thought/Speech Bubble */}
          {showQuip && (
            <div className="absolute -top-16 -left-28 sm:-left-36 bg-white/95 backdrop-blur-md px-3.5 py-2 rounded-2xl border border-orange-200 shadow-xl shadow-orange-950/10 text-xs font-bold text-slate-800 max-w-[200px] animate-in fade-in slide-in-from-bottom-2 duration-300 z-50">
              <span className="leading-tight block">{quipText}</span>
              <div className="absolute -bottom-1.5 right-10 w-3 h-3 bg-white border-r border-b border-orange-200 rotate-45" />
            </div>
          )}

          {/* Dance & Controls Mini Bar */}
          {showDanceMenu && (
            <div className="absolute -top-12 right-0 flex items-center gap-1.5 p-1.5 bg-slate-900/90 backdrop-blur-md rounded-2xl shadow-xl border border-slate-700 animate-in fade-in duration-200 z-50">
              <button
                type="button"
                onClick={() => triggerDance('disco')}
                className="px-2 py-1 rounded-xl text-[10px] font-bold bg-orange-600 hover:bg-orange-500 text-white cursor-pointer transition-colors"
                title="Disco Groove"
              >
                🕺 Disco
              </button>
              <button
                type="button"
                onClick={() => triggerDance('robot')}
                className="px-2 py-1 rounded-xl text-[10px] font-bold bg-indigo-600 hover:bg-indigo-500 text-white cursor-pointer transition-colors"
                title="Robot Freeze"
              >
                🤖 Robot
              </button>
              <button
                type="button"
                onClick={() => triggerDance('breakdance')}
                className="px-2 py-1 rounded-xl text-[10px] font-bold bg-purple-600 hover:bg-purple-500 text-white cursor-pointer transition-colors"
                title="Breakdance Spin"
              >
                🌀 Spin
              </button>
              <button
                type="button"
                onClick={() => setIsWandering(!isWandering)}
                className={`p-1 rounded-xl text-[10px] ${
                  isWandering ? 'bg-emerald-600 text-white' : 'bg-slate-700 text-slate-300'
                } cursor-pointer`}
                title={isWandering ? 'Wandering around screen edges (Click to Settle)' : 'Settled in place (Click to Wander)'}
              >
                <Move className="w-3.5 h-3.5" />
              </button>
            </div>
          )}

          {/* Interactive Mascot Body Container */}
          <div className="relative flex flex-col items-center group">
            {/* Mascot Character Element */}
            <div
              onClick={handleMascotClick}
              className={`w-16 h-16 sm:w-18 sm:h-18 rounded-3xl bg-gradient-to-tr from-orange-500 via-amber-400 to-yellow-300 p-1 shadow-2xl shadow-orange-500/30 border-2 border-white cursor-pointer transition-all duration-300 relative flex items-center justify-center ${
                currentDance === 'disco'
                  ? 'animate-bounce'
                  : currentDance === 'robot'
                  ? 'animate-pulse hover:rotate-6'
                  : currentDance === 'breakdance'
                  ? 'animate-spin'
                  : 'hover:scale-110'
              }`}
              title="Click Yuki for funny dance moves & expressions!"
            >
              {/* Cute YUKTI Antennas / Ears */}
              <div className="absolute -top-3.5 flex items-center justify-between w-9 px-1">
                <span className="w-2 h-3.5 rounded-full bg-amber-400 border border-white -rotate-15 shadow-xs" />
                <span className="w-2 h-3.5 rounded-full bg-amber-400 border border-white rotate-15 shadow-xs" />
              </div>

              {/* Face Display Screen */}
              <div className="w-full h-full rounded-2xl bg-slate-900 p-1.5 flex flex-col items-center justify-center relative overflow-hidden">
                {/* Floating Music Notes during dance */}
                {isDancing && (
                  <span className="absolute top-1 right-1 text-[10px] text-amber-300 animate-ping">
                    ♪
                  </span>
                )}

                {/* Animated Eyes based on Expression */}
                <div className="flex items-center justify-center gap-2 mb-1">
                  {expression === 'cool' ? (
                    <span className="text-sm font-black text-amber-300">😎</span>
                  ) : expression === 'wink' ? (
                    <div className="flex items-center gap-2">
                      <span className="w-2.5 h-2.5 rounded-full bg-amber-300 shadow-amber-300 shadow-sm" />
                      <span className="w-2.5 h-0.5 bg-amber-300 rounded" />
                    </div>
                  ) : expression === 'dizzy' ? (
                    <span className="text-xs text-amber-300 font-bold">@ @</span>
                  ) : expression === 'giggle' ? (
                    <div className="flex items-center gap-1.5">
                      <span className="w-2.5 h-1.5 rounded-t-full border-t-2 border-amber-300" />
                      <span className="w-2.5 h-1.5 rounded-t-full border-t-2 border-amber-300" />
                    </div>
                  ) : (
                    <div className="flex items-center gap-2">
                      <span className="w-2.5 h-2.5 rounded-full bg-amber-300 animate-pulse shadow-amber-300 shadow-sm" />
                      <span className="w-2.5 h-2.5 rounded-full bg-amber-300 animate-pulse shadow-amber-300 shadow-sm" />
                    </div>
                  )}
                </div>

                {/* Smiling / Giggling Mouth */}
                <div className="w-3.5 h-1.5 rounded-b-full bg-amber-400/90 shadow-2xs" />
              </div>

              {/* Bouncy Floating Hands */}
              <div className="absolute -left-2 top-6 w-2.5 h-3 rounded-full bg-amber-400 border border-white shadow-xs -rotate-25" />
              <div className="absolute -right-2 top-6 w-2.5 h-3 rounded-full bg-amber-400 border border-white shadow-xs rotate-25" />
            </div>

            {/* Launch Chat Button Pill */}
            <button
              type="button"
              onClick={() => setIsOpen(true)}
              className="mt-2 inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-slate-900 hover:bg-slate-800 text-white text-[11px] font-black shadow-lg shadow-slate-900/25 border border-slate-700 hover:scale-105 transition-all cursor-pointer whitespace-nowrap"
            >
              <Sparkles className="w-3 h-3 text-amber-300 animate-spin" />
              <span>Chat with Yuki</span>
            </button>
          </div>
        </div>
      )}

      {/* FULL GEMINI 3.8 FLASH AI CHAT MODAL */}
      {isOpen && (
        <div className="fixed bottom-6 right-6 z-50 w-[94vw] sm:w-[440px] h-[580px] max-h-[85vh] bg-white rounded-3xl shadow-2xl border border-orange-200/90 flex flex-col overflow-hidden animate-in slide-in-from-bottom-6 duration-200">
          {/* Header with Dancing Mini Yuki */}
          <div className="bg-gradient-to-r from-slate-950 via-orange-950 to-slate-900 text-white p-4 flex items-center justify-between">
            <div className="flex items-center gap-3">
              {/* Mini Dancing Yuki Avatar */}
              <div
                onClick={() => triggerDance('breakdance')}
                className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-orange-500 to-amber-400 p-0.5 flex items-center justify-center cursor-pointer shadow-md hover:scale-105 transition-transform"
                title="Click to make Yuki breakdance!"
              >
                <div className="w-full h-full rounded-xl bg-slate-900 flex flex-col items-center justify-center">
                  <div className="flex items-center gap-1 mb-0.5">
                    <span className="w-1.5 h-1.5 rounded-full bg-amber-300 animate-pulse" />
                    <span className="w-1.5 h-1.5 rounded-full bg-amber-300 animate-pulse" />
                  </div>
                  <div className="w-2.5 h-1 rounded-b-full bg-amber-400" />
                </div>
              </div>

              <div>
                <h3 className="text-sm font-black flex items-center gap-2">
                  <span>YUKTI AI Counselor (Yuki)</span>
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-orange-500/20 text-orange-200 border border-orange-400/30">
                    Gemini 3.8 Flash
                  </span>
                </h3>
                <span className="text-[10px] text-slate-300 block">
                  Campus Recruitment & Academic Advisor · Google Grounded
                </span>
              </div>
            </div>

            <div className="flex items-center gap-1">
              <button
                type="button"
                onClick={() => triggerDance('disco')}
                className="p-1.5 rounded-xl text-amber-300 hover:bg-white/10 transition-colors cursor-pointer text-xs"
                title="Make Yuki Dance!"
              >
                🕺
              </button>
              <button
                type="button"
                onClick={() => setIsOpen(false)}
                className="p-1.5 rounded-xl text-slate-300 hover:text-white hover:bg-white/10 transition-colors cursor-pointer"
                aria-label="Close chat"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Messages Scroll Thread */}
          <div className="flex-1 overflow-y-auto p-4 space-y-3.5 bg-[#faf6f0]">
            {messages.map((msg) => (
              <div
                key={msg.id}
                className={`flex gap-2.5 ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                {msg.role === 'model' && (
                  <div className="w-7 h-7 rounded-xl bg-gradient-to-tr from-orange-500 to-amber-500 text-white flex items-center justify-center shrink-0 text-xs font-black mt-0.5 shadow-xs">
                    Y
                  </div>
                )}
                <div
                  className={`max-w-[85%] rounded-2xl p-3.5 text-xs leading-relaxed space-y-2 ${
                    msg.role === 'user'
                      ? 'bg-slate-900 text-white rounded-br-xs'
                      : 'bg-white border border-orange-200/80 text-slate-800 rounded-bl-xs shadow-xs'
                  }`}
                >
                  <p className="whitespace-pre-line">{msg.content}</p>

                  {/* Grounded Web Sources */}
                  {msg.sources && msg.sources.length > 0 && (
                    <div className="pt-2 border-t border-slate-100 space-y-1 text-[10px]">
                      <span className="font-bold text-slate-500 flex items-center gap-1">
                        <Globe className="w-3 h-3 text-orange-600" /> Grounded Campus Sources:
                      </span>
                      <div className="flex flex-wrap gap-1">
                        {msg.sources.map((s, idx) => (
                          <a
                            key={idx}
                            href={s.url}
                            target="_blank"
                            rel="noreferrer"
                            className="inline-flex items-center gap-1 px-2 py-0.5 rounded bg-orange-50 hover:bg-orange-100 text-orange-800 font-medium border border-orange-200"
                          >
                            <span>{s.title.slice(0, 24)}...</span>
                            <ExternalLink className="w-2.5 h-2.5" />
                          </a>
                        ))}
                      </div>
                    </div>
                  )}

                  <span
                    className={`block text-[9px] text-right ${
                      msg.role === 'user' ? 'text-slate-400' : 'text-slate-400'
                    }`}
                  >
                    {msg.timestamp}
                  </span>
                </div>
              </div>
            ))}

            {isTyping && (
              <div className="flex gap-2.5 items-center text-xs text-slate-500 italic">
                <div className="w-7 h-7 rounded-xl bg-gradient-to-tr from-orange-500 to-amber-500 text-white flex items-center justify-center text-xs font-bold animate-bounce shadow-xs">
                  Y
                </div>
                <span>Yuki is researching verified placement insights...</span>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Quick Prompts Strip */}
          {messages.length <= 2 && (
            <div className="p-2 bg-white border-t border-orange-100 flex gap-1.5 overflow-x-auto scrollbar-none">
              {samplePrompts.map((p, i) => (
                <button
                  key={i}
                  type="button"
                  onClick={() => handleSendMessage(p)}
                  className="text-[10px] font-semibold px-2.5 py-1 rounded-full bg-orange-50 hover:bg-orange-100 hover:text-orange-900 whitespace-nowrap text-slate-700 transition-colors cursor-pointer shrink-0 border border-orange-200"
                >
                  {p}
                </button>
              ))}
            </div>
          )}

          {/* Chat Input Bar */}
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleSendMessage();
            }}
            className="p-3 bg-white border-t border-slate-200 flex items-center gap-2"
          >
            <input
              type="text"
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              placeholder="Ask Yuki about TCS, salary, DSA, or tell it to dance..."
              className="flex-1 px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-orange-500 bg-slate-50 font-medium"
            />
            <button
              type="submit"
              disabled={!inputText.trim() || isTyping}
              className="p-2.5 rounded-xl bg-orange-600 hover:bg-orange-500 disabled:opacity-40 text-white transition-colors cursor-pointer shrink-0 shadow-md shadow-orange-600/20"
              aria-label="Send message"
            >
              <Send className="w-4 h-4" />
            </button>
          </form>
        </div>
      )}
    </>
  );
};

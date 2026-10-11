import React, { useState } from 'react';
import { MousePointerClick, Check, Sparkles, X, MessageSquareQuote } from 'lucide-react';

interface AnnotationFeedbackBarProps {
  cardStyle: 'white' | 'subtle';
  setCardStyle: (style: 'white' | 'subtle') => void;
  isAnnotated: boolean;
  setIsAnnotated: (val: boolean) => void;
}

export const AnnotationFeedbackBar: React.FC<AnnotationFeedbackBarProps> = ({
  cardStyle,
  setCardStyle,
  isAnnotated,
  setIsAnnotated,
}) => {
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const [feedbackPrompt, setFeedbackPrompt] = useState<string>("Let's make these cards white");
  const [showAppliedToast, setShowAppliedToast] = useState<boolean>(false);

  const handleApplyFeedback = () => {
    // If prompt contains 'white' or user submits, make cards white
    if (feedbackPrompt.toLowerCase().includes('white')) {
      setCardStyle('white');
    }
    setIsAnnotated(true);
    setShowAppliedToast(true);
    setIsOpen(false);
    setTimeout(() => {
      setShowAppliedToast(false);
    }, 4000);
  };

  return (
    <>
      {/* Floating Lab Step 3 Helper Trigger */}
      <div className="fixed bottom-4 right-4 z-40 flex flex-col items-end gap-2">
        {showAppliedToast && (
          <div className="bg-slate-900 text-white text-xs px-3.5 py-2.5 rounded-xl shadow-lg border border-slate-700 flex items-center gap-2 animate-in fade-in slide-in-from-bottom-2">
            <Check className="w-4 h-4 text-emerald-400 shrink-0" />
            <span>
              Updated: <strong>KPI Cards styled white</strong> based on your feedback.
            </span>
          </div>
        )}

        <div className="bg-white/95 backdrop-blur-md rounded-xl border border-slate-200 shadow-md p-1.5 flex items-center gap-1.5 text-xs">
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 font-medium text-slate-800 bg-slate-100 hover:bg-slate-200 rounded-lg transition-colors"
            title="Lab Step 3: Annotate App Simulation"
          >
            <MessageSquareQuote className="w-3.5 h-3.5 text-indigo-600" />
            <span>Annotate App (Step 3)</span>
          </button>

          {/* Quick theme pill toggle */}
          <div className="flex items-center bg-slate-100 p-0.5 rounded-lg text-[11px]">
            <button
              onClick={() => {
                setCardStyle('white');
                setIsAnnotated(true);
              }}
              className={`px-2 py-1 rounded-md transition-all font-medium ${
                cardStyle === 'white' ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-500 hover:text-slate-900'
              }`}
            >
              Cards: White ✓
            </button>
            <button
              onClick={() => {
                setCardStyle('subtle');
                setIsAnnotated(false);
              }}
              className={`px-2 py-1 rounded-md transition-all font-medium ${
                cardStyle === 'subtle' ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-500 hover:text-slate-900'
              }`}
            >
              Cards: Subtle
            </button>
          </div>
        </div>
      </div>

      {/* Step 3 Simulation Modal */}
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-2xs">
          <div className="bg-white rounded-2xl border border-slate-200 shadow-2xl max-w-md w-full p-5 space-y-4 animate-in fade-in zoom-in-95">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="w-7 h-7 rounded-lg bg-indigo-50 text-indigo-600 flex items-center justify-center">
                  <MousePointerClick className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-slate-900">Lab Step 3: Annotate & Iterate</h3>
                  <p className="text-[11px] text-slate-500">Provide visual prompt feedback on KPI cards</p>
                </div>
              </div>
              <button
                onClick={() => setIsOpen(false)}
                className="p-1 text-slate-400 hover:text-slate-600 rounded-lg hover:bg-slate-100"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 text-xs space-y-2">
              <div className="text-slate-500 text-[11px] font-medium">Selected Target Area:</div>
              <div className="flex items-center gap-2 font-mono font-semibold text-slate-800 bg-white p-2 rounded-lg border border-slate-200">
                <span className="w-2.5 h-2.5 rounded-full bg-indigo-600" />
                <span>#kpi-cards-container (Top Metric Cards)</span>
              </div>
            </div>

            <div>
              <label className="block text-xs font-medium text-slate-700 mb-1">
                Visual Feedback Prompt (from Lab):
              </label>
              <input
                type="text"
                value={feedbackPrompt}
                onChange={(e) => setFeedbackPrompt(e.target.value)}
                placeholder="Let's make these cards white"
                className="w-full text-xs p-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-1 focus:ring-indigo-500 font-medium"
              />
            </div>

            <div className="flex items-center justify-end gap-2 pt-2 border-t border-slate-100">
              <button
                onClick={() => setIsOpen(false)}
                className="px-3 py-1.5 text-xs text-slate-600 hover:text-slate-800"
              >
                Cancel
              </button>
              <button
                onClick={handleApplyFeedback}
                className="inline-flex items-center gap-1.5 px-4 py-1.5 text-xs font-semibold text-white bg-indigo-600 hover:bg-indigo-700 rounded-lg shadow-xs transition-colors"
              >
                <Sparkles className="w-3.5 h-3.5" />
                <span>Apply Feedback</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

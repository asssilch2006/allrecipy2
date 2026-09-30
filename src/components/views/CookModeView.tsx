import React, { useState, useEffect, useRef } from 'react';
import {
  ArrowLeft, ChevronLeft, ChevronRight, Volume2, VolumeX, Play, Pause,
  RotateCcw, Sparkles, CheckCircle2, Clock, ChefHat, Timer as TimerIcon
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { useApp } from '../../context/AppContext';
import { InstructionStep } from '../../types';

export const CookModeView: React.FC = () => {
  const { cookingRecipe, exitCooking, toggleAiChef } = useApp();

  const [currentStepIndex, setCurrentStepIndex] = useState(0);
  const [isVoiceEnabled, setIsVoiceEnabled] = useState(false);
  const [timerSeconds, setTimerSeconds] = useState<number | null>(null);
  const [isTimerRunning, setIsTimerRunning] = useState(false);
  const [timerInitialSeconds, setTimerInitialSeconds] = useState<number>(0);
  const timerIntervalRef = useRef<any>(null);

  if (!cookingRecipe) {
    return (
      <div className="py-20 text-center space-y-3">
        <p className="text-xs text-stone-500">No active recipe selected for Cook Mode.</p>
        <button
          onClick={exitCooking}
          className="px-4 py-2 bg-emerald-600 text-white rounded-xl text-xs font-semibold"
        >
          Return to Recipes
        </button>
      </div>
    );
  }

  const steps: InstructionStep[] = cookingRecipe.analyzedInstructions?.[0]?.steps || [];
  const currentStep = steps[currentStepIndex];
  const totalSteps = steps.length;
  const isFinished = currentStepIndex >= totalSteps;

  // Extract duration from step length or text regex (e.g. "8 minutes", "35 minutes")
  useEffect(() => {
    if (!currentStep) return;

    let detectedMinutes = currentStep.length?.number || 0;
    if (!detectedMinutes) {
      const match = currentStep.step.match(/(\d+)\s*(?:to\s*\d+\s*)?(?:minutes|minute|mins|min)/i);
      if (match && match[1]) {
        detectedMinutes = parseInt(match[1], 10);
      }
    }

    if (detectedMinutes > 0) {
      const totalSec = detectedMinutes * 60;
      setTimerSeconds(totalSec);
      setTimerInitialSeconds(totalSec);
      setIsTimerRunning(false);
    } else {
      setTimerSeconds(null);
      setIsTimerRunning(false);
    }
  }, [currentStepIndex, currentStep]);

  // Audio chime using Web Audio API
  const playChime = () => {
    try {
      const audioCtx = new (window.AudioContext || (window as any).webkitAudioContext)();
      const osc = audioCtx.createOscillator();
      const gain = audioCtx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(587.33, audioCtx.currentTime); // D5
      osc.frequency.exponentialRampToValueAtTime(880, audioCtx.currentTime + 0.3); // A5
      gain.gain.setValueAtTime(0.2, audioCtx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, audioCtx.currentTime + 0.8);
      osc.connect(gain);
      gain.connect(audioCtx.destination);
      osc.start();
      osc.stop(audioCtx.currentTime + 0.8);
    } catch (e) {
      console.warn('Audio Context not available');
    }
  };

  // Timer interval handling
  useEffect(() => {
    if (isTimerRunning && timerSeconds !== null && timerSeconds > 0) {
      timerIntervalRef.current = setInterval(() => {
        setTimerSeconds((prev) => {
          if (prev === null || prev <= 1) {
            clearInterval(timerIntervalRef.current);
            setIsTimerRunning(false);
            playChime();
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    } else {
      if (timerIntervalRef.current) clearInterval(timerIntervalRef.current);
    }

    return () => {
      if (timerIntervalRef.current) clearInterval(timerIntervalRef.current);
    };
  }, [isTimerRunning, timerSeconds]);

  // Voice Readout using SpeechSynthesis
  const speakCurrentStep = () => {
    if (!('speechSynthesis' in window) || !currentStep) return;
    window.speechSynthesis.cancel();
    const utterance = new SpeechSynthesisUtterance(
      `Step ${currentStep.number}: ${currentStep.step}`
    );
    utterance.rate = 0.95;
    utterance.pitch = 1.0;
    window.speechSynthesis.speak(utterance);
  };

  useEffect(() => {
    if (isVoiceEnabled && currentStep) {
      speakCurrentStep();
    }
    return () => {
      if ('speechSynthesis' in window) window.speechSynthesis.cancel();
    };
  }, [currentStepIndex, isVoiceEnabled]);

  const handleNext = () => {
    if (currentStepIndex < totalSteps - 1) {
      setCurrentStepIndex((prev) => prev + 1);
    } else {
      // Completed all steps!
      setCurrentStepIndex(totalSteps);
      confetti({
        particleCount: 80,
        spread: 70,
        origin: { y: 0.6 },
      });
    }
  };

  const handlePrev = () => {
    if (currentStepIndex > 0) {
      setCurrentStepIndex((prev) => prev - 1);
    }
  };

  const formatTimer = (sec: number) => {
    const mins = Math.floor(sec / 60);
    const remainder = sec % 60;
    return `${mins}:${remainder < 10 ? '0' : ''}${remainder}`;
  };

  return (
    <div className="min-h-[85vh] flex flex-col justify-between max-w-4xl mx-auto space-y-6 animate-in fade-in">
      {/* Top Distraction-Free Header */}
      <div className="flex items-center justify-between border-b border-stone-200 pb-3">
        <button
          onClick={exitCooking}
          className="min-h-[44px] px-3.5 rounded-xl bg-stone-100 hover:bg-stone-200 text-stone-700 flex items-center gap-2 text-xs font-semibold transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Exit Cook Mode</span>
        </button>

        <div className="text-center truncate px-2">
          <span className="text-[11px] font-bold text-emerald-700 uppercase tracking-wider block">
            Hands-Free Cooking
          </span>
          <span className="text-xs font-semibold text-stone-900 truncate block max-w-xs md:max-w-md">
            {cookingRecipe.title}
          </span>
        </div>

        {/* Voice Toggle */}
        <button
          onClick={() => {
            const next = !isVoiceEnabled;
            setIsVoiceEnabled(next);
            if (next) speakCurrentStep();
            else if ('speechSynthesis' in window) window.speechSynthesis.cancel();
          }}
          className={`min-h-[44px] px-3.5 rounded-xl border flex items-center gap-1.5 text-xs font-semibold transition-colors ${
            isVoiceEnabled
              ? 'bg-emerald-600 text-white border-emerald-600 shadow-xs'
              : 'bg-white text-stone-600 border-stone-200 hover:bg-stone-50'
          }`}
          title="Voice Readout"
        >
          {isVoiceEnabled ? <Volume2 className="w-4 h-4" /> : <VolumeX className="w-4 h-4" />}
          <span className="hidden sm:inline">{isVoiceEnabled ? 'Voice On' : 'Voice Guidance'}</span>
        </button>
      </div>

      {/* Progress Bar */}
      <div className="space-y-1.5">
        <div className="flex items-center justify-between text-xs text-stone-500 font-medium">
          <span>
            {isFinished ? 'Completed!' : `Step ${currentStepIndex + 1} of ${totalSteps}`}
          </span>
          <span className="tabular-nums">
            {Math.round((Math.min(currentStepIndex + 1, totalSteps) / totalSteps) * 100)}% Complete
          </span>
        </div>
        <div className="w-full h-2.5 bg-stone-200 rounded-full overflow-hidden">
          <div
            className="h-full bg-emerald-600 transition-all duration-300 rounded-full"
            style={{
              width: `${(Math.min(currentStepIndex + 1, totalSteps) / totalSteps) * 100}%`,
            }}
          />
        </div>
      </div>

      {/* Main Step Canvas */}
      {!isFinished && currentStep ? (
        <div className="bg-white border border-stone-200/90 rounded-3xl p-6 md:p-12 shadow-sm space-y-8 flex-1 flex flex-col justify-between">
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <span className="inline-flex items-center gap-1.5 text-xs font-bold text-emerald-800 bg-emerald-50 px-3 py-1 rounded-full uppercase tracking-wider">
                <ChefHat className="w-3.5 h-3.5 text-emerald-600" />
                Step {currentStep.number}
              </span>

              <button
                onClick={speakCurrentStep}
                className="text-xs text-stone-500 hover:text-emerald-700 flex items-center gap-1 font-medium"
              >
                <Volume2 className="w-3.5 h-3.5" />
                <span>Repeat step voice</span>
              </button>
            </div>

            {/* Large Typography for Hands-Free Countertop Readability */}
            <p className="font-display text-2xl md:text-3xl lg:text-4xl text-stone-900 leading-snug font-medium">
              {currentStep.step}
            </p>
          </div>

          {/* Interactive Built-In Step Timer (if detected) */}
          {timerSeconds !== null && (
            <div className="p-4 md:p-6 rounded-2xl bg-amber-50/80 border border-amber-200/90 flex flex-wrap items-center justify-between gap-4">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-2xl bg-amber-500 text-white flex items-center justify-center shadow-xs">
                  <TimerIcon className="w-6 h-6" />
                </div>
                <div>
                  <span className="text-[11px] font-semibold text-amber-900 uppercase tracking-wider block">
                    Step Countdown Timer
                  </span>
                  <span className="font-mono text-3xl font-bold text-amber-950 tabular-nums">
                    {formatTimer(timerSeconds)}
                  </span>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => setIsTimerRunning(!isTimerRunning)}
                  className={`min-h-[44px] px-5 rounded-xl font-semibold text-xs flex items-center gap-1.5 text-white transition-all shadow-xs ${
                    isTimerRunning
                      ? 'bg-amber-600 hover:bg-amber-700'
                      : 'bg-emerald-600 hover:bg-emerald-700'
                  }`}
                >
                  {isTimerRunning ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4 fill-white" />}
                  <span>{isTimerRunning ? 'Pause' : timerSeconds === 0 ? 'Restart' : 'Start Timer'}</span>
                </button>

                <button
                  onClick={() => {
                    setIsTimerRunning(false);
                    setTimerSeconds(timerInitialSeconds);
                  }}
                  className="min-h-[44px] px-3 rounded-xl bg-white border border-amber-200 text-stone-700 hover:bg-amber-100/50 text-xs font-semibold"
                  title="Reset Timer"
                >
                  <RotateCcw className="w-4 h-4" />
                </button>
              </div>
            </div>
          )}

          {/* Ask Chef Auguste Context Shortcut */}
          <div className="pt-4 border-t border-stone-100 flex items-center justify-between">
            <span className="text-xs text-stone-500">Unsure about this step's technique or timing?</span>
            <button
              onClick={toggleAiChef}
              className="text-xs font-semibold text-emerald-700 hover:text-emerald-800 flex items-center gap-1 hover:underline"
            >
              <Sparkles className="w-3.5 h-3.5 text-emerald-600" />
              <span>Ask Chef Auguste</span>
            </button>
          </div>
        </div>
      ) : (
        /* Finished Celebration Screen */
        <div className="bg-white border border-stone-200 rounded-3xl p-8 md:p-14 text-center space-y-6 shadow-sm flex-1 flex flex-col justify-center items-center">
          <div className="w-20 h-20 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center animate-bounce">
            <CheckCircle2 className="w-12 h-12" />
          </div>
          <div className="space-y-2 max-w-md">
            <h2 className="font-display text-3xl font-bold text-stone-900">
              Bon Appétit! Dish Completed.
            </h2>
            <p className="text-stone-600 text-sm leading-relaxed">
              You just finished cooking <span className="font-semibold text-stone-900">{cookingRecipe.title}</span>. Enjoy your homemade culinary creation!
            </p>
          </div>
          <div className="flex flex-wrap items-center justify-center gap-3 pt-4">
            <button
              onClick={() => setCurrentStepIndex(0)}
              className="px-5 py-2.5 rounded-xl border border-stone-200 text-stone-700 font-semibold text-xs hover:bg-stone-50"
            >
              Restart Steps
            </button>
            <button
              onClick={exitCooking}
              className="px-6 py-2.5 rounded-xl bg-emerald-600 text-white font-semibold text-xs hover:bg-emerald-700 shadow-sm"
            >
              Back to Recipe Details
            </button>
          </div>
        </div>
      )}

      {/* Bottom Large Touch Controls (>= 48px hitboxes) */}
      {!isFinished && (
        <div className="grid grid-cols-2 gap-4 pt-2">
          <button
            onClick={handlePrev}
            disabled={currentStepIndex === 0}
            className="min-h-[52px] px-6 bg-white border border-stone-300 hover:bg-stone-50 active:bg-stone-100 disabled:opacity-40 text-stone-800 font-semibold text-sm rounded-2xl flex items-center justify-center gap-2 transition-all shadow-2xs"
          >
            <ChevronLeft className="w-5 h-5" />
            <span>Previous Step</span>
          </button>

          <button
            onClick={handleNext}
            className="min-h-[52px] px-6 bg-emerald-600 hover:bg-emerald-700 active:bg-emerald-800 text-white font-semibold text-sm rounded-2xl flex items-center justify-center gap-2 transition-all shadow-md shadow-emerald-600/25 active:scale-98"
          >
            <span>{currentStepIndex === totalSteps - 1 ? 'Finish Cooking!' : 'Next Step'}</span>
            <ChevronRight className="w-5 h-5" />
          </button>
        </div>
      )}
    </div>
  );
};

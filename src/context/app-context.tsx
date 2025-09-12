'use client';
import { createContext, useContext } from 'react';
import type { SharedState, AppError, Journey } from '@/app/state';
import type { AudienceInsightsInput } from '@/ai/flows/generate-audience-insights';
import type { CreateSocialMediaStrategyInput } from '@/ai/flows/create-social-media-strategy';
import type { GenerateViralHooksInput } from '@/ai/flows/generate-viral-hooks';
import type { GenerateContentCaptionsInput } from '@/ai/flows/generate-content-captions';
import type { GenerateContentCalendarInput } from '@/ai/flows/generate-content-calendar';
import type { AutofillAudienceDetailsInput } from '@/ai/flows/autofill-audience-details';
import type { IdentifyTrendingTopicsInput } from '@/ai/flows/identify-trending-topics';
import type { TranslateTextInput, TranslateTextOutput } from '@/ai/schemas/translate-schemas';

export interface JourneyListItem {
  id: string;
  name: string;
  savedAt: string; // ISO string
}

interface AppContextType extends SharedState {
    updateState: (newState: Partial<SharedState>) => void;
    addError: (error: string) => void;
    clearErrors: () => void;
    generateAudienceInsights: (input: AudienceInsightsInput) => Promise<void>;
    autofillAudienceDetails: (input: AutofillAudienceDetailsInput) => Promise<{ brandDetails: string, targetDemographic: string } | null>;
    generateStrategy: (input: CreateSocialMediaStrategyInput) => Promise<void>;
    generateTrends: (input: IdentifyTrendingTopicsInput) => Promise<void>;
    generateViralHooks: (input: GenerateViralHooksInput) => Promise<void>;
    generateContentCaptions: (input: GenerateContentCaptionsInput) => Promise<void>;
    generateContentCalendar: (input: GenerateContentCalendarInput) => Promise<void>;
    translateText: (input: TranslateTextInput) => Promise<TranslateTextOutput | null>;
    saveCurrentJourney: (name: string) => Promise<boolean>;
    saveAsNewJourney: (name: string) => Promise<boolean>;
    loadFullJourney: (journey: Journey, state: SharedState) => void;
}

export const AppContext = createContext<AppContextType | undefined>(undefined);

export function useAppContext() {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useAppContext must be used within an AppProvider');
  }
  return context;
}

'use client';

import { useState, useCallback } from 'react';
import { AppContext } from './app-context';
import type { SharedState, AppError, Journey } from '@/app/state';
import { useToast } from '@/hooks/use-toast';
import { 
  runAudienceInsights, 
  runStrategyAlchemist,
  runViralHookGenerator,
  runContentCrafter,
  runCalendarCreator,
  runAutofillAudienceDetails,
  runTrendTracker,
  saveJourney
} from '@/app/actions';
import type { AudienceInsightsInput } from '@/ai/flows/generate-audience-insights';
import type { CreateSocialMediaStrategyInput } from '@/ai/flows/create-social-media-strategy';
import type { GenerateViralHooksInput } from '@/ai/flows/generate-viral-hooks';
import type { GenerateContentCaptionsInput } from '@/ai/flows/generate-content-captions';
import type { GenerateContentCalendarInput } from '@/ai/flows/generate-content-calendar';
import type { AutofillAudienceDetailsInput } from '@/ai/flows/autofill-audience-details';
import type { IdentifyTrendingTopicsInput } from '@/ai/flows/identify-trending-topics';


const initialState: SharedState = {
  brandDetails: '',
  targetDemographic: '',
  industry: '',
  audienceAnalysisReport: null,
  strategy: null,
  trends: null,
  hooks: null,
  captions: null,
  calendar: null,
  errors: [],
  currentJourney: null,
};

export function AppProvider({ children }: { children: React.ReactNode }) {
  const [state, setState] = useState<SharedState>(initialState);
  const { toast } = useToast();

  const updateState = useCallback((newState: Partial<SharedState>) => {
    setState(prevState => ({ ...prevState, ...newState }));
  }, []);

  const addError = useCallback((error: string) => {
    console.error("Adding error:", error);
    const newError: AppError = {
      message: error,
      timestamp: new Date().toISOString(),
    };
    setState(prevState => ({
      ...prevState,
      errors: [...prevState.errors, newError],
    }));
    toast({
      title: 'An Error Occurred',
      description: error,
      variant: 'destructive',
    });
  }, [toast]);

  const clearErrors = useCallback(() => {
    setState(prevState => ({ ...prevState, errors: [] }));
  }, []);

  const handleAction = useCallback(async <T, U>(action: (input: T) => Promise<{ data?: U; error?: string }>, input: T, successCallback: (data: U) => void) => {
    const { data, error } = await action(input);
    if (error) {
      addError(error);
      return null;
    }
    if (data) {
      successCallback(data);
      return data;
    }
    return null;
  }, [addError]);

  const generateAudienceInsights = useCallback(async (input: AudienceInsightsInput) => {
    await handleAction(runAudienceInsights, input, (data) => {
      updateState({ 
        brandDetails: input.brandDetails, 
        targetDemographic: input.targetDemographic,
        audienceAnalysisReport: data 
      });
    });
  }, [handleAction, updateState]);
  
  const autofillAudienceDetails = useCallback(async (input: AutofillAudienceDetailsInput) => {
    const result = await handleAction(runAutofillAudienceDetails, input, (data) => {
        updateState({ 
            brandDetails: data.brandDetails, 
            targetDemographic: data.targetDemographic, 
            audienceAnalysisReport: null 
        });
    });
    return result ? { brandDetails: result.brandDetails, targetDemographic: result.targetDemographic } : null;
  }, [handleAction, updateState]);

  const generateStrategy = useCallback(async (input: CreateSocialMediaStrategyInput) => {
    await handleAction(runStrategyAlchemist, input, (data) => {
      updateState({ strategy: data });
    });
  }, [handleAction, updateState]);

  const generateTrends = useCallback(async (input: IdentifyTrendingTopicsInput) => {
    await handleAction(runTrendTracker, input, (data) => {
        updateState({ trends: data });
    });
  }, [handleAction, updateState]);

  const generateViralHooks = useCallback(async (input: GenerateViralHooksInput) => {
    await handleAction(runViralHookGenerator, input, (data) => {
        updateState({ hooks: data });
    });
  }, [handleAction, updateState]);

  const generateContentCaptions = useCallback(async (input: GenerateContentCaptionsInput) => {
    await handleAction(runContentCrafter, input, (data) => {
        updateState({ captions: data });
    });
  }, [handleAction, updateState]);

  const generateContentCalendar = useCallback(async (input: GenerateContentCalendarInput) => {
    await handleAction(runCalendarCreator, input, (data) => {
        updateState({ calendar: data });
    });
  }, [handleAction, updateState]);

  const saveCurrentJourney = useCallback(async (name: string) => {
    const { data, error } = await saveJourney(state, name, state.currentJourney?.id);
    if (error) {
      addError(error);
      return false;
    }
    if (data) {
      updateState({ currentJourney: { id: data.id, name } });
      return true;
    }
    return false;
  }, [state, addError, updateState]);

  const saveAsNewJourney = useCallback(async (name: string) => {
    const { data, error } = await saveJourney(state, name); // No ID forces a new document
    if (error) {
      addError(error);
      return false;
    }
    if (data) {
      updateState({ currentJourney: { id: data.id, name } });
      return true;
    }
    return false;
  }, [state, addError, updateState]);

  const loadFullJourney = useCallback((journey: Journey, loadedState: SharedState) => {
    updateState({ ...loadedState, currentJourney: journey, errors: [] });
  }, [updateState]);

  const value = {
    ...state,
    updateState,
    addError,
    clearErrors,
    generateAudienceInsights,
    autofillAudienceDetails,
    generateStrategy,
    generateTrends,
generateViralHooks,
    generateContentCaptions,
    generateContentCalendar,
    saveCurrentJourney,
    saveAsNewJourney,
    loadFullJourney,
  };

  return (
    <AppContext.Provider value={value}>
      {children}
    </AppContext.Provider>
  );
}

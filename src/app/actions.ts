'use server';

import { generateAudienceInsights, AudienceInsightsInput } from '@/ai/flows/generate-audience-insights';
import { createSocialMediaStrategy, CreateSocialMediaStrategyInput } from '@/ai/flows/create-social-media-strategy';
import { generateViralHooks, GenerateViralHooksInput } from '@/ai/flows/generate-viral-hooks';
import { generateContentCaptions, GenerateContentCaptionsInput } from '@/ai/flows/generate-content-captions';
import { generateContentCalendar, GenerateContentCalendarInput } from '@/ai/flows/generate-content-calendar';
import { autofillAudienceDetails, type AutofillAudienceDetailsInput } from '@/ai/flows/autofill-audience-details';
import { identifyTrendingTopics, type IdentifyTrendingTopicsInput } from '@/ai/flows/identify-trending-topics';
import { getJourneys as getJourneysFromDb, getJourney as getJourneyFromDb, saveJourney as saveJourneyToDb } from './firestore-actions';
import type { SharedState } from './state';


const handleError = (error: unknown) => {
  console.error(error);
  const message = error instanceof Error ? error.message : 'An unknown error occurred.';
  return { error: message };
};

export async function runAudienceInsights(input: AudienceInsightsInput) {
  try {
    const result = await generateAudienceInsights(input);
    return { data: result };
  } catch (error) {
    return handleError(error);
  }
}

export async function runStrategyAlchemist(input: CreateSocialMediaStrategyInput) {
  try {
    const result = await createSocialMediaStrategy(input);
    return { data: result };
  } catch (error) {
    return handleError(error);
  }
}

export async function runViralHookGenerator(input: GenerateViralHooksInput) {
  try {
    const result = await generateViralHooks(input);
    return { data: result };
  } catch (error) {
    return handleError(error);
  }
}

export async function runContentCrafter(input: GenerateContentCaptionsInput) {
  try {
    const result = await generateContentCaptions(input);
    return { data: result };
  } catch (error) {
    return handleError(error);
  }
}

export async function runCalendarCreator(input: GenerateContentCalendarInput) {
  try {
    const result = await generateContentCalendar(input);
    return { data: result };
  } catch (error) {
    return handleError(error);
  }
}

export async function runAutofillAudienceDetails(input: AutofillAudienceDetailsInput) {
  try {
    const result = await autofillAudienceDetails(input);
    return { data: result };
  } catch (error) {
    return handleError(error);
  }
}

export async function runTrendTracker(input: IdentifyTrendingTopicsInput) {
    try {
        const result = await identifyTrendingTopics(input);
        return { data: result };
    } catch (error) {
        return handleError(error);
    }
}

export async function getJourneys() {
  try {
    const journeys = await getJourneysFromDb();
    return { data: journeys };
  } catch (error) {
    return handleError(error);
  }
}

export async function loadJourney(id: string) {
  try {
    const journey = await getJourneyFromDb(id);
    return { data: journey };
  } catch (error) {
    return handleError(error);
  }
}

export async function saveJourney(journey: SharedState, name: string, id?: string) {
  try {
    const journeyId = await saveJourneyToDb(journey, name, id);
    return { data: { id: journeyId } };
  } catch (error) {
    return handleError(error);
  }
}
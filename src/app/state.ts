import type { AudienceInsightsOutput } from '@/ai/flows/generate-audience-insights';
import type { CreateSocialMediaStrategyOutput } from "@/ai/flows/create-social-media-strategy";
import type { IdentifyTrendingTopicsOutput } from '@/ai/flows/identify-trending-topics';
import type { GenerateViralHooksOutput } from "@/ai/flows/generate-viral-hooks";
import type { GenerateContentCaptionsOutput } from "@/ai/flows/generate-content-captions";
import type { GenerateContentCalendarOutput } from "@/ai/flows/generate-content-calendar";

export interface AppError {
  message: string;
  timestamp: string;
}

export interface Journey {
  id: string;
  name: string;
}

export interface SharedState {
  brandDetails: string;
  targetDemographic: string;
  industry: string;
  audienceAnalysisReport: AudienceInsightsOutput | null;
  strategy: CreateSocialMediaStrategyOutput | null;
  trends: IdentifyTrendingTopicsOutput | null;
  hooks: GenerateViralHooksOutput | null;
  captions: GenerateContentCaptionsOutput | null;
  calendar: GenerateContentCalendarOutput | null;
  errors: AppError[];
  currentJourney: Journey | null;
}

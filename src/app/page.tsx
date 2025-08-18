'use client';

import { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import Header from "@/components/layout/header";
import { 
  Users, 
  FlaskConical, 
  Flame, 
  PenSquare, 
  CalendarDays 
} from "lucide-react";
import AudienceInsights from "@/components/features/audience-insights";
import StrategyAlchemist from "@/components/features/strategy-alchemist";
import ViralHookGenerator from "@/components/features/viral-hook-generator";
import ContentCrafter from "@/components/features/content-crafter";
import CalendarCreator from "@/components/features/calendar-creator";
import type { AudienceInsightsOutput } from '@/ai/flows/generate-audience-insights';
import type { CreateSocialMediaStrategyOutput } from "@/ai/flows/create-social-media-strategy";
import type { GenerateViralHooksOutput } from "@/ai/flows/generate-viral-hooks";
import type { GenerateContentCaptionsOutput } from "@/ai/flows/generate-content-captions";
import type { GenerateContentCalendarOutput } from "@/ai/flows/generate-content-calendar";

export interface SharedState {
  brandDetails: string;
  targetDemographic: string;
  audienceAnalysisReport: AudienceInsightsOutput | null;
  strategy: CreateSocialMediaStrategyOutput | null;
  hooks: GenerateViralHooksOutput | null;
  captions: GenerateContentCaptionsOutput | null;
  calendar: GenerateContentCalendarOutput | null;
}

export default function Home() {
  const [sharedState, setSharedState] = useState<SharedState>({
    brandDetails: '',
    targetDemographic: '',
    audienceAnalysisReport: null,
    strategy: null,
    hooks: null,
    captions: null,
    calendar: null,
  });
  
  const handleStateUpdate = (newState: Partial<SharedState>) => {
    setSharedState(prevState => ({ ...prevState, ...newState }));
  };

  return (
    <div className="min-h-screen bg-background text-foreground">
      <Header />
      <main className="container mx-auto px-4 py-8">
        <Tabs defaultValue="audience" className="w-full">
          <TabsList className="grid w-full grid-cols-2 md:grid-cols-3 lg:grid-cols-5 h-auto">
            <TabsTrigger value="audience" className="flex-col sm:flex-row gap-2 py-2">
              <Users className="h-5 w-5" />
              <span className="font-semibold">Audience</span>
            </TabsTrigger>
            <TabsTrigger value="strategy" className="flex-col sm:flex-row gap-2 py-2">
              <FlaskConical className="h-5 w-5" />
              <span className="font-semibold">Strategy</span>
            </TabsTrigger>
            <TabsTrigger value="hooks" className="flex-col sm:flex-row gap-2 py-2">
              <Flame className="h-5 w-5" />
              <span className="font-semibold">Hooks</span>
            </TabsTrigger>
            <TabsTrigger value="content" className="flex-col sm:flex-row gap-2 py-2">
              <PenSquare className="h-5 w-5" />
              <span className="font-semibold">Content</span>
            </TabsTrigger>
            <TabsTrigger value="calendar" className="flex-col sm:flex-row gap-2 py-2">
              <CalendarDays className="h-5 w-5" />
              <span className="font-semibold">Calendar</span>
            </TabsTrigger>
          </TabsList>
          
          <TabsContent value="audience" className="mt-6">
            <AudienceInsights 
              sharedState={sharedState}
              onUpdate={handleStateUpdate}
            />
          </TabsContent>
          <TabsContent value="strategy" className="mt-6">
            <StrategyAlchemist 
               sharedState={sharedState}
               onUpdate={handleStateUpdate}
            />
          </TabsContent>
          <TabsContent value="hooks" className="mt-6">
            <ViralHookGenerator 
              sharedState={sharedState}
              onUpdate={handleStateUpdate}
            />
          </TabsContent>
          <TabsContent value="content" className="mt-6">
            <ContentCrafter 
               sharedState={sharedState}
               onUpdate={handleStateUpdate}
            />
          </TabsContent>
          <TabsContent value="calendar" className="mt-6">
            <CalendarCreator 
              sharedState={sharedState}
              onUpdate={handleStateUpdate}
            />
          </TabsContent>
        </Tabs>
      </main>
    </div>
  );
}

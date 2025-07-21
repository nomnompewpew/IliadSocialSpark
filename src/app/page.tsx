'use client';

import { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import Header from "@/components/layout/header";
import { 
  Users, 
  FlaskConical, 
  TrendingUp, 
  Flame, 
  PenSquare, 
  CalendarDays 
} from "lucide-react";
import AudienceInsights from "@/components/features/audience-insights";
import StrategyAlchemist from "@/components/features/strategy-alchemist";
import TrendTracker from "@/components/features/trend-tracker";
import ViralHookGenerator from "@/components/features/viral-hook-generator";
import ContentCrafter from "@/components/features/content-crafter";
import CalendarCreator from "@/components/features/calendar-creator";
import type { AudienceInsightsOutput } from '@/ai/flows/generate-audience-insights';

export interface SharedState {
  brandDetails: string;
  targetDemographic: string;
  audienceAnalysisReport: AudienceInsightsOutput | null;
}

export default function Home() {
  const [sharedState, setSharedState] = useState<SharedState>({
    brandDetails: '',
    targetDemographic: '',
    audienceAnalysisReport: null,
  });
  
  const handleAudienceInsightsUpdate = (newState: Partial<SharedState>) => {
    setSharedState(prevState => ({ ...prevState, ...newState }));
  };

  return (
    <div className="min-h-screen bg-background text-foreground">
      <Header />
      <main className="container mx-auto px-4 py-8">
        <Tabs defaultValue="audience" className="w-full">
          <TabsList className="grid w-full grid-cols-2 md:grid-cols-3 lg:grid-cols-6 h-auto">
            <TabsTrigger value="audience" className="flex-col sm:flex-row gap-2 py-2">
              <Users className="h-5 w-5" />
              <span className="font-semibold">Audience</span>
            </TabsTrigger>
            <TabsTrigger value="strategy" className="flex-col sm:flex-row gap-2 py-2">
              <FlaskConical className="h-5 w-5" />
              <span className="font-semibold">Strategy</span>
            </TabsTrigger>
            <TabsTrigger value="trends" className="flex-col sm:flex-row gap-2 py-2">
              <TrendingUp className="h-5 w-5" />
              <span className="font-semibold">Trends</span>
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
              onUpdate={handleAudienceInsightsUpdate}
            />
          </TabsContent>
          <TabsContent value="strategy" className="mt-6">
            <StrategyAlchemist 
               brandDescription={sharedState.brandDetails}
               targetAudience={sharedState.targetDemographic}
            />
          </TabsContent>
          <TabsContent value="trends" className="mt-6">
            <TrendTracker />
          </TabsContent>
          <TabsContent value="hooks" className="mt-6">
            <ViralHookGenerator 
              audiencePsychology={sharedState.targetDemographic}
            />
          </TabsContent>
          <TabsContent value="content" className="mt-6">
            <ContentCrafter 
               brandDescription={sharedState.brandDetails}
            />
          </TabsContent>
          <TabsContent value="calendar" className="mt-6">
            <CalendarCreator 
              brandDescription={sharedState.brandDetails}
              targetAudience={sharedState.targetDemographic}
            />
          </TabsContent>
        </Tabs>
      </main>
    </div>
  );
}

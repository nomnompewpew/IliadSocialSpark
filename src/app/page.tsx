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
import type { SharedState } from "@/app/state";
import TrendTracker from "@/components/features/trend-tracker";
import { TrendingUp } from "lucide-react";

export type Journey = {
  id: string;
  name: string;
};

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
};

export default function Home() {
  const [sharedState, setSharedState] = useState<SharedState>(initialState);
  const [currentJourney, setCurrentJourney] = useState<Journey | null>(null);
  
  const handleStateUpdate = (newState: Partial<SharedState>) => {
    setSharedState(prevState => ({ ...prevState, ...newState }));
  };

  const handleLoadJourney = (journey: Journey, data: SharedState) => {
    setCurrentJourney(journey);
    setSharedState(data);
  }

  const handleSaveJourney = (journey: Journey) => {
    setCurrentJourney(journey);
  }

  return (
    <div className="flex flex-col min-h-screen bg-background text-foreground">
      <Header 
        sharedState={sharedState}
        currentJourney={currentJourney}
        onLoadJourney={handleLoadJourney}
        onSaveJourney={handleSaveJourney}
      />
      <main className="flex-grow container mx-auto px-4 py-8">
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
              onUpdate={handleStateUpdate}
            />
          </TabsContent>
          <TabsContent value="strategy" className="mt-6">
            <StrategyAlchemist 
               sharedState={sharedState}
               onUpdate={handleStateUpdate}
            />
          </TabsContent>
          <TabsContent value="trends" className="mt-6">
            <TrendTracker 
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
      <footer className="py-4 border-t border-border/40">
        <div className="container mx-auto text-center text-sm text-muted-foreground">
          &copy; {new Date().getFullYear()} The Calton Group. All rights reserved.
        </div>
      </footer>
    </div>
  );
}
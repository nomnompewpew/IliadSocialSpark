'use client';

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import Header from "@/components/layout/header";
import { 
  Users, 
  FlaskConical,
  Flame, 
  PenSquare, 
  CalendarDays,
  TrendingUp
} from "lucide-react";
import AudienceInsights from "@/components/features/audience-insights";
import StrategyAlchemist from "@/components/features/strategy-alchemist";
import ViralHookGenerator from "@/components/features/viral-hook-generator";
import ContentCrafter from "@/components/features/content-crafter";
import CalendarCreator from "@/components/features/calendar-creator";
import TrendTracker from "@/components/features/trend-tracker";
import { useAuth } from "@/context/auth-context";

export default function Home() {
  const { user, loading, isTeamMember } = useAuth();

  // The AuthProvider now handles the main loading and redirect logic.
  // This check is a safeguard to prevent content flashing for non-team members
  // before the AuthProvider's final state is resolved.
  if (loading || !user || !isTeamMember) {
    return null; 
  }

  return (
      <div className="flex flex-col min-h-screen bg-background text-foreground">
        <Header />
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
              <TabsTrigger value="trends" className="flex-col sm-flex-row gap-2 py-2">
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
              <AudienceInsights />
            </TabsContent>
            <TabsContent value="strategy" className="mt-6">
              <StrategyAlchemist />
            </TabsContent>
            <TabsContent value="trends" className="mt-6">
              <TrendTracker />
            </TabsContent>
            <TabsContent value="hooks" className="mt-6">
              <ViralHookGenerator />
            </TabsContent>
            <TabsContent value="content" className="mt-6">
              <ContentCrafter />
            </TabsContent>
            <TabsContent value="calendar" className="mt-6">
              <CalendarCreator />
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
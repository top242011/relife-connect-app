'use client';

import { summarizeParliamentaryMinutes, SummarizeParliamentaryMinutesOutput } from '@/ai/flows/summarize-parliamentary-minutes';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Textarea } from '@/components/ui/textarea';
import { Loader2 } from 'lucide-react';
import React, { useState, useTransition } from 'react';
import { Badge } from '../ui/badge';
import { useToast } from '@/hooks/use-toast';

export function MinutesRepository() {
  const [minutesText, setMinutesText] = useState('');
  const [result, setResult] = useState<SummarizeParliamentaryMinutesOutput | null>(null);
  const [isPending, startTransition] = useTransition();
  const { toast } = useToast();

  const handleAnalyze = () => {
    if (!minutesText.trim()) {
      toast({
        title: "Input Required",
        description: "Please paste the meeting minutes before analyzing.",
        variant: "destructive",
      });
      return;
    }
    startTransition(async () => {
      try {
        const res = await summarizeParliamentaryMinutes({ minutes: minutesText });
        setResult(res);
      } catch (error) {
        console.error("Error summarizing minutes:", error);
        toast({
            title: "Analysis Failed",
            description: "An error occurred while analyzing the minutes. Please try again.",
            variant: "destructive",
        });
      }
    });
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Analyze Meeting Minutes</CardTitle>
        <CardDescription>
          Paste minutes below to use AI to generate a summary, identify key topics, decisions, and suggest tags.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <Textarea
          placeholder="Paste your meeting minutes here..."
          className="min-h-[200px] text-base"
          value={minutesText}
          onChange={(e) => setMinutesText(e.target.value)}
        />
        <Button onClick={handleAnalyze} disabled={isPending}>
          {isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
          Analyze Minutes
        </Button>

        {isPending && (
          <div className="flex items-center justify-center rounded-lg border p-8">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
            <p className="ml-4 text-muted-foreground">AI is analyzing the text...</p>
          </div>
        )}

        {result && (
          <div className="space-y-6 pt-4">
            <Card>
                <CardHeader>
                    <CardTitle>AI Analysis Results</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                    <div>
                        <h3 className="font-semibold mb-2">Summary</h3>
                        <p className="text-muted-foreground">{result.summary}</p>
                    </div>
                     <div>
                        <h3 className="font-semibold mb-2">Key Decisions</h3>
                        <ul className="list-disc list-inside text-muted-foreground space-y-1">
                            {result.decisions.map((decision, index) => <li key={index}>{decision}</li>)}
                        </ul>
                    </div>
                    <div>
                        <h3 className="font-semibold mb-2">Topics Discussed</h3>
                        <div className="flex flex-wrap gap-2">
                            {result.topics.map((topic, index) => <Badge variant="secondary" key={index}>{topic}</Badge>)}
                        </div>
                    </div>
                    <div>
                        <h3 className="font-semibold mb-2">Suggested Tags</h3>
                         <div className="flex flex-wrap gap-2">
                            {result.tags.map((tag, index) => <Badge variant="outline" key={index}>{tag}</Badge>)}
                        </div>
                    </div>
                </CardContent>
            </Card>
          </div>
        )}
      </CardContent>
    </Card>
  );
}

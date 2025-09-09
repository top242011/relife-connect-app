'use client';

import { suggestMeetingTopics, SuggestMeetingTopicsOutput } from '@/ai/flows/suggest-meeting-topics';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/hooks/use-toast';
import { Loader2, Wand2 } from 'lucide-react';
import React, { useState, useTransition } from 'react';
import { Badge } from '../ui/badge';

export function MinutesRepository() {
  const [minutes, setMinutes] = useState('');
  const [result, setResult] = useState<SuggestMeetingTopicsOutput | null>(null);
  const [isPending, startTransition] = useTransition();
  const { toast } = useToast();

  const handleAnalysis = () => {
    if (!minutes.trim()) {
      toast({
        title: 'Minutes Required',
        description: 'Please paste the meeting minutes to analyze.',
        variant: 'destructive',
      });
      return;
    }
    startTransition(async () => {
      setResult(null);
      try {
        const res = await suggestMeetingTopics({ minutes });
        setResult(res);
      } catch (error) {
        console.error('Error analyzing minutes:', error);
        toast({
          title: 'Analysis Failed',
          description: 'An error occurred while analyzing the minutes.',
          variant: 'destructive',
        });
      }
    });
  };

  return (
    <div className="grid gap-6 lg:grid-cols-2">
      <Card>
        <CardHeader>
          <CardTitle>AI Minutes Analyzer</CardTitle>
          <CardDescription>
            Paste your meeting minutes below and let AI summarize, tag, and
            extract key decisions.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid w-full gap-2">
            <Label htmlFor="minutes-text">Meeting Minutes</Label>
            <Textarea
              id="minutes-text"
              placeholder="Paste your meeting minutes here..."
              rows={15}
              value={minutes}
              onChange={(e) => setMinutes(e.target.value)}
            />
          </div>
        </CardContent>
        <CardFooter>
          <Button onClick={handleAnalysis} disabled={isPending}>
            {isPending ? (
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            ) : (
              <Wand2 className="mr-2 h-4 w-4" />
            )}
            Analyze Minutes
          </Button>
        </CardFooter>
      </Card>
      <Card>
        <CardHeader>
          <CardTitle>Analysis Results</CardTitle>
          <CardDescription>
            Review the summary, tags, and decisions extracted by AI.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {isPending && (
            <div className="flex items-center justify-center rounded-lg border-2 border-dashed p-12 text-center">
              <Loader2 className="h-8 w-8 animate-spin text-primary" />
              <p className="ml-4 text-muted-foreground">AI is analyzing...</p>
            </div>
          )}
           {!isPending && !result && (
                <div className="flex flex-col items-center justify-center rounded-lg border-2 border-dashed p-12 text-center">
                    <Wand2 className="mx-auto h-12 w-12 text-muted-foreground" />
                    <h3 className="mt-4 text-lg font-semibold">Awaiting Analysis</h3>
                    <p className="mt-2 text-sm text-muted-foreground">
                        Results will appear here once you analyze the minutes.
                    </p>
                </div>
            )}
          {result && (
            <div className='space-y-4'>
              <div>
                <h3 className="font-semibold mb-2">Summary</h3>
                <p className="text-sm text-muted-foreground bg-secondary p-3 rounded-md">
                  {result.summary}
                </p>
              </div>
              <div>
                <h3 className="font-semibold mb-2">Suggested Tags</h3>
                <div className="flex flex-wrap gap-2">
                  {result.suggestedTags.map((tag, index) => (
                    <Badge key={index}>{tag}</Badge>
                  ))}
                </div>
              </div>
              <div>
                <h3 className="font-semibold mb-2">Key Decisions</h3>
                <ul className="list-disc list-inside space-y-1 text-sm text-muted-foreground">
                  {result.keyDecisions.map((decision, index) => (
                    <li key={index}>{decision}</li>
                  ))}
                </ul>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
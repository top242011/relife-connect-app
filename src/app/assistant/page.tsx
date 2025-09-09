'use client';

import { findRelevantParliamentaryData, FindRelevantParliamentaryDataOutput } from '@/ai/flows/find-relevant-parliamentary-data';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { useToast } from '@/hooks/use-toast';
import { Bot, Loader2, Search } from 'lucide-react';
import React, { useState, useTransition } from 'react';

export default function AssistantPage() {
  const [query, setQuery] = useState('');
  const [result, setResult] = useState<FindRelevantParliamentaryDataOutput | null>(null);
  const [isPending, startTransition] = useTransition();
  const { toast } = useToast();

  const handleSearch = () => {
    if (!query.trim()) {
        toast({
            title: "Query Required",
            description: "Please enter a search query.",
            variant: "destructive",
        });
        return;
    }
    startTransition(async () => {
        setResult(null);
      try {
        const res = await findRelevantParliamentaryData({ query });
        setResult(res);
      } catch (error) {
        console.error("Error fetching parliamentary data:", error);
        toast({
            title: "Search Failed",
            description: "An error occurred while fetching data. Please try again.",
            variant: "destructive",
        });
      }
    });
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Parliamentary Data Assistant</h1>
        <p className="text-muted-foreground">
          Use AI to find relevant snippets and keywords from parliamentary transcripts and reports.
        </p>
      </div>

      <div className="flex w-full items-center space-x-2">
        <Input
          type="text"
          placeholder="Search for topics, legislation, or MPs..."
          className="text-base"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
        />
        <Button type="submit" onClick={handleSearch} disabled={isPending}>
          {isPending ? (
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
          ) : (
            <Search className="mr-2 h-4 w-4" />
          )}
          Search
        </Button>
      </div>

      {isPending && (
          <div className="flex items-center justify-center rounded-lg border p-8">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
            <p className="ml-4 text-muted-foreground">AI is searching parliamentary records...</p>
          </div>
      )}

      {!isPending && !result && (
        <div className="flex flex-col items-center justify-center rounded-lg border-2 border-dashed p-12 text-center">
            <Bot className="mx-auto h-12 w-12 text-muted-foreground" />
            <h3 className="mt-4 text-lg font-semibold">Ready to Assist</h3>
            <p className="mt-2 text-sm text-muted-foreground">
                Enter a query above to start your search.
            </p>
        </div>
      )}

      {result && (
        <Card>
            <CardHeader>
                <CardTitle>Search Results for "{query}"</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
                <div>
                    <h3 className="font-semibold mb-2">Keywords</h3>
                    <div className="flex flex-wrap gap-2">
                        {result.keywords.map((keyword, index) => (
                            <Badge key={index} variant="default" style={{backgroundColor: 'hsl(var(--accent))', color: 'hsl(var(--accent-foreground))'}}>{keyword}</Badge>
                        ))}
                    </div>
                </div>
                 <div>
                    <h3 className="font-semibold mb-2">Relevant Snippets</h3>
                    <Accordion type="single" collapsible className="w-full">
                        {result.snippets.map((snippet, index) => (
                            <AccordionItem value={`item-${index}`} key={index}>
                                <AccordionTrigger>Snippet {index + 1}</AccordionTrigger>
                                <AccordionContent>
                                    <blockquote className="border-l-2 pl-4 italic text-muted-foreground">
                                        {snippet}
                                    </blockquote>
                                </AccordionContent>
                            </AccordionItem>
                        ))}
                    </Accordion>
                </div>
            </CardContent>
        </Card>
      )}
    </div>
  );
}

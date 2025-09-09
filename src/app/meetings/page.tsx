import { MeetingScheduler } from "@/components/meetings/meeting-scheduler";
import { MinutesRepository } from "@/components/meetings/minutes-repository";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import Link from "next/link";
import { PlusCircle } from 'lucide-react';

export default function MeetingsPage() {
    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight">Meetings & Minutes</h1>
                    <p className="text-muted-foreground">
                        Schedule party meetings, manage records, and analyze minutes.
                    </p>
                </div>
                 <Button asChild>
                    <Link href="/meetings/manage">
                        <PlusCircle className="mr-2 h-4 w-4" />
                        Manage Meetings
                    </Link>
                </Button>
            </div>
            <Tabs defaultValue="repository" className="w-full">
                <TabsList className="grid w-full grid-cols-2 max-w-md">
                    <TabsTrigger value="repository">AI Minutes Analyzer</TabsTrigger>
                    <TabsTrigger value="scheduler">Schedule Meeting</TabsTrigger>
                </TabsList>
                <TabsContent value="repository">
                    <MinutesRepository />
                </TabsContent>
                <TabsContent value="scheduler">
                    <MeetingScheduler />
                </TabsContent>
            </Tabs>
        </div>
    )
}

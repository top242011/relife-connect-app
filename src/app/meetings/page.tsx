import { MeetingScheduler } from "@/components/meetings/meeting-scheduler";
import { MinutesRepository } from "@/components/meetings/minutes-repository";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

export default function MeetingsPage() {
    return (
        <div className="space-y-6">
            <div>
                <h1 className="text-3xl font-bold tracking-tight">Meetings & Minutes</h1>
                <p className="text-muted-foreground">
                    Schedule party meetings and manage parliamentary and internal minutes.
                </p>
            </div>
            <Tabs defaultValue="repository" className="w-full">
                <TabsList className="grid w-full grid-cols-2 max-w-md">
                    <TabsTrigger value="repository">Minutes Repository</TabsTrigger>
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

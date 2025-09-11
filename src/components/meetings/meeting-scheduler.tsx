'use client'

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "../ui/button";
import { PlusCircle } from "lucide-react";
import { NewMeetingForm } from "./new-meeting-form";
import { useLanguage } from "@/hooks/use-language";


export function MeetingScheduler() {
    const { t } = useLanguage();
    return (
        <Card>
            <CardHeader>
                <CardTitle>{t('schedule_new_meeting_title')}</CardTitle>
                <CardDescription>{t('schedule_new_meeting_subtitle')}</CardDescription>
            </CardHeader>
            <CardContent>
                <NewMeetingForm>
                    <Button>
                        <PlusCircle className="mr-2 h-4 w-4" />
                        {t('create_new_meeting_button')}
                    </Button>
                </NewMeetingForm>
            </CardContent>
        </Card>
    )
}

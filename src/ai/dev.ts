import { config } from 'dotenv';
config();

import '@/ai/flows/find-relevant-parliamentary-data.ts';
import '@/ai/flows/summarize-parliamentary-minutes.ts';
import '@/ai/flows/suggest-meeting-topics.ts';
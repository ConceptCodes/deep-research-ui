import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import useStore, { type Event } from "@/hooks/use-store";
import { useEffect, useRef, useState } from "react";
import { ScrollArea } from "./ui/scroll-area";

type EventLogProps = {
  projectId: number;
};

export function EventLog({ projectId }: EventLogProps) {
  const { getEventLog } = useStore();
  const [events, setEvents] = useState<Event[]>([]);

  const eventsEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    eventsEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [events]);

  useEffect(() => {
    const interval = setInterval(() => {
      const newEvents = getEventLog(projectId);
      if (newEvents.length > events.length) {
        setEvents(newEvents);
      }
    }, 1000);
    return () => clearInterval(interval);
  }, [events, getEventLog, projectId]);

  if (events.length === 0) {
    return (
      <div className="mt-4 rounded-md bg-muted p-4">
        <p className="text-sm">
          No events to display yet.
        </p>
      </div>
    );
  }

  return (
    <div>
      <h1 className="mb-4 text-lg font-semibold">Event Log</h1>
      <ScrollArea className="h-[500px] w-full">
        <Accordion type="single" collapsible className="w-full">
          {events.map((event, i) => {
            const { title, content } = event;
            return (
              <AccordionItem value={`item-${i}`} key={i}>
                <AccordionTrigger className="font-semibold">
                  {title}
                </AccordionTrigger>
                <AccordionContent>
                  <pre className="text-wrap overflow-hidden">{content}</pre>
                </AccordionContent>
              </AccordionItem>
            );
          })}
          <div ref={eventsEndRef} />
        </Accordion>
      </ScrollArea>
    </div>
  );
}

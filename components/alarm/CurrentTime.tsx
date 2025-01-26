"use client";

import { Card } from "@/components/ui/card";
import { CurrentTimeProps } from "@/types/types";
import { format } from "date-fns";

export function CurrentTime({ currentTime }: CurrentTimeProps) {
  return (
    <Card className="p-8 text-center backdrop-blur-sm bg-card/50">
      <div className="space-y-4">
        <div className="flex flex-col items-center justify-center">
          <h1 className="text-7xl md:text-9xl font-bold tracking-tighter">
            {format(currentTime, "HH:mm")}
          </h1>
          <p className="text-2xl md:text-4xl text-muted-foreground">
            {format(currentTime, "ss")}
          </p>
        </div>
        <p className="text-lg text-muted-foreground">
          {format(currentTime, "EEEE, MMMM do, yyyy")}
        </p>
      </div>
    </Card>
  );
}

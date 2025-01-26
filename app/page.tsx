"use client";

import { useState, useEffect } from "react";
import { Card } from "@/components/ui/card";
import { ThemeToggle } from "@/components/theme/theme-toggle";
import { AlarmForm } from "@/components/alarm/AlarmForm";
import { AlarmList } from "@/components/alarm/AlarmList";
import { AlarmDialog } from "@/components/alarm/AlarmDialog";
import { CurrentTime } from "@/components/alarm/CurrentTime";
import { useAlarm } from "@/contexts/AlarmContext";
import { AddAlarmDialog } from "@/components/alarm/AddAlarmDialog";

export default function AlarmClock() {
  const [currentTime, setCurrentTime] = useState(new Date());
  const { alarms, openAlarmDialog } = useAlarm();

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    const now = currentTime.toTimeString().substring(0, 5);
    const today = ["SUN", "MON", "TUE", "WED", "THU", "FRI", "SAT"][
      currentTime.getDay()
    ];

    alarms.forEach((alarm) => {
      if (
        alarm.isActive &&
        alarm.time === now &&
        (alarm.days.length === 0 || alarm.days.includes(today))
      ) {
        if (alarm.snoozeCount < 3) {
          openAlarmDialog(alarm);
        }
      }
    });
  }, [currentTime, alarms, openAlarmDialog]);

  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-muted p-4">
      <Card className="fixed bottom-10 left-10">
        <ThemeToggle />
      </Card>
      <div className="container mx-auto max-w-4xl">
        <main className="space-y-8 py-8">
          <CurrentTime currentTime={currentTime} />
          <div className="grid gap-6">
            <Card className="p-6 backdrop-blur-sm bg-card/50">
              <AlarmList />
            </Card>
          </div>
        </main>
      </div>
      <AlarmDialog />
      <div className="fixed bottom-10 right-10">
        <AddAlarmDialog />
      </div>
    </div>
  );
}

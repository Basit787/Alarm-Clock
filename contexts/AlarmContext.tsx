"use client";

import { useToast } from "@/hooks/use-toast";
import { Alarm, AlarmContextType } from "@/types/types";
import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useRef,
  useState,
} from "react";

const AlarmContext = createContext<AlarmContextType | undefined>(undefined);

export function AlarmProvider({ children }: { children: React.ReactNode }) {
  const [dialogOpen, setDialogOpen] = useState(false);
  const [activeAlarm, setActiveAlarm] = useState<Alarm | null>(null);
  const [alarms, setAlarms] = useState<Alarm[]>([]);
  const { toast } = useToast();
  const audioRef = useRef<HTMLAudioElement | null>(null);

  useEffect(() => {
    audioRef.current = new Audio("/alarm-sound.mp3");
    audioRef.current.loop = true;

    return () => {
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current = null;
      }
    };
  }, []);

  const playAlarmSound = useCallback(() => {
    if (audioRef.current) {
      // Set volume to maximum and play
      audioRef.current.volume = 1;
      audioRef.current.play().catch((error) => {
        console.error("Error playing alarm sound:", error);
      });
    }
  }, []);

  const stopAlarmSound = useCallback(() => {
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current.currentTime = 0;
    }
  }, []);

  const openAlarmDialog = useCallback(
    (alarm: Alarm) => {
      setActiveAlarm(alarm);
      setDialogOpen(true);
      playAlarmSound();
    },
    [playAlarmSound]
  );

  const closeAlarmDialog = useCallback(() => {
    setDialogOpen(false);
    setActiveAlarm(null);
    stopAlarmSound();
  }, [stopAlarmSound]);

  const handleSnooze = useCallback(() => {
    if (activeAlarm) {
      const snoozeTime = new Date();
      snoozeTime.setMinutes(snoozeTime.getMinutes() + 5);
      const newTime = snoozeTime.toTimeString().substring(0, 5);

      setAlarms((prevAlarms) =>
        prevAlarms.map((alarm) =>
          alarm.id === activeAlarm.id
            ? {
                ...alarm,
                time: newTime,
                snoozeCount: alarm.snoozeCount + 1,
              }
            : alarm
        )
      );
      closeAlarmDialog();
      toast({
        title: "Alarm snoozed",
        description: "Alarm will ring again in 5 minutes",
      });
    }
  }, [activeAlarm, closeAlarmDialog, toast]);

  const handleDeleteAlarm = useCallback(
    (id: number) => {
      setAlarms((prevAlarms) => prevAlarms.filter((alarm) => alarm.id !== id));
      toast({
        title: "Alarm deleted",
        variant: "destructive",
      });
    },
    [toast]
  );

  const value = {
    dialogOpen,
    activeAlarm,
    openAlarmDialog,
    closeAlarmDialog,
    handleSnooze,
    handleDeleteAlarm,
    alarms,
    setAlarms,
    playAlarmSound,
    stopAlarmSound,
  };

  return (
    <AlarmContext.Provider value={value}>{children}</AlarmContext.Provider>
  );
}

export function useAlarm() {
  const context = useContext(AlarmContext);
  if (context === undefined) {
    throw new Error("useAlarm must be used within an AlarmProvider");
  }
  return context;
}

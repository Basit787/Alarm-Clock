"use client";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Bell } from "lucide-react";
import { motion } from "framer-motion";
import { useAlarm } from "@/contexts/AlarmContext";

export function AlarmDialog() {
  const {
    dialogOpen,
    activeAlarm,
    handleSnooze,
    closeAlarmDialog,
    handleDeleteAlarm,
  } = useAlarm();

  if (!activeAlarm) return null;

  return (
    <Dialog open={dialogOpen}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="text-center text-2xl">Wake Up!</DialogTitle>
        </DialogHeader>
        <div className="py-8">
          <motion.div
            animate={{ scale: [1, 1.2, 1] }}
            transition={{ repeat: Infinity, duration: 2 }}
            className="flex justify-center"
          >
            <Bell className="h-16 w-16 text-primary" />
          </motion.div>
          <p className="text-center text-4xl font-bold mt-4">
            {activeAlarm.time}
          </p>
          {activeAlarm.label && (
            <p className="text-center text-muted-foreground mt-2">
              {activeAlarm.label}
            </p>
          )}
        </div>
        <DialogFooter className="flex-col sm:flex-row gap-2">
          <Button
            onClick={handleSnooze}
            variant="outline"
            className="w-full sm:w-auto"
          >
            Snooze 5 Minutes
          </Button>
          <Button
            onClick={() => {
              closeAlarmDialog();
              if (activeAlarm) {
                handleDeleteAlarm(activeAlarm.id);
              }
            }}
            className="w-full sm:w-auto"
          >
            Stop Alarm
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

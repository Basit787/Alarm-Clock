"use client";

import { Bell, Edit2, Trash2 } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { Switch } from "@/components/ui/switch";
import { Button } from "@/components/ui/button";
import { useAlarm } from "@/contexts/AlarmContext";

export function AlarmList() {
  const { alarms, handleDeleteAlarm, setAlarms } = useAlarm();

  const handleToggle = (id: number) => {
    setAlarms((prevAlarms) =>
      prevAlarms.map((alarm) =>
        alarm.id === id ? { ...alarm, isActive: !alarm.isActive } : alarm
      )
    );
  };

  const formatDays = (days: string[]) => {
    if (days.length === 7) return "Every day";
    if (days.length === 0) return "Once";
    if (days.length === 5 && !days.includes("SAT") && !days.includes("SUN")) {
      return "Weekdays";
    }
    if (days.length === 2 && days.includes("SAT") && days.includes("SUN")) {
      return "Weekends";
    }
    return days.join(", ");
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-semibold">Your Alarms</h2>
        <span className="text-sm text-muted-foreground">
          {alarms.length} {alarms.length === 1 ? "alarm" : "alarms"}
        </span>
      </div>

      <AnimatePresence>
        {alarms.length === 0 ? (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="flex flex-col items-center justify-center h-[200px] text-muted-foreground"
          >
            <Bell className="h-12 w-12 mb-4" />
            <p>No alarms set</p>
          </motion.div>
        ) : (
          <div className="space-y-3">
            {alarms.map((alarm) => (
              <motion.div
                key={alarm.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                className="group relative bg-card p-4 rounded-lg border hover:shadow-md transition-all"
              >
                <div className="flex items-center justify-between">
                  <div className="space-y-1">
                    <div className="flex items-center gap-3">
                      <p className="text-2xl font-medium">{alarm.time}</p>
                      <Switch
                        checked={alarm.isActive}
                        onCheckedChange={() => handleToggle(alarm.id)}
                      />
                    </div>
                    {alarm.label && (
                      <p className="text-sm font-medium">{alarm.label}</p>
                    )}
                    <p className="text-sm text-muted-foreground">
                      {formatDays(alarm.days)}
                    </p>
                  </div>
                  <div className="flex space-x-2">
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => handleDeleteAlarm(alarm.id)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}

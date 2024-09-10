"use client";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import React, { useEffect, useState } from "react";

interface Alarm {
  time: string;
  snoozeCount: number;
}

const AlarmClock = () => {
  const [currentTime, setCurrentTime] = useState(new Date());
  const [newAlarm, setNewAlarm] = useState("");
  const [alarms, setAlarms] = useState<Alarm[]>([]);
  const [activeAlarm, setActiveAlarm] = useState<Alarm | null>(null);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [editIndex, setEditIndex] = useState<number | null>(null);
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    const now = currentTime.toTimeString().substring(0, 5);
    alarms.forEach((alarm) => {
      if (alarm.time === now) {
        if (alarm.snoozeCount < 3) {
          setActiveAlarm(alarm);
          setDialogOpen(true);
        } else {
          setAlarms(alarms.filter((a) => a.time !== now));
        }
      }
    });
  }, [currentTime, alarms]);

  const handleAddOrUpdateAlarm = () => {
    if (newAlarm) {
      if (isEditing && editIndex !== null) {
        const updatedAlarms = [...alarms];
        updatedAlarms[editIndex] = {
          ...updatedAlarms[editIndex],
          time: newAlarm,
        };
        setAlarms(updatedAlarms);
        setIsEditing(false);
        setEditIndex(null);
      } else {
        setAlarms([...alarms, { time: newAlarm, snoozeCount: 0 }]);
      }
      setNewAlarm("");
    }
  };

  const handleSnooze = () => {
    if (activeAlarm) {
      const updatedAlarms = alarms.map((alarm) =>
        alarm.time === activeAlarm.time
          ? {
              ...alarm,
              snoozeCount: alarm.snoozeCount + 1,
              time: getSnoozeTime(alarm.time),
            }
          : alarm
      );
      setAlarms(updatedAlarms);
      setDialogOpen(false);
    }
  };

  const handleCancelAlarm = () => {
    if (activeAlarm) {
      setAlarms(alarms.filter((alarm) => alarm.time !== activeAlarm.time));
      setDialogOpen(false);
    }
  };

  const getSnoozeTime = (time: string) => {
    const [hours, minutes] = time.split(":").map(Number);
    const snoozeMinutes = 5;
    const date = new Date();
    date.setHours(hours, minutes + snoozeMinutes, 0, 0);
    return date.toTimeString().substring(0, 5);
  };

  const handleEditAlarm = (index: number) => {
    setNewAlarm(alarms[index].time);
    setIsEditing(true);
    setEditIndex(index);
  };

  const handleDeleteAlarm = (index: number) => {
    const updatedAlarms = alarms.filter(
      (_, alarmIndex) => alarmIndex !== index
    );
    setAlarms(updatedAlarms);
  };

  return (
    <div className="flex flex-col justify-center items-center min-h-screen">
      <Card className="w-1/2 flex flex-col justify-center items-center">
        <p className="text-8xl m-5">
          {currentTime.toTimeString().substring(0, 8)}
        </p>
        <div className="flex flex-row gap-5">
          <Input
            type="time"
            value={newAlarm}
            onChange={(e) => setNewAlarm(e.target.value)}
            className="cursor-pointer"
          />
          <Button
            onClick={handleAddOrUpdateAlarm}
            className="bg-sky-600 hover:bg-sky-700 text-white rounded"
          >
            {isEditing ? "Update Alarm" : "Add Alarm"}
          </Button>
        </div>
        <div className="m-5 w-96 flex justify-center items-center">
          {alarms.length > 0 ? (
            alarms.map((alarm, index) => (
              <Card
                key={index}
                className="p-4 flex flex-row justify-between items-center"
              >
                <div>{alarm.time}</div>
                <div className="flex gap-2">
                  <Button
                    onClick={() => handleEditAlarm(index)}
                    className="bg-emerald-600 hover:bg-emerald-700 text-white rounded"
                  >
                    Edit
                  </Button>
                  <Button
                    onClick={() => handleDeleteAlarm(index)}
                    className="bg-red-600 hover:bg-red-700 text-white rounded"
                  >
                    Delete
                  </Button>
                </div>
              </Card>
            ))
          ) : (
            <p>No alarms set</p>
          )}
        </div>

        <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Alarm is ringing!</DialogTitle>
            </DialogHeader>
            <p>The alarm for {activeAlarm?.time} is ringing.</p>
            <DialogFooter>
              <Button onClick={handleSnooze}>Snooze</Button>
              <Button onClick={handleCancelAlarm}>Cancel</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </Card>
    </div>
  );
};

export default AlarmClock;

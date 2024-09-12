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
import Ringtone from "../components/Ringtone";

interface Alarm {
  id: number;
  time: string;
  snoozeCount: number;
}

const AlarmClock = () => {
  const [currentTime, setCurrentTime] = useState(new Date());
  const [alarms, setAlarms] = useState<Alarm[]>([]);
  const [newAlarm, setNewAlarm] = useState("");
  const [activeAlarm, setActiveAlarm] = useState<Alarm | null>(null);
  const [dialogOpen, setDialogOpen] = useState<boolean>(false);
  const [editIndex, setEditIndex] = useState<number | null>(null);
  const [error, setError] = useState("");

  useEffect(() => {
    setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);
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

  useEffect(() => {
    if (error) {
      setTimeout(() => {
        setError("");
      }, 2000);
    }
  }, [error]);

  const handleAddAlarm = () => {
    const alreadyAlarm = alarms.find((alarm) => alarm.time === newAlarm);
    const snoozeCount = alarms.find((alarm) => alarm.snoozeCount > 0);
    if (snoozeCount ? alreadyAlarm : !alreadyAlarm) {
      if (newAlarm) {
        setAlarms([
          ...alarms,
          {
            id: Math.ceil(Math.random() * 1000),
            time: newAlarm,
            snoozeCount: 0,
          },
        ]);
        setNewAlarm("");
      }
    } else {
      setNewAlarm("");
      setError("Alarm already exist!!!");
    }
  };

  const handleUpdateAlarm = () => {
    if (editIndex !== null && newAlarm) {
      const updatedAlarms = alarms.map((alarm, index) =>
        index === editIndex ? { ...alarm, time: newAlarm } : alarm
      );
      setAlarms(updatedAlarms);
      setNewAlarm("");
      setEditIndex(null);
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

  const getSnoozeTime = (time: string) => {
    const [hours, minutes] = time.split(":").map(Number);
    const date = new Date();
    date.setHours(hours, minutes + 5, 0, 0);
    return date.toTimeString().substring(0, 5);
  };

  const handleCancelAlarm = () => {
    if (activeAlarm) {
      setAlarms(alarms.filter((alarm) => alarm.time !== activeAlarm.time));
      setDialogOpen(false);
    }
  };

  const handleEditAlarm = (index: number) => {
    setNewAlarm(alarms[index].time);
    setEditIndex(index);
  };

  const handleDeleteAlarm = (id: number) => {
    setAlarms(alarms.filter((alarm) => alarm.id !== id));
  };

  return (
    <div className="flex flex-col justify-center items-center min-h-screen">
      <Card className="md:w-1/2 w-full flex flex-col justify-center items-center">
        <p className="md:text-8xl text-4xl m-5">
          {currentTime.toTimeString().substring(0, 8)}
        </p>
        <div className="flex flex-col md:flex-row gap-5 items-center">
          <div className="border-2">
            <p className="text-xl">
              {editIndex !== null ? "Update Time" : "Select Time"}
            </p>
            <Input
              type="time"
              value={newAlarm}
              onChange={(e) => setNewAlarm(e.target.value)}
              className="cursor-pointer w-32 h-10 rounded text-center border-none text-xl"
              placeholder="Select Time"
            />
          </div>
          {newAlarm && (
            <Button
              onClick={editIndex !== null ? handleUpdateAlarm : handleAddAlarm}
              className="bg-sky-600 hover:bg-sky-700 text-white rounded"
            >
              {editIndex === null ? "Add" : "Update"}
            </Button>
          )}
        </div>
        {error && <p className="text-red-700">{error}</p>}
        <div className="m-5  flex flex-col justify-center items-center gap-4">
          {alarms.length > 0 ? (
            alarms.map((alarm, index) => (
              <Card
                key={index}
                className="p-4  flex flex-row justify-between items-center md:w-96 "
              >
                <div>
                  <div className="md:text-xl text-lg m-4">{alarm.time}</div>
                  <div className="md:text-xl text-lg m-4">
                    Snooze: {alarm.snoozeCount}
                  </div>
                </div>
                <div className="flex flex-col gap-2">
                  <Button
                    onClick={() => handleEditAlarm(index)}
                    className="bg-emerald-600 hover:bg-emerald-700 text-white rounded"
                  >
                    Edit
                  </Button>
                  <Button
                    onClick={() => handleDeleteAlarm(alarm.id)}
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
            <Ringtone />
            <DialogHeader>
              <DialogTitle>Alarm is ringing!</DialogTitle>
            </DialogHeader>
            <p>The alarm for {activeAlarm?.time} is ringing.</p>
            <DialogFooter className="flex md:flex-row flex-col gap-4 ">
              <Button
                onClick={handleSnooze}
                className="bg-emerald-600 hover:bg-emerald-700 text-white rounded"
              >
                Snooze
              </Button>
              <Button
                onClick={handleCancelAlarm}
                className="bg-red-600 hover:bg-red-700 text-white rounded"
              >
                Cancel
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </Card>
    </div>
  );
};

export default AlarmClock;

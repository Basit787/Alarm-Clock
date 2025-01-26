"use client";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { AlarmForm } from "./AlarmForm";
import { Plus } from "lucide-react";

export function AddAlarmDialog() {
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="outline" size="lg" className="w-full">
          <Plus />
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Add New Alarm</DialogTitle>
        </DialogHeader>
        <div className="py-4">
          <AlarmForm />
        </div>
      </DialogContent>
    </Dialog>
  );
}

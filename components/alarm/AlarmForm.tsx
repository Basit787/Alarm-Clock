"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Clock, Plus } from "lucide-react";
import { Checkbox } from "@/components/ui/checkbox";
import { useAlarm } from "@/contexts/AlarmContext";
import { useToast } from "@/hooks/use-toast";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { formSchema, FormValues } from "@/zod/formSchema";
import { DAYS } from "@/utils/data";
import { useState } from "react";
import { DialogClose } from "@radix-ui/react-dialog";

export function AlarmForm() {
  const { setAlarms } = useAlarm();
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      time: "",
      label: "",
      days: [],
    },
  });

  function onSubmit(data: FormValues) {
    setIsSubmitting(true);

    const newAlarm = {
      id: Math.ceil(Math.random() * 1000),
      time: data.time,
      label: data.label,
      days: data.days,
      isActive: true,
      snoozeCount: 0,
    };

    setAlarms((prev) => [...prev, newAlarm]);
    toast({
      title: "Alarm set",
      description: `Alarm set for ${data.time}`,
    });
    form.reset();
    setIsSubmitting(false);
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <FormField
          control={form.control}
          name="time"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Alarm Time</FormLabel>
              <div className="relative">
                <FormControl>
                  <Input
                    type="datetime-local"
                    className="pl-10 text-lg h-12"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </div>
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="label"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Label (Optional)</FormLabel>
              <FormControl>
                <Input placeholder="Enter alarm label" {...field} />
              </FormControl>
              <FormDescription>
                Add a description for your alarm
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="days"
          render={() => (
            <FormItem>
              <FormLabel>Repeat</FormLabel>
              <div className="flex flex-wrap gap-2">
                {DAYS.map((day) => (
                  <FormField
                    key={day.value}
                    control={form.control}
                    name="days"
                    render={({ field }) => {
                      return (
                        <FormItem
                          key={day.value}
                          className="flex items-center space-x-2"
                        >
                          <FormControl>
                            <Checkbox
                              checked={field.value?.includes(day.value)}
                              onCheckedChange={(checked) => {
                                const updatedDays = checked
                                  ? [...field.value, day.value]
                                  : field.value?.filter(
                                      (value) => value !== day.value
                                    );
                                field.onChange(updatedDays);
                              }}
                            />
                          </FormControl>
                          <FormLabel className="text-sm font-normal">
                            {day.value}
                          </FormLabel>
                        </FormItem>
                      );
                    }}
                  />
                ))}
              </div>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="flex items-center justify-end gap-4">
          <DialogClose asChild>
            <Button type="button" variant="outline">
              Cancel
            </Button>
          </DialogClose>
          <DialogClose asChild>
            <Button type="submit" disabled={isSubmitting}>
              Add Alarm
            </Button>
          </DialogClose>
        </div>
      </form>
    </Form>
  );
}

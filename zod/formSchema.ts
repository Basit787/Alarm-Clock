import { z } from "zod";

export const formSchema = z.object({
  time: z.string().min(1, "Please select a time"),
  label: z.string().max(30, "Label must be less than 30 characters").optional(),
  days: z.array(z.enum(["SUN", "MON", "TUE", "WED", "THU", "FRI", "SAT"])),
});

export type FormValues = z.infer<typeof formSchema>;

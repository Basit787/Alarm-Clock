export interface Alarm {
  id: number;
  time: string;
  label?: string;
  days: string[];
  isActive: boolean;
  snoozeCount: number;
}

export interface AlarmContextType {
  dialogOpen: boolean;
  activeAlarm: Alarm | null;
  openAlarmDialog: (alarm: Alarm) => void;
  closeAlarmDialog: () => void;
  handleSnooze: () => void;
  handleDeleteAlarm: (id: number) => void;
  alarms: Alarm[];
  setAlarms: React.Dispatch<React.SetStateAction<Alarm[]>>;
  playAlarmSound: () => void;
  stopAlarmSound: () => void;
}

export interface CurrentTimeProps {
  currentTime: Date;
}

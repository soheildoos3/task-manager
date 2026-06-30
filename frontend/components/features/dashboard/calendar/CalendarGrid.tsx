"use client";

import { Task } from "@/types/task";
import CalendarDay from "./CalendarDay";

interface CalendarGridProps {
  days: Date[];
  tasks: Task[];
  getTasksForDate: (date: Date) => Task[];
  isToday: (date: Date) => boolean;
}

export default function CalendarGrid({
  days,
  tasks,
  getTasksForDate,
  isToday,
}: CalendarGridProps) {
  const weekDays = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
  const firstDayOfMonth = days[0];
  const startDay = firstDayOfMonth ? firstDayOfMonth.getDay() : 0;

  return (
    <div className="grid grid-cols-7 gap-1">
      {weekDays.map((day) => (
        <div
          key={day}
          className="text-muted-foreground p-2 text-center text-sm font-medium"
        >
          {day}
        </div>
      ))}
      {Array.from({ length: startDay }).map((_, i) => (
        <div key={`empty-${i}`} className="min-h-[100px] p-2" />
      ))}
      {days.map((date) => (
        <CalendarDay
          key={date.toISOString()}
          date={date}
          tasks={getTasksForDate(date)}
          isToday={isToday(date)}
        />
      ))}
    </div>
  );
}

import * as React from "react";
import { Clock } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { cn } from "@/lib/utils";

interface TimePickerProps {
  value?: string;
  onChange?: (value: string) => void;
  placeholder?: string;
  disabled?: boolean;
  className?: string;
}

// Generate hours (00-23)
const hours = Array.from({ length: 24 }, (_, i) =>
  i.toString().padStart(2, "0")
);

// Generate minutes (00, 15, 30, 45)
const minutes = ["00", "15", "30", "45"];

export function TimePicker({
  value,
  onChange,
  placeholder = "Select time",
  disabled = false,
  className,
}: TimePickerProps) {
  const [open, setOpen] = React.useState(false);

  // Parse the current value
  const [currentHour, currentMinute] = React.useMemo(() => {
    if (!value) return ["", ""];
    const [hour, minute] = value.split(":");
    return [hour || "", minute || ""];
  }, [value]);

  const handleTimeChange = (hour: string, minute: string) => {
    if (hour && minute && onChange) {
      onChange(`${hour}:${minute}`);
    }
  };

  const handleHourChange = (hour: string) => {
    handleTimeChange(hour, currentMinute || "00");
  };

  const handleMinuteChange = (minute: string) => {
    handleTimeChange(currentHour || "00", minute);
  };

  const displayValue = React.useMemo(() => {
    if (!value) return "";
    const [hour, minute] = value.split(":");
    if (!hour || !minute) return "";

    // Convert to 12-hour format for display
    const hourNum = parseInt(hour, 10);
    const period = hourNum >= 12 ? "PM" : "AM";
    const displayHour =
      hourNum === 0 ? 12 : hourNum > 12 ? hourNum - 12 : hourNum;

    return `${displayHour}:${minute} ${period}`;
  }, [value]);

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          className={cn(
            "w-full justify-start text-left font-normal",
            !value && "text-muted-foreground",
            className
          )}
          disabled={disabled}
        >
          <Clock className="mr-2 h-4 w-4" />
          {displayValue || placeholder}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-auto p-4" align="start">
        <div className="space-y-4">
          <div className="text-sm font-medium">Select Time</div>
          <div className="grid grid-cols-2 gap-2">
            <div className="space-y-2">
              <label className="text-xs font-medium text-muted-foreground">
                Hour
              </label>
              <Select value={currentHour} onValueChange={handleHourChange}>
                <SelectTrigger>
                  <SelectValue placeholder="HH" />
                </SelectTrigger>
                <SelectContent>
                  {hours.map((hour) => {
                    const hourNum = parseInt(hour, 10);
                    const displayHour =
                      hourNum === 0
                        ? 12
                        : hourNum > 12
                        ? hourNum - 12
                        : hourNum;
                    const period = hourNum >= 12 ? "PM" : "AM";

                    return (
                      <SelectItem key={hour} value={hour}>
                        {displayHour} {period}
                      </SelectItem>
                    );
                  })}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <label className="text-xs font-medium text-muted-foreground">
                Minute
              </label>
              <Select value={currentMinute} onValueChange={handleMinuteChange}>
                <SelectTrigger>
                  <SelectValue placeholder="MM" />
                </SelectTrigger>
                <SelectContent>
                  {minutes.map((minute) => (
                    <SelectItem key={minute} value={minute}>
                      {minute}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
          {currentHour && currentMinute && (
            <div className="pt-2 border-t">
              <div className="text-sm text-muted-foreground">
                Selected: {displayValue}
              </div>
            </div>
          )}
        </div>
      </PopoverContent>
    </Popover>
  );
}

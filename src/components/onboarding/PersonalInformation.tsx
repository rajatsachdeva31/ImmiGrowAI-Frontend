"use client";

import React, { useState } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { CalendarIcon } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { format } from "date-fns";

interface PersonalInformationProps<T> {
  formData: T;
  setFormData: React.Dispatch<React.SetStateAction<T>>;
  errors: { [key: string]: string };
}

const PersonalInformation = <T extends Record<string, any>>({
  formData,
  setFormData,
  errors,
}: PersonalInformationProps<T>) => {
  const [isOpen, setIsOpen] = useState(false);
  return (
    <div className="text-left">
      <h2 className="text-xl font-semibold mb-4">Personal Information</h2>
      <div className="flex justify-between items-center">
        <Label>Full Name:</Label>
        <Input
          className="w-2/3 mb-4"
          type="text"
          value={formData.fullName || ""}
          onChange={(e) =>
            setFormData({ ...formData, fullName: e.target.value })
          }
        />
      </div>
      {errors.fullName && <p className="text-red-500 text-sm mb-4">{errors.fullName}</p>}
      <div className="flex justify-between items-center">
        <Label>Phone Number:</Label>
        <Input
          className="w-2/3 mb-4"
          type="tel"
          value={formData.phoneNumber || ""}
          onChange={(e) =>
            setFormData({ ...formData, phoneNumber: e.target.value })
          }
        />
      </div>
      {errors.phoneNumber && <p className="text-red-500 text-sm mb-4">{errors.phoneNumber}</p>}
      {errors.phoneLength && <p className="text-red-500 text-sm mb-4">{errors.phoneLength}</p>}
      <div className="flex justify-between items-center">
        <Label>Date of Birth:</Label>
        <Popover open={isOpen} onOpenChange={setIsOpen}>
          <PopoverTrigger asChild>
            <Button
              variant={"outline"}
              className={cn(
                "w-2/3 mb-4",
                !formData.dateOfBirth && "text-muted-foreground"
              )}
            >
              {formData.dateOfBirth ? (
                format(formData.dateOfBirth, "PPP")
              ) : (
                <span>Date of Birth</span>
              )}
              <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-auto p-0" align="start">
            <Calendar
              mode="single"
              captionLayout="dropdown"
              selected={
                formData.dateOfBirth
                  ? new Date(formData.dateOfBirth)
                  : undefined
              }
              onSelect={(date) =>
                setFormData({
                  ...formData,
                  dateOfBirth: date ? date.toISOString().split("T")[0] : "",
                })
              }
              onDayClick={() => setIsOpen(false)}
              fromYear={1960}
              toYear={new Date().getFullYear()}
            />
          </PopoverContent>
        </Popover>
      </div>
      {errors.dateOfBirth && <p className="text-red-500 text-sm mb-4">{errors.dateOfBirth}</p>}
    </div>
  );
};

export default PersonalInformation;

"use client";

import { forwardRef, useMemo, useState } from "react";
import { HexColorPicker } from "react-colorful";
import { cn } from "@/lib/utils";
import { useForwardedRef } from "@/lib/use-forwarded-ref";
import type { ButtonProps } from "@/components/ui/button";
import { Button } from "@/components/ui/button";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

interface ColorPickerProps {
  value: string;
  label: string;
  onChange: (value: string) => void;
  onBlur?: () => void;
}

const ColorPicker = forwardRef<
  HTMLInputElement,
  Omit<ButtonProps, "value" | "onChange" | "onBlur"> & ColorPickerProps
>(
  (
    { disabled, value, onChange, onBlur, name, className, label, ...props },
    forwardedRef
  ) => {
    const ref = useForwardedRef(forwardedRef);
    const [open, setOpen] = useState(false);

    const parsedValue = useMemo(() => {
      return value || "#FFFFFF";
    }, [value]);

    return (
      <div className="space-y-2">
        <Label>{label}</Label>
        <div className="flex gap-2">
          <Popover onOpenChange={setOpen} open={open}>
            <PopoverTrigger asChild disabled={disabled} onBlur={onBlur}>
              <Button
                {...props}
                className={cn("block w-9 h-9 p-0 rounded-md", className)}
                name={name}
                onClick={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  setOpen(true);
                }}
                style={{
                  backgroundColor: parsedValue,
                }}
                variant="outline"
              >
                <div />
              </Button>
            </PopoverTrigger>
            <PopoverContent 
              className="w-full"
              onInteractOutside={(e) => {
                e.preventDefault();
                setOpen(false);
              }}
            >
              <HexColorPicker 
                color={parsedValue} 
                onChange={onChange}
              />
            </PopoverContent>
          </Popover>
          <Input
            maxLength={7}
            onChange={(e) => {
              onChange(e?.currentTarget?.value);
            }}
            ref={ref}
            value={parsedValue}
            className="flex-1"
          />
        </div>
      </div>
    );
  }
);

ColorPicker.displayName = "ColorPicker";

export { ColorPicker };
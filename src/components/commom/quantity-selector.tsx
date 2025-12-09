"use client";

import { Minus, Plus, Trash2 } from "lucide-react";
import { Button } from "../ui/button";
import { useState } from "react";
import { cn } from "@/lib/utils";

interface QuantitySelectorProps {
  value?: number;
  min?: number;
  max?: number;
  onChange?: (value: number) => void;
  onRemove?: () => void;
  disabled?: boolean;
  className?: string;
}

const QuantitySelector = ({
  value: controlledValue,
  min = 1,
  max = 999,
  onChange,
  onRemove,
  disabled = false,
  className,
}: QuantitySelectorProps) => {
  const [internalValue, setInternalValue] = useState(1);
  const [inputValue, setInputValue] = useState("");
  const [isFocused, setIsFocused] = useState(false);
  const value = controlledValue ?? internalValue;

  const handleChange = (newValue: number) => {
    const clampedValue = Math.max(min, Math.min(max, newValue));
    if (onChange) {
      onChange(clampedValue);
    } else {
      setInternalValue(clampedValue);
    }
  };

  const handleDecrement = () => {
    if (value === min && onRemove) {
      onRemove();
    } else if (value > min) {
      handleChange(value - 1);
    }
  };

  const handleIncrement = () => {
    if (value < max) {
      handleChange(value + 1);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    if (val === "" || /^\d+$/.test(val)) {
      setInputValue(val);
    }
  };

  const handleInputFocus = () => {
    setIsFocused(true);
    setInputValue(String(value));
  };

  const handleInputBlur = () => {
    setIsFocused(false);
    
    if (inputValue.trim() === "" || inputValue === "0") {
      if (onRemove) {
        onRemove();
      }
      setInputValue("");
      return;
    }

    const newValue = parseInt(inputValue);
    
    if (!isNaN(newValue) && newValue > 0) {
      handleChange(newValue);
    }
    
    setInputValue("");
  };

  const handleInputKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      e.currentTarget.blur();
    }
  };

  return (
    <div
      className={cn(
        "inline-flex items-center gap-0.5  rounded-full bg-neutral-50  h-7",
        disabled && "opacity-50 pointer-events-none",
        className
      )}
    >
      <Button
        variant="ghost"
        size="xs"
        title={value === min && onRemove ? "Remove item" : "Decrease quantity"}
        onClick={handleDecrement}
        disabled={disabled || (!onRemove && value <= min)}
        className={cn(
          "h-6 w-6 rounded-full hover:bg-accent disabled:opacity-40 p-0 mx-[1px]",
          value === min && onRemove && "hover:bg-destructive/10"
        )}
      >
        {value === min && onRemove ? (
          <Trash2 className="size-3 text-destructive" />
        ) : (
          <Minus className="size-3" />
        )}
      </Button>
      <input
        type="text"
        value={isFocused ? inputValue : value}
        onChange={handleInputChange}
        onFocus={handleInputFocus}
        onBlur={handleInputBlur}
        onKeyDown={handleInputKeyDown}
        disabled={disabled}
        className="w-7 text-center text-xs font-medium bg-transparent border-none outline-none appearance-none [&::-webkit-inner-spin-button]:appearance-none [&::-webkit-outer-spin-button]:appearance-none disabled:cursor-not-allowed"
      />
      <Button
        variant="ghost"
        size="xs"
        title="Increase quantity"
        onClick={handleIncrement}
        disabled={disabled || value >= max}
        className="h-6 w-6 rounded-full hover:bg-accent disabled:opacity-40 p-0 mx-[1px]"
      >
        <Plus className="size-3" />
      </Button>
    </div>
  );
};

export default QuantitySelector;
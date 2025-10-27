"use client"
import { Check, ChevronsUpDown } from "lucide-react"

import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from "@/components/ui/command"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"

interface ComboboxItem {
  value: number
  label: string
  description?: string
}

interface ComboboxProps {
  items: ComboboxItem[]
  value: number
  onValueChange: (value: number) => void
  searchValue: string
  onSearchChange: (value: string) => void
  open: boolean
  onOpenChange: (open: boolean) => void
  placeholder?: string
  searchPlaceholder?: string
}

export function Combobox({
  items,
  value,
  onValueChange,
  searchValue,
  onSearchChange,
  open,
  onOpenChange,
  placeholder = "Select item...",
  searchPlaceholder = "Search...",
}: ComboboxProps) {
  const selectedItem = items.find((item) => item.value === value)

  return (
    <Popover open={open} onOpenChange={onOpenChange}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          className="w-full justify-between bg-transparent"
        >
          <span className="truncate">{selectedItem ? selectedItem.label : placeholder}</span>
          <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-full p-0" align="start">
        <Command>
          <CommandInput placeholder={searchPlaceholder} value={searchValue} onValueChange={onSearchChange} />
          <CommandEmpty>Tidak ada item yang ditemukan.</CommandEmpty>
          <CommandList>
            <CommandGroup>
              {items.map((item) => (
                <CommandItem
                    key={item.value}
                    value={item.value}
                    onSelect={
                        () => {onValueChange(item.value), onOpenChange(false)}
                    }
                    >
                    <Check className={cn("mr-2 h-4 w-4", value === item.value ? "opacity-100" : "opacity-0")} />
                    <div className="flex flex-col">
                        <span>{item.label}</span>
                        {item.description && (
                            <span className="text-sm text-muted-foreground">
                                {item.description}
                            </span>
                        )}
                    </div>
                </CommandItem>
              ))}
            </CommandGroup>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  )
}

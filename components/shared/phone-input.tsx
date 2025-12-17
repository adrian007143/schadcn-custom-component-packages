"use client";

import * as React from "react";
import { CheckIcon, ChevronsUpDown } from "lucide-react";
import * as RPNInput from "react-phone-number-input";
import flags from "react-phone-number-input/flags";

import { Button } from "@/components/ui/button";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import { Input } from "@/components/ui/input";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { ScrollArea } from "@/components/ui/scroll-area";
import { cn } from "@/lib/utils";

/* -------------------------------------------------------------
 * TYPES
 * ------------------------------------------------------------- */

type PhoneInputProps = Omit<
  React.ComponentProps<"input">,
  "onChange" | "value" | "ref"
> &
  Omit<RPNInput.Props<typeof RPNInput.default>, "onChange"> & {
    onChange?: (value: RPNInput.Value) => void;
  };

/* -------------------------------------------------------------
 * MAIN PHONE INPUT
 * ------------------------------------------------------------- */

export const PhoneInput = React.forwardRef<
  React.ComponentRef<typeof RPNInput.default>,
  PhoneInputProps
>(({ className, onChange, value, ...props }, ref) => {
  return (
    <RPNInput.default
      ref={ref}
      className={cn(
        "flex w-full items-stretch rounded-md border border-border bg-input",
        "focus-within:ring-2 focus-within:ring-primary/40 focus-within:border-primary",
        className
      )}
      flagComponent={FlagComponent}
      countrySelectComponent={CountrySelect}
      inputComponent={InputComponent}
      smartCaret={false}
      value={value || undefined}
      onChange={(v) => onChange?.(v || ("" as RPNInput.Value))}
      {...props}
    />
  );
});
PhoneInput.displayName = "PhoneInput";

/* -------------------------------------------------------------
 * INPUT PART
 * ------------------------------------------------------------- */

const InputComponent = React.forwardRef<
  HTMLInputElement,
  React.ComponentProps<"input">
>(({ className, ...props }, ref) => (
  <Input
    ref={ref}
    className={cn(
      "flex-1 h-full border-0 rounded-none bg-transparent px-3 text-sm",
      "focus-visible:ring-0 focus-visible:ring-offset-0",
      className
    )}
    {...props}
  />
));
InputComponent.displayName = "InputComponent";

/* -------------------------------------------------------------
 * COUNTRY SELECT
 * ------------------------------------------------------------- */

type CountryEntry = {
  label: string;
  value: RPNInput.Country | undefined;
};

type CountrySelectProps = {
  disabled?: boolean;
  value: RPNInput.Country;
  options: CountryEntry[];
  onChange: (country: RPNInput.Country) => void;
};

const CountrySelect = ({
  disabled,
  value: selectedCountry,
  options: countryList,
  onChange,
}: CountrySelectProps) => {
  const scrollAreaRef = React.useRef<HTMLDivElement>(null);
  const [searchValue, setSearchValue] = React.useState("");
  const [isOpen, setIsOpen] = React.useState(false);

  /* ✅ Reset scroll when search changes */
  React.useEffect(() => {
    const viewport = scrollAreaRef.current?.querySelector(
      "[data-radix-scroll-area-viewport]"
    ) as HTMLElement | null;

    if (viewport) viewport.scrollTop = 0;
  }, [searchValue]);

  /* ✅ MANUAL FILTERING (FIXES SEARCH) */
  const filteredCountries = React.useMemo(() => {
    if (!searchValue.trim()) return countryList;

    const q = searchValue.toLowerCase();

    return countryList.filter(
      (c) => c.value && c.label.toLowerCase().includes(q)
    );
  }, [countryList, searchValue]);

  /* ✅ Memoized rendering */
  const renderedOptions = React.useMemo(
    () =>
      filteredCountries.map(({ value, label }) =>
        value ? (
          <CountrySelectOption
            key={value}
            country={value}
            countryName={label}
            selectedCountry={selectedCountry}
            onChange={onChange}
            onSelectComplete={() => setIsOpen(false)}
          />
        ) : null
      ),
    [filteredCountries, selectedCountry, onChange]
  );

  return (
    <Popover
      open={isOpen}
      onOpenChange={(open) => {
        setIsOpen(open);
        if (open) setSearchValue("");
      }}
    >
      <PopoverTrigger asChild>
        <Button
          type="button"
          variant="ghost"
          className={cn(
            "flex h-full items-center gap-1 rounded-none rounded-l-md",
            "border-0 border-r border-border bg-transparent px-2",
            "focus-visible:ring-0 focus-visible:ring-offset-0",
            disabled && "opacity-50 cursor-not-allowed"
          )}
          disabled={disabled}
        >
          <FlagComponent
            country={selectedCountry}
            countryName={selectedCountry}
          />
          <ChevronsUpDown
            className={cn(
              "size-4 opacity-60",
              disabled && "opacity-0 pointer-events-none"
            )}
          />
        </Button>
      </PopoverTrigger>

      <PopoverContent className="w-72 p-0">
        <Command shouldFilter={false}>
          <CommandInput
            value={searchValue}
            onValueChange={setSearchValue}
            placeholder="Search country..."
          />

          <CommandList>
            <ScrollArea ref={scrollAreaRef} className="h-72">
              {filteredCountries.length === 0 && (
                <CommandEmpty>No country found.</CommandEmpty>
              )}

              <CommandGroup>{renderedOptions}</CommandGroup>
            </ScrollArea>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  );
};

/* -------------------------------------------------------------
 * COUNTRY OPTION
 * ------------------------------------------------------------- */

interface CountrySelectOptionProps extends RPNInput.FlagProps {
  selectedCountry: RPNInput.Country;
  onChange: (country: RPNInput.Country) => void;
  onSelectComplete: () => void;
}

const CountrySelectOption = React.memo(
  ({
    country,
    countryName,
    selectedCountry,
    onChange,
    onSelectComplete,
  }: CountrySelectOptionProps) => {
    const handleSelect = () => {
      onChange(country);
      onSelectComplete();
    };

    return (
      <CommandItem className="gap-2" onSelect={handleSelect}>
        <FlagComponent country={country} countryName={countryName} />
        <span className="flex-1 text-sm">{countryName}</span>
        <span className="text-sm text-foreground/50">
          +{RPNInput.getCountryCallingCode(country)}
        </span>
        <CheckIcon
          className={cn(
            "ml-auto size-4",
            country === selectedCountry ? "opacity-100" : "opacity-0"
          )}
        />
      </CommandItem>
    );
  }
);
CountrySelectOption.displayName = "CountrySelectOption";

/* -------------------------------------------------------------
 * FLAG (MEMOIZED)
 * ------------------------------------------------------------- */

const FlagComponent = React.memo(
  ({ country, countryName }: RPNInput.FlagProps) => {
    const Flag = flags[country];

    return (
      <span className="flex h-4 w-6 overflow-hidden rounded-sm bg-foreground/20 [&_svg:not([class*='size-'])]:size-full">
        {Flag && <Flag title={countryName} />}
      </span>
    );
  }
);
FlagComponent.displayName = "FlagComponent";

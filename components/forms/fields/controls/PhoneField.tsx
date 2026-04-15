"use client";

import * as React from "react";
import { CheckIcon, ChevronDown, SearchIcon } from "lucide-react";
import * as RPNInput from "react-phone-number-input";
import flags from "react-phone-number-input/flags";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { cn } from "@/lib/utils";

type PhoneInputProps = Omit<
  React.ComponentProps<"input">,
  "onChange" | "value" | "ref"
> &
  Omit<RPNInput.Props<typeof RPNInput.default>, "onChange"> & {
    onChange?: (value?: RPNInput.Value) => void;
  };

const noop = () => {};

export const PhoneField = React.forwardRef<HTMLInputElement, PhoneInputProps>(
  ({ className, onChange, value, ...props }, ref) => {
    return (
      <RPNInput.default
        inputRef={ref}
        className={cn(
          "flex w-full items-stretch rounded-md border border-border bg-input",
          "focus-within:border-primary focus-within:ring-2 focus-within:ring-primary/40",
          className
        )}
        flagComponent={FlagComponent}
        countrySelectComponent={CountrySelect}
        inputComponent={InputComponent}
        smartCaret={false}
        value={value || undefined}
        onChange={onChange ?? noop}
        {...props}
      />
    );
  }
);
PhoneField.displayName = "PhoneField";

/** @deprecated Use PhoneField instead. */
export const PhoneInput = PhoneField;

const InputComponent = React.forwardRef<
  HTMLInputElement,
  React.ComponentProps<"input">
>(({ className, ...props }, ref) => (
  <Input
    ref={ref}
    className={cn(
      "h-full flex-1 rounded-none border-0 bg-transparent px-3 text-sm",
      "focus-visible:ring-0 focus-visible:ring-offset-0",
      className
    )}
    {...props}
  />
));
InputComponent.displayName = "InputComponent";

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
  const [isOpen, setIsOpen] = React.useState(false);
  const [searchValue, setSearchValue] = React.useState("");
  const searchInputRef = React.useRef<HTMLInputElement>(null);

  React.useEffect(() => {
    if (!isOpen) return;

    const frame = requestAnimationFrame(() => {
      searchInputRef.current?.focus({ preventScroll: true });
    });

    return () => {
      cancelAnimationFrame(frame);
    };
  }, [isOpen]);

  const filteredCountries = React.useMemo(() => {
    const query = searchValue.trim().toLowerCase();
    if (!query) {
      return countryList;
    }

    return countryList.filter((country) =>
      country.label.toLowerCase().includes(query)
    );
  }, [countryList, searchValue]);

  return (
    <Popover
      open={isOpen}
      onOpenChange={(open) => {
        setIsOpen(open);
        if (open) {
          setSearchValue("");
        }
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
            disabled && "cursor-not-allowed opacity-50"
          )}
          disabled={disabled}
        >
          <FlagComponent
            country={selectedCountry}
            countryName={selectedCountry}
          />
          <ChevronDown
            className={cn(
              "size-4 opacity-60",
              disabled && "pointer-events-none opacity-0"
            )}
          />
        </Button>
      </PopoverTrigger>

      <PopoverContent
        side="bottom"
        align="start"
        sideOffset={4}
        initialFocus={false}
        className="z-[70] w-72 p-0"
      >
        <div className="bg-popover text-popover-foreground overflow-hidden rounded-md">
          <div className="flex items-center gap-2 border-b px-3">
            <SearchIcon className="size-4 shrink-0 opacity-50" />
            <Input
              ref={searchInputRef}
              value={searchValue}
              onChange={(event) => setSearchValue(event.target.value)}
              placeholder="Search country..."
              className="h-10 rounded-none border-0 bg-transparent px-0 shadow-none focus-visible:ring-0"
            />
          </div>

          <div className="max-h-72 overflow-y-auto p-1">
            {filteredCountries.length === 0 ? (
              <div className="px-2 py-6 text-center text-sm text-muted-foreground">
                No country found.
              </div>
            ) : (
              filteredCountries.map((country) =>
                country.value ? (
                  <CountrySelectOption
                    key={country.value}
                    country={country.value}
                    countryName={country.label}
                    selectedCountry={selectedCountry}
                    onChange={onChange}
                    onSelectComplete={() => setIsOpen(false)}
                  />
                ) : null
              )
            )}
          </div>
        </div>
      </PopoverContent>
    </Popover>
  );
};

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
    const handleSelect = React.useCallback(() => {
      onChange(country);
      onSelectComplete();
    }, [country, onChange, onSelectComplete]);

    return (
      <button
        type="button"
        onClick={handleSelect}
        className={cn(
          "flex w-full items-center gap-2 rounded-sm px-2 py-2 text-left text-sm transition-colors",
          "hover:bg-accent hover:text-accent-foreground",
          country === selectedCountry && "bg-accent text-accent-foreground"
        )}
      >
        <FlagComponent country={country} countryName={countryName} />
        <span className="flex-1 text-sm">{countryName}</span>
        {country === selectedCountry ? (
          <CheckIcon className="size-4 opacity-100" />
        ) : null}
      </button>
    );
  }
);
CountrySelectOption.displayName = "CountrySelectOption";

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

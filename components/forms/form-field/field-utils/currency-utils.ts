export const formatCurrency = (
  value: number,
  locale: string = "en-PH",
  decimals: number = 2,
  useThousands: boolean = true,
  trimZeros: boolean = false
): string => {
  if (isNaN(value)) return "";

  const options: Intl.NumberFormatOptions = {
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals,
    useGrouping: useThousands,
  };

  let formatted = new Intl.NumberFormat(locale, options).format(value);

  // Remove trailing zeros (optional)
  if (trimZeros) {
    formatted = formatted.replace(/\.?0+$/, "");
  }

  return formatted;
};


export const parseCurrency = (value: string): number | null => {
  if (!value) return null;
  const cleaned = value.replace(/[^0-9.-]+/g, "");
  const num = Number(cleaned);
  return isNaN(num) ? null : num;
};

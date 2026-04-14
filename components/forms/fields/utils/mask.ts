export const applyMask = (value: string, mask: string): string => {
  const digits = value.replace(/\D/g, "");
  let result = "";
  let digitIndex = 0;

  for (let i = 0; i < mask.length; i++) {
    if (digitIndex >= digits.length) break;

    if (mask[i] === "#") {
      result += digits[digitIndex];
      digitIndex++;
    } else {
      result += mask[i];
    }
  }

  return result;
};

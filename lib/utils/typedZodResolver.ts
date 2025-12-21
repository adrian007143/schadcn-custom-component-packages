import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import type { FieldValues, Resolver } from "react-hook-form";

/**
 * Typed wrapper around zodResolver.
 * This keeps your FormBuilder generics clean and avoids resolver type errors.
 */
export function typedZodResolver<TValues extends FieldValues>(
  schema: z.ZodType<TValues>
): Resolver<TValues> {
  // We cast through unknown because zodResolver’s internal types are broader
  
  return zodResolver(schema as never) as unknown as Resolver<TValues>;
}

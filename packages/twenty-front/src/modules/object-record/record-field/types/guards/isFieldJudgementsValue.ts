import { FieldJudgementsValue } from '@/object-record/record-field/types/FieldMetadata';
import { z } from 'zod';

// Define a schema for JudgementItem
const judgementItemSchema = z.object({
  text: z.string(),
  author: z.string(),
  createdAt: z.string(),
});

// Define a more robust schema that ensures we always get an array of JudgementItems
export const judgementsSchema = z.union([
  // Allow null/undefined to be transformed to empty array
  z.null().transform(() => []),
  z.undefined().transform(() => []),
  // Ensure we have an array of JudgementItems
  z.array(judgementItemSchema),
]);

export const isFieldJudgementsValue = (
  fieldValue: unknown,
): fieldValue is FieldJudgementsValue => {
  // First check if it's already an array of JudgementItems
  if (Array.isArray(fieldValue) && 
      fieldValue.every(item => 
        typeof item === 'object' && 
        item !== null && 
        'text' in item && 
        'author' in item && 
        'createdAt' in item)) {
    return true;
  }
  
  // Otherwise use the schema to validate
  return judgementsSchema.safeParse(fieldValue).success;
};
import { FieldOpinionsValue } from '@/object-record/record-field/types/FieldMetadata';
import { z } from 'zod';

// Define a more robust schema that ensures we always get an array of strings
export const opinionsSchema = z.union([
  // Allow null/undefined to be transformed to empty array
  z.null().transform(() => []),
  z.undefined().transform(() => []),
  // Ensure we have an array of strings
  z.array(z.string()),
  // If we get a single string, convert it to an array with one element
  z.string().transform(value => [value]),
]);

export const isFieldOpinionsValue = (
  fieldValue: unknown,
): fieldValue is FieldOpinionsValue => {
  // First check if it's already an array of strings
  if (Array.isArray(fieldValue) && fieldValue.every(item => typeof item === 'string')) {
    return true;
  }

  // Otherwise use the schema to validate
  return opinionsSchema.safeParse(fieldValue).success;
};
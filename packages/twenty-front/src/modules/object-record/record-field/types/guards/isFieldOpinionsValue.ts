import { FieldOpinionsValue } from '@/object-record/record-field/types/FieldMetadata';
import { z } from 'zod';

export const opinionsSchema = z.union([z.null(), z.array(z.string())]);

export const isFieldOpinionsValue = (
  fieldValue: unknown,
): fieldValue is FieldOpinionsValue => opinionsSchema.safeParse(fieldValue).success;

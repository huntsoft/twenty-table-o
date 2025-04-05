import { FieldDefinition } from '@/object-record/record-field/types/FieldDefinition';
import { FieldJudgementsMetadata } from '@/object-record/record-field/types/FieldMetadata';
import { FieldMetadataType } from 'twenty-shared/types';

export const isFieldJudgements = (
  field: FieldDefinition<any>,
): field is FieldDefinition<FieldJudgementsMetadata> =>
  field.type === FieldMetadataType.JUDGEMENTS;
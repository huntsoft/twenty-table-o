import { FieldDefinition } from '@/object-record/record-field/types/FieldDefinition';
import { FieldJudgementsMetadata } from '@/object-record/record-field/types/FieldMetadata';
import { FieldMetadataType } from 'twenty-shared/types';

export const isFieldJudgements = (
  field: Pick<FieldDefinition<any>, 'type'>,
): field is Pick<FieldDefinition<FieldJudgementsMetadata>, 'type'> =>
  field.type === FieldMetadataType.JUDGEMENTS;
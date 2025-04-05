import { FieldContext } from '@/object-record/record-field/contexts/FieldContext';
import { FieldDefinition } from '@/object-record/record-field/types/FieldDefinition';
import {
    FieldOpinionsMetadata,
    FieldOpinionsValue,
} from '@/object-record/record-field/types/FieldMetadata';
import { useRecordFieldValue } from '@/object-record/record-store/contexts/RecordFieldValueSelectorContext';
import { useContext, useMemo } from 'react';
import { isDefined } from 'twenty-shared/utils';
import { useOpinionsFieldInitialValue } from './useOpinionsFieldInitialValue';

export const useOpinionsFieldDisplay = () => {
  const { recordId, fieldDefinition } = useContext(FieldContext);
  const initialValue = useOpinionsFieldInitialValue();

  const { fieldName } = fieldDefinition.metadata;

  const rawFieldValue = useRecordFieldValue<FieldOpinionsValue | undefined>(
    recordId,
    fieldName,
  );

  // Ensure fieldValue is always an array
  const fieldValue = useMemo(() => {
    if (!isDefined(rawFieldValue)) {
      return initialValue;
    }

    if (!Array.isArray(rawFieldValue)) {
      return initialValue;
    }

    return rawFieldValue;
  }, [rawFieldValue, initialValue]);

  return {
    fieldDefinition: fieldDefinition as FieldDefinition<FieldOpinionsMetadata>,
    fieldValue,
  };
};
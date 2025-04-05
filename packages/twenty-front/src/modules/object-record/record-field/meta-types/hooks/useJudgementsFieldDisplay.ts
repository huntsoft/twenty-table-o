import { FieldContext } from '@/object-record/record-field/contexts/FieldContext';
import { FieldDefinition } from '@/object-record/record-field/types/FieldDefinition';
import {
    FieldJudgementsMetadata,
    FieldJudgementsValue,
} from '@/object-record/record-field/types/FieldMetadata';
import { useRecordFieldValue } from '@/object-record/record-store/contexts/RecordFieldValueSelectorContext';
import { useContext, useMemo } from 'react';
import { isDefined } from 'twenty-shared/utils';
import { useJudgementsFieldInitialValue } from './useJudgementsFieldInitialValue';

export const useJudgementsFieldDisplay = () => {
  const { recordId, fieldDefinition } = useContext(FieldContext);
  const initialValue = useJudgementsFieldInitialValue();

  const { fieldName } = fieldDefinition.metadata;

  const rawFieldValue = useRecordFieldValue<FieldJudgementsValue | undefined>(
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

  // Get the latest judgement for display in the table
  const latestJudgement = useMemo(() => {
    if (!fieldValue.length) {
      return null;
    }

    // Sort by createdAt in descending order and take the first one
    return [...fieldValue].sort((a, b) => 
      new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    )[0];
  }, [fieldValue]);

  return {
    fieldDefinition: fieldDefinition as FieldDefinition<FieldJudgementsMetadata>,
    fieldValue,
    latestJudgement,
  };
};
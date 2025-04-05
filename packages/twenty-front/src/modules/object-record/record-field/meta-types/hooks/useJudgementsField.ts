import { FieldContext } from '@/object-record/record-field/contexts/FieldContext';
import { usePersistField } from '@/object-record/record-field/hooks/usePersistField';
import { JudgementItem } from '@/object-record/record-field/types/FieldMetadata';
import { isFieldJudgements } from '@/object-record/record-field/types/guards/isFieldJudgements';
import { judgementsSchema } from '@/object-record/record-field/types/guards/isFieldJudgementsValue';
import { recordStoreFamilySelector } from '@/object-record/record-store/states/selectors/recordStoreFamilySelector';
import { useContext, useMemo } from 'react';
import { useRecoilState } from 'recoil';
import { useJudgementsFieldInitialValue } from './useJudgementsFieldInitialValue';

export const useJudgementsField = () => {
  const { recordId, fieldDefinition, hotkeyScope } = useContext(FieldContext);

  // Check if the field is a judgements field
  if (!isFieldJudgements(fieldDefinition)) {
    throw new Error(
      `Trying to use a "${fieldDefinition.type}" field as a "JUDGEMENTS" field.`,
    );
  }

  const fieldName = fieldDefinition.metadata.fieldName;
  const initialValue = useJudgementsFieldInitialValue();

  const [rawFieldValue, setRawFieldValue] = useRecoilState(
    recordStoreFamilySelector({
      recordId,
      fieldName,
    }),
  );

  // Safely handle the field value to ensure it's always an array of JudgementItems
  const fieldValue = useMemo(() => {
    if (!rawFieldValue) {
      return initialValue;
    }

    if (Array.isArray(rawFieldValue)) {
      return rawFieldValue;
    }

    return initialValue;
  }, [rawFieldValue, initialValue]);

  const persistField = usePersistField();

  const persistJudgementsField = (nextValue: JudgementItem[]) => {
    try {
      // Always ensure we're persisting an array
      const valueToSave = Array.isArray(nextValue) ? nextValue : [];

      // Validate with schema
      const validValue = judgementsSchema.parse(valueToSave);

      // Persist the validated value
      persistField(validValue);
    } catch (error) {
      console.error('Error persisting judgements field:', error);
      // Fallback to empty array if validation fails
      persistField([]);
    }
  };

  const addJudgement = (text: string, author: string) => {
    const newJudgement: JudgementItem = {
      text,
      author,
      createdAt: new Date().toISOString(),
    };

    const updatedJudgements = [...fieldValue, newJudgement];
    persistJudgementsField(updatedJudgements);
  };

  const setFieldValue = (value: unknown) => {
    // Ensure we're always setting an array
    const safeValue = Array.isArray(value) ? value : [];
    setRawFieldValue(safeValue);
  };

  return {
    fieldValue,
    setFieldValue,
    persistJudgementsField,
    addJudgement,
    hotkeyScope,
  };
};
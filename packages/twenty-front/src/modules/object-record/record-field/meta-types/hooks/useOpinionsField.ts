import { FieldContext } from '@/object-record/record-field/contexts/FieldContext';
import { usePersistField } from '@/object-record/record-field/hooks/usePersistField';
import { assertFieldMetadata } from '@/object-record/record-field/types/guards/assertFieldMetadata';
import { isFieldOpinions } from '@/object-record/record-field/types/guards/isFieldOpinions';
import { opinionsSchema } from '@/object-record/record-field/types/guards/isFieldOpinionsValue';
import { recordStoreFamilySelector } from '@/object-record/record-store/states/selectors/recordStoreFamilySelector';
import { useContext, useMemo } from 'react';
import { useRecoilState } from 'recoil';
import { FieldMetadataType } from '~/generated-metadata/graphql';
import { useOpinionsFieldInitialValue } from './useOpinionsFieldInitialValue';

export const useOpinionsField = () => {
  const { recordId, fieldDefinition, hotkeyScope } = useContext(FieldContext);

  assertFieldMetadata(FieldMetadataType.OPINIONS, isFieldOpinions, fieldDefinition);

  const fieldName = fieldDefinition.metadata.fieldName;
  const initialValue = useOpinionsFieldInitialValue();

  const [rawFieldValue, setRawFieldValue] = useRecoilState(
    recordStoreFamilySelector({
      recordId,
      fieldName,
    }),
  );

  // Safely handle the field value to ensure it's always an array
  const fieldValue = useMemo(() => {
    if (!rawFieldValue) {
      return initialValue;
    }

    if (Array.isArray(rawFieldValue)) {
      return rawFieldValue;
    }

    // If it's a string, try to make it a single-item array
    if (typeof rawFieldValue === 'string') {
      return [rawFieldValue];
    }

    return initialValue;
  }, [rawFieldValue, initialValue]);

  const persistField = usePersistField();

  const persistOpinionsField = (nextValue: string[]) => {
    try {
      // Always ensure we're persisting an array
      const valueToSave = Array.isArray(nextValue) ? nextValue : [];

      // Validate with schema
      const validValue = opinionsSchema.parse(valueToSave);

      // Persist the validated value
      persistField(validValue);
    } catch (error) {
      console.error('Error persisting opinions field:', error);
      // Fallback to empty array if validation fails
      persistField([]);
    }
  };

  const setFieldValue = (value: unknown) => {
    // Ensure we're always setting an array
    const safeValue = Array.isArray(value) ? value : [];
    setRawFieldValue(safeValue);
  };

  return {
    fieldValue,
    setFieldValue,
    persistOpinionsField,
    hotkeyScope,
  };
};

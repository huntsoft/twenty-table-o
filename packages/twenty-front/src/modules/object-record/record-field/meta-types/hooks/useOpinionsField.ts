import { FieldContext } from '@/object-record/record-field/contexts/FieldContext';
import { usePersistField } from '@/object-record/record-field/hooks/usePersistField';
import { FieldOpinionsValue } from '@/object-record/record-field/types/FieldMetadata';
import { assertFieldMetadata } from '@/object-record/record-field/types/guards/assertFieldMetadata';
import { isFieldOpinions } from '@/object-record/record-field/types/guards/isFieldOpinions';
import { opinionsSchema } from '@/object-record/record-field/types/guards/isFieldOpinionsValue';
import { recordStoreFamilySelector } from '@/object-record/record-store/states/selectors/recordStoreFamilySelector';
import { useContext } from 'react';
import { useRecoilState } from 'recoil';
import { FieldMetadataType } from '~/generated-metadata/graphql';

export const useOpinionsField = () => {
  const { recordId, fieldDefinition, hotkeyScope } = useContext(FieldContext);

  assertFieldMetadata(FieldMetadataType.OPINIONS, isFieldOpinions, fieldDefinition);

  const fieldName = fieldDefinition.metadata.fieldName;

  const [fieldValue, setFieldValue] = useRecoilState<FieldOpinionsValue>(
    recordStoreFamilySelector({
      recordId,
      fieldName,
    }),
  );

  const persistField = usePersistField();

  const persistOpinionsField = (nextValue: string[]) => {
    if (!nextValue) persistField(null);

    try {
      persistField(opinionsSchema.parse(nextValue));
    } catch {
      return;
    }
  };

  return {
    fieldValue,
    setFieldValue,
    persistOpinionsField,
    hotkeyScope,
  };
};

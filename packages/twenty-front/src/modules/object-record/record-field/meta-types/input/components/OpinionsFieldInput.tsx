import { useOpinionsField } from '@/object-record/record-field/meta-types/hooks/useOpinionsField';
import { useOpinionsFieldInitialValue } from '@/object-record/record-field/meta-types/hooks/useOpinionsFieldInitialValue';
import { MultiItemFieldInput } from '@/object-record/record-field/meta-types/input/components/MultiItemFieldInput';
import { OpinionsFieldMenuItem } from '@/object-record/record-field/meta-types/input/components/OpinionsFieldMenuItem';
import { useEffect, useMemo } from 'react';
import { FieldMetadataType } from '~/generated-metadata/graphql';

type OpinionsFieldInputProps = {
  onCancel?: () => void;
  onClickOutside?: (event: MouseEvent | TouchEvent) => void;
};

export const OpinionsFieldInput = ({
  onCancel,
  onClickOutside,
}: OpinionsFieldInputProps) => {
  const { persistOpinionsField, hotkeyScope, fieldValue, setFieldValue } = useOpinionsField();
  const initialValue = useOpinionsFieldInitialValue();

  // Ensure we initialize with an empty array if fieldValue is not an array
  useEffect(() => {
    if (!Array.isArray(fieldValue)) {
      setFieldValue(initialValue);
    }
  }, [fieldValue, setFieldValue, initialValue]);

  // Create a safe array value that's guaranteed to be an array
  const safeItems = useMemo(() => {
    if (!fieldValue) {
      return initialValue;
    }

    if (Array.isArray(fieldValue)) {
      return fieldValue;
    }

    return initialValue;
  }, [fieldValue, initialValue]);

  return (
    <MultiItemFieldInput
      hotkeyScope={hotkeyScope}
      newItemLabel="Add Item"
      items={safeItems}
      onPersist={persistOpinionsField}
      onCancel={onCancel}
      onClickOutside={onClickOutside}
      placeholder="Enter value"
      fieldMetadataType={FieldMetadataType.OPINIONS}
      renderItem={({ value, index, handleEdit, handleDelete }) => (
        <OpinionsFieldMenuItem
          key={index}
          dropdownId={`${hotkeyScope}-opinions-${index}`}
          value={value}
          onEdit={handleEdit}
          onDelete={handleDelete}
        />
      )}
    />
  );
};
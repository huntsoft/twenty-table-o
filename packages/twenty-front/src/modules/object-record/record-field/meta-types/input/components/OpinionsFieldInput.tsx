import { useOpinionsField } from '@/object-record/record-field/meta-types/hooks/useOpinionsField';
import { MultiItemFieldInput } from '@/object-record/record-field/meta-types/input/components/MultiItemFieldInput';
import { OpinionsFieldMenuItem } from '@/object-record/record-field/meta-types/input/components/OpinionsFieldMenuItem';
import { useMemo } from 'react';
import { FieldMetadataType } from '~/generated-metadata/graphql';

type OpinionsFieldInputProps = {
  onCancel?: () => void;
  onClickOutside?: (event: MouseEvent | TouchEvent) => void;
};

export const OpinionsFieldInput = ({
  onCancel,
  onClickOutside,
}: OpinionsFieldInputProps) => {
  const { persistOpinionsField, hotkeyScope, fieldValue } = useOpinionsField();

  const opinionsItems = useMemo<Array<string>>(
    () => (Array.isArray(fieldValue) ? fieldValue : []),
    [fieldValue],
  );

  return (
    <MultiItemFieldInput
      hotkeyScope={hotkeyScope}
      newItemLabel="Add Item"
      items={opinionsItems}
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
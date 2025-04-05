import { Chip, ChipVariant } from 'twenty-ui';

import { FieldOpinionsValue } from '@/object-record/record-field/types/FieldMetadata';
import { ExpandableList } from '@/ui/layout/expandable-list/components/ExpandableList';

type OpinionsDisplayProps = {
  value: FieldOpinionsValue | null | undefined;
};

export const OpinionsDisplay = ({ value }: OpinionsDisplayProps) => {
  // Ensure value is an array
  const safeValue = Array.isArray(value) ? value : [];

  return (
    <ExpandableList>
      {safeValue.map((item, index) => (
        <Chip
          key={`${item}-${index}`}
          variant={ChipVariant.Highlighted}
          label={item}
        />
      ))}
    </ExpandableList>
  );
};
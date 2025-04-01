import { Chip, ChipVariant } from 'twenty-ui';

import { FieldOpinionsValue } from '@/object-record/record-field/types/FieldMetadata';
import { ExpandableList } from '@/ui/layout/expandable-list/components/ExpandableList';

type OpinionsDisplayProps = {
  value: FieldOpinionsValue;
};

export const OpinionsDisplay = ({ value }: OpinionsDisplayProps) => {
  return (
    <ExpandableList>
      {value?.map((item, index) => (
        <Chip
          key={`${item}-${index}`}
          variant={ChipVariant.Highlighted}
          label={item}
        />
      ))}
    </ExpandableList>
  );
};

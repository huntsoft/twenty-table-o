import { MultiItemFieldMenuItem } from '@/object-record/record-field/meta-types/input/components/MultiItemFieldMenuItem';
import { JudgementItem } from '@/object-record/record-field/types/FieldMetadata';
import { JudgementsDisplay } from '@/ui/field/display/components/JudgementsDisplay';

type JudgementsFieldMenuItemProps = {
  dropdownId: string;
  onDelete?: () => void;
  judgement: JudgementItem;
};

// Create a display component that accepts the value prop
const JudgementDisplayComponent = ({ value }: { value: JudgementItem }) => (
  <JudgementsDisplay value={[value]} />
);

export const JudgementsFieldMenuItem = ({
  dropdownId,
  onDelete,
  judgement,
}: JudgementsFieldMenuItemProps) => {
  return (
    <MultiItemFieldMenuItem
      dropdownId={dropdownId}
      value={judgement}
      onDelete={onDelete}
      DisplayComponent={JudgementDisplayComponent}
      hasPrimaryButton={false}
    />
  );
};
import { MultiItemFieldMenuItem } from '@/object-record/record-field/meta-types/input/components/MultiItemFieldMenuItem';
import { OpinionsDisplay } from '@/ui/field/display/components/OpinionsDisplay';

type OpinionsFieldMenuItemProps = {
  dropdownId: string;
  onEdit?: () => void;
  onDelete?: () => void;
  value: string;
};

export const OpinionsFieldMenuItem = ({
  dropdownId,
  onEdit,
  onDelete,
  value,
}: OpinionsFieldMenuItemProps) => {
  return (
    <MultiItemFieldMenuItem
      dropdownId={dropdownId}
      value={value}
      onEdit={onEdit}
      onDelete={onDelete}
      DisplayComponent={() => <OpinionsDisplay value={[value]} />}
      hasPrimaryButton={false}
    />
  );
};

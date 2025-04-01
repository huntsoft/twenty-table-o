import { useOpinionsFieldDisplay } from '@/object-record/record-field/meta-types/hooks/useOpinionsFieldDisplay';
import { OpinionsDisplay } from '@/ui/field/display/components/OpinionsDisplay';

export const OpinionsFieldDisplay = () => {
  const { fieldValue } = useOpinionsFieldDisplay();

  if (!Array.isArray(fieldValue)) {
    return <></>;
  }

  return <OpinionsDisplay value={fieldValue} />;
};

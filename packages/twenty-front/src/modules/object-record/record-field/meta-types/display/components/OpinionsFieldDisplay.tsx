import { useOpinionsFieldDisplay } from '@/object-record/record-field/meta-types/hooks/useOpinionsFieldDisplay';
import { useOpinionsFieldInitialValue } from '@/object-record/record-field/meta-types/hooks/useOpinionsFieldInitialValue';
import { OpinionsDisplay } from '@/ui/field/display/components/OpinionsDisplay';

export const OpinionsFieldDisplay = () => {
  const { fieldValue } = useOpinionsFieldDisplay();
  const initialValue = useOpinionsFieldInitialValue();

  // Ensure we're always working with an array
  const safeFieldValue = Array.isArray(fieldValue) ? fieldValue : initialValue;

  return <OpinionsDisplay value={safeFieldValue} />;
};

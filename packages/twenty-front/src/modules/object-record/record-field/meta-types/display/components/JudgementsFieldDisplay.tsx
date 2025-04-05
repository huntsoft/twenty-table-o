import { useJudgementsFieldDisplay } from '@/object-record/record-field/meta-types/hooks/useJudgementsFieldDisplay';
import { useJudgementsFieldInitialValue } from '@/object-record/record-field/meta-types/hooks/useJudgementsFieldInitialValue';
import { JudgementsDisplay } from '@/ui/field/display/components/JudgementsDisplay';

type JudgementsFieldDisplayProps = {
  showLatestOnly?: boolean;
};

export const JudgementsFieldDisplay = ({ showLatestOnly = false }: JudgementsFieldDisplayProps) => {
  const { fieldValue } = useJudgementsFieldDisplay();
  const initialValue = useJudgementsFieldInitialValue();

  // Ensure we're always working with an array
  const safeFieldValue = Array.isArray(fieldValue) ? fieldValue : initialValue;

  return <JudgementsDisplay value={safeFieldValue} showLatestOnly={showLatestOnly} />;
};
import { useJudgementsField } from '@/object-record/record-field/meta-types/hooks/useJudgementsField';
import { useJudgementsFieldInitialValue } from '@/object-record/record-field/meta-types/hooks/useJudgementsFieldInitialValue';
import { JudgementsDisplay } from '@/ui/field/display/components/JudgementsDisplay';
import { TextArea } from '@/ui/input/components/TextArea';
import styled from '@emotion/styled';
import { useEffect, useMemo, useState } from 'react';
import { Button, IconPlus } from 'twenty-ui';

type JudgementsFieldInputProps = {
  onCancel?: () => void;
  onClickOutside?: (event: MouseEvent | TouchEvent) => void;
};

const StyledContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.spacing(2)};
  padding: ${({ theme }) => theme.spacing(2)};
  width: 100%;
`;

const StyledJudgementsContainer = styled.div`
  max-height: 200px;
  overflow-y: auto;
  margin-bottom: ${({ theme }) => theme.spacing(2)};
`;

const StyledInputContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.spacing(2)};
`;

const StyledButtonContainer = styled.div`
  display: flex;
  justify-content: flex-end;
`;

export const JudgementsFieldInput = ({
  onCancel,
  onClickOutside,
}: JudgementsFieldInputProps) => {
  const { persistJudgementsField, addJudgement, hotkeyScope, fieldValue, setFieldValue } = useJudgementsField();
  const initialValue = useJudgementsFieldInitialValue();
  const [newJudgementText, setNewJudgementText] = useState('');

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

  // Sort judgements by date (newest first)
  const sortedJudgements = useMemo(() => {
    return [...safeItems].sort(
      (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    );
  }, [safeItems]);

  const handleAddJudgement = () => {
    if (!newJudgementText.trim()) return;
    
    // In a real app, you would get the current user's name
    // For now, we'll use a placeholder
    const currentUser = "Current User";
    
    addJudgement(newJudgementText, currentUser);
    setNewJudgementText('');
  };

  const handleDeleteJudgement = (index: number) => {
    const updatedJudgements = [...safeItems];
    updatedJudgements.splice(index, 1);
    persistJudgementsField(updatedJudgements);
  };

  return (
    <StyledContainer>
      {sortedJudgements.length > 0 && (
        <StyledJudgementsContainer>
          <JudgementsDisplay value={sortedJudgements} />
        </StyledJudgementsContainer>
      )}
      
      <StyledInputContainer>
        <TextArea
          placeholder="Add a new judgement..."
          value={newJudgementText}
          onChange={(text) => setNewJudgementText(text)}
          minRows={3}
        />
        
        <StyledButtonContainer>
          <Button
            title="Add Judgement"
            Icon={IconPlus}
            onClick={handleAddJudgement}
            disabled={!newJudgementText.trim()}
          />
        </StyledButtonContainer>
      </StyledInputContainer>
    </StyledContainer>
  );
};
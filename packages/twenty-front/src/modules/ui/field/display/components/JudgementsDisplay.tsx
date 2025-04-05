import { FieldJudgementsValue, JudgementItem } from '@/object-record/record-field/types/FieldMetadata';
import { ExpandableList } from '@/ui/layout/expandable-list/components/ExpandableList';
import { useTheme } from '@emotion/react';
import styled from '@emotion/styled';
import { format } from 'date-fns';

type JudgementsDisplayProps = {
  value: FieldJudgementsValue | null | undefined;
  showLatestOnly?: boolean;
};

const StyledJudgementContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.spacing(1)};
  padding: ${({ theme }) => theme.spacing(1)};
  border-radius: ${({ theme }) => theme.border.radius.sm};
  background-color: ${({ theme }) => theme.background.transparent.light};
  margin-bottom: ${({ theme }) => theme.spacing(1)};
`;

const StyledJudgementHeader = styled.div`
  display: flex;
  justify-content: space-between;
  font-size: ${({ theme }) => theme.font.size.xs};
  color: ${({ theme }) => theme.font.color.tertiary};
`;

const StyledJudgementAuthor = styled.span`
  font-weight: ${({ theme }) => theme.font.weight.medium};
`;

const StyledJudgementDate = styled.span``;

const StyledJudgementText = styled.div`
  font-size: ${({ theme }) => theme.font.size.sm};
  color: ${({ theme }) => theme.font.color.primary};
  white-space: pre-wrap;
  word-break: break-word;
`;

const StyledEmptyState = styled.div`
  color: ${({ theme }) => theme.font.color.light};
  font-style: italic;
  font-size: ${({ theme }) => theme.font.size.sm};
`;

const JudgementCard = ({ judgement }: { judgement: JudgementItem }) => {
  const theme = useTheme();
  
  const formattedDate = format(
    new Date(judgement.createdAt),
    'MMM d, yyyy h:mm a',
  );

  return (
    <StyledJudgementContainer>
      <StyledJudgementHeader>
        <StyledJudgementAuthor>{judgement.author}</StyledJudgementAuthor>
        <StyledJudgementDate>{formattedDate}</StyledJudgementDate>
      </StyledJudgementHeader>
      <StyledJudgementText>{judgement.text}</StyledJudgementText>
    </StyledJudgementContainer>
  );
};

export const JudgementsDisplay = ({ value, showLatestOnly = false }: JudgementsDisplayProps) => {
  // Ensure value is an array
  const safeValue = Array.isArray(value) ? value : [];
  
  if (safeValue.length === 0) {
    return <StyledEmptyState>No judgements yet</StyledEmptyState>;
  }

  // Sort judgements by date (newest first)
  const sortedJudgements = [...safeValue].sort(
    (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
  );

  // If showLatestOnly is true, only show the most recent judgement
  const judgements = showLatestOnly ? [sortedJudgements[0]] : sortedJudgements;

  return (
    <ExpandableList>
      {judgements.map((judgement, index) => (
        <JudgementCard 
          key={`${judgement.author}-${judgement.createdAt}-${index}`} 
          judgement={judgement} 
        />
      ))}
    </ExpandableList>
  );
};
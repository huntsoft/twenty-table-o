import styled from '@emotion/styled';

import { FieldMetadataItem } from '@/object-metadata/types/FieldMetadataItem';
import { SettingsDataModelPreviewFormCard } from '@/settings/data-model/components/SettingsDataModelPreviewFormCard';
import { SettingsDataModelFieldJudgementsForm } from '@/settings/data-model/fields/forms/judgements/components/SettingsDataModelFieldJudgementsForm';
import {
  SettingsDataModelFieldPreviewCard,
  SettingsDataModelFieldPreviewCardProps,
} from '@/settings/data-model/fields/preview/components/SettingsDataModelFieldPreviewCard';
import { useEffect } from 'react';
import { useFormContext } from 'react-hook-form';
import { computeMetadataNameFromLabel } from '~/pages/settings/data-model/utils/compute-metadata-name-from-label.utils';

type SettingsDataModelFieldJudgementsSettingsFormCardProps = {
  disabled?: boolean;
  fieldMetadataItem: Pick<
    FieldMetadataItem,
    'icon' | 'label' | 'type' | 'defaultValue' | 'settings'
  >;
} & Pick<SettingsDataModelFieldPreviewCardProps, 'objectMetadataItem'>;

const StyledFieldPreviewCard = styled(SettingsDataModelFieldPreviewCard)`
  flex: 1 1 100%;
`;

export const SettingsDataModelFieldJudgementsSettingsFormCard = ({
  disabled,
  fieldMetadataItem,
  objectMetadataItem,
}: SettingsDataModelFieldJudgementsSettingsFormCardProps) => {
  const { watch, setValue } = useFormContext();

  // Ensure name is set when component mounts
  useEffect(() => {
    const label = watch('label');
    const isLabelSyncedWithName = watch('isLabelSyncedWithName');

    if (isLabelSyncedWithName && label) {
      setValue('name', computeMetadataNameFromLabel(label), { shouldValidate: true });
    }
  }, [watch, setValue]);

  return (
    <SettingsDataModelPreviewFormCard
      preview={
        <StyledFieldPreviewCard
          fieldMetadataItem={{
            icon: watch('icon'),
            label: watch('label') || 'New Field',
            settings: watch('settings') || null,
            type: fieldMetadataItem.type,
          }}
          objectMetadataItem={objectMetadataItem}
        />
      }
      form={
        <SettingsDataModelFieldJudgementsForm
          disabled={disabled}
          fieldMetadataItem={fieldMetadataItem}
        />
      }
    />
  );
};
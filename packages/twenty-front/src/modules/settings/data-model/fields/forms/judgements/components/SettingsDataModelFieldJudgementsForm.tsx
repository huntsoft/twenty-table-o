import { useEffect } from 'react';
import { Controller, useFormContext, useWatch } from 'react-hook-form';

import { FieldMetadataItem } from '@/object-metadata/types/FieldMetadataItem';
import { z } from 'zod';
import { computeMetadataNameFromLabel } from '~/pages/settings/data-model/utils/compute-metadata-name-from-label.utils';

type SettingsDataModelFieldJudgementsFormProps = {
  disabled?: boolean;
  fieldMetadataItem: Pick<
    FieldMetadataItem,
    'icon' | 'label' | 'type' | 'defaultValue' | 'settings'
  >;
};

export const judgementsFieldDefaultValueSchema = z.object({
  // Add any specific settings for judgements field if needed
});

export const settingsDataModelFieldJudgementsFormSchema = z.object({
  settings: judgementsFieldDefaultValueSchema,
});

export type SettingsDataModelFieldJudgementsFormValues = z.infer<
  typeof settingsDataModelFieldJudgementsFormSchema
>;

export const SettingsDataModelFieldJudgementsForm = ({
  disabled,
  fieldMetadataItem,
}: SettingsDataModelFieldJudgementsFormProps) => {
  const { control, setValue } = useFormContext<SettingsDataModelFieldJudgementsFormValues>();

  // Watch for label changes to sync with name if needed
  const label = useWatch({ name: 'label' });
  const isLabelSyncedWithName = useWatch({ name: 'isLabelSyncedWithName' });

  // Ensure name is set based on label if synced
  useEffect(() => {
    if (isLabelSyncedWithName && label) {
      setValue('name', computeMetadataNameFromLabel(label), { shouldValidate: true });
    }
  }, [label, isLabelSyncedWithName, setValue]);

  return (
    <Controller
      name="settings"
      defaultValue={{}}
      control={control}
      render={({ field: { onChange, value } }) => {
        return (
          <>
            {/* Add any specific settings UI for judgements field if needed */}
          </>
        );
      }}
    />
  );
};
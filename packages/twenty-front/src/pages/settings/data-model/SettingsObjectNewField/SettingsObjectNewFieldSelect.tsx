import { useFilteredObjectMetadataItems } from '@/object-metadata/hooks/useFilteredObjectMetadataItems';
import { RecordFieldValueSelectorContextProvider } from '@/object-record/record-store/contexts/RecordFieldValueSelectorContext';
import { SettingsPageContainer } from '@/settings/components/SettingsPageContainer';
import { SettingsDataModelNewFieldBreadcrumbDropDown } from '@/settings/data-model/components/SettingsDataModelNewFieldBreadcrumbDropDown';
import { SETTINGS_FIELD_TYPE_CONFIGS } from '@/settings/data-model/constants/SettingsFieldTypeConfigs';
import { SettingsObjectNewFieldSelector } from '@/settings/data-model/fields/forms/components/SettingsObjectNewFieldSelector';
import { FieldType } from '@/settings/data-model/types/FieldType';
import { SettingsFieldType } from '@/settings/data-model/types/SettingsFieldType';
import { AppPath } from '@/types/AppPath';
import { SettingsPath } from '@/types/SettingsPath';
import { SubMenuTopBarContainer } from '@/ui/layout/page/components/SubMenuTopBarContainer';
import { zodResolver } from '@hookform/resolvers/zod';
import { useEffect } from 'react';
import { FormProvider, useForm } from 'react-hook-form';
import { useParams } from 'react-router-dom';
import { z } from 'zod';
import { FieldMetadataType } from '~/generated-metadata/graphql';
import { useNavigateApp } from '~/hooks/useNavigateApp';
import { getSettingsPath } from '~/utils/navigation/getSettingsPath';
import { t } from '@lingui/core/macro';
import { isDefined } from 'twenty-shared/utils';

export const settingsDataModelFieldTypeFormSchema = z.object({
  type: z.nativeEnum(FieldMetadataType),  // Use nativeEnum to include all valid types
});

export type SettingsDataModelFieldTypeFormValues = z.infer<
  typeof settingsDataModelFieldTypeFormSchema
>;

export const SettingsObjectNewFieldSelect = () => {
  const navigate = useNavigateApp();
  const { objectNamePlural = '' } = useParams();
  const { findActiveObjectMetadataItemByNamePlural } =
    useFilteredObjectMetadataItems();
  const activeObjectMetadataItem =
    findActiveObjectMetadataItemByNamePlural(objectNamePlural);
  const formMethods = useForm<SettingsDataModelFieldTypeFormValues>({
    resolver: zodResolver(settingsDataModelFieldTypeFormSchema),
    defaultValues: {
      type: FieldMetadataType.TEXT,
    },
    mode: 'onSubmit',
    reValidateMode: 'onSubmit',
  });
  const excludedFieldTypes: FieldType[] = (
    [
      FieldMetadataType.NUMERIC,
      FieldMetadataType.RICH_TEXT,
      FieldMetadataType.RICH_TEXT_V2,
      FieldMetadataType.ACTOR,
    ] as const
  ).filter(isDefined);

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const fieldType = params.get('fieldType');
    
    if (fieldType && Object.values(FieldMetadataType).includes(fieldType as FieldMetadataType)) {
      formMethods.setValue('type', fieldType as FieldMetadataType, {
        shouldValidate: false,
      });
    }
  }, []);

  useEffect(() => {
    if (!activeObjectMetadataItem) {
      navigate(AppPath.NotFound);
    }
  }, [activeObjectMetadataItem, navigate]);

  if (!activeObjectMetadataItem) return null;

  return (
    <RecordFieldValueSelectorContextProvider>
      <FormProvider {...formMethods}>
        <SubMenuTopBarContainer
          title={t`1. Select a field type`}
          links={[
            { children: t`Workspace`, href: '/settings/workspace' },
            { children: t`Objects`, href: '/settings/objects' },
            {
              children: activeObjectMetadataItem.labelPlural,
              href: getSettingsPath(SettingsPath.ObjectDetail, {
                objectNamePlural,
              }),
            },
            { children: <SettingsDataModelNewFieldBreadcrumbDropDown /> },
          ]}
        >
          <SettingsPageContainer>
            <SettingsObjectNewFieldSelector
              objectNamePlural={objectNamePlural}
              excludedFieldTypes={excludedFieldTypes}
            />
          </SettingsPageContainer>
        </SubMenuTopBarContainer>
      </FormProvider>
    </RecordFieldValueSelectorContextProvider>
  );
};

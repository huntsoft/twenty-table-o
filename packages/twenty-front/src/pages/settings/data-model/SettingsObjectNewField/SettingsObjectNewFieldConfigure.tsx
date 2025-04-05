import { useCreateOneRelationMetadataItem } from '@/object-metadata/hooks/useCreateOneRelationMetadataItem';
import { useFieldMetadataItem } from '@/object-metadata/hooks/useFieldMetadataItem';
import { useFilteredObjectMetadataItems } from '@/object-metadata/hooks/useFilteredObjectMetadataItems';
import { CoreObjectNameSingular } from '@/object-metadata/types/CoreObjectNameSingular';
import { useFindManyRecords } from '@/object-record/hooks/useFindManyRecords';
import { RecordFieldValueSelectorContextProvider } from '@/object-record/record-store/contexts/RecordFieldValueSelectorContext';
import { SaveAndCancelButtons } from '@/settings/components/SaveAndCancelButtons/SaveAndCancelButtons';
import { SettingsPageContainer } from '@/settings/components/SettingsPageContainer';
import { SettingsDataModelNewFieldBreadcrumbDropDown } from '@/settings/data-model/components/SettingsDataModelNewFieldBreadcrumbDropDown';
import { FIELD_NAME_MAXIMUM_LENGTH } from '@/settings/data-model/constants/FieldNameMaximumLength';
import { SettingsDataModelFieldDescriptionForm } from '@/settings/data-model/fields/forms/components/SettingsDataModelFieldDescriptionForm';
import { SettingsDataModelFieldIconLabelForm } from '@/settings/data-model/fields/forms/components/SettingsDataModelFieldIconLabelForm';
import { SettingsDataModelFieldSettingsFormCard } from '@/settings/data-model/fields/forms/components/SettingsDataModelFieldSettingsFormCard';
import { settingsFieldFormSchema } from '@/settings/data-model/fields/forms/validation-schemas/settingsFieldFormSchema';
import { SettingsFieldType } from '@/settings/data-model/types/SettingsFieldType';
import { AppPath } from '@/types/AppPath';
import { SettingsPath } from '@/types/SettingsPath';
import { SnackBarVariant } from '@/ui/feedback/snack-bar-manager/components/SnackBar';
import { useSnackBar } from '@/ui/feedback/snack-bar-manager/hooks/useSnackBar';
import { SubMenuTopBarContainer } from '@/ui/layout/page/components/SubMenuTopBarContainer';
import { View } from '@/views/types/View';
import { ViewType } from '@/views/types/ViewType';
import { useApolloClient } from '@apollo/client';
import { zodResolver } from '@hookform/resolvers/zod';
import { useLingui } from '@lingui/react/macro';
import pick from 'lodash.pick';
import { useEffect, useState } from 'react';
import { FormProvider, useForm } from 'react-hook-form';
import { useParams, useSearchParams } from 'react-router-dom';
import { H2Title, Section } from 'twenty-ui';
import { z } from 'zod';
import { FieldMetadataType } from '~/generated-metadata/graphql';
import { useNavigateApp } from '~/hooks/useNavigateApp';
import { useNavigateSettings } from '~/hooks/useNavigateSettings';
import { DEFAULT_ICONS_BY_FIELD_TYPE } from '~/pages/settings/data-model/constants/DefaultIconsByFieldType';
import { computeMetadataNameFromLabel } from '~/pages/settings/data-model/utils/compute-metadata-name-from-label.utils';
import { isUndefinedOrNull } from '~/utils/isUndefinedOrNull';
import { getSettingsPath } from '~/utils/navigation/getSettingsPath';
type SettingsDataModelNewFieldFormValues = z.infer<
  ReturnType<typeof settingsFieldFormSchema>
> &
  any;

const DEFAULT_ICON_FOR_NEW_FIELD = 'IconUsers';

export const SettingsObjectNewFieldConfigure = () => {
  const { t } = useLingui();

  const navigateApp = useNavigateApp();
  const navigate = useNavigateSettings();

  const { objectNamePlural = '' } = useParams();
  const [searchParams] = useSearchParams();
  const fieldType =
    (searchParams.get('fieldType') as SettingsFieldType) ||
    FieldMetadataType.TEXT;
  const { enqueueSnackBar } = useSnackBar();

  const { findActiveObjectMetadataItemByNamePlural } =
    useFilteredObjectMetadataItems();
  const activeObjectMetadataItem =
    findActiveObjectMetadataItemByNamePlural(objectNamePlural);
  const { createMetadataField } = useFieldMetadataItem();
  const apolloClient = useApolloClient();

  // Ensure fieldType is a valid FieldMetadataType
  const validFieldType = fieldType as FieldMetadataType;

  const formConfig = useForm<SettingsDataModelNewFieldFormValues>({
    resolver: zodResolver(settingsFieldFormSchema()),
    defaultValues: {
      type: validFieldType,
      icon: DEFAULT_ICONS_BY_FIELD_TYPE[validFieldType] ?? DEFAULT_ICON_FOR_NEW_FIELD,
      isLabelSyncedWithName: true,
      settings: {},
    },
    mode: 'onSubmit',
    reValidateMode: 'onSubmit',
  });

  // Force set the type to ensure it's properly initialized
  useEffect(() => {
    // This is critical - we need to ensure the type is set correctly
    formConfig.setValue('type', validFieldType, { shouldValidate: true });

    // For JUDGEMENTS field type, we need to ensure settings is initialized
    if (validFieldType === FieldMetadataType.JUDGEMENTS) {
      formConfig.setValue('settings', {}, { shouldValidate: true });

      // Set a default name if label is empty to pass validation
      const currentLabel = formConfig.getValues('label');
      if (!currentLabel || currentLabel.trim() === '') {
        formConfig.setValue('label', 'New Judgements Field', { shouldValidate: true });
        formConfig.setValue('name', 'newJudgementsField', { shouldValidate: true });
      }

      // Force validation after a short delay
      setTimeout(() => {
        formConfig.trigger();
      }, 100);
    }
  }, [validFieldType, formConfig]);

  useEffect(() => {
    // Set the icon based on field type
    formConfig.setValue(
      'icon',
      DEFAULT_ICONS_BY_FIELD_TYPE[fieldType] ?? DEFAULT_ICON_FOR_NEW_FIELD,
    );
  }, [fieldType, formConfig]);

  // Watch for label changes to automatically set name field
  const label = formConfig.watch('label');
  const isLabelSyncedWithName = formConfig.watch('isLabelSyncedWithName');

  useEffect(() => {
    if (isLabelSyncedWithName && label) {
      const computedName = computeMetadataNameFromLabel(label);
      formConfig.setValue('name', computedName, {
        shouldValidate: true,
        shouldDirty: true
      });

      // For JUDGEMENTS field type, we need to ensure the form is validated
      if (validFieldType === FieldMetadataType.JUDGEMENTS) {
        // Trigger validation after name is set
        setTimeout(() => {
          formConfig.trigger();
        }, 0);
      }
    } else if (isLabelSyncedWithName && validFieldType === FieldMetadataType.JUDGEMENTS) {
      // If label is empty but we're in JUDGEMENTS mode, set a default name
      formConfig.setValue('name', 'newJudgementsField', {
        shouldValidate: true,
        shouldDirty: true
      });
    }
  }, [label, isLabelSyncedWithName, formConfig, validFieldType]);

  const [, setObjectViews] = useState<View[]>([]);
  const [, setRelationObjectViews] = useState<View[]>([]);

  useFindManyRecords<View>({
    objectNameSingular: CoreObjectNameSingular.View,
    filter: {
      type: { eq: ViewType.Table },
      objectMetadataId: { eq: activeObjectMetadataItem?.id },
    },
    onCompleted: async (views) => {
      if (isUndefinedOrNull(views)) return;
      setObjectViews(views);
    },
  });

  const relationObjectMetadataId = formConfig.watch(
    'relation.objectMetadataId',
  );

  useFindManyRecords<View>({
    objectNameSingular: CoreObjectNameSingular.View,
    skip: !relationObjectMetadataId,
    filter: {
      type: { eq: ViewType.Table },
      objectMetadataId: { eq: relationObjectMetadataId },
    },
    onCompleted: async (views) => {
      if (isUndefinedOrNull(views)) return;
      setRelationObjectViews(views);
    },
  });
  const { createOneRelationMetadataItem: createOneRelationMetadata } =
    useCreateOneRelationMetadataItem();

  useEffect(() => {
    if (!activeObjectMetadataItem) {
      navigateApp(AppPath.NotFound);
    }
  }, [activeObjectMetadataItem, navigateApp]);

  if (!activeObjectMetadataItem) return null;

  const { isValid, isSubmitting, errors } = formConfig.formState;
  const canSave = isValid && !isSubmitting;

  // Add a useEffect to log form values and errors for debugging
  useEffect(() => {
    console.log('Form values:', formConfig.getValues());
    console.log('Form errors:', errors);
    console.log('Form is valid:', isValid);
  }, [formConfig, errors, isValid]);

  // Special handling for JUDGEMENTS field type - force validation after component mount
  useEffect(() => {
    // Force validation after a short delay to ensure all fields are properly initialized
    const timer = setTimeout(() => {
      // For JUDGEMENTS field type, ensure all required fields are set
      if (validFieldType === FieldMetadataType.JUDGEMENTS) {
        const currentValues = formConfig.getValues();

        // Ensure type is set
        if (!currentValues.type) {
          formConfig.setValue('type', validFieldType, { shouldValidate: true });
        }

        // Ensure settings is set
        if (!currentValues.settings) {
          formConfig.setValue('settings', {}, { shouldValidate: true });
        }

        // Ensure name is set if label is synced
        if (currentValues.isLabelSyncedWithName &&
            (!currentValues.name || currentValues.name.trim() === '')) {
          const nameValue = currentValues.label ?
            computeMetadataNameFromLabel(currentValues.label) :
            'newJudgementsField';
          formConfig.setValue('name', nameValue, { shouldValidate: true });
        }
      }

      // Trigger validation
      formConfig.trigger();
    }, 500);

    return () => clearTimeout(timer);
  }, [formConfig, validFieldType]);

  const handleSave = async (
    formValues: SettingsDataModelNewFieldFormValues,
  ) => {
    try {
      navigate(SettingsPath.ObjectDetail, {
        objectNamePlural,
      });

      if (
        formValues.type === FieldMetadataType.RELATION &&
        'relation' in formValues
      ) {
        const { relation: relationFormValues, ...fieldFormValues } = formValues;

        await createOneRelationMetadata({
          relationType: relationFormValues.type,
          field: pick(fieldFormValues, [
            'icon',
            'label',
            'description',
            'name',
            'isLabelSyncedWithName',
          ]),
          objectMetadataId: activeObjectMetadataItem.id,
          connect: {
            field: {
              icon: relationFormValues.field.icon,
              label: relationFormValues.field.label,
              name:
                (relationFormValues.field.isLabelSyncedWithName ?? true)
                  ? computeMetadataNameFromLabel(relationFormValues.field.label)
                  : relationFormValues.field.name,
            },
            objectMetadataId: relationFormValues.objectMetadataId,
          },
        });
      } else {
        // Ensure name and settings are set for JUDGEMENTS field type
        if (formValues.type === FieldMetadataType.JUDGEMENTS) {
          // Ensure name is set
          if (formValues.isLabelSyncedWithName &&
              (!formValues.name || formValues.name.trim() === '')) {
            formValues.name = formValues.label ?
              computeMetadataNameFromLabel(formValues.label) :
              'newJudgementsField';
          }

          // Ensure settings is set
          if (!formValues.settings) {
            formValues.settings = {};
          }
        }

        await createMetadataField({
          ...formValues,
          objectMetadataId: activeObjectMetadataItem.id,
        });
      }

      // TODO: fix optimistic update logic
      // Forcing a refetch for now but it's not ideal
      await apolloClient.refetchQueries({
        include: ['FindManyViews', 'CombinedFindManyRecords'],
      });
    } catch (error) {
      const isDuplicateFieldNameInObject = (error as Error).message.includes(
        'duplicate key value violates unique constraint "IndexOnNameObjectMetadataIdAndWorkspaceIdUnique"',
      );

      enqueueSnackBar(
        isDuplicateFieldNameInObject
          ? t`Please use different names for your source and destination fields`
          : (error as Error).message,
        {
          variant: SnackBarVariant.Error,
        },
      );
    }
  };
  if (!activeObjectMetadataItem) return null;

  return (
    <RecordFieldValueSelectorContextProvider>
      <FormProvider // eslint-disable-next-line react/jsx-props-no-spreading
        {...formConfig}
      >
        <SubMenuTopBarContainer
          title={t`2. Configure field`}
          links={[
            {
              children: t`Workspace`,
              href: getSettingsPath(SettingsPath.Workspace),
            },
            {
              children: t`Objects`,
              href: getSettingsPath(SettingsPath.Objects),
            },
            {
              children: activeObjectMetadataItem.labelPlural,
              href: getSettingsPath(SettingsPath.ObjectDetail, {
                objectNamePlural,
              }),
            },
            { children: <SettingsDataModelNewFieldBreadcrumbDropDown /> },
          ]}
          actionButton={
            <SaveAndCancelButtons
              isSaveDisabled={!canSave}
              isCancelDisabled={isSubmitting}
              onCancel={() =>
                navigate(
                  SettingsPath.ObjectNewFieldSelect,
                  {
                    objectNamePlural,
                  },
                  {
                    fieldType,
                  },
                )
              }
              onSave={formConfig.handleSubmit(handleSave)}
            />
          }
        >
          <SettingsPageContainer>
            <Section>
              <H2Title
                title={t`Icon and Name`}
                description={t`The name and icon of this field`}
              />
              <SettingsDataModelFieldIconLabelForm
                maxLength={FIELD_NAME_MAXIMUM_LENGTH}
                canToggleSyncLabelWithName={
                  fieldType !== FieldMetadataType.RELATION
                }
              />
            </Section>
            <Section>
              <H2Title
                title={t`Values`}
                description={t`The values of this field`}
              />
              <SettingsDataModelFieldSettingsFormCard
                fieldMetadataItem={{
                  icon: formConfig.watch('icon'),
                  label: formConfig.watch('label') || 'New Field',
                  settings: formConfig.watch('settings') || null,
                  type: fieldType as FieldMetadataType,
                }}
                objectMetadataItem={activeObjectMetadataItem}
              />
            </Section>
            <Section>
              <H2Title
                title={t`Description`}
                description={t`The description of this field`}
              />
              <SettingsDataModelFieldDescriptionForm />
            </Section>
          </SettingsPageContainer>
        </SubMenuTopBarContainer>
      </FormProvider>
    </RecordFieldValueSelectorContextProvider>
  );
};

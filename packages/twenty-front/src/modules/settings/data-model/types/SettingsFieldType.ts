import { FieldType } from '@/settings/data-model/types/FieldType';
import { SettingsExcludedFieldType } from '@/settings/data-model/types/SettingsExcludedFieldType';
import { ExcludeLiteral } from '~/types/ExcludeLiteral';

// Update this type to include JUDGEMENTS
export type SettingsFieldType = ExcludeLiteral<
  FieldType | 'JUDGEMENTS',
  SettingsExcludedFieldType
>;

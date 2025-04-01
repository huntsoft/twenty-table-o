import { FieldMetadataType } from '~/generated-metadata/graphql';

import { FieldDefinition } from '../FieldDefinition';
import { FieldMetadata, FieldOpinionsMetadata } from '../FieldMetadata';

export const isFieldOpinions = (
  field: Pick<FieldDefinition<FieldMetadata>, 'type'>,
): field is FieldDefinition<FieldOpinionsMetadata> =>
  field.type === FieldMetadataType.OPINIONS;

import {
  ABSTRACT_TYPE_CATEGORIES,
} from './constants';
import Text from './type-configs/text';
import Number from './type-configs/number';
import Unknown from './type-configs/unknown';

import type { AbstractType, AbstractTypeResponse, AbstractTypeConfiguration } from './types.d';

/**
 * This is meant to be serializable and replaced by an API
 * at a later point
 */
export const abstractTypeCategories = {
  [ABSTRACT_TYPE_CATEGORIES.Text]: Text,
  [ABSTRACT_TYPE_CATEGORIES.Number]: Number,
  [ABSTRACT_TYPE_CATEGORIES.Other]: Unknown,
};

function getAbstractTypeConfiguration(identifier: AbstractType['identifier']): AbstractTypeConfiguration {
  return abstractTypeCategories[identifier]
    || abstractTypeCategories[ABSTRACT_TYPE_CATEGORIES.Other];
}

export function constructAbstractTypeFromResponse(response: AbstractTypeResponse): AbstractType {
  return {
    ...response,
    ...getAbstractTypeConfiguration[response.identifier],
    dbTypes: new Set(response.db_types),
  } as AbstractType;
}

import { derived, writable, get } from 'svelte/store';
import { getAPI, States } from '@mathesar/utils/api';
import { currentDBId } from '@mathesar/stores/databases';
import { preloadCommonData } from '@mathesar/utils/preloadData';

import type { Readable, Writable, Unsubscriber } from 'svelte/store';
import type { Database, DbType } from '@mathesar/App.d';
import type { CancellablePromise } from '@mathesar-component-library';
import type { AbstractType, AbstractTypeResponse } from '@mathesar/stores/abstract-types/types';

import { constructAbstractTypeFromResponse } from './abstractTypeCategories';

const commonData = preloadCommonData();

export const UnknownAbstractType: AbstractType = constructAbstractTypeFromResponse({
  name: 'Unknown',
  identifier: 'other',
  db_types: [],
});

export type AbstractTypesMap = Map<AbstractType['identifier'], AbstractType>;

interface AbstractTypesSubstance {
  state: States,
  data: AbstractTypesMap,
  error?: string
}

const databasesToAbstractTypesStoreMap: Map<Database['id'], Writable<AbstractTypesSubstance>> = new Map();
const abstractTypesRequestMap: Map<Database['id'], CancellablePromise<AbstractTypeResponse[]>> = new Map();

function processTypeResponse(abstractTypesResponse: AbstractTypeResponse[]): AbstractTypesMap {
  const abstractTypesMap: AbstractTypesMap = new Map();
  abstractTypesResponse.forEach((entry) => {
    abstractTypesMap.set(entry.identifier, constructAbstractTypeFromResponse(entry));
  });
  return abstractTypesMap;
}

export async function refetchTypesForDB(databaseId: Database['id']): Promise<AbstractTypesMap> {
  const store = databasesToAbstractTypesStoreMap.get(databaseId);
  if (!store) {
    console.error(`DB Types store for db: ${databaseId} not found.`);
    return null;
  }

  try {
    store.update((currentData) => ({
      ...currentData,
      state: States.Loading,
    }));

    abstractTypesRequestMap.get(databaseId)?.cancel();

    const typesRequest = getAPI<AbstractTypeResponse[]>(`/databases/${databaseId}/types/`);
    abstractTypesRequestMap.set(databaseId, typesRequest);
    const response = await typesRequest;

    const abstractTypesMap = processTypeResponse(response);

    store.update((currentData) => ({
      ...currentData,
      state: States.Done,
      data: abstractTypesMap,
    }));

    return abstractTypesMap;
  } catch (err) {
    store.update((currentData) => ({
      ...currentData,
      state: States.Error,
      error: err instanceof Error ? err.message : 'Error in fetching schemas',
    }));
    return null;
  }
}

let preload = true;

function getTypesForDatabase(databaseId: Database['id']): Writable<AbstractTypesSubstance> {
  let store = databasesToAbstractTypesStoreMap.get(databaseId);
  if (!store) {
    store = writable({
      state: States.Loading,
      data: new Map(),
    });
    databasesToAbstractTypesStoreMap.set(databaseId, store);

    if (preload) {
      preload = false;
      store.update((currentData) => ({
        ...currentData,
        state: States.Done,
        data: processTypeResponse(commonData.abstract_types),
      }));
    } else {
      void refetchTypesForDB(databaseId);
    }
  } else if (get(store).error) {
    void refetchTypesForDB(databaseId);
  }
  return store;
}

export const abstractTypes: Readable<AbstractTypesSubstance> = derived(
  currentDBId,
  ($currentDBId, set) => {
    let unsubscribe: Unsubscriber;

    if (!$currentDBId) {
      set({
        state: States.Done,
        data: new Map(),
      });
    } else {
      const store = getTypesForDatabase($currentDBId);
      unsubscribe = store.subscribe((typesData) => {
        set(typesData);
      });
    }

    return () => {
      unsubscribe?.();
    };
  },
);

export function getAbstractTypeForDBType(
  dbType: DbType, abstractTypesMap: AbstractTypesMap,
): AbstractType | null {
  if (dbType && abstractTypesMap) {
    // eslint-disable-next-line no-restricted-syntax
    for (const [, abstractType] of abstractTypesMap) {
      if (abstractType.dbTypes.has(dbType)) {
        return abstractType;
      }
    }
  }
  return UnknownAbstractType;
}

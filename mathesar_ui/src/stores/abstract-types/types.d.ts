import type { DbType } from '@mathesar/App.d';

export interface AbstractTypeResponse {
  name: string,
  identifier: string,
  db_types: DbType[]
}

export interface AbstractTypeConfiguration {
  defaultDBType: DbType,
  icon: string,
  input: {
    type: string,
    validationRules?: Record<string, {
      method: string,
      op: string,
      value: unknown
    }>
    overrides?: unknown,
  },
  typeSwitchOptions?: {
    database: {
      allowDefault: boolean,
      fields: {
        type: string,
        id: string,
        label: string,
        options?: unknown,
        showOn?: {
          id: string,
          op: string,
          value: unknown,
        }
      }[],
      determinationRules?: {
        resolve: string,
        rule: unknown,
      }[]
    },
    display?: {
      fields: {
        type: string,
        id: string,
        label: string,
        options?: unknown[],
        showOn?: unknown
      }[]
    }
  }
}

export interface AbstractType extends Omit<AbstractTypeResponse, 'db_types'>, AbstractTypeConfiguration {
  dbTypes: Set<DbType>,
}

import { INPUT_TYPES } from '../constants';
import type { AbstractTypeConfiguration } from '../types.d';

const textType: AbstractTypeConfiguration = {
  icon: 'T',
  input: {
    type: INPUT_TYPES.String,
    validationRules: {
      CHAR: {
        method: 'length',
        op: 'lte',
        value: 255,
      },
      VARCHAR: {
        method: 'length',
        op: 'lte',
        value: 32672,
      },
    },
  },
  typeSwitchOptions: {
    database: {
      allowDefault: true,
      fields: [
        {
          type: 'toggle',
          id: 'restrictFieldSize',
          label: 'Restrict Field Size',
        },
        {
          type: INPUT_TYPES.Integer,
          id: 'fieldSizeLimit',
          label: 'Field Size Limit',
          showOn: {
            id: 'restrictFieldSize',
            op: 'eq',
            value: true,
          },
        },
      ],
      determinationRules: [
        {
          resolve: 'CHAR',
          rule: {
            and: [
              {
                id: 'restrictFieldSize',
                op: 'eq',
                value: true,
              },
              {
                id: 'fieldSizeLimit',
                op: 'lte',
                value: 255,
              },
            ],
          },
        },
        {
          resolve: 'VARCHAR',
          rule: {
            and: [
              {
                id: 'restrictFieldSize',
                op: 'eq',
                value: true,
              },
              {
                id: 'fieldSizeLimit',
                op: 'lte',
                value: 32672,
              },
            ],
          },
        },
        {
          resolve: 'TEXT',
          rule: {
            id: 'restrictFieldSize',
            op: 'eq',
            value: false,
          },
        },
      ],
    },
  },
};

export default textType;

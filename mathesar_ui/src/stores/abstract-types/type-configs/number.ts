import { INPUT_TYPES } from '../constants';
import type { AbstractTypeConfiguration } from '../types.d';

const numberType: AbstractTypeConfiguration = {
  icon: '#',
  input: {
    type: INPUT_TYPES.Integer,
  },
  typeSwitchOptions: {
    database: {
      allowDefault: true,
      fields: [
        {
          type: INPUT_TYPES.Select,
          id: 'numberType',
          label: 'Number Type',
          options: ['Integer', 'Decimal', 'Float'],
        },
        {
          type: INPUT_TYPES.Select,
          id: 'integerDataSize',
          label: 'Integer Data Size',
          options: ['Long int', 'Small int'],
          showOn: {
            id: 'numberType',
            op: 'eq',
            value: 'Integer',
          },
        },
        {
          type: INPUT_TYPES.Integer,
          id: 'decimalPlaces',
          label: 'Decimal Places',
          showOn: {
            id: 'numberType',
            op: 'eq',
            value: 'Decimal',
          },
        },
        {
          type: INPUT_TYPES.Integer,
          id: 'maxDigits',
          label: 'Max Digits',
          showOn: {
            id: 'maxDigits',
            op: 'eq',
            value: 'Decimal',
          },
        },
      ],
    },
    display: {
      fields: [
        {
          type: 'toggle',
          id: 'showAsPercentage',
          label: 'Show as Percentage',
        },
        {
          type: INPUT_TYPES.Select,
          id: 'format',
          label: 'Format',
          options: [
            {
              id: 1,
              label: 'English (US)',
            },
            {
              id: 2,
              label: 'French (FR)',
            },
          ],
        },
      ],
    },
  },
};

export default numberType;

import { INPUT_TYPES } from '../constants';
import type { AbstractTypeConfiguration } from '../types.d';

const unknownType: AbstractTypeConfiguration = {
  icon: '?',
  input: {
    type: INPUT_TYPES.String,
  },
};

export default unknownType;

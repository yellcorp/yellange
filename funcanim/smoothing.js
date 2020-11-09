import {
  smoothCubic as _smoothCubic,
  smoothQuintic as _smoothQuintic,
} from '../math';

export const smoothCubic = {
  type: 'smoothCubic',
  evaluate: _smoothCubic,
};

export const smoothQuintic = {
  type: 'smoothQuintic',
  evaluate: _smoothQuintic,
};

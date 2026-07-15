import { HAJJ_DATA } from './hajj.js';
import { HARAM_DATA } from './haram.js';
export { UI } from './ui.js';

export const DATA = {
  hajj: HAJJ_DATA,
  haram: HARAM_DATA,
};

export const ROUTE_KEYS = {
  hajj: ['haram', 'mina', 'arafah', 'muz', 'jamarat'],
  haram: ['kaaba', 'blackstone', 'hijr', 'maqam', 'safa', 'marwah'],
};

export function languageIndex(language) {
  return language === 'en' ? 0 : 1;
}

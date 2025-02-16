import { IsotopeEl, QueryRules } from './model';

type IsotopeElWithoutIndex = Omit<IsotopeEl, 'index'>;

const data: IsotopeElWithoutIndex[] = [
  { name: 'Nitrogen', abbr: 'N', float: '14.007', number: '7', tags: '' },
  {
    name: 'Sodium',
    abbr: 'Na',
    float: '22.99',
    number: '11',
    tags: 'metal ium',
  },
  { name: 'Argon', abbr: 'Ar', float: '39.948', number: '18', tags: '' },
  {
    name: 'Potassium',
    abbr: 'K',
    float: '39.0983',
    number: '19',
    tags: 'metal ium',
  },
  {
    name: 'Calcium',
    abbr: 'Ca',
    float: '40.078',
    number: '20',
    tags: 'metal ium',
  },
  {
    name: 'Cobalt',
    abbr: 'Co',
    float: '58.933',
    number: '27',
    tags: 'metal transition',
  },
  {
    name: 'Cadmium',
    abbr: 'Cd',
    float: '112.411',
    number: '48',
    tags: 'metal transition ium',
  },
  { name: 'Antimony', abbr: 'Sb', float: '121.76', number: '51', tags: '' },
  { name: 'Tellurium', abbr: 'Te', float: '127.6', number: '52', tags: 'ium' },
  {
    name: 'Ytterbium',
    abbr: 'Yb',
    float: '173.054',
    number: '70',
    tags: 'metal ium',
  },
  {
    name: 'Rhenium',
    abbr: 'Re',
    float: '186.207',
    number: '75',
    tags: 'metal transition ium',
  },
  {
    name: 'Gold',
    abbr: 'Au',
    float: '196.967',
    number: '79',
    tags: 'metal transition',
  },
  {
    name: 'Mercury',
    abbr: 'Hg',
    float: '200.59',
    number: '80',
    tags: 'metal transition',
  },
  {
    name: 'Thallium',
    abbr: 'Tl',
    float: '204.383',
    number: '81',
    tags: 'metal ium',
  },
  { name: 'Lead', abbr: 'Pb', float: '207.2', number: '82', tags: 'metal' },
  {
    name: 'Bismuth',
    abbr: 'Bi',
    float: '208.980',
    number: '83',
    tags: 'metal',
  },
  {
    name: 'Uranium',
    abbr: 'U',
    float: '238.029',
    number: '92',
    tags: 'metal ium',
  },
  {
    name: 'Plutonium',
    abbr: 'Pu',
    float: '244',
    number: '94',
    tags: 'metal ium',
  },
];

export const elements: IsotopeEl[] = data
  .sort((a, b) => a.name.localeCompare(b.name))
  .map((el, index) => {
    const isotope: IsotopeEl = {
      ...el,
      index,
    };
    return isotope;
  });

export const initialQueryRules: QueryRules = {
  filter: 'all',
  sort: 'name',
};

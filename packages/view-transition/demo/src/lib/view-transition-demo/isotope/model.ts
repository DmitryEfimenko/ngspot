export interface IsotopeEl {
  name: string;
  abbr: string;
  float: string;
  number: string;
  tags: string;
  index: number;
}

export interface QueryRules {
  filter: 'all' | 'metal' | 'transition' | 'ium';
  sort: 'name' | 'symbol' | 'number';
}

export interface NameSourcePair {
  name: string;
  source: string;
}

export interface DataItem {
  id: number;
  hex: string;
  name_source_pairs: NameSourcePair[];
}
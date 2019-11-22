export interface Category {
  id: number;
  name: string;
  parent: number;
  genre_v1: string; // genre?
  genre_v2: string; // genre?
  is_active: boolean;
  usable: boolean;
  visible: boolean;
  use_series: boolean;
  last_modified: string;
}

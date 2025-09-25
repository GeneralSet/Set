/* tslint:disable */
/* eslint-disable */
export function random(): number;
export class Set {
  free(): void;
  constructor(number_of_features: number, feature_options: number, board_size: number);
  is_set(ids: string[]): boolean;
  hint(board: string[]): string[];
  update_board(set_ids: string[]): Set;
  get_deck(): string[];
  get_board(): string[];
  is_end(): boolean;
  board_size: number;
  number_of_features: number;
  feature_options: number;
  sets: number;
}

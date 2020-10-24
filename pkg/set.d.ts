/* tslint:disable */
/* eslint-disable */
/**
* @returns {number}
*/
export function random(): number;
/**
*/
export class Set {
  free(): void;
/**
* @param {number} number_of_features
* @param {number} feature_options
* @returns {Set}
*/
  static new(number_of_features: number, feature_options: number): Set;
/**
* @param {string} ids
* @returns {boolean}
*/
  is_set(ids: string): boolean;
/**
* @param {string} board
* @returns {string}
*/
  hint(board: string): string;
/**
* @param {string} set
* @returns {Set}
*/
  update_board(set: string): Set;
/**
* @returns {string}
*/
  get_deck(): string;
/**
* @returns {string}
*/
  get_board(): string;
/**
* @returns {boolean}
*/
  is_end(): boolean;
/**
* @returns {number}
*/
  board_size: number;
/**
* @returns {number}
*/
  feature_options: number;
/**
* @returns {number}
*/
  number_of_features: number;
/**
* @returns {number}
*/
  sets: number;
}

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
* @param {number} board_size
*/
  constructor(number_of_features: number, feature_options: number, board_size: number);
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
*/
  board_size: number;
/**
*/
  feature_options: number;
/**
*/
  number_of_features: number;
/**
*/
  sets: number;
}

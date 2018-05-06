/* tslint:disable */
export function random_f64(): number;

export class Set {
board_size: number
number_of_features: number
feature_options: number
sets: number
free(): void;
static  new(arg0: number, arg1: number): Set;

 init_deck(): string;

 is_set(arg0: string): boolean;

 hint(arg0: string): string;

 update_board(arg0: string, arg1: string): Set;

 get_deck(): string;

 get_board(): string;

}

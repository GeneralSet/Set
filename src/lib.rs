#![feature(proc_macro, wasm_custom_section, wasm_import_module)]

extern crate wasm_bindgen;

use std::collections::HashMap;
use wasm_bindgen::prelude::*;

#[wasm_bindgen]
pub struct Set {
    board_size: usize,
    number_of_features: usize,
    feature_options: usize
}

#[wasm_bindgen]
impl Set {
    pub fn new() -> Set {
        Set {
            board_size: 12,
            number_of_features: 4,
            feature_options: 3
        }
    }

    fn generate_id(args: Vec<usize>) -> String {
        let mut id = String::new();
        for x in 0..args.len() {
            if x > 0 {
                id += &String::from("_");
            }
            id += &args[x].to_string();
        }
        id
    }

    fn generate_ids(&self, features: usize, args: Vec<usize>, mut ids: Vec<String>) -> String {
        if features <= 0 {
            return Set::generate_id(args);
        } else {
            for index in 0..self.feature_options {
                let mut new_args = args.clone();
                new_args.push(index);
                let id = self.generate_ids(features - 1, new_args, Vec::new());
                ids.push(id);
            }
            return ids.join(",");
        }
    }

    pub fn init_deck(&self) -> String {
        self.generate_ids(self.number_of_features, Vec::new(), Vec::new())
    }

    fn are_options_same_or_diffrent(features: &Vec<&str>) -> bool {
        let mut features_hash: HashMap<&str, &str> = HashMap::new();
        let mut all_diffrent = true;
        let mut all_same = true;

        for i in 0..features.len() {
            if features_hash.contains_key(features[i]) {
                all_diffrent = false;
            } else {
                features_hash.insert(features[i], "");
            }

            if (i + 1) < features.len() {
                if features[i] != features[i+1] {
                    all_same = false;
                }
            }
        }

        return all_diffrent || all_same;
    }

    pub fn is_set(&self, ids: String) -> bool {
        let ids = ids.split(",");
        let selected_features: Vec<Vec<&str>> = ids.map(|id| id.split("_").collect()).collect();

        for i in 0..self.number_of_features {
            let mut option_values: Vec<&str> = Vec::new();
            for id in &selected_features {
                let value: Option<&&str> = id.get(i);
                match value {
                    Some(x) => option_values.push(x),
                    None => return false,
                }
            }
            if !(Set::are_options_same_or_diffrent(&option_values)) {
                return false;
            }
        }
        return true;
    }

    fn find_sets(&self, board: &Vec<&str>, args: Vec<&str>, mut index: usize) -> Option<Vec<String>> {
        if args.len() >= self.feature_options {
            let str_args = args.join(",");
            if self.is_set(str_args.clone()) {
                return Some(vec![str_args]);
            } else {
                return None;
            }
        } else {
            let mut sets = vec![];
            for i in index..board.len() {
                let id = board[i];

                let mut new_args = args.clone();
                new_args.push(id);

                index += 1;
                let set = self.find_sets(board, new_args, index);
                match set {
                    Some(x) => sets.extend(x),
                    None => ()
                }
            }
            return Some(sets);
        }
    }

    pub fn hint(&self, board: String) -> String {
        let board: Vec<&str> = board.split(",").collect();
        match self.find_sets(&board, vec![], 0) {
            Some(valid_sets) => {
                match valid_sets.clone().pop() {
                    Some(set) => return set,
                    None => (),
                }
            },
            None => (),
        }
        String::from("")
    }
}

#[cfg(test)]
mod tests {
    use super::*;

    #[test]
    fn can_generate_an_id() {
        assert_eq!(Set::generate_id(vec![0,0,0,0]), "0_0_0_0");
    }

    #[test]
    fn are_options_same_or_diffrent() {
        assert_eq!(Set::are_options_same_or_diffrent(&vec!["0","0","0"]), true);
        assert_eq!(Set::are_options_same_or_diffrent(&vec!["0","1","0"]), false);
        assert_eq!(Set::are_options_same_or_diffrent(&vec!["0","1","2"]), true);
    }
}

//   public updateBoard(
//     deck: string[],
//     board: string[],
//     numberOfSets: number
//   ): {deck: string[], board: string[], numberOfSets: number} {
//     while (board.length < this.boardSize || numberOfSets < 1) {
//       if (deck.length < 1) {
//         break;
//       }
//       for (let i = 0 ; i < 3; i++) {
//         const randomIndex = Math.floor(Math.random() * deck.length);
//         board.push(deck[randomIndex]);
//         deck.splice(randomIndex, 1);
//       }
//       numberOfSets = this.numberOfSets(board);
//     }
//     numberOfSets = this.numberOfSets(board);
//     return {deck, board, numberOfSets};
//   }
//
// }

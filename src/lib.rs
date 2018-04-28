#![feature(proc_macro, wasm_custom_section, wasm_import_module)]

extern crate wasm_bindgen;

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
            let mut index = 0;
            while index < self.feature_options {
                let mut new_args = args.clone();
                new_args.push(index);
                let id = self.generate_ids(features - 1, new_args, Vec::new());
                ids.push(id);
                index += 1;
            }
            return ids.join(",");
        }
    }

    pub fn init_deck(&self) -> String {
        self.generate_ids(self.number_of_features, Vec::new(), Vec::new())
    }

    fn are_options_diffrent(features: &Vec<&str>) -> bool {
        for i in 0..features.len() {
            for j in (i + 1)..features.len() {
                if features[i] == features[j] {
                    return false;
                }
            }
        }
        return true;
    }

    fn are_options_same(features: &Vec<&str>) -> bool {
        for i in 1..features.len() {
            if features[i] != features[i-1] {
                return false;
            }
        }
        return true;
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
            if !(Set::are_options_diffrent(&option_values) || Set::are_options_same(&option_values)) {
                return false;
            }
        }
        return true;
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
    fn are_options_diffrent() {
        assert_eq!(Set::are_options_diffrent(&vec!["0","0","0"]), false);
        assert_eq!(Set::are_options_diffrent(&vec!["0","1","0"]), false);
        assert_eq!(Set::are_options_diffrent(&vec!["0","1","2"]), true);
    }

    #[test]
    fn are_options_same() {
        assert_eq!(Set::are_options_same(&vec!["0","0","0"]), true);
        assert_eq!(Set::are_options_same(&vec!["0","1","0"]), false);
        assert_eq!(Set::are_options_same(&vec!["0","1","2"]), false);
    }
}

//   private numberOfSets(board: string[]): number {
//     let count = 0;
//     for (let i = 0; i < board.length; i++) {
//       for (let j = i + 1; j < board.length; j++) {
//         for (let k = j + 1; k < board.length; k++) {
//           const isValidSet = this.isSet([board[i], board[j], board[k]]);
//           if (isValidSet) {
//             count++;
//           }
//         }
//       }
//     }
//     return count;
//   }
//
//   public hint(board: string[]): string[] {
//     for (let i = 0; i < board.length; i++) {
//       for (let j = i + 1; j < board.length; j++) {
//         for (let k = j + 1; k < board.length; k++) {
//           const potentialSet = [board[i], board[j], board[k]];
//           const isValidSet = this.isSet([board[i], board[j], board[k]]);
//           if (isValidSet) {
//             return potentialSet;
//           }
//         }
//       }
//     }
//     return [];
//   }
//
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

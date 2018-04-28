#![feature(proc_macro, wasm_custom_section, wasm_import_module)]

extern crate wasm_bindgen;

use wasm_bindgen::prelude::*;

#[wasm_bindgen]
pub struct Set {
    board_size: u32,
    number_of_features: u32,
    feature_options: u32
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

    fn generate_id(args: Vec<u32>) -> String {
        let mut id = String::new();
        for x in 0..args.len() {
            if x > 0 {
                id += &String::from("_");
            }
            id += &args[x].to_string();
        }
        id
    }

    fn generate_ids(&self, features: u32, args: Vec<u32>, mut ids: Vec<String>) -> String {
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

    pub fn are_attributes_not_equal(&self, features: String) -> bool {
        let features: Vec<&str> = features.split(",").collect();
        for i in 0..features.len() {
            for j in i + 1..features.len() {
                if features[i] == features[j] {
                    return false;
                }
            }
        }
        return true;
    }

    pub fn are_attributes_equal(&self, features: String) -> bool {
        let features: Vec<&str> = features.split(",").collect();
        for i in 1..features.len() {
            if features[i] != features[i-1] {
                return false;
            }
        }
        return true;
    }
}



//   TODO:
//   public isSet(ids: string[]): boolean {
//     const selectedFeatures = ids.map((id) => id.split('_'));
//     for (let i = 0; i < this.numberOfFeatures; i++) {
//       const attributeValues = selectedFeatures.map((features) => {
//         return features[i];
//       });
//       if (!(this.areAttributesEqual(attributeValues) ||
//             this.areAttributesNotEqual (attributeValues))) {
//         return false;
//       }
//     }
//     return true;
//   }
//
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

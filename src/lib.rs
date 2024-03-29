extern crate getrandom;
extern crate rand;
// extern crate serde_wasm_bindgen;
// extern crate serde;
extern crate wasm_bindgen;

use std::collections::HashMap;
use wasm_bindgen::prelude::*;
use wasm_bindgen::throw_str;
// use serde::{Serialize, Deserialize};

#[cfg(target_arch = "wasm32")]
#[wasm_bindgen]
extern "C" {
    #[wasm_bindgen(js_namespace = Math, js_name = random)]
    fn js_random() -> f64;
    #[wasm_bindgen(js_namespace = console, js_name = log)]
    fn console_log(msg: &str);
}

#[cfg(not(target_arch = "wasm32"))]
pub fn console_log(msg: &str) {
    println!("{}", msg);
}

#[cfg(not(target_arch = "wasm32"))]
pub fn random() -> f64 {
    return rand::random::<f64>();
}

#[cfg(target_arch = "wasm32")]
#[wasm_bindgen]
pub fn random() -> f64 {
    return js_random();
}

#[wasm_bindgen]
pub struct Set {
    pub board_size: usize,
    pub number_of_features: usize,
    pub feature_options: usize,
    deck: String,
    board: String,
    pub sets: usize,
}

#[wasm_bindgen]
impl Set {
    fn string_to_vec<'a>(value: &'a String) -> Vec<&'a str> {
        return value.split(",").skip_while(|x| x.is_empty()).collect();
    }

    fn generate_id(args: Vec<usize>) -> String {
        let string_args: Vec<String> = args.iter().map(|a| a.to_string()).collect();
        string_args.join("_")
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

    fn init_deck(&self) -> String {
        self.generate_ids(self.number_of_features, Vec::new(), Vec::new())
    }

    #[wasm_bindgen(constructor)]
    pub fn new(number_of_features: usize, feature_options: usize, board_size: usize) -> Set {
        let new_set = Set {
            board_size: board_size,
            number_of_features: number_of_features,
            feature_options: feature_options,
            deck: "".to_string(),
            board: "".to_string(),
            sets: 0,
        };
        let deck = new_set.init_deck();
        new_set.fill_board(deck, "".to_string())
    }

    fn are_options_same_or_different(features: &Vec<&str>) -> bool {
        let mut features_hash: HashMap<&str, &str> = HashMap::new();
        let mut all_different = true;
        let mut all_same = true;

        for i in 0..features.len() {
            if features_hash.contains_key(features[i]) {
                all_different = false;
            } else {
                features_hash.insert(features[i], "");
            }

            if (i + 1) < features.len() {
                if features[i] != features[i + 1] {
                    all_same = false;
                }
            }
        }

        return all_different || all_same;
    }

    pub fn is_set(&self, ids: String) -> bool {
        let ids = ids.split(",");
        let selected_features: Vec<Vec<&str>> = ids.map(|id| id.split("_").collect()).collect();

        if selected_features.len() != self.feature_options {
            throw_str("incorrect number of cards selected");
        }

        for i in 0..self.number_of_features {
            let mut option_values: Vec<&str> = Vec::new();
            for id in &selected_features {
                let value: Option<&&str> = id.get(i);
                match value {
                    Some(x) => option_values.push(x),
                    None => return false,
                }
            }
            if !(Set::are_options_same_or_different(&option_values)) {
                return false;
            }
        }
        return true;
    }

    fn find_sets(
        &self,
        board: &Vec<&str>,
        args: Vec<&str>,
        mut index: usize,
    ) -> Option<Vec<String>> {
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
                    None => (),
                }
            }
            return Some(sets);
        }
    }

    pub fn hint(&self, board: String) -> String {
        let board: Vec<&str> = Set::string_to_vec(&board);
        match self.find_sets(&board, vec![], 0) {
            Some(valid_sets) => match valid_sets.clone().pop() {
                Some(set) => return set,
                None => (),
            },
            None => (),
        }
        String::from("")
    }

    fn number_of_sets(&self, board: &Vec<&str>) -> usize {
        let valid_sets = self.find_sets(&board, vec![], 0);
        match valid_sets {
            Some(x) => x.len(),
            None => 0,
        }
    }

    fn next_card_index(&self, deck: Vec<&str>) -> usize {
        (random() * deck.len() as f64).floor() as usize
    }

    fn fill_board(&self, deck: String, board: String) -> Set {
        let mut board_array: Vec<&str> = Vec::new();
        if board.len() > 1 {
            board_array = Set::string_to_vec(&board)
        }
        let mut deck: Vec<&str> = Set::string_to_vec(&deck);

        let mut number_of_sets = self.number_of_sets(&board_array);
        while board_array.len() < self.board_size || number_of_sets < 1 {
            if deck.len() < 1 {
                number_of_sets = self.number_of_sets(&board_array);
                break;
            }
            for _i in 0..self.feature_options {
                let random_index = self.next_card_index(deck.clone());
                board_array.push(deck[random_index]);
                deck.remove(random_index);
            }
            number_of_sets = self.number_of_sets(&board_array);
        }
        Set {
            board_size: self.board_size,
            number_of_features: self.number_of_features,
            feature_options: self.feature_options,
            deck: deck.join(","),
            board: board_array.join(","),
            sets: number_of_sets,
        }
    }

    pub fn update_board(&self, set: String) -> Set {
        if !self.is_set(set.clone()) {
            throw_str("Failed to update board. Invalid set passed to update board");
        }
        let set_ids: Vec<&str> = Set::string_to_vec(&set);
        let board: Vec<&str> = Set::string_to_vec(&self.board);
        let mut deck: Vec<&str> = Set::string_to_vec(&self.deck);
        let mut new_board: Vec<&str> = Vec::new();

        for i in 0..board.len() {
            if !set_ids.contains(&board[i]) {
                new_board.push(board[i]);
                continue;
            }
            if deck.len() == 0 {
                continue;
            }
            if board.len() > self.board_size {
                continue;
            }
            let random_index = self.next_card_index(deck.clone());
            new_board.push(deck[random_index]);
            deck.remove(random_index);
        }
        let s = Set {
            board_size: self.board_size,
            number_of_features: self.number_of_features,
            feature_options: self.feature_options,
            deck: deck.join(","),
            board: new_board.join(","),
            sets: self.number_of_sets(&new_board),
        };
        if deck.len() > 0 {
            return s.fill_board(deck.join(","), new_board.join(","));
        } else {
            return s;
        }
    }

    pub fn get_deck(&self) -> String {
        self.deck.clone()
    }

    pub fn get_board(&self) -> String {
        self.board.clone()
    }

    pub fn is_end(&self) -> bool {
        self.deck.len() == 0 && self.sets == 0
    }
}

#[cfg(test)]
mod tests {
    use super::*;

    #[test]
    fn can_generate_an_id() {
        assert_eq!(Set::generate_id(vec![0, 0, 0, 0]), "0_0_0_0");
    }

    #[test]
    fn are_options_same_or_different() {
        assert_eq!(
            Set::are_options_same_or_different(&vec!["0", "0", "0"]),
            true
        );
        assert_eq!(
            Set::are_options_same_or_different(&vec!["0", "1", "0"]),
            false
        );
        assert_eq!(
            Set::are_options_same_or_different(&vec!["0", "1", "2"]),
            true
        );
    }

    #[test]
    fn number_of_sets() {
        let set = Set::new(4, 3, 12);
        assert_eq!(
            set.number_of_sets(&vec!["0_0_0_0", "1_1_1_1", "2_2_2_2", "2_2_2_1", "2_2_2_0"]),
            2
        );
    }

    #[test]
    #[should_panic]
    fn test_is_set_selection_to_small() {
        let set = Set::new(4, 3, 12);
        set.is_set("0_0_0_0,1_1_1_1".to_string());
    }

    #[test]
    fn test_is_set_all_different() {
        let set = Set::new(4, 3, 12);
        assert_eq!(set.is_set("0_0_0_0,1_1_1_1,2_2_2_2".to_string()), true);
    }

    #[test]
    fn test_is_set_invalid_set() {
        let set = Set::new(4, 3, 12);
        assert_eq!(set.is_set("0_0_0_1,1_1_1_1,2_2_2_2".to_string()), false);
    }

    #[test]
    #[should_panic]
    fn test_update_board_invalid_set() {
        let set = Set::new(4, 3, 12);

        set.update_board("0_0_0_1,1_1_1_1,4_4_4_4".to_string());
    }

    #[test]
    fn test_update_board_empty_deck() {
        let mut set = Set::new(4, 3, 12);
        set.deck = "".to_string();
        let valid_set = "0_0_0_0,1_1_1_1,2_2_2_2";
        set.board = valid_set.to_string();

        set = set.update_board(valid_set.to_string());

        assert_eq!(set.get_deck(), "");
        assert_eq!(set.get_board(), "");
    }

    #[test]
    fn test_update_board_no_cards_in_deck() {
        let mut set = Set::new(3, 3, 9);
        set.deck = "".to_string();
        set.board =
            "0_0_0,2_2_0,2_0_1,2_2_1,0_1_1,2_0_0,0_2_1,1_1_2,1_1_1,1_0_0,0_1_0,1_2_2".to_string();
        set = set.update_board("0_0_0,1_0_0,2_0_0".to_string());

        assert_eq!(set.get_deck(), "");
        assert_eq!(
            set.get_board(),
            "2_2_0,2_0_1,2_2_1,0_1_1,0_2_1,1_1_2,1_1_1,0_1_0,1_2_2"
        );
    }

    #[test]
    fn test_update_board_goes_back_to_default_size() {
        let mut set = Set::new(4, 3, 12);
        let fifteen_cards = "0_0_0_0,0_0_0_1,0_0_0_2,0_0_1_0,0_0_1_1,0_0_1_2,0_0_2_0,0_0_2_1,0_0_2_2,0_1_0_0,0_1_0_1,0_1_0_2,0_1_1_0,0_1_1_1,0_1_1_2";
        set.board = fifteen_cards.to_string();
        set = set.update_board("0_0_0_0,0_0_0_1,0_0_0_2".to_string());

        let new_board: Vec<&str> = Set::string_to_vec(&set.board);
        assert_eq!(new_board.len(), 12);
    }
}

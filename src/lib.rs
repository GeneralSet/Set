extern crate getrandom;
extern crate rand;
extern crate serde;
extern crate wasm_bindgen;
extern crate serde_wasm_bindgen;

use serde::{Deserialize, Serialize};
use std::collections::HashMap;
use wasm_bindgen::prelude::*;

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

#[cfg(target_arch = "wasm32")]
pub fn handle_error(message: &str) -> ! {
    wasm_bindgen::throw_str(message); 
}

#[cfg(not(target_arch = "wasm32"))]
pub fn handle_error(message: &str) -> ! {
    panic!("{}", message);
}

#[wasm_bindgen]
#[derive(Serialize, Deserialize)]
pub struct Set {
    pub board_size: usize,
    pub number_of_features: usize,
    pub feature_options: usize,
    deck: Vec<String>,
    board: Vec<String>,
    pub sets: usize,
}

#[wasm_bindgen]
impl Set {
    fn generate_id(args: Vec<usize>) -> String {
        let string_args: Vec<String> = args.iter().map(|a| a.to_string()).collect();
        string_args.join("_")
    }

    fn generate_ids(&self, features: usize, args: Vec<usize>, mut ids: Vec<String>) -> Vec<String> {
        if features <= 0 {
            return vec![Set::generate_id(args)];
        } else {
            for index in 0..self.feature_options {
                let mut new_args = args.clone();
                new_args.push(index);
                let id = self.generate_ids(features - 1, new_args, Vec::new());
                ids.extend(id);
            }
            return ids;
        }
    }

    fn init_deck(&self) -> Vec<String> {
        self.generate_ids(self.number_of_features, Vec::new(), Vec::new())
    }

    #[wasm_bindgen(constructor)]
    pub fn new(number_of_features: usize, feature_options: usize, board_size: usize) -> Set {
        let new_set = Set {
            board_size: board_size,
            number_of_features: number_of_features,
            feature_options: feature_options,
            deck: Vec::new(),
            board: Vec::new(),
            sets: 0,
        };
        let deck = new_set.init_deck();
        new_set.fill_board(deck, Vec::new())
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

    pub fn is_set(&self, ids: Vec<String>) -> bool {
        let selected_features: Vec<Vec<&str>> =
            ids.iter().map(|id| id.split("_").collect()).collect();

        if selected_features.len() != self.feature_options {
            handle_error("incorrect number of cards selected");
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
        board: &Vec<String>,
        args: Vec<String>,
        mut index: usize,
    ) -> Option<Vec<Vec<String>>> {
        if args.len() >= self.feature_options {
            if self.is_set(args.clone()) {
                return Some(vec![args]);
            } else {
                return None;
            }
        } else {
            let mut sets = vec![];
            for i in index..board.len() {
                let id = board[i].clone();

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

    pub fn hint(&self, board: Vec<String>) -> Vec<String> {
        match self.find_sets(&board, vec![], 0) {
            Some(valid_sets) => match valid_sets.last() {
                Some(set) => return set.clone(),
                None => (),
            },
            None => (),
        }
        Vec::new()
    }

    fn number_of_sets(&self, board: &Vec<String>) -> usize {
        let valid_sets = self.find_sets(board, vec![], 0);
        match valid_sets {
            Some(x) => x.len(),
            None => 0,
        }
    }

    fn next_card_index(&self, deck_len: usize) -> usize {
        (random() * deck_len as f64).floor() as usize
    }

    fn fill_board(&self, mut deck: Vec<String>, mut board: Vec<String>) -> Set {
        let mut number_of_sets = self.number_of_sets(&board);
        while board.len() < self.board_size || number_of_sets < 1 {
            if self.deck.len() < 1 {
                number_of_sets = self.number_of_sets(&board);
                break;
            }
            for _i in 0..self.feature_options {
                let random_index = self.next_card_index(deck.len());
                board.push(deck[random_index].clone());
                deck.remove(random_index);
            }
            number_of_sets = self.number_of_sets(&board);
        }
        Set {
            board_size: self.board_size,
            number_of_features: self.number_of_features,
            feature_options: self.feature_options,
            deck: deck,
            board: board,
            sets: number_of_sets,
        }
    }

    pub fn update_board(&self, set_ids: Vec<String>) -> Set {
        if !self.is_set(set_ids.clone()) {
            handle_error("Failed to update board. Invalid set passed to update board");
        }
        let mut deck = self.deck.clone();
        let mut new_board: Vec<String> = Vec::new();
        for i in 0..self.board.len() {
            if !set_ids.contains(&self.board[i]) {
                new_board.push(self.board[i].clone());
                continue;
            }
            if deck.len() == 0 {
                continue;
            }
            if self.board.len() > self.board_size {
                continue;
            }
            let random_index = self.next_card_index(deck.len());
            new_board.push(deck[random_index].clone());
            deck.remove(random_index);
        }
        let s = Set {
            board_size: self.board_size,
            number_of_features: self.number_of_features,
            feature_options: self.feature_options,
            deck: deck.clone(),
            board: new_board.clone(),
            sets: self.number_of_sets(&new_board),
        };
        if deck.len() > 0 {
            return s.fill_board(deck, new_board);
        } else {
            return s;
        }
    }

    pub fn get_deck(&self) -> Vec<String> {
        self.deck.clone()
    }

    pub fn get_board(&self) -> Vec<String> {
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
            set.number_of_sets(&vec![
                "0_0_0_0".to_string(),
                "1_1_1_1".to_string(),
                "2_2_2_2".to_string(),
                "2_2_2_1".to_string(),
                "2_2_2_0".to_string()
            ]),
            2
        );
    }

    #[test]
    fn get_hint() {
        let set = Set::new(4, 3, 12);
        assert_eq!(
            set.hint(vec![
                "0_2_1_2".to_string(),
                "2_2_1_0".to_string(),
                "1_2_1_1".to_string(),
            ]),
            vec![
                "0_2_1_2".to_string(),
                "2_2_1_0".to_string(),
                "1_2_1_1".to_string(),
            ]
        );
    }

    #[test]
    #[should_panic]
    fn is_set_selection_to_small() {
        let set = Set::new(4, 3, 12);
        set.is_set(vec!["0_0_0_0".to_string(), "1_1_1_1".to_string()]);
    }

    #[test]
    fn is_set_all_different() {
        let set = Set::new(4, 3, 12);
        assert_eq!(
            set.is_set(vec![
                "0_0_0_0".to_string(),
                "1_1_1_1".to_string(),
                "2_2_2_2".to_string()
            ]),
            true
        );
    }

    #[test]
    fn is_set_invalid_set() {
        let set = Set::new(4, 3, 12);
        assert_eq!(
            set.is_set(vec![
                "0_0_0_1".to_string(),
                "1_1_1_1".to_string(),
                "2_2_2_2".to_string()
            ]),
            false
        );
    }

    #[test]
    #[should_panic]
    fn update_board_invalid_set() {
        let set = Set::new(4, 3, 12);

        set.update_board(vec![
            "0_0_0_1".to_string(),
            "1_1_1_1".to_string(),
            "4_4_4_4".to_string(),
        ]);
    }

    #[test]
    fn update_board_empty_deck() {
        let mut set = Set::new(4, 3, 12);
        set.deck = Vec::new();
        let valid_set = vec![
            "0_0_0_0".to_string(),
            "1_1_1_1".to_string(),
            "2_2_2_2".to_string(),
        ];
        set.board = valid_set.clone();

        set = set.update_board(valid_set);

        assert_eq!(set.get_deck().is_empty(), true);
        assert_eq!(set.get_board().is_empty(), true);
    }

    #[test]
    fn update_board_no_cards_in_deck() {
        let mut set = Set::new(3, 3, 9);
        set.deck = Vec::new();
        set.board = vec![
            "0_0_0".to_string(),
            "2_2_0".to_string(),
            "2_0_1".to_string(),
            "2_2_1".to_string(),
            "0_1_1".to_string(),
            "2_0_0".to_string(),
            "0_2_1".to_string(),
            "1_1_2".to_string(),
            "1_1_1".to_string(),
            "1_0_0".to_string(),
            "0_1_0".to_string(),
            "1_2_2".to_string(),
        ];
        set = set.update_board(vec![
            "0_0_0".to_string(),
            "1_0_0".to_string(),
            "2_0_0".to_string(),
        ]);

        assert_eq!(set.get_deck().is_empty(), true);
        assert_eq!(
            set.get_board(),
            vec![
                "2_2_0".to_string(),
                "2_0_1".to_string(),
                "2_2_1".to_string(),
                "0_1_1".to_string(),
                "0_2_1".to_string(),
                "1_1_2".to_string(),
                "1_1_1".to_string(),
                "0_1_0".to_string(),
                "1_2_2".to_string(),
            ]
        );
    }

    #[test]
    fn update_board_goes_back_to_default_size() {
        let mut set = Set::new(4, 3, 12);
        let fifteen_cards = vec![
            "0_0_0_0".to_string(),
            "0_0_0_1".to_string(),
            "0_0_0_2".to_string(),
            "0_0_1_0".to_string(),
            "0_0_1_1".to_string(),
            "0_0_1_2".to_string(),
            "0_0_2_0".to_string(),
            "0_0_2_1".to_string(),
            "0_0_2_2".to_string(),
            "0_1_0_0".to_string(),
            "0_1_0_1".to_string(),
            "0_1_0_2".to_string(),
            "0_1_1_0".to_string(),
            "0_1_1_1".to_string(),
            "0_1_1_2".to_string(),
        ];
        set.board = fifteen_cards;
        set = set.update_board(vec![
            "0_0_0_0".to_string(),
            "0_0_0_1".to_string(),
            "0_0_0_2".to_string(),
        ]);

        assert_eq!(set.get_board().len(), 12);
    }
}

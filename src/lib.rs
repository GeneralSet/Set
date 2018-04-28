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
}


// #![feature(proc_macro, wasm_custom_section, wasm_import_module)]
//
// extern crate wasm_bindgen;
//
// use wasm_bindgen::prelude::*;
//
// // #[wasm_bindgen]
// // extern {
// //     #[wasm_bindgen(js_namespace = console)]
// //     fn log(s: &str);
// //     #[wasm_bindgen(js_namespace = console, js_name = log)]
// //     fn log_u32(a: u32);
// //     #[wasm_bindgen(js_namespace = console, js_name = log)]
// //     fn log_many(a: &str, b: &str);
// // }
//
// #[wasm_bindgen]
// pub struct Set {
//     feature_options: i32,
//     number_of_features: i32
// }
//
// // static BOARD_SIZE: i32 = 12;
// static FEATURE_OPTIONS: i32 = 3;
// static NUMBER_OF_FEATURES: i32 = 4;
//

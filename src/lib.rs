#![feature(proc_macro, wasm_custom_section, wasm_import_module)]

extern crate wasm_bindgen;

use wasm_bindgen::prelude::*;

// static BOARD_SIZE: i32 = 12;
static FEATURE_OPTIONS: i32 = 3;
static NUMBER_OF_FEATURES: i32 = 4;

fn generate_id(args: Vec<i32>) -> String {
    let mut id = String::new();
    for x in 0..args.len() {
        if x > 0 {
            id += &String::from("_");
        }
        id += &args[x].to_string();
    }
    id
}

fn generate_ids(features: i32, args: Vec<i32>, mut ids: Vec<String>) -> String {
    if features <= 0 {
        return generate_id(args);
    } else {
        let mut index = 0;
        while index < FEATURE_OPTIONS {
            let mut new_args = args.clone();
            new_args.push(index);
            let id = generate_ids(features - 1, new_args, Vec::new());
            ids.push(id);
            index += 1;
        }
        return ids.join(",");
    }
}

#[wasm_bindgen]
pub fn init_deck() -> String {
    generate_ids(NUMBER_OF_FEATURES, Vec::new(), Vec::new())
}

// Prevents additional console window on Windows in release, DO NOT REMOVE!!
#![cfg_attr(not(debug_assertions), windows_subsystem = "windows")]

mod resolver;

use std::sync::Mutex;

use tauri::State;

use resolver::{resolve, Shape};


#[derive(Default)]
struct AppState {
    instructions: Vec<String>
}

type App = Mutex<AppState>;

// Learn more about Tauri commands at https://tauri.app/v1/guides/features/command
#[tauri::command]
fn append_instruction(state: State<App>, instruction: String) -> (Vec<String>, Vec<Shape>) {
    let mut lock = state.lock().unwrap();
    lock.instructions.push(instruction);
    (
        lock.instructions.clone(),
        resolve(&lock.instructions)
    )
}

fn main() {
    tauri::Builder::default()
        .manage(Mutex::<AppState>::default())
        .invoke_handler(tauri::generate_handler!(append_instruction))
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}

use std::collections::HashMap;

use serde::Serialize;

#[derive(Clone, Serialize)]
pub struct Point {
    x: usize,
    y: usize
}

impl Point {
    fn new(x: usize, y: usize) -> Self {
        Self { x, y }
    }
}

#[derive(Clone, Serialize)]
#[serde(untagged)]
pub enum Shape {
    Point(Point)
}

pub struct Resolver<'a> {
    instructions: &'a Vec<String>,
    resolved_shapes: HashMap<String, Shape>
}

impl<'a> Resolver<'a> {
    fn resolve(&mut self) {
        for instruction in self.instructions {
            self.resolved_shapes.insert(instruction.clone(), Shape::Point(
                Point::new(0, 0)
            ));
        }
    }
}

pub fn resolve(instructions: &Vec<String>) -> Vec<Shape> {
    let mut resolver = Resolver { instructions, resolved_shapes: HashMap::new() };
    resolver.resolve();
    resolver.resolved_shapes.values().cloned().collect()
}
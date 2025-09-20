Task 1: Hoisting in Variables (assignment 2.js)
This script illustrates hoisting, a JavaScript behavior where variable and function declarations are moved to the top of their containing scope during compilation.

var: Variables declared with var are hoisted and are initialized to undefined. This means you can access the variable before its declaration, though its value will be undefined until the declaration line is reached.

let and const: These variables are also hoisted, but they are not initialized. They remain in a Temporal Dead Zone (TDZ) until their declaration line is executed. Trying to access them before this point will result in a ReferenceError.

Task 1: Hoisting in Variables (assignment 2.js)
This script illustrates hoisting, a JavaScript behavior where variable and function declarations are moved to the top of their containing scope during compilation.

var: Variables declared with var are hoisted and are initialized to undefined. This means you can access the variable before its declaration, though its value will be undefined until the declaration line is reached.

let and const: These variables are also hoisted, but they are not initialized. They remain in a Temporal Dead Zone (TDZ) until their declaration line is executed. Trying to access them before this point will result in a ReferenceError.

Task 2: Function Declarations vs. Expressions (assignment 2.2.js)
This file highlights the difference in hoisting behavior between function declarations and function expressions.

Function Declarations: A function defined using the function keyword (e.g., function add() { ... }) is fully hoisted. This means you can call the function anywhere in its scope, even before its definition in the code.

Function Expressions: A function defined as an expression and assigned to a variable (e.g., const multiply = function() { ... }) is treated like a variable. The variable itself is hoisted (like const), but the function's value is not assigned until the line where the expression is evaluated. Attempting to call it before this point will result in a TypeError because the variable holds an uninitialized value.

 Task 3: Arrow Functions vs. Normal Functions (assignment 2.3.js)
This script compares the behavior of this in arrow functions and normal functions within an object.

Normal Functions (function () { ... }): The this keyword inside a normal function is dynamically scoped. Its value depends on how the function is called. When called as an object method (obj.normalFunc()), this refers to the object (obj) itself.

Arrow Functions (() => { ... }): Arrow functions do not have their own this binding. Instead, they inherit the this value from their surrounding (enclosing) lexical scope. In this case, this refers to the global object (window in browsers, or undefined in strict mode/modules like Node.js), not the obj object.

Task 4: Higher-Order Functions (assignment 2.4.js)
This final example demonstrates a higher-order function. A higher-order function is a function that either:

Takes one or more functions as arguments.

Returns a function.

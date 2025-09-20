console.log("---- Task 1: Hoisting in Variables ----");

console.log("var a before declaration:", a);
var a = 10;
console.log("var a after declaration:", a); 

let b = 20;
console.log("let b after declaration:", b); 
const c = 30;
console.log("const c after declaration:", c); 

console.log("\nExplanation:");
console.log("- var is hoisted and initialized to undefined.");
console.log("- let and const are hoisted but uninitialized (TDZ) until their declaration lines.");

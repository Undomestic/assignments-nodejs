
console.log("\n---- Task 4: Higher Order Functions ----");

function calculate(operation, a, b) {
    return operation(a, b);
}

const addOp = (x, y) => x + y;
const subtractOp = (x, y) => x - y;
const multiplyOp = (x, y) => x * y;
const divideOp = (x, y) => x / y;

console.log("Add:", calculate(addOp, 10, 5));
console.log("Subtract:", calculate(subtractOp, 10, 5)); 
console.log("Multiply:", calculate(multiplyOp, 4, 5));  
console.log("Divide:", calculate(divideOp, 20, 5));     

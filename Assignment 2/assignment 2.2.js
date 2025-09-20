console.log("\n---- Task 2: Function Declarations vs Expressions ----");

console.log("Calling add before definition:", add(2, 3)); // Works
try {
    console.log("Calling multiply before definition:", multiply(2, 3)); // Error
} catch (err) {
    console.log("Error calling multiply before definition:", err.message);
}

function add(x, y) {
    return x + y;
}

const multiply = function (x, y) {
    return x * y;
};

console.log("Calling add after definition:", add(4, 5)); // Works
console.log("Calling multiply after definition:", multiply(4, 5)); // Works

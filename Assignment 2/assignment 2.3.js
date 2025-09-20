console.log("\n---- Task 3: Arrow Functions vs Normal Functions ----");

const obj = {
    arrowFunc: () => {
        console.log("Arrow Function 'this':", this);
    },
    normalFunc: function () {
        console.log("Normal Function 'this':", this);
    }
};

obj.arrowFunc();  
obj.normalFunc(); 

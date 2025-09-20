const fs=require('fs');

console.log (" Start bocking read... ");

const data=fs.readFileSync('data.txt','utf-8');

console.log("file content: ",data);
console.log(" End of blocking read.");

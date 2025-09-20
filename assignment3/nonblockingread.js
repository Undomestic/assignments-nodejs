const fs=require('fs');
console.log(" Start non-blocking read... ");

fs.readfile("data.txt","utf-8",(err,data)=>{
    if(err){
        console.log("Error reading file:",err);
        return;}
    
    console.log("file content: ",data);
    
    });
    console.log("End of non-blocking read.");
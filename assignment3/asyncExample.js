function fetchUserData(callback){
    console.log("Fecthing User Data....");
    setTimeout(()=>{
        callback("Data recevied successfully");
    },2000);
}
fetchUserData((message)=>{
    console.log(message);
});

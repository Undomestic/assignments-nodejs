Module System: maths.js and app.js
The provided code demonstrates Node.js's CommonJS module system. In this system, each file is a module, and you can export and import functionality between them.
maths.js exports the add and subtract functions.
app.js imports these functions using require('./maths'). This allows app.js to use the functions defined in maths.js, keeping the code organized and reusable.


2.Asynchronous Operations: blockingread.js and nonblockingread.js
These files demonstrate the difference between blocking (synchronous) and non-blocking (asynchronous) file I/O operations in Node.js.
blockingread.js uses the synchronous fs.readFileSync() method to read the contents of data.txt. This function will halt the execution of the program until the file read is complete. The program prints "Start blocking read...", reads the file, then prints the file content followed by "End of blocking read.". This approach is simple but can cause the application to be unresponsive if the file is large or the I/O operation is slow.
nonblockingread.js uses the asynchronous fs.readFile() method. This function initiates the file read but allows the program to continue executing other code immediately. The program will print "Start non-blocking read...", and then "End of non-blocking read." before the file is even finished reading. Once the file read is complete, the provided callback function is executed, and the file's content is then printed to the console. This is the preferred method for I/O operations in Node.js as it prevents the application from being blocked and keeps it responsive.


3.Asynchronous Example: asyncExample.js
This file further demonstrates asynchronous behavior using setTimeout(), which is a built-in Node.js function.
fetchUserData is a function that simulates a long-running operation, such as fetching data from a server.
It uses setTimeout() to wait for 2 seconds before executing the callback function.
Because setTimeout() is a non-blocking operation, the console.log("Fecthing User Data...."); message is printed immediately, and the program doesn't pause for 2 seconds. After 2 seconds, the callback function is invoked, printing the "Data recevied successfully" message. This is a core pattern for handling operations that don't complete instantly without freezing the entire application.

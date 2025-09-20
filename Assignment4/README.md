server.js 💻
This file is a basic Node.js web server. It uses the built-in http module to create a server that listens for incoming requests.
http.createServer() creates a new server instance. It takes a callback function that is executed every time a request is made to the server.
req and res are objects representing the incoming request and the outgoing response, respectively.
The server is configured to respond to any request with a status code of 200 (OK), a Content-Type header of 'text/plain', and the text "Hello, World!" as the body of the response.
server.listen(PORT, ...) starts the server, making it listen for requests on the specified port, which is 3000 in this case. Once the server is running, a message is logged to the console confirming the server's address.


test.html 🌐
This file is a simple HTML client that interacts with a web server, likely an API, using JavaScript's Fetch API.
The HTML provides a user interface with input fields and buttons to test different API endpoints.
The JavaScript functions (addTodo, getTodos, and testRoot) use the fetch() method to send HTTP requests to a server running at http://localhost:8080/.
addTodo(): This function sends a POST request to the /todos endpoint to add a new to-do item. It includes a JSON body with the text from the input field.
getTodos(): This function sends a GET request to the /todos endpoint to retrieve all to-do items.
testRoot(): This function sends a GET request to the root URL (/) to test the server's basic response.
In all cases, the script uses .then() and .catch() to handle the server's response or any potential errors, and it displays the result in the div with the output ID.

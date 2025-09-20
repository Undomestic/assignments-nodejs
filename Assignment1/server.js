~const http = require('http')
const url = require('url')
const port = 3000

let todos = []
let nextId = 1

const server = http.createServer(function(req, res){
    const parsedUrl = url.parse(req.url, true)
    const method = req.method
    const path = parsedUrl.pathname

    res.setHeader('Access-Control-Allow-Origin', '*')
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS')
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type')
    res.setHeader('Content-Type', 'application/json')

    if (method === 'OPTIONS') {
        res.writeHead(200)
        res.end()
        return
    }

    if (method === 'POST' && path === '/todos') {
        let body = ''
        
        req.on('data', chunk => {
            body += chunk.toString()
        })
        
        req.on('end', () => {
            try {
                const todoData = JSON.parse(body)
                
                if (!todoData.text || todoData.text.trim() === '') {
                    res.writeHead(400)
                    res.end(JSON.stringify({ error: 'Todo text is required' }))
                    return
                }
                
                const newTodo = {
                    id: nextId++,
                    text: todoData.text.trim(),
                    completed: false,
                    createdAt: new Date().toISOString()
                }
                
                todos.push(newTodo)
                
                res.writeHead(201)
                res.end(JSON.stringify(newTodo))
            } catch (error) {
                res.writeHead(400)
                res.end(JSON.stringify({ error: 'Invalid JSON' }))
            }
        })
    }
    else if (method === 'GET' && path === '/todos') {
        res.writeHead(200)
        res.end(JSON.stringify(todos))
    }
    else if (method === 'GET' && path === '/') {
        res.writeHead(200)
        res.end('Hello world this is Node.js To-Do API!')
    }
    else {
        res.writeHead(404)
        res.end(JSON.stringify({ error: 'Route not found' }))
    }
})

server.listen(port, function(error)  {
 if (error){
    console.log('Something is wrong in the server.... Please wait. ')
 } 
 else{
    console.log('Server is listening on port '+ port)
    console.log('Available endpoints:')
    console.log('  GET / - Hello world message')
    console.log('  POST /todos - Add a new todo')
    console.log('  GET /todos - List all todos')
 }
})
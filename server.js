import http from 'http';
import fs from 'fs';
import { WebSocketServer, WebSocket } from 'ws';
 
const PORT = 3001;
const server = http.createServer((req, res) => {
    fs.readFile('./public/index.html', 'utf-8',(err, data)=>{
         if (err) {
      res.writeHead(404);
      res.end('Not Found');
      return;
    }
    res.writeHead(200, { 'Content-Type': 'text/html' });
    res.end(data);
    });
   

});

function broadcast(payload) {
  wss.clients.forEach((client) => {
    if (client.readyState === WebSocket.OPEN) {
      client.send(JSON.stringify(payload));
    }
  });
}
const wss = new WebSocketServer({ server })
wss.on("connection", (socket, req) => {
    const username = new URL(req.url, "http://localhost").searchParams.get(
        "username",);
        broadcast({ type: "system", text: `${username} joined` });
    socket.on("message", (data) => {
    const { username, text } = JSON.parse(data.toString());        broadcast({ type: "chat", username, text })
    });
    socket.on("close",() =>{
         broadcast({ type: "system", text: `${username} left` })
    });
})

server.listen(PORT,() =>{
    console.log('Chat server running at http://localhost:3001')
});
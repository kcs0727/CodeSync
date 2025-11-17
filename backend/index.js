import express from "express";
import cors from 'cors';
import dotenv from 'dotenv';
dotenv.config();
import http from 'http';
import { Server } from 'socket.io'
import ACTIONS from "./actions.js";


const app = express();
const server = http.createServer(app);
const io = new Server(server);

const port = process.env.PORT || 9000;
app.use(express.json());
app.use(cors());


const userSocketMap = {};

function getAllConnectedClients(roomId) {
  return [...io.sockets.adapter.rooms.get(roomId) || []].map((socketId) => (
    {
      socketId,
      username: userSocketMap[socketId]
    }
  ));
}

io.on("connection", (socket) => {
  console.log("Socket connected:", socket.id);

  socket.on(ACTIONS.JOIN, ({ roomId, newuser }) => {
    userSocketMap[socket.id] = newuser;
    socket.join(roomId);

    const clients = getAllConnectedClients(roomId);

    // Notify existing users that someone joined
    clients.forEach(({ socketId }) => {
      io.to(socketId).emit(ACTIONS.JOINED, {
        clients,
        newuser,
        socketId: socket.id,
      });
    });

  });

  socket.on(ACTIONS.CODE_CHANGE,({roomId, code})=>{
    io.to(roomId).emit(ACTIONS.CODE_CHANGE, { code });
  })

  socket.on(ACTIONS.SYNC_CODE,({socketId, code})=>{
    io.to(socketId).emit(ACTIONS.CODE_CHANGE, { code });
  })

  socket.on("disconnecting", () => {
    const rooms = [...socket.rooms];
    rooms.forEach((roomId) => {
      socket.in(roomId).emit(ACTIONS.DISCONNECTED, {
        socketId: socket.id,
        username: userSocketMap[socket.id],
      });
    });

    delete userSocketMap[socket.id];
    socket.leave();
  });

})


app.get("/", (req, res) => {
  res.send("Collaborative Editor Backend Running.");
});

server.listen(port, () => console.log(`Server running at http://localhost:${port}`));
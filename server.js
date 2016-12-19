const PORT = process.env.PORT || 3000
const express = require('express')
const path = require('path')
const moment = require('moment')

const app = express()
const http = require('http').Server(app)
const io = require('socket.io')(http)

app.use(express.static(path.join(__dirname, '/public')))

var clientInfo = {}

io.on('connection', socket => {
  console.log('user connected via socket.io')

  socket.on('disconnect', function () {
    if (typeof clientInfo[socket.id] !== 'undefined') {
      socket.leave(clientInfo[socket.id].room)
      io.to(clientInfo[socket.id].room).emit('msg', {
        name: 'System',
        text: clientInfo[socket.id].name + ' has left.',
        timeStamp: moment().valueOf()
      })
      delete clientInfo[socket.id]
    }
  })

  socket.on('joinRoom', function (req) {
    clientInfo[socket.id] = req
    socket.join(req.room)
    socket.broadcast.to(req.room).emit('msg', {
      name: 'System',
      text: req.name + ' has joined!',
      timeStamp: moment().valueOf()
    })
  })

  socket.on('msg', function (message) {
    message.timeStamp = moment().valueOf()
    console.log(message.timeStamp + ' : ' + message.name + ' - ' + message.text)
    io.to(clientInfo[socket.id].room).emit('msg', message)
  })

  socket.emit('msg', {
    name: 'System',
    text: 'Welcome to the chat app',
    timeStamp: moment().valueOf()
  })
})

http.listen(PORT, () => {
  console.log('sever started on port ' + PORT)
})

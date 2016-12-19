const PORT = process.env.PORT || 3000
const express = require('express')
const path = require('path')
const moment = require('moment')

const app = express()
const http = require('http').Server(app)
const io = require('socket.io')(http)

app.use(express.static(path.join(__dirname, '/public')))

io.on('connection', socket => {
  console.log('user connected via socket.io')

  socket.on('msg', function (message) {
    message.timeStamp = moment().valueOf()
    console.log(message.timeStamp + ' : ' + message.name + ' - ' + message.text)
    io.emit('msg', message)
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

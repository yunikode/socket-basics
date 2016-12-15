var socket = io()

socket.on('connect', function () {
  console.log('connected to socket.io server')
})

socket.on('msg', function (message) {
  console.log('New Message: ' + message.text)
})

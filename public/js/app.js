var socket = io()

socket.on('connect', function () {
  console.log('connected to socket.io server')
})

socket.on('msg', function (message) {
  // console.log('New Message: ' + message.text)
  $('.messages').append('<p>' + message.text + '</p>')
})

// submit new messages

var $form = $('#message-form')
var $message = $form.find('input[name=message]')

$form.on('submit', function (event) {
  event.preventDefault()
  socket.emit('msg', {
    text: $message.val()
  })
  $message.val('')
})

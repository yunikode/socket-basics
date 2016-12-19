function getQueryParams (params) {
  var query = window.location.search.substring(1)
  var vars = query.split('&')
  for (var i = 0; i < vars.length; i++) {
    var pair = vars[i].split('=')
    if (decodeURIComponent(pair[0]) == params) {
      return decodeURIComponent(pair[1].replace(/\+/g, ' '))
    }
  }

  return undefined
}

var name = getQueryParams('name') || 'Anonymous'
var room = getQueryParams('room') || 'General'
var socket = io()

$('#roomName').text(room)

socket.on('connect', function () {
  socket.emit('joinRoom', {
    name: name,
    room: room
  })
})

socket.on('msg', function (message) {
  var $messages = $('.messages')
  var time = moment.utc(message.timeStamp).local().format('h:mm a')

  $messages.append('<p><strong>' + message.name + ' ' + time + '</strong></p>')
  $messages.append('<p>' + message.text + '</p>')
})

// submit new messages

var $form = $('#message-form')

$form.on('submit', function (event) {
  event.preventDefault()
  var $message = $form.find('input[name=message]')
  socket.emit('msg', {
    name: name,
    text: $message.val()
  })
  $message.val('')
})

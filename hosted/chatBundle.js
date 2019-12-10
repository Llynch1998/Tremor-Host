const socket = io();
const inRoom = false;
let currentRoom;
const handleText = e => {
  e.preventDefault(); // prevents page reloading
  if (inRoom) {
    socket.to('currentRoom').emit('chat message', $('#username').val() + " : " + $('#m').val());
  } else {
    socket.emit('chat message', $('#username').val() + " : " + $('#m').val());
  }

  $('#m').val('');

  return false;
};

const chat = () => {
  socket.on('chat message', msg => {
    let messages = $('#messages');
    let messageDiv = $('<div class="messageStyle"></div>');
    //let userDiv = $(`<p class="usernameStyle">${$('#username').val()}</p>`);
    let messageContent = $(`<p class="messageContentStyle">${msg}</p>`);
    //messageDiv.append(userDiv);
    messageDiv.append(messageContent);
    messages.append($('<li>').append(messageDiv));
    //$('#messages').scrollTop = $('#messages').scrollHeight;
    messages[0].scrollTop = messages[0].scrollHeight;
    //window.scrollTo(0,$('#messages').scrollHeight, 20000);
  });

  socket.on('userAdded', data => {
    let people = $('#users');
    people.empty();
    for (let i = 0; i < data.length; i++) {

      people.append(`<li id="people" onClick="CreateRoom()">${data[i]}</li>`);
    }
  });

  socket.on('leaving', empty => {
    console.log('left');
    socket.emit('left', name);
    $('#users').html("");
  });
};

const ChatForm = props => {
  return React.createElement(
    'form',
    { id: 'messageForm',
      onSubmit: handleText,
      name: 'messageForm',
      action: '/saveMessage',
      method: 'POST' },
    React.createElement('input', { id: 'm', type: 'text', autocomplete: 'off' }),
    React.createElement('input', { type: 'hidden', name: '_csrf', value: props.csrf }),
    React.createElement('input', { className: 'buttonSend', type: 'submit', value: 'Send' })
  );
};

const setup = function (csrf) {
  ReactDOM.render(React.createElement(ChatForm, { csrf: csrf }), document.querySelector('#sender'));
};

const getToken = () => {
  sendAjax('GET', '/getToken', null, result => {
    setup(result.csrfToken);
  });
};

const CreateRoom = e => {
  let username = $('#username').val();
  let target = e.target.value;
  let users = [username, target];
  inRoom = true;
  socket.emit('create', users);
  socket.on('joined room', data => {
    currentRoom = data;
  });
  console.log(currentRoom);
};

$(document).ready(function () {
  chat();
  getToken();
  sendAjax('Get', '/loadMessages', null, result => {
    for (let i = 0; i < result.length; i++) {
      let messages = $('#messages');
      let messageDiv = $('<div class="messageStyle"></div>');
      //let userDiv = $(`<p class="usernameStyle">${$('#username').val()}</p>`);
      let messageContent = $(`<p class="messageContentStyle">${result[i]}</p>`);
      //messageDiv.append(userDiv);
      messageDiv.append(messageContent);
      messages.append($('<li>').append(messageDiv));
    }
  });
  socket.emit('joined', $("#username").val());
});
const handleError = message => {
    $("#errorMessage").text(message);
    $("#errorMessageContainer").animate({ width: 'toggle' }, 350);
};

const redirect = response => {
    $("#errorMessageContainer").animate({ width: 'hide' }, 350);
    window.location = response.redirect;
};

const sendAjax = (type, action, data, success) => {
    $.ajax({
        cache: false,
        type: type,
        url: action,
        data: data,
        dataType: "json",
        success: success,
        error: function (xhr, status, error) {
            var messageObj = JSON.parse(xhr.responseText);
            handleError(messageObj.error);
        }
    });
};

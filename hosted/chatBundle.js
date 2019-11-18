const socket = io();

const handleText = e => {
  e.preventDefault(); // prevents page reloading
  socket.emit('chat message', $('#m').val());
  $('#m').val('');

  return false;
};

const chat = () => {
  socket.on('chat message', msg => {
    let messages = $('#messages');
    let messageDiv = $('<div class="messageStyle"></div>');
    let userDiv = $(`<p class="usernameStyle">${$('#username').val()}</p>`);
    let messageContent = $(`<p class="messageContentStyle">${msg}</p>`);
    messageDiv.append(userDiv);
    messageDiv.append(messageContent);
    messages.append($('<li>').append(messageDiv));
    $('#messages').scrollTop = $('#messages').scrollHeight - $('#messages').clientHeight;
    //window.scrollTo(0,$('#messages').scrollHeight);
  });

  socket.on('joined', name => {
    let people = $('#peopleInChat');
    people.append(`<li>${name}</li>`);
  });
  socket.on('userAdded', data => {

    for (let i = 0; i < data.length; i++) {
      let people = $('#users');
      people.append(`<li id="people">${data[i]}</li>`);
    }
  });
};

const ChatForm = props => {
  return React.createElement(
    'form',
    { id: 'messageForm',
      onSubmit: handleText,
      name: 'messageForm',
      action: '',
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

$(document).ready(function () {
  chat();
  getToken();
  socket.emit('joined', $("#username").val());
});
const handleError = message => {
    $("#errorMessage").text(message);
    $("#domoMessage").animate({ width: 'toggle' }, 350);
};

const redirect = response => {
    $("#domoMessage").animate({ width: 'hide' }, 350);
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

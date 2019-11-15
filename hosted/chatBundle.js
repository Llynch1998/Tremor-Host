const socket = io();
let username = "";
const handleText = e => {
  e.preventDefault(); // prevents page reloading
  socket.emit('chat message', $('#m').val());
  $('#m').val('');

  return false;
};

const chat = () => {
  socket.on('chat message', msg => {
    let message = $('#messages');
    message.append($('<li>').text(username));
    window.scrollTo(0, document.body.scrollHeight);
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

const loadUserFromServer = () => {
  sendAjax('GET', '/getUser', null, data => {
    username = data.username;
    console.log('username : ' + username);
  });
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
  loadUserFromServer();
  chat();
  getToken();
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

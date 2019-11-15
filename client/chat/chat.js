const socket = io();

const handleText = (e) =>{
  e.preventDefault(); // prevents page reloading
  socket.emit('chat message', $('#m').val());
  $('#m').val('');

  return false;
}

const chat= () => {
  socket.on ('chat message', (msg, username) => {
    let message = $('#messages');
    let userDiv = $(`<div><p class="usernameStyle">${$('#username').val()}</p></div>`);
    let messageDiv = $(`<p class="messageStyle">${msg}</p>`);
    message.append($('<li>').append(userDiv).append(messageDiv));
    window.scrollTo(0,document.body.scrollHeight);
  });
}

const ChatForm = (props) => {
  return (
      <form id='messageForm'
      onSubmit={handleText}
      name='messageForm'
      action=''
      method='POST'>
          <input id="m" type='text' autocomplete="off" />
          <input type='hidden' name='_csrf' value={props.csrf} />
          <input className='buttonSend' type='submit' value='Send' />
      </form>
  );
};


const setup = function(csrf) {
  ReactDOM.render(
      <ChatForm csrf={csrf}/>, document.querySelector('#sender')
  );
};

const getToken = () => {
  sendAjax('GET', '/getToken', null, (result) => {
      setup(result.csrfToken);
  });
};

$(document).ready(function() {
  chat();
  getToken();
});
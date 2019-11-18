const socket = io();

const handleText = (e) =>{
  e.preventDefault(); // prevents page reloading
  socket.emit('chat message', $('#m').val());
  $('#m').val('');

  return false;
}

const chat= () => {
  socket.on ('chat message', (msg, username) => {
    let messages = $('#messages');
    let messageDiv = $('<div class="messageStyle"></div>');
    let userDiv = $(`<p class="usernameStyle">${$('#username').val()}</p>`);
    let messageContent = $(`<p class="messageContentStyle">${msg}</p>`);
    messageDiv.append(userDiv);
    messageDiv.append(messageContent)
    messages.append($('<li>').append(messageDiv));
    $('#messages').scrollTop = $('#messages').scrollHeight - $('#messages').clientHeight;
    //window.scrollTo(0,$('#messages').scrollHeight);
  });
  
  socket.on('joined', (name) =>{
    console.log('we in like flin');
    socket.name = name;
  });
  socket.on('userAdded', (data) =>{

    for(let i = 0; i < data.length; i++){
        let people = $('#users');
        people.append(`<li id="people">${data[i]}</li>`);
    }
  });
  
  socket.on('leaving', (empty) =>{
    console.log('left');
    socket.emit('left', name);
    $('#users').html("");
  })
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
  socket.emit('joined', $("#username").val())
});
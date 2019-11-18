const socket = io();

const handleText = (e) =>{
  e.preventDefault(); // prevents page reloading
  socket.emit('chat message', $('#username').val() + " : " + $('#m').val());
  $('#m').val('');


  return false;
}

const chat= () => {
  socket.on ('chat message', (msg) => {
    let messages = $('#messages');
    let messageDiv = $('<div class="messageStyle"></div>');
    //let userDiv = $(`<p class="usernameStyle">${$('#username').val()}</p>`);
    let messageContent = $(`<p class="messageContentStyle">${msg}</p>`);
    //messageDiv.append(userDiv);
    messageDiv.append(messageContent)
    messages.append($('<li>').append(messageDiv));
    //$('#messages').scrollTop = $('#messages').scrollHeight;
    messages[0].scrollTop = messages[0].scrollHeight;
    //window.scrollTo(0,$('#messages').scrollHeight, 20000);
  });
  
  
  socket.on('userAdded', (data) =>{
    let people = $('#users');
    people.empty();
    for(let i = 0; i < data.length; i++){
       
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
      action='/saveMessage'
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
  sendAjax('Get', '/loadMessages', null, (result) =>{
    for(let i = 0; i < result.length; i++){
      let messages = $('#messages');
      let messageDiv = $('<div class="messageStyle"></div>');
      //let userDiv = $(`<p class="usernameStyle">${$('#username').val()}</p>`);
      let messageContent = $(`<p class="messageContentStyle">${result[i]}</p>`);
      //messageDiv.append(userDiv);
      messageDiv.append(messageContent)
      messages.append($('<li>').append(messageDiv));
    }
  });
  socket.emit('joined', $("#username").val())
});
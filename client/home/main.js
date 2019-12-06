const MainPage = (props) => {
    return(
        <div id="mainContent">
            <h2 id="tremorTitle">Tremor</h2>
            <p id="tremorDescription">
                Tremor is a real-time chat application developed by Matthew Paseltiner and Wyatt Lynch as a class project. 
                It uses socket.io, MongoDB, RedisLabs, Heroku, and Electron to create a seamless experience. Users can create an account and join for free. 
                There is a public chat for anyone that wants to join but you can also create private groups with your friends.
            </p>
            <input id='csrftoken' type='hidden' name='_csrf' value={props.csrf}/>
        </div>
    )
}

const setup = function(csrf) {
    ReactDOM.render(<MainPage csrf={csrf} />, document.querySelector("#content"));
};

const getToken = () => {
    sendAjax('GET', '/getToken', null, (result) => {
        setup(result.csrftoken);
    });
};

$(document).ready(function() {
    getToken();
});
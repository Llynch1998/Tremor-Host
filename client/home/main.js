const mainPage = () => {
    return(
        <div id="mainContent">
            <h2 id="tremorTitle">Tremor</h2>
            <p id="tremorDescription">
                Tremor is a real-time chat application developed by Matthew Paseltiner and Wyatt Lynch as a class project. 
                It uses socket.io, MongoDB, RedisLabs, Heroku, and Electron to create a seamless experience. Users can create an account and join for free. 
                There is a public chat for anyone that wants to join but you can also create private groups with your friends.
            </p>
        </div>
    )
}

const setup = function() {
    ReactDOM.render(<downloadPage/>, document.querySelector("#content"));
};

const getToken = () => {
    sendAjax('GET', '/getToken', null, () => {
        setup();
    });
};

$(document).ready(function() {
    getToken();
});
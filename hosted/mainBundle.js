const MainPage = props => {
    return React.createElement(
        "div",
        { id: "mainContent" },
        React.createElement(
            "h2",
            { id: "tremorTitle" },
            "Tremor"
        ),
        React.createElement(
            "p",
            { id: "tremorDescription" },
            "Tremor is a real-time chat application developed by Matthew Paseltiner and Wyatt Lynch as a class project. It uses socket.io, MongoDB, RedisLabs, Heroku, and Electron to create a seamless experience. Users can create an account and join for free. There is a public chat for anyone that wants to join but you can also create private groups with your friends."
        ),
        React.createElement("input", { id: "csrftoken", type: "hidden", name: "_csrf", value: props.csrf })
    );
};

const setup = function (csrf) {
    ReactDOM.render(React.createElement(MainPage, { csrf: csrf }), document.querySelector("#content"));
};

const getToken = () => {
    sendAjax('GET', '/getToken', null, result => {
        setup(result.csrftoken);
    });
};

$(document).ready(function () {
    getToken();
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

const handlePasswordChange = e => {
    e.preventDefault();

    return false;
};

const ChangePasswordWindow = props => {
    return React.createElement(
        "form",
        { id: "changePasswordForm", name: "changePasswordForm",
            onSubmit: handlePasswordChange,
            action: "/passChange",
            method: "POST",
            className: "mainForm"
        },
        React.createElement(
            "label",
            { htmlFor: "currPass" },
            "Current Password"
        ),
        React.createElement("input", { id: "currPass", type: "text", name: "currPass", placeholder: "current password" }),
        React.createElement(
            "label",
            { htmlFor: "newPass" },
            "Password"
        ),
        React.createElement("input", { id: "newPass", type: "password", name: "newPass", placeholder: "password" }),
        React.createElement(
            "label",
            { htmlFor: "newPass2" },
            "Password"
        ),
        React.createElement("input", { id: "newPass2", type: "password", name: "newPass2", placeholder: "retype password" }),
        React.createElement("input", { type: "hidden", name: "_csrf", value: props.csrf }),
        React.createElement("input", { className: "formSubmit", type: "submit", value: "Change Password" })
    );
};

const createChangePasswordWindow = csrf => {
    ReactDOM.render(React.createElement(ChangePasswordWindow, { csrf: csrf }), document.querySelector("#content"));
};

const AccountInfo = props => {
    return React.createElement(
        "div",
        { id: "accountInfo", name: "accountInfo" },
        React.createElement(
            "p",
            { id: "usernameLabel" },
            React.createElement(
                "strong",
                null,
                "Username:"
            ),
            " ",
            props.username
        ),
        React.createElement(
            "label",
            { htmlFor: "changePasswordButton", id: "passwordLabel" },
            React.createElement(
                "strong",
                null,
                "Password:"
            ),
            " "
        ),
        React.createElement("input", { type: "hidden", name: "_csrf", value: props.csrf }),
        React.createElement(
            "a",
            { id: "changePasswordButton", href: "/passChange" },
            "Change Password"
        )
    );
};

const setup = function (csrf) {
    const changePasswordButton = document.querySelector("#changePasswordButton");

    ReactDOM.render(React.createElement(AccountInfo, { csrf: csrf, username: document.querySelector('#username').value }), document.querySelector('#content'));

    changePasswordButton.addEventListener("click", e => {
        e.preventDefault();
        createChangePasswordWindow(csrf);
        return false;
    });
};

const getToken = () => {
    sendAjax('GET', '/getToken', null, result => {
        setup(result.csrfToken);
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

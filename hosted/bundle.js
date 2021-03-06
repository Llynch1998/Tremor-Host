

let csrfToken;

const handlePasswordChange = e => {
    e.preventDefault();

    $("#errorMessageContainer").animate({ width: 'hide' }, 350);

    if ($("#currPass").val() == '' || $("#newPass").val() == '' || $("#newPass2").val() == '') {
        handleError("All fields are required");
        return false;
    }

    if ($("#currPass").val() === $("#newPass").val()) {
        handleError("New Password Required");
    };

    if ($("#newPass").val() !== $("#newPass2").val()) {
        handleError("Passwords do not match");
        return false;
    }

    sendAjax('POST', '/passChange', $("#changePasswordForm").serialize(), () => {
        handleError("You've Changed Your Password");
    });

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
        React.createElement("input", { type: "hidden", name: "_csrf", value: csrfToken }),
        React.createElement("input", { id: "changePassBtn", type: "submit", value: "Change Password" })
    );
};

const createChangePasswordWindow = csrf => {
    ReactDOM.render(React.createElement(ChangePasswordWindow, { csrf: csrf }), document.querySelector("#content"));
};

const addFriend = () => {
    sendAjax('POST', '/addFriend', $("#addFriend").serialize(), function () {
        loadFriends();
    });
};

const loadFriends = () => {
    sendAjax('GET', '/getFriends', null, data => {
        ReactDOM.render(React.createElement(AccountInfo, { friends: data.friends }), document.querySelector("#friends"));
    });
};

const AccountInfo = props => {
    return React.createElement(
        "div",
        { id: "holder" },
        React.createElement(
            "form",
            { id: "accountInfo", name: "accountInfo",
                onSubmit: addFriend },
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
            React.createElement("input", { type: "hidden", name: "_csrf", value: csrfToken }),
            React.createElement("input", { type: "submit", id: "changePasswordButton", value: "Change Password" })
        ),
        React.createElement(
            "form",
            { id: "addFriend", name: "addFriend", onSubmit: addFriend },
            React.createElement(
                "label",
                { htmlFor: "username" },
                "Username: "
            ),
            React.createElement("input", { id: "userName", type: "text", name: "usernam", placeholder: "Account Name" }),
            React.createElement("input", { type: "submit", value: "Add User" })
        ),
        React.createElement(
            "section",
            { id: "friends" },
            React.createElement(
                "p",
                { id: "friendsLabel" },
                React.createElement(
                    "strong",
                    null,
                    "Friends:"
                )
            ),
            React.createElement(
                "ul",
                { id: "friendsList" },
                props.friends
            )
        )
    );
};

const setup = function (csrf) {

    ReactDOM.render(React.createElement(AccountInfo, { csrf: csrf, username: document.querySelector('#username').value }), document.querySelector('#content'));
};

const getToken = () => {
    sendAjax('GET', '/getToken', null, result => {
        setup(result.csrfToken);
        csrfToken = result.csrfToken;
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

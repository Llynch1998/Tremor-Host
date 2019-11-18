// const ChangePasswordWindow = (props) => {
//     return(
//         <form id="changePasswordForm" name="changePasswordForm"
//             onSubmit={handleSignup}
//             action="/passwordChange"
//             method="POST"
//             className="mainForm"
//         >
//             <label htmlFor="oldPassword">Old Password</label>
//             <input id="oldPass" type="text" name="oldPassword" placeholder="current password"/>
//             <label htmlFor="newPass">Password</label>
//             <input id="newPass" type="password" name="newPass" placeholder="password"/>
//             <label htmlFor="newPass2">Password</label>
//             <input id="newPass2" type="password" name="newPass2" placeholder="retype password"/>
//             <input type="hidden" name="_csrf" value={props.csrf}/>
//             <input className="formSubmit" type="submit" value="Change Password" />

//         </form>

//     )
// }

// const createChangePasswordWindow = (csrf) => {
//     ReactDOM.render(
//         <ChangePasswordWindow csrf={csrf} />,
//         document.querySelector("#content")
//     );
// }

const AccountInfo = props => {
    return React.createElement(
        "div",
        { id: "accountInfo" },
        React.createElement(
            "label",
            { htmlFor: "username", id: "usernameLabel" },
            "Username: ",
            props.username
        ),
        React.createElement(
            "label",
            { htmlFor: "password" },
            "Password: "
        ),
        React.createElement("input", { type: "hidden", name: "_csrf", value: props.csrf }),
        React.createElement("input", { id: "changePasswordButton", type: "submit", value: "Change Password" })
    );
};

const setup = function (csrf) {
    ReactDOM.render(React.createElement(AccountInfo, { csrf: csrf, username: document.querySelector('#username').value }), document.querySelector('#account'));
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

const handleLogin = e => {
    e.preventDefault();

    $("#errorMessageContainer").animate({ width: 'hide' }, 350);

    if ($("#user").val() == '' || $("#pass").val() == '') {
        handleError("Username or password is empty");
        return false;
    }

    console.log($("input[name=_csrf]").val());

    sendAjax('POST', $("#loginForm").attr("action"), $("#loginForm").serialize(), redirect);
    return false;
};

const handleSignup = e => {
    e.preventDefault();

    $("#errorMessageContainer").animate({ width: 'hide' }, 350);

    if ($("#user").val() == '' || $("#pass").val() == '' || $("#pass2").val() == '') {
        handleError("All fields are required");
        return false;
    }

    if ($("#pass").val() !== $("#pass2").val()) {
        handleError("Passwords do not match");
        return false;
    }

    sendAjax('POST', $("#signupForm").attr("action"), $("#signupForm").serialize(), redirect);
    return false;
};

const LoginWindow = props => {
    return React.createElement(
        "form",
        { id: "loginForm", name: "loginForm",
            onSubmit: handleLogin,
            action: "/login",
            method: "POST",
            className: "mainForm"
        },
        React.createElement(
            "label",
            { htmlFor: "username" },
            "Username"
        ),
        React.createElement("input", { id: "user", type: "text", name: "username", placeholder: "username" }),
        React.createElement(
            "label",
            { htmlFor: "pass" },
            "Password"
        ),
        React.createElement("input", { id: "pass", type: "password", name: "pass", placeholder: "password" }),
        React.createElement("input", { type: "hidden", name: "_csrf", value: props.csrf }),
        React.createElement("input", { className: "formSubmit", type: "submit", value: "Sign in" })
    );
};

const SignupWindow = props => {
    return React.createElement(
        "form",
        { id: "signupForm", name: "signupForm",
            onSubmit: handleSignup,
            action: "/signup",
            method: "POST",
            className: "mainForm"
        },
        React.createElement(
            "label",
            { htmlFor: "username" },
            "Username"
        ),
        React.createElement("input", { id: "user", type: "text", name: "username", placeholder: "username" }),
        React.createElement(
            "label",
            { htmlFor: "pass" },
            "Password"
        ),
        React.createElement("input", { id: "pass", type: "password", name: "pass", placeholder: "password" }),
        React.createElement(
            "label",
            { htmlFor: "pass2" },
            "Password"
        ),
        React.createElement("input", { id: "pass2", type: "password", name: "pass2", placeholder: "retype password" }),
        React.createElement("input", { type: "hidden", name: "_csrf", value: props.csrf }),
        React.createElement("input", { className: "formSubmit", type: "submit", value: "Sign in" })
    );
};

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

const createLoginWindow = csrf => {
    ReactDOM.render(React.createElement(LoginWindow, { csrf: csrf }), document.querySelector("#content"));
};

const createSignupWindow = csrf => {
    ReactDOM.render(React.createElement(SignupWindow, { csrf: csrf }), document.querySelector("#content"));
};

// const createChangePasswordWindow = (csrf) => {
//     ReactDOM.render(
//         <ChangePasswordWindow csrf={csrf} />,
//         document.querySelector("#content")
//     );
// }

const setup = csrf => {
    const loginButton = document.querySelector("#loginButton");
    const signupButton = document.querySelector("#signupButton");
    //const changePasswordButton = document.querySelector("#changePasswordButton"); 

    signupButton.addEventListener("click", e => {
        e.preventDefault();
        createSignupWindow(csrf);
        return false;
    });

    loginButton.addEventListener("click", e => {
        e.preventDefault();
        createLoginWindow(csrf);
        return false;
    });

    // changePasswordButton.addEventListener("click", e => {
    //     e.preventDefault();
    //     createChangePasswordWindow(csrf);
    //     return false;
    // })

    createLoginWindow(csrf);
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

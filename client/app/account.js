const handlePasswordChange = (e) => {
    e.preventDefault();

    $("#errorMessageContainer").animate({width:'hide'},350);

    if($("#currPass").val() == '' || $("#newPass").val() == '' || $("#newPass2").val() == ''){
        handleError("All fields are required");
        return false;
    }

    if($("#newPass").val() !== $("#newPass2").val()){
        handleError("Passwords do not match");
        return false;
    }

    sendAjax('POST', $("#changePasswordForm").attr("action"), $("#changePasswordForm").serialize(), redirect);

    return false;
}

const ChangePasswordWindow = (props) => {
    return(
        <form id="changePasswordForm" name="changePasswordForm"
            onSubmit={handlePasswordChange}
            action="/passChange"
            method="POST"
            className="mainForm"
        >
            <label htmlFor="currPass">Current Password</label>
            <input id="currPass" type="text" name="currPass" placeholder="current password"/>
            <label htmlFor="newPass">Password</label>
            <input id="newPass" type="password" name="newPass" placeholder="password"/>
            <label htmlFor="newPass2">Password</label>
            <input id="newPass2" type="password" name="newPass2" placeholder="retype password"/>
            <input type="hidden" name="_csrf" value={props.csrf}/>
            <input id="changePassBtn" type="submit" value="Change Password" />

        </form>

    )
}

const createChangePasswordWindow = (csrf) => {
    ReactDOM.render(
        <ChangePasswordWindow csrf={csrf} />,
        document.querySelector("#content")
    );
}

const AccountInfo = (props) => {
    return (
        <form id="accountInfo" name="accountInfo"
        onSubmit={createChangePasswordWindow}>
            <p id="usernameLabel"><strong>Username:</strong> {props.username}</p>
            <label htmlFor="changePasswordButton" id="passwordLabel"><strong>Password:</strong> </label>
            <input type="hidden" name="_csrf" value={props.csrf}/>
            
            <input type="submit" id="changePasswordButton" value="Change Password"/>
        </form>
    );
};

const setup = function(csrf){
    const changePasswordButton = document.querySelector("#changePasswordButton"); 

    ReactDOM.render(
        <AccountInfo csrf={csrf} username={document.querySelector('#username').value}/>, document.querySelector('#content')
    );

    changePasswordButton.addEventListener("click", e => {
        e.preventDefault();
        createChangePasswordWindow(csrf);
        return false;
    });
        
};

const getToken = () => {
    sendAjax('GET', '/getToken', null, (result) => {
        setup(result.csrfToken);
    });
};

$(document).ready(function() {
    getToken();
});
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

const AccountInfo = (props) => {
    return (
        <div id="accountInfo">
<label htmlFor="username" id="usernameLabel">Username: {props.username}</label>
            <label htmlFor="password">Password: </label>
            <input type="hidden" name="_csrf" value={props.csrf}/>
            <input id="changePasswordButton" type="submit" value="Change Password" />
        </div>
    );
};

const setup = function(csrf){
    ReactDOM.render(
        <AccountInfo csrf={csrf} username={document.querySelector('#username').value}/>, document.querySelector('#account')
    );
        
};

const getToken = () => {
    sendAjax('GET', '/getToken', null, (result) => {
        setup(result.csrfToken);
    });
};

$(document).ready(function() {
    getToken();

    
});
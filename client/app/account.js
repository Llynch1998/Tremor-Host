

let csrfToken;


const handlePasswordChange = (e) => {
    e.preventDefault();

    $("#errorMessageContainer").animate({width:'hide'},350);

    if($("#currPass").val() == '' || $("#newPass").val() == '' || $("#newPass2").val() == ''){
        handleError("All fields are required");
        return false;
    }

    if($("#currPass").val() === $("#newPass").val()){
        handleError("New Password Required");
    };

    if($("#newPass").val() !== $("#newPass2").val()){
        handleError("Passwords do not match");
        return false;
    }

    sendAjax('POST', '/passChange', $("#changePasswordForm").serialize(), ()=>{
        handleError("You've Changed Your Password");
    });

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
            <input type="hidden" name="_csrf" value={csrfToken}/>
            <input id="changePassBtn" type="submit" value="Change Password" />

        </form>

    );
};

const createChangePasswordWindow = (csrf) => {
    ReactDOM.render(
        <ChangePasswordWindow csrf={csrf} />,
        document.querySelector("#content")
    );
}

const addFriend = () =>{
    sendAjax('POST', '/addFriend', $("#addFriend").serialize(), function(){
        loadFriends();
    });
}

const loadFriends = () =>{
    sendAjax('GET', '/getFriends', null, (data) =>{
        ReactDOM.render(
            <FriendList friends={data.friends} />, document.querySelector("#friends")
        );
    });
};

const FriendList = function(props) {
    if(props.friends.length === 0){
        return(
            <div className="FriendList">
                <h3 className="noFriends">0 Friends</h3>
            </div>
        );
    }

    
    const friendNodes= props.domos.map(function(friend){
        return(
            <div key={friend._id} className="friend">
                <h3 className="username">{friend.name} </h3>
            </div>

        );
    });

    return (
        <div className="FriendList">{friendNodes} </div>
    )
};


const AccountInfo = (props) => {
    return (
        <div id="holder">
            <form id="accountInfo" name="accountInfo"
            onSubmit={addFriend}>
                <p id="usernameLabel"><strong>Username:</strong> {props.username}</p>
                <label htmlFor="changePasswordButton" id="passwordLabel"><strong>Password:</strong> </label>
                <input type="hidden" name="_csrf" value={csrfToken}/>
                
                <input type="submit" id="changePasswordButton" value="Change Password"/>
            </form>
            <form id="addFriend" name="addFriend" onSubmit={addFriend}>
                <label htmlFor="username">Friend Name: </label>
                <input id="username" type="text" name="username" placeholder="Account Name"/>
                <input type="submit" value="Add User" />
            </form>
            <section id="friends">
                <p id="friendsLabel"><strong>Friends:</strong></p>
                
            </section>
        </div>
        
    );
};

const setup = function(csrf){
    

    ReactDOM.render(
        <AccountInfo csrf={csrf} username={document.querySelector('#username').value}/>, document.querySelector('#content')
    );

    
        
};

const getToken = () => {
    sendAjax('GET', '/getToken', null, (result) => {
        setup(result.csrfToken);
        csrfToken = result.csrfToken;
    });
};

$(document).ready(function() {
    getToken();
});
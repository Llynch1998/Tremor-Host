const DownloadPage = () => {
    return React.createElement(
        "div",
        { id: "downloads" },
        React.createElement(
            "h2",
            { id: "downloadTitle" },
            "Download Tremor"
        ),
        React.createElement(
            "p",
            { id: "downloadDescription" },
            "The downloads contain a .zip file with the electron executable for Tremor. To run the app you need to unzip the folder and run the tremor.exe file."
        ),
        React.createElement(
            "div",
            { id: "downloadLinks" },
            React.createElement(
                "a",
                { id: "windowsDownload", href: "../hosted/downloads/TremorApp_Windows.zip", download: true },
                "Download for Windows"
            ),
            React.createElement(
                "a",
                { id: "macDownload", href: "", download: true },
                "Download for MacOS"
            )
        )
    );
};

const setup = function () {
    ReactDOM.render(React.createElement(DownloadPage, null), document.querySelector("#content"));
};

const getToken = () => {
    sendAjax('GET', '/getToken', null, () => {
        setup();
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

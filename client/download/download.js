const DownloadPage = () => {
    return(
        <div id="downloads">
            <h2 id="downloadTitle">Download Tremor</h2>
            <p id="downloadDescription">The downloads contain a .zip file with the electron executable for Tremor. To run the app you need to unzip the folder and run the tremor.exe file.</p>
            <div id="downloadLinks">
                <a id="windowsDownload" href="../hosted/downloads/TremorWindows.zip" download>Download for Windows</a>
                <a id="macDownload" href="../hosted/download/TremorMac.zip" download>Download for MacOS</a>
            </div>
        </div>
        
    )
}

const setup = function() {
    ReactDOM.render(<DownloadPage/>, document.querySelector("#content"));
};

const getToken = () => {
    sendAjax('GET', '/getToken', null, () => {
        setup();
    });
};

$(document).ready(function() {
    getToken();
});
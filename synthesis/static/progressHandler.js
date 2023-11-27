/**
 * progressHandler.js
 *
 * This module handles the progress of data processing and provides functions
 * to update the visual representation of ongoing tasks or operations.
 */

/**
 * Displays a synthesize button, audio player, and download button for the generated audio.
 * This function is intended for use within the updateProgress function.
 *
 * @param {string} audioUrl - The URL of the generated audio file.
 * @returns {void} - This function does not return a value.
 */
function _showSuccess(audioUrl) {
    let progressDiv = document.getElementById("progress");

    let htmlContent = `
                        <button id="synthesize-button" class="btn btn-light btn-outline-dark mb-1" type="submit"
                        style="margin-right: 3rem;">Synthesize</button>

                        <audio controls style="margin-right: 1rem;">
                                <source src="${audioUrl}" type="audio/wav">
                                <p>A video player should have appeared here, but your browser does not support the audio tag.</p>
                        </audio>

                        <button type="button" id="download-button" class="btn btn-light btn-outline-dark mb-3" download>Download</button>
                `;

    progressDiv.innerHTML = htmlContent;

    let downloadBtn = document.getElementById("download-button");
    downloadBtn.addEventListener("click", function (event) {
        event.preventDefault();
        window.open(audioUrl, "_blank");
    });
};


/**
 * Updates the progress in the output part of the website.
 * This function is intended for use within the updateProgress function.
 *
 * @param {string} loadingImageUrl - The URL of the loading image to display.
 * @param {number} progress - The progress percentage to display.
 * @returns {void} - This function does not return a value.
 */
function _showProgress(loadingImageUrl, progress) {
    let progressDiv = document.getElementById("progress");
    let htmlContent = `
                        <p style="margin-top: 1rem;">
                        <img src="${loadingImageUrl}" width="25" height="25"
                        alt=""> ${progress}% Synthesizing, please wait. 
                        This can take a few minutes.</p>
                    `;

    progressDiv.innerHTML = htmlContent;
};


/**
 * Displays an error message in the output part of the website.
 * This function is intended for use within the updateProgress function.
 *
 * @param {string} helpUrl - The URL to the guidelines for assistance.
 * @returns {void} - This function does not return a value.
 */
function _showFailed(helpUrl) {
    let progressDiv = document.getElementById("progress");
    let htmlContent = `
                        <button id="synthesize-button" class="btn btn-light btn-outline-dark mb-1" type="submit"
                        style="margin-right: 3rem;">Synthesize</button>
                        <p style="margin-top: 1rem;">
                            Synthesis failed. Please make sure you followed the 
                            <a href="${helpUrl}">guidelines</a> and try again. 
                            If the problem persists, please contact the 
                            <a href="https://github.com/ntlprzybysz/synthesis-gui">maintainer</a>.
                        </p>
                    `;

    progressDiv.innerHTML = htmlContent;
};


/**
 * Updates the progress status on the web page based on server response on the task status.
 * This function is intended for use within the updateAndSchedule function.
 *
 * @param {string} sessionKey - The session key for the request.
 * @param {object} urls - An object containing various URLs generated dynamically in the main html template.
 * @returns {void} - This function does not return a value.
 */
function _updateProgress(sessionKey, urls) {
    let xhr = new XMLHttpRequest();
    const csrftoken = document.querySelector("[name=csrfmiddlewaretoken]").value;
    xhr.onreadystatechange = function () {
        if (xhr.readyState === 4 && xhr.status === 200) {
            let response = JSON.parse(xhr.responseText);
            let progress = response.progress;

            if (progress === 100) {
                _showSuccess(urls.audioUrl);
            } else if (progress >= 0 && progress <= 100) {
                _showProgress(urls.loadingImageUrl, progress);
            } else {
                _showFailed(urls.helpUrl);
            }
        }
    };
    xhr.open("POST", urls.taskStatusUrl, true);
    xhr.setRequestHeader("X-CSRFToken", csrftoken);
    xhr.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");
    xhr.send("session_key=" + sessionKey);
};


/**
 * Updates the progress and schedules periodic updates.
 *
 * @param {string} sessionKey - The session key for tracking the progress.
 * @param {object} urls - An object containing various URLs generated dynamically in the main html template.
 * @returns {void} - This function does not return a value.
 */
function updateAndSchedule(sessionKey, urls) {
    _updateProgress(sessionKey, urls);

    let currentStatus = document.getElementById("progress").innerHTML;
    if (currentStatus.includes("Synthesizing, please wait.")) {
        setTimeout(function () {
            updateAndSchedule(sessionKey, urls);
        }, 1000);
    };
};
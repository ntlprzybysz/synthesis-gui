/**
 * Inserts the given symbol into the text field at the current cursor position.
 *
 * @param {string} symbol - The symbol to be inserted.
 */
function insertSymbol(symbol) {
    var textFieldValue = document.getElementById("ipa-input-field");
    var cursorPosition = textFieldValue.selectionStart;

    var currentValue = textFieldValue.value;
    var updatedValue = currentValue.substring(0, cursorPosition) + symbol + currentValue.substring(cursorPosition);
    textFieldValue.value = updatedValue;

    textFieldValue.selectionStart = cursorPosition + symbol.length;
    textFieldValue.selectionEnd = cursorPosition + symbol.length;
    textFieldValue.focus();
}


/**
 * Saves project information to a text file with a sanitized filename and initiates the download.
 *
 * @param {Object} projectInformation - An object containing project-related information.
 */
function saveFile(projectInformation) {
    var fileName = "synthesis_" + projectInformation["projectName"];
    var pattern = /[^a-z]/gi;
    fileName = fileName.replace(pattern, "_");
    fileName += ".txt";

    var fileContent = "";
    for (var key in projectInformation) {
        fileContent += key + ": " + projectInformation[key] + "\n";
    };

    const link = document.createElement("a");
    const file = new Blob([fileContent], { type: "text/plain" });
    link.href = URL.createObjectURL(file);
    link.download = fileName;
    link.click();
    URL.revokeObjectURL(link.href);
}


/**
 * Saves user input from the project name and text input fields to a text file.
 */
function saveTextInput() {
    var projectNameFieldValue = document.getElementById("project-name-field").value;
    var textFieldValue = document.getElementById("text-input-field").value;

    var projectInformation = {
        "projectName": projectNameFieldValue,
        "textInput": textFieldValue,
    };

    saveFile(projectInformation);
}


/**
 * Saves user input from the project name and IPA input fields to a text file.
 */
function saveIpaInput() {
    var projectNameFieldValue = document.getElementById("project-name-field").value;
    var ipaFieldValue = document.getElementById("ipa-input-field").value;

    var projectInformation = {
        "projectName": projectNameFieldValue,
        "ipaInput": ipaFieldValue,
    };

    saveFile(projectInformation);
}


/**
 * Saves project information to a text file.
 */
function saveProject() {
    var projectNameFieldValue = document.getElementById("project-name-field").value;
    var textFieldValue = document.getElementById("text-input-field").value;
    var ipaFieldValue = document.getElementById("ipa-input-field").value;
    var modelFieldValue = document.getElementById("model-select-field").value;
    var voiceFieldValue = document.getElementById("voice-select-field").value;
    var sentenceFieldValue = document.getElementById("sentence-select-field").value;

    var projectInformation = {
        "projectName": projectNameFieldValue,
        "textInput": textFieldValue,
        "ipaInput": ipaFieldValue,
        "modelInput": modelFieldValue,
        "voiceInput": voiceFieldValue,
        "sentenceInput": sentenceFieldValue,
    };

    saveFile(projectInformation);
}


/**
 * Loads project information from a text file and populates corresponding input fields.
 *
 * @param {File} file - The file containing project information.
 */
function loadInput(file) {
    const reader = new FileReader();

    reader.onload = function (event) {
        const fileContent = event.target.result;
        const lines = fileContent.split("\n");

        const projectInformation = {};
        lines.forEach(function (line) {
            const [key, value] = line.split(": ");
            projectInformation[key] = value;
        });

        const fieldMapping = {
            projectName: "project-name-field",
            textInput: "text-input-field",
            ipaInput: "ipa-input-field",
            modelInput: "model-select-field",
            voiceInput: "voice-select-field",
            sentenceInput: "sentence-select-field"
        };

        for (var key in projectInformation) {
            const fieldId = fieldMapping[key];
            if (fieldId) {
                document.getElementById(fieldId).value = projectInformation[key];
            };
        };
    };

    reader.readAsText(file);
}


/**
 * Allows the user to select and load a project file from their local system.
 */
function loadProject() {
    const input = document.createElement("input");
    input.type = "file";
    input.accept = ".txt";

    input.onchange = function (event) {
        const file = event.target.files[0];
        loadInput(file);
    };

    input.click();
}


/**
 * Updates the progress status on the web page based on server response on the task status.
 *
 * @param {string} sessionKey - The session key for the request.
 * @param {object} urls - An object containing various URLs generated dynamically in the main html template.
 */
function updateProgress(sessionKey, urls) {
    var xhr = new XMLHttpRequest();
    const csrftoken = document.querySelector('[name=csrfmiddlewaretoken]').value;
    xhr.onreadystatechange = function () {
        if (xhr.readyState === 4 && xhr.status === 200) {
            var response = JSON.parse(xhr.responseText);
            var progress = response.progress;

            if (progress === 100) {
                var progressDiv = document.getElementById('progress');

                var htmlContent = `
                                    <li>
                                            <button id="synthesize-button" type="submit">Synthesize</button>
                                    </li>
                                    <li>
                                            <audio controls>
                                                    <source src="${urls.audioUrl}" type="audio/wav">
                                                    <p>Your browser does not support the audio tag.</p>
                                            </audio>
                                    </li>
                                    <li>
                                            <button id="download-button"
                                            style="font-size: medium; font-family: Deja Vu Serif, sans-serif; text-align: center; width: min-content;"
                                            download>Download</button>
                                    </li>
                            `;

                progressDiv.innerHTML = htmlContent;

                var downloadBtn = document.getElementById('download-button');
                downloadBtn.addEventListener('click', function () {
                    event.preventDefault();
                    window.open(urls.audioUrl, '_blank');
                });

            } else if (progress >= 0 && progress <= 100) {
                let barStatus = "0%";
                switch (progress) {
                    case 15:
                        barStatus = "15%";
                        break;

                    case 30:
                        barStatus = "30%";
                        break;

                    case 45:
                        barStatus = "45%";
                        break;

                    case 60:
                        barStatus = "60%";
                        break;

                    case 75:
                        barStatus = "75%";
                        break;

                    default:
                        barStatus = "0%";
                }

                var progressDiv = document.getElementById('progress');
                var htmlContent = `
                                    <li>
                                        <p><img src="${urls.loadingImageUrl}" width="25"
                                        height="25"> ${barStatus} Synthesizing, please wait. This can take a
                                        few minutes.</p>
                                    </li>
                                `;

                progressDiv.innerHTML = htmlContent;

            } else {
                var progressDiv = document.getElementById('progress');
                var htmlContent = `
                                    <li>
                                            <button id="synthesize-button" type="submit">Synthesize</button><br>
                                            <p>Synthesis failed. Please make sure you followed the <a href="${urls.helpUrl}">guidelines</a> and try again. If the problem persists, please contact the <a href="https://github.com/ntlprzybysz/synthesis-gui">maintainer</a>.</p>
                                    </li>
                                `;

                progressDiv.innerHTML = htmlContent;
            }
        }
    };
    xhr.open('POST', urls.taskStatusUrl, true);
    xhr.setRequestHeader("X-CSRFToken", csrftoken);
    xhr.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');
    xhr.send('session_key=' + sessionKey);
}


/**
 * Updates the progress and schedules periodic updates.
 *
 * @param {string} sessionKey - The session key for tracking the progress.
 * @param {object} urls - An object containing various URLs generated dynamically in the main html template.
 */
function updateAndSchedule(sessionKey, urls) {
    updateProgress(sessionKey, urls);

    var currentStatus = document.getElementById('progress').innerHTML;
    if (currentStatus.includes("Synthesizing, please wait.")) {
        setTimeout(function () {
            updateAndSchedule(sessionKey, urls);
        }, 1000);
    }
}
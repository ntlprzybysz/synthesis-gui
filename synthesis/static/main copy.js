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
 * Populates input fields with the chosen example.
 *
 * @param {string} chosenExample - The selected example keyword.
 */
function loadExample(chosenExample) {
    switch(chosenExample) {
        case "quick":
            document.getElementById("project-name-field").value = "Quick test";
            document.getElementById("text-input-field").value = "printing";
            document.getElementById("ipa-input-field").value = "p˘|r˘|ɪː|n˘|t|ɪː|ŋː";
            document.getElementById("model-select-field").value = "LJSPEECH11";
            document.getElementById("voice-select-field").value = "LINDAJOHNSON";
            document.getElementById("sentence-select-field").value = 1;
            break;

        case "printing":
            document.getElementById("project-name-field").value = "Example printing";
            document.getElementById("text-input-field").value = "Printing, in the only sense with which we are at present concerned, differs from most if not from all the arts and crafts represented in the Exhibition in being comparatively modern.";
            document.getElementById("ipa-input-field").value = "p˘|r˘|ɪː|n˘|t|ɪː|ŋː|,|SIL2|ɪː|n|SIL0|ð|əː|SIL1|ˈoʊ|n|l˘|i|SIL0|sː|ˈɛˑ|n|s|SIL0|w˘|ˈɪ˘|ðː|SIL0|w|ˈɪ|tʃ|SIL0|w|ˈi|SIL0|ˈɑ|r|SIL0|ˈæ|t|SIL0|p˘|r˘|ˈɛ|z|ə|n˘|t|SIL0|k˘|ə˘|n|s|ˈʌrː|n|dː|,|SIL3|d|ˈɪ|f|ərˑ|zː|SIL1|f˘|r˘|ˈʌ˘|mˑ|SIL0|m˘|ˈoʊˑ|s|t˘|SIL0|ˈɪ|f|SIL0|n|ˈɑ|t|SIL0|f˘|r˘|ˈʌ˘|m|SIL0|ˈɔ|lˑ|SIL0|ðˑ|əː|SIL0|ˈɑ|r|t|s˘|SIL0|ə|n|d|SIL0|k|r˘|ˈæ|f|t˘|s|SIL0|r|ˌɛ˘|p|r˘|ɪ˘|z|ˈɛ|n˘|t|ɪ|d|SIL0|ɪː|n|SIL0|ð˘|ə|SIL0|ˌɛˑ|k|s˘|ə|b|ˈɪˑ|ʃ|əˑ|nː|SIL2|ɪ|n|SIL0|b˘|ˈi˘|ɪː|ŋ˘|SIL0|k˘|ə˘|m|p|ˈɛr|ə|t|ɪ|v|l|i|SIL0|mˑ|ˈɑː|d|";
            document.getElementById("model-select-field").value = "LJSPEECH11";
            document.getElementById("voice-select-field").value = "LINDAJOHNSON";
            document.getElementById("sentence-select-field").value = 1;
            break;
        
        case "mountain":
            document.getElementById("project-name-field").value = "Example mountain";
            document.getElementById("text-input-field").value = "As the overlying plate lifts up, it also forms mountain ranges.";
            document.getElementById("ipa-input-field").value = "ˈæ|z|SIL0|ð|ʌ|SIL0|ˌoʊ|v|ɝ|l|ˈaɪ|ɪ|ŋ|SIL0|p|l|ˈeɪ|t|SIL0|l|ˈɪ|f|t|s|SIL0|ˈʌ|p|,|SIL1|ɪ|t|SIL0|ˈɔ|l|s|oʊ|SIL0|f|ˈɔ|r|m|z|SIL0|m|ˈaʊ|n|t|ʌ|n|SIL0|r|ˈeɪ|n|ʣ|ʌ|z|.|SIL2";
            document.getElementById("model-select-field").value = "LJSPEECH11";
            document.getElementById("voice-select-field").value = "LINDAJOHNSON";
            document.getElementById("sentence-select-field").value = 1;
            break;
        
        case "wind":
            document.getElementById("project-name-field").value = "Example north wind";
            document.getElementById("text-input-field").value = "The North Wind and the Sun were disputing which was the stronger, when a traveler came along wrapped in a warm cloak.";
            document.getElementById("ipa-input-field").value = "ð|ʌ|SIL0|n|ˈɔ|r|θ|SIL0|w|ˈɪ|n|d|SIL0|ˈæ|n|d|SIL0|ð|ʌ|SIL0|s|ˈʌ|n|SIL0|w|ɝ|SIL0|d|ɪ|s|p|j|ˈu|t|ɪ|ŋ|SIL0|h|w|ˈɪ|t͡ʃ|SIL0|w|ˈɑ|z|SIL0|ð|ʌ|SIL0|s|t|r|ˈɔ|ŋ|ɝ|,|SIL1|h|w|ˈɛ|n|SIL0|ʌ|SIL0|t|r|ˈæ|v|ʌ|l|ɝ|SIL0|k|ˈeɪ|m|SIL0|ʌ|l|ˈɔ|ŋ|SIL0|r|ˈæ|p|t|SIL0|ɪ|n|SIL0|ʌ|SIL0|w|ˈɔ|r|m|SIL0|k|l|ˈoʊ|k|.|SIL2";
            document.getElementById("model-select-field").value = "LJSPEECH11";
            document.getElementById("voice-select-field").value = "LINDAJOHNSON";
            document.getElementById("sentence-select-field").value = 1;
            break;

        default:
            document.getElementById("project-name-field").value = "Example synthesis";
            document.getElementById("text-input-field").value = "";
            document.getElementById("ipa-input-field").value = "";
            document.getElementById("model-select-field").value = "LJSPEECH11";
            document.getElementById("voice-select-field").value = "LINDAJOHNSON";
            document.getElementById("sentence-select-field").value = 1;
    };
};

document.addEventListener("DOMContentLoaded", function () {
    const element = document.getElementById("example");
    if (element) {
        element.addEventListener("change", function () {
        var selectedValue = document.getElementById("example").value;
        loadExample(selectedValue);
        });
    };
});

/**
 * Changes voice options and the symbol set based on the selected model.
 */
function changeModelOptions(selectedModel) {
    switch(selectedModel) {
        case "testModel":
            /* something happens */
            break;

        /* min. LJSPEECH11 */
        default:
            document.getElementById("project-name-field").value = "Example synthesis";
            document.getElementById("text-input-field").value = "";
            document.getElementById("ipa-input-field").value = "";
            document.getElementById("model-select-field").value = "LJSPEECH11";
            document.getElementById("voice-select-field").value = "LINDAJOHNSON";
            document.getElementById("sentence-select-field").value = 1;
    };
};

document.addEventListener("DOMContentLoaded", function () {
    const element = document.getElementById("model-select-field");
    if (element) {
        element.addEventListener("change", function () {
        var selectedModel = document.getElementById("model-select-field").value;
        changeModelOptions(selectedModel);
        });
    };
});

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
 * Displays the audio playback and download in the output part of the website.
 */
function showSuccess(audioUrl) {
    var progressDiv = document.getElementById('progress');

    var htmlContent = `
                        <button id="synthesize-button" class="btn btn-light btn-outline-dark mb-1" type="submit"
                        style="margin-right: 3rem;">Synthesize</button>

                        <audio controls style="margin-right: 1rem;">
                                <source src="${audioUrl}" type="audio/wav">
                                <p>A video player should have appeared here, but your browser does not support the audio tag.</p>
                        </audio>

                        <button type="button" id="download-button" class="btn btn-light btn-outline-dark mb-3" download>Download</button>
                `;

    progressDiv.innerHTML = htmlContent;

    var downloadBtn = document.getElementById('download-button');
    downloadBtn.addEventListener('click', function () {
        event.preventDefault();
        window.open(audioUrl, '_blank');
    });
}


/**
 * Updates the progress in the output part of the website.
 */
function showProgress(loadingImageUrl, progress) {
    var progressDiv = document.getElementById('progress');
    var htmlContent = `
                        <p style="margin-top: 1rem;">
                        <img src="${loadingImageUrl}" width="25" height="25"
                        alt=""> ${progress}% Synthesizing, please wait. 
                        This can take a few minutes.</p>
                    `;

    progressDiv.innerHTML = htmlContent;
}


/**
 * Displays an error message in the output part of the website.
 */
function showFailed(helpUrl) {
    var progressDiv = document.getElementById('progress');
    var htmlContent = `
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
                showSuccess(urls.audioUrl);
            } else if (progress >= 0 && progress <= 100) {
                showProgress(urls.loadingImageUrl, progress);
            } else {
                showFailed(urls.helpUrl);
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
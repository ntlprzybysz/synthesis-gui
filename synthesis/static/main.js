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


function saveTextInput() {
    var projectNameFieldValue = document.getElementById("project-name-field").value;
    var textFieldValue = document.getElementById("text-input-field").value;

    var projectInformation = {
        "projectName": projectNameFieldValue,
        "textInput": textFieldValue,
    };

    saveFile(projectInformation);
}


function saveIpaInput() {
    var projectNameFieldValue = document.getElementById("project-name-field").value;
    var ipaFieldValue = document.getElementById("ipa-input-field").value;

    var projectInformation = {
        "projectName": projectNameFieldValue,
        "ipaInput": ipaFieldValue,
    };

    saveFile(projectInformation);
}


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

function updateProgress(sessionKey, taskStatusUrl, audioUrl, helpUrl) {    
    var currentStatus = 0;
    
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
                                                    <source src="${audioUrl}" type="audio/wav">
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
                    window.open(audioUrl, '_blank');
                });
            
            } else if (progress >= 0 && progress <= 100) {
                let barStatus = ".................. 0%";
                switch (progress)
                {
                    case 15:
                        barStatus = "|||............... 15%";
                        break;

                    case 30:
                        barStatus = "||||||............ 30%";
                        break;

                    case 45:
                        barStatus = "|||||||||......... 45%";
                        break;

                    case 60:
                        barStatus = "||||||||||||...... 60%";
                        break;

                    case 75:
                        barStatus = "|||||||||||||||... 75%";
                        break;

                    default:
                        barStatus = ".................. 0%";
                }

                var progressDiv = document.getElementById('progress');
                var htmlContent = `
                                    <li>
                                        <p>${barStatus} Synthesizing, please wait. This can take a
                                        few minutes.</p>
                                    </li>
                                `;

                progressDiv.innerHTML = htmlContent;

            } else {
                var progressDiv = document.getElementById('progress');
                var htmlContent = `
                                    <li>
                                            <button id="synthesize-button" type="submit">Synthesize</button><br>
                                            <p>Synthesis failed. Please make sure you followed the <a href="${helpUrl}">guidelines</a> and try again. If the problem persists, please contact the <a href="https://github.com/ntlprzybysz/synthesis-gui">maintainer</a>.</p>
                                    </li>
                                `;

                progressDiv.innerHTML = htmlContent;
            }
        }
    };
    xhr.open('POST', taskStatusUrl, true);
    xhr.setRequestHeader("X-CSRFToken", csrftoken);
    xhr.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');
    xhr.send('session_key=' + sessionKey);

    return progress;
}


function updateAndSchedule(sessionKey, taskStatusUrl, audioUrl, helpUrl) {
    console.log("Updating progress...");
    updateProgress(sessionKey, taskStatusUrl, audioUrl, helpUrl);

    var currentStatus = document.getElementById('progress').innerHTML;
    console.log("Current status: " + currentStatus + ", contains: " + currentStatus.includes("Synthesizing, please wait."))
    if (currentStatus.includes("Synthesizing, please wait.")) {
            console.log("Scheduling the next update...");
            setTimeout(function () {
                updateAndSchedule(sessionKey, taskStatusUrl, audioUrl, helpUrl);
            }, 1000);   // updates status in 1 sec
    }
}
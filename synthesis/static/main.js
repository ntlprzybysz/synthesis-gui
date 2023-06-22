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
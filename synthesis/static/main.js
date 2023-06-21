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


function saveTextInput() {
    var textFieldValue = document.getElementById("text-input-field").value;

    var projectInformation = {
        "textInput": textFieldValue,
    };

    var jsonData = JSON.stringify(projectInformation);

}

/* 
function saveIpaInput() {
    var ipaFieldValue = document.getElementById("ipa-input-field").value;

    var projectInformation = {
        "ipaInput" : ipaFieldValue,
    };
}
 */
/* 
function saveProject() {
    var projectNameFieldValue = document.getElementById("project-name-field").value;
    var textFieldValue = document.getElementById("text-input-field").value;
    var ipaFieldValue = document.getElementById("ipa-input-field").value;
    var modelFieldValue = document.getElementById("model-select-field").value;
    var voiceFieldValue = document.getElementById("voice-select-field").value;
    var sentenceFieldValue = document.getElementById("sentence-select-field").value;

    var projectInformation = {
        "projectName" : projectNameFieldValue,
        "textInput" : textFieldValue,
        "ipaInput" : ipaFieldValue,
        "modelInput" : modelFieldValue,
        "voiceInput" : voiceFieldValue,
        "sentenceInput" : sentenceFieldValue,
    };
}
 */
/* 
function loadProject() {
    var projectInformation = {
        "projectName" : projectNameFieldValue,
        "textInput" : textFieldValue,
        "ipaInput" : ipaFieldValue,
        "modelInput" : modelFieldValue,
        "voiceInput" : voiceFieldValue,
        "sentenceInput" : sentenceFieldValue,
    };

    var projectNameFieldValue = document.getElementById("project-name-field").value;
    var textFieldValue = document.getElementById("text-input-field").value;
    var ipaFieldValue = document.getElementById("ipa-input-field").value;
    var modelFieldValue = document.getElementById("model-select-field").value;
    var voiceFieldValue = document.getElementById("voice-select-field").value;
    var sentenceFieldValue = document.getElementById("sentence-select-field").value;

}
 */
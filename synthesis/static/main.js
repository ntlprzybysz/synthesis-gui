/**
 * Inserts a separator "|" and the given symbol into the text field at the current cursor position.
 *
 * @param {string} symbol - The symbol to be inserted.
 * @returns {void} - This function does not return a value.
 */
function insertSymbol(symbol) {
    let textFieldValue = document.getElementById("ipa-input-field");
    let cursorPosition = textFieldValue.selectionStart;

    let currentValue = textFieldValue.value;
    let textBeforeCursor = currentValue.substring(0, cursorPosition);

    let toInsert;
    // Empty text field
    if (textBeforeCursor === "") {
        toInsert = symbol;
    // Non-empty text field
    } else {
        let charBeforeCursor = textBeforeCursor.charAt(textBeforeCursor.length - 1);
        let charAfterCursor = currentValue.charAt(cursorPosition);
        // Input as first character
        if (charBeforeCursor === "") {
            if (charAfterCursor === "|") {
                toInsert = symbol;            
            } else {
                toInsert = symbol + "|"; 
            };
        // Input end-of-text
        } else if (charAfterCursor === "") {
            if (charBeforeCursor === "|") {
                toInsert = symbol;
            } else {
                toInsert = "|" + symbol; 
            };
        } else {
            if ((charBeforeCursor === "|") && (charAfterCursor === "|")) {
                toInsert = symbol;
            } else if (charBeforeCursor === "|") {
                toInsert = symbol + "|"; 
            } else if (charAfterCursor === "|") {
                toInsert = "|" + symbol; 
            } else {
                toInsert = "|" + symbol + "|"; 
            };
        };
    };

    let updatedValue = currentValue.substring(0, cursorPosition) + toInsert + currentValue.substring(cursorPosition);
    textFieldValue.value = updatedValue;

    textFieldValue.selectionStart = cursorPosition + toInsert.length;
    textFieldValue.selectionEnd = cursorPosition + toInsert.length;
    textFieldValue.focus();
};


/**
 * Clears existing elements in the given element.
 * @param {*} element - The element to be emptied.
 */
function emptyElement(element) {
    if (element) {
        while (element.firstChild) {
            element.removeChild(element.firstChild);
        };
    };
};


/**
 * Updates a specific input field with a given value.
*
* @param {string} fieldId - The ID of the input field.
* @param {string} fieldValue - The value to set in the input field.
* @returns {void} - This function does not return a value.
*/
function updateField(fieldId, fieldValue) {
    let fieldElement = document.getElementById(fieldId);
    if (fieldElement) {
        if (fieldId === "model-select-field") {
            changeModelOptions(fieldValue);
        };
        fieldElement.value = fieldValue;
    };
};


/**
 * Updates input fields based on project information.
 *
 * @param {object} projectInformation - The project information object.
 * @returns {void} - This function does not return a value.
 */
function updateInputFields(projectInformation) {
    const fieldMapping = {
        projectName: "project-name-field",
        textInput: "text-input-field",
        ipaInput: "ipa-input-field",
        modelInput: "model-select-field",
        voiceInput: "voice-select-field",
        sentenceInput: "sentence-select-field"
    };

    for (let key in projectInformation) {
        let fieldId = fieldMapping[key];
        if (fieldId) {
            const fieldValue = projectInformation[key];
            updateField(fieldId, fieldValue);
        };
    };
};


/**
 * Gets the IPA input from its input field and splits it into an array of strings 
 * based on the line break symbol. The sentences in the array are shortened to 25 characters.
 * @returns {Array} - An array of strings, where each string is a sentence from the IPA field.
 */
function getSentences() {
    const ipaFieldValue = document.getElementById("ipa-input-field").value;
    if (/\S/.test(ipaFieldValue)) { // Check if the string contains non-whitespace characters
        return [];
    } else if (ipaFieldValue.includes("\n")) {
        let sentences = ipaFieldValue.split("\n");
        for (let i = 0; i < sentences.length; i++) {
            if (/\S/.test(sentences[i])) {
                sentences.splice(i, 1);
            };
            if (sentences[i].length > 25) {
                sentences[i] = sentences[i].slice(0, 25);
                sentences[i][23] = ".";
                sentences[i][24] = ".";
                sentences[i][25] = ".";
            };
        }
        return sentences;
    } else {
        return [ipaFieldValue];
    };
};


/**
 * Updates the sentence dropdown with the sentences from the IPA field.
 * @returns {void} - This function does not return a value.
 */
function updateSentenceDropdown() {
    const sentences = getSentences();
    let sentenceDropdown = document.getElementById("sentence-select-field");
    emptyElement(sentenceDropdown);

    for (let i = 0; i < sentences.length; i++) {
        let sentenceElement = document.createElement("option");
        sentenceElement.text = sentences[i];
        sentenceElement.value = sentences[i];
        sentenceDropdown.appendChild(sentenceElement);
    };
};


function selectSentence() {
    updateSentenceDropdown();
    // slice input to selection
};


/**
 * Event listeners for triggers.
 * - Listens for the "DOMContentLoaded" event to trigger updates on page load.
 * - Listens for changes in the example selection field to update fields accordingly.
 * - Listens for changes in the model selection field to update speaker and symbol options.
 * 
 * @returns {void} - This function does not return a value.
 */
document.addEventListener("DOMContentLoaded", function () {
    // Triggers an update of fields when an example is selected
    const exampleSelectField = document.getElementById("example");
    if (exampleSelectField) {
        exampleSelectField.addEventListener("change", function () {
            let selectedValue = exampleSelectField.value;
            loadExample(selectedValue);
        });
    };

    // Triggers an update of speaker and symbol options when a model is changed
    const modelSelectField = document.getElementById("model-select-field");
    if (modelSelectField) {
        changeModelOptions(modelSelectField.value);
        modelSelectField.addEventListener("change", function () {
            changeModelOptions(modelSelectField.value);
        });
    };
});
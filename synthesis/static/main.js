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
 * Shortens sentences in an array to 25 characters and adds ellipsis if necessary.
 * @param {string[]} sentences - An array of sentences to be formatted.
 * @returns {string[]} - The formatted array of sentences.
 */
function formatSentences(sentences) {
    for (let i = 0; i < sentences.length; i++) {
        if (sentences[i].length > 25) {
            sentences[i] = sentences[i].slice(0, 25);
            sentences[i][23] = ".";
            sentences[i][24] = ".";
            sentences[i][25] = ".";
        };
    };
    return sentences;
};


/**
 * Gets the IPA input from its input field and splits it into an array of strings 
 * based on the line break symbol.
 * @returns {Array} - An array of strings, where each string is a sentence from the IPA field.
 */
function getSentences() {
    const ipaFieldValue = document.getElementById("ipa-input-field").value;
    if (/^\s*$/.test(ipaFieldValue)) { // Contains only whitespace characters?
        return [];
    } else if (ipaFieldValue.includes("\n")) {
        let sentences = ipaFieldValue.split("\n");
        for (let i = 0; i < sentences.length; i++) {
            if (/\S/.test(sentences[i])) { // Contains any non-whitespace characters?
                sentences.splice(i, 1);
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
    let sentences = getSentences();
    sentences = formatSentences(sentences);

    let sentenceDropdown = document.getElementById("sentence-select-field");
    emptyElement(sentenceDropdown);

    for (let i = 0; i < sentences.length; i++) {
        let sentenceElement = document.createElement("option");
        sentenceElement.text = sentences[i];
        sentenceElement.value = i;
        sentenceDropdown.appendChild(sentenceElement);
    };
};


/**
 * Updates the IPA input field with the selected sentence from the dropdown.
 * @returns {void} - This function does not return a value.
 */
function selectSentence() {
    const sentenceDropdown = document.getElementById("sentence-select-field");
    if (sentenceDropdown) {
        sentenceDropdown.addEventListener("change", function () {
            const selectedSentence = document.getElementById("sentence-select-field").value;
            const sentences = getSentences();
            if (selectSentence && sentences) {
                updateField("ipa-input-field", sentences[i]);
            };
        });
    };
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

/*
    const sentenceSelectField = document.getElementById("sentence-select-field");
    if (sentenceSelectField) {
        // Triggers an update of sentence options when the dropdown is clicked on
        sentenceSelectField.addEventListener("click", function () {
            updateSentenceDropdown();
            console.log("updated sentences")
        });
        
        // Triggers an update of IPA input based on selected sentence
        sentenceSelectField.addEventListener("change", function () {
            selectSentence();
            console.log("updated ipa input based on selected sentence")
        });
    };
*/
});
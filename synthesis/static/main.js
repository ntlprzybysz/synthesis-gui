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
        if (fieldId === "ipa-input-field") {
            updateBreaks(fieldValue);
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
        sentenceBreaks: "sentence-breaks-field",
        paragraphBreaks: "paragraph-breaks-field",
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
 * Resets input fields.
 *
 * @returns {void} - This function does not return a value.
 */
function startNewProject() {
    const projectInformation = {
        "projectName": "New project",
        "ipaInput": "",
        "modelInput": "101000-with-markers",
        "voiceInput": "Linda Johnson",
        "sentenceBreaks": 0.0,
        "paragraphBreaks": 0,
    };
    updateInputFields(projectInformation);
};


/**
 * Counts the number of times a given symbol appears in a text.
 * 
 * @param {string} symbol - The symbol to count.
 * @param {string} text - The text to search.
 * @returns {number} The number of times the symbol appears in the text.
 */
function countSymbols(symbol, text) {
	const lines = text.split(symbol);
	let counter = 0;
	for (let i = 0; i < lines.length; i++) {
		counter += 1;
	};
	return counter;
};


/**
 * Updates the number of paragraph and sentence breaks in the HTML field.
 * 
 * @returns {void} - This function does not return a value.
 */
function updateBreaks(ipaFieldValue) {
    counterParagraphBreaks = countSymbols("\n\n", ipaFieldValue) - 1;
    updateField("paragraph-breaks-field", counterParagraphBreaks + ".0");

	if (counterParagraphBreaks > 0) {
        counterSentenceBreaks = countSymbols("\n", ipaFieldValue) - counterParagraphBreaks;
    } else {
        counterSentenceBreaks = countSymbols("\n", ipaFieldValue);
    };
	updateField("sentence-breaks-field", "0." + counterSentenceBreaks);
};


/**
 * Listens for the "DOMContentLoaded" event to trigger updates on page load, then:
 * - Listens for changes in the model selection field to update speaker and symbol options.
 * - Listens for changes in the IPA input field to update the sentence and paragraph breaks.
 * - Listens for loading an example to adjust the modal's content.
 * 
 * @returns {void} - This function does not return a value.
 */
document.addEventListener("DOMContentLoaded", function () {
    // Triggers an update of speaker and symbol options when a model is changed
    const modelSelectField = document.getElementById("model-select-field");
    if (modelSelectField) {
        changeModelOptions(modelSelectField.value);
        modelSelectField.addEventListener("change", function () {
            changeModelOptions(modelSelectField.value);
        });
    };

    // Triggers an update of sentence and paragraph breaks when IPA input field is changed
    const ipaInputField = document.getElementById("ipa-input-field");
    if (ipaInputField) {
        updateBreaks(ipaInputField.value);
        ipaInputField.addEventListener("change", function () {
            updateBreaks(ipaInputField.value);
        });
    };

    // Triggers an update of a modal content that appears when an example is chosen.
    // A generic modal contant is replaced with data relevant to the selected example.
    const exampleModal = document.getElementById("loadExampleModal");
    exampleModal.addEventListener("show.bs.modal", event => {
        const button = event.relatedTarget;
        const example = button.getAttribute("data-bs-example");
        
        console.log("Example: ", example);

        let proceedButton = document.getElementById("loadExampleModalButton");
        proceedButton.onclick = function() {
            loadExample(example);
        };
    });
});


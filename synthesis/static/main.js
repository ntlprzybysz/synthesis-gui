/**
 * Inserts a separator "|" and the given symbol into the text field at the current cursor position.
 *
 * @param {string} symbol - The symbol to be inserted.
 * @returns {void} - This function does not return a value.
 */
function insertSymbol (symbol) {
    let textFieldValue = document.getElementById("ipa-input-field");
    let cursorPosition = textFieldValue.selectionStart;
    
    let currentValue = textFieldValue.value;
    let toInsert = "|" + symbol;
    if (currentValue === "") {
        toInsert = symbol;
    };

    let updatedValue = currentValue.substring(0, cursorPosition) + toInsert + currentValue.substring(cursorPosition);
    textFieldValue.value = updatedValue;

    textFieldValue.selectionStart = cursorPosition + toInsert.length;
    textFieldValue.selectionEnd = cursorPosition + toInsert.length;
    textFieldValue.focus();
};


/**
 * Creates a sanitized filename for a text file based on the project name.
 * This function is intended for use within the saveFile function.
 *
 * @param {string} originalFilename - The original project name used to generate the filename.
 * @returns {string} - The sanitized filename for the text file.
 */
function _createFilename (originalFilename) {
    let fileName = "synthesis_" + originalFilename;
    const pattern = /[^a-z]/gi;
    fileName = fileName.replace(pattern, "_");
    fileName += ".txt";
    return fileName;
};


/**
 * Generates a formatted string of project information for a text file.
 * This function is intended for use within the saveFile function.
 *
 * @param {Object} projectInformation - An object containing project-related information.
 * @returns {string} - The formatted string of project information for the file content.
 */
function _getFileContent (projectInformation) {
    let fileContent = "";
    for (let key in projectInformation) {
        fileContent += key + ": " + projectInformation[key] + "\n";
    };
    return fileContent;
};


/**
 * Initiates a download of a file with the specified content and name.
 * This function is intended for use within the saveFile function.
 *
 * @param {string} fileContent - The content of the file to be downloaded.
 * @param {string} fileName - The name to be given to the downloaded file.
 * @returns {void} - This function does not return a value.
 */
function _startDownload (fileContent, fileName) {
    const link = document.createElement("a");
    const file = new Blob([fileContent], { type: "text/plain" });
    link.href = URL.createObjectURL(file);
    link.download = fileName;
    link.click();
    URL.revokeObjectURL(link.href);
};


/**
 * Saves project information to a text file.
 *
 * @param {Object} projectInformation - An object containing project-related information.
 * @returns {void} - This function does not return a value.
 */
function saveFile(projectInformation) {
    const fileName = _createFilename(projectInformation["projectName"]);
    const fileContent = _getFileContent(projectInformation);
    _startDownload(fileContent, fileName);
};


/**
 * Saves user input from the project name and text input fields to a text file.
 *
 * @returns {void} - This function does not return a value.
 */
function saveTextInput() {
    const projectNameFieldValue = document.getElementById("project-name-field").value;
    const textFieldValue = document.getElementById("text-input-field").value;

    const projectInformation = {
        "projectName": projectNameFieldValue,
        "textInput": textFieldValue,
    };

    saveFile(projectInformation);
}


/**
 * Saves user input from the project name and IPA input fields to a text file.
 *
 * @returns {void} - This function does not return a value.
 */
function saveIpaInput() {
    const projectNameFieldValue = document.getElementById("project-name-field").value;
    const ipaFieldValue = document.getElementById("ipa-input-field").value;

    const projectInformation = {
        "projectName": projectNameFieldValue,
        "ipaInput": ipaFieldValue,
    };

    saveFile(projectInformation);
}


/**
 * Saves project information, including project name, text input, IPA input,
 * selected model, voice, and sentence to a text file.
 *
 * @returns {void} - This function does not return a value.
 */
function saveProject() {
    const projectNameFieldValue = document.getElementById("project-name-field").value;
    const textFieldValue = document.getElementById("text-input-field").value;
    const ipaFieldValue = document.getElementById("ipa-input-field").value;
    const modelFieldValue = document.getElementById("model-select-field").value;
    const voiceFieldValue = document.getElementById("voice-select-field").value;
    const sentenceFieldValue = document.getElementById("sentence-select-field").value;

    const projectInformation = {
        "projectName": projectNameFieldValue,
        "textInput": textFieldValue,
        "ipaInput": ipaFieldValue,
        "modelInput": modelFieldValue,
        "voiceInput": voiceFieldValue,
        "sentenceInput": sentenceFieldValue,
    };

    saveFile(projectInformation);
};


/**
 * Parses the content of the file into a project information object.
 * This function is intended for use within the loadInput function.
 *
 * @param {string} fileContent - The content of the file.
 * @returns {object} - The project information object.
 */
function _parseFileContent(fileContent) {
    let lines = fileContent.split("\n");
    let projectInformation = {};

    lines.forEach(function (line) {
        let [key, value] = line.split(": ");
        projectInformation[key] = value;
    });

    return projectInformation;
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
 * Loads project information from a text file and populates corresponding input fields.
 *
 * @param {File} file - The file containing project information.
 * @returns {void} - This function does not return a value.
 */
function loadInput(file) {
    const reader = new FileReader();

    reader.onload = function (event) {
        const fileContent = event.target.result;
        let projectInformation = _parseFileContent(fileContent);
        updateInputFields(projectInformation);
    };

    reader.readAsText(file);
};


/**
 * Allows the user to select and load a project file from their local system.
 * Triggers the loadInput function with the selected file.
 *
 * @returns {void} - This function does not return a value.
 */
function loadProject() {
    let input = document.createElement("input");
    input.type = "file";
    input.accept = ".txt";

    input.onchange = function (event) {
        const file = event.target.files[0];
        loadInput(file);
    };

    input.click();
};


/**
 * Populates input fields with the chosen example.
 *
 * @param {string} chosenExample - The selected example keyword.
 * @returns {void} - This function does not return a value.
 */
function loadExample(chosenExample) {
    let projectInformation;
    switch(chosenExample) {
        case "quick":
            projectInformation = {
                "projectName": "Quick test",
                "textInput": "printing",
                "ipaInput": "p˘|r˘|ɪː|n˘|t|ɪː|ŋː",
                "modelInput": "ljspeech11",
                "voiceInput": "Linda Johnson",
                "sentenceInput": 1,
            };
            break;
            
        case "printing":
            projectInformation = {
                "projectName": "Example printing",
                "textInput": "Printing, in the only sense with which we are at present concerned, differs from most if not from all the arts and crafts represented in the Exhibition in being comparatively modern.",
                "ipaInput": "p˘|r˘|ɪː|n˘|t|ɪː|ŋː|,|SIL2|ɪː|n|SIL0|ð|əː|SIL1|ˈoʊ|n|l˘|i|SIL0|sː|ˈɛˑ|n|s|SIL0|w˘|ˈɪ˘|ðː|SIL0|w|ˈɪ|tʃ|SIL0|w|ˈi|SIL0|ˈɑ|r|SIL0|ˈæ|t|SIL0|p˘|r˘|ˈɛ|z|ə|n˘|t|SIL0|k˘|ə˘|n|s|ˈʌrː|n|dː|,|SIL3|d|ˈɪ|f|ərˑ|zː|SIL1|f˘|r˘|ˈʌ˘|mˑ|SIL0|m˘|ˈoʊˑ|s|t˘|SIL0|ˈɪ|f|SIL0|n|ˈɑ|t|SIL0|f˘|r˘|ˈʌ˘|m|SIL0|ˈɔ|lˑ|SIL0|ðˑ|əː|SIL0|ˈɑ|r|t|s˘|SIL0|ə|n|d|SIL0|k|r˘|ˈæ|f|t˘|s|SIL0|r|ˌɛ˘|p|r˘|ɪ˘|z|ˈɛ|n˘|t|ɪ|d|SIL0|ɪː|n|SIL0|ð˘|ə|SIL0|ˌɛˑ|k|s˘|ə|b|ˈɪˑ|ʃ|əˑ|nː|SIL2|ɪ|n|SIL0|b˘|ˈi˘|ɪː|ŋ˘|SIL0|k˘|ə˘|m|p|ˈɛr|ə|t|ɪ|v|l|i|SIL0|mˑ|ˈɑː|d|",
                "modelInput": "ljspeech11",
                "voiceInput": "Linda Johnson",
                "sentenceInput": 1,
            };
            break;
        
        case "mountain":
            projectInformation = {
                "projectName": "Example mountain",
                "textInput": "As the overlying plate lifts up, it also forms mountain ranges.",
                "ipaInput": "ˈæ|z|SIL0|ð|ʌ|SIL0|ˌoʊ|v|ɝ|l|ˈaɪ|ɪ|ŋ|SIL0|p|l|ˈeɪ|t|SIL0|l|ˈɪ|f|t|s|SIL0|ˈʌ|p|,|SIL1|ɪ|t|SIL0|ˈɔ|l|s|oʊ|SIL0|f|ˈɔ|r|m|z|SIL0|m|ˈaʊ|n|t|ʌ|n|SIL0|r|ˈeɪ|n|dʒ|ʌ|z|.|SIL2",
                "modelInput": "ljspeech11",
                "voiceInput": "Linda Johnson",
                "sentenceInput": 1,
            };
            break;
            
        case "wind":
            projectInformation = {
                "projectName": "Example north wind",
                "textInput": "The North Wind and the Sun were disputing which was the stronger, when a traveler came along wrapped in a warm cloak.",
                "ipaInput": "ð|ʌ|SIL0|n|ˈɔ|r|θ|SIL0|w|ˈɪ|n|d|SIL0|ˈæ|n|d|SIL0|ð|ʌ|SIL0|s|ˈʌ|n|SIL0|w|ɝ|SIL0|d|ɪ|s|p|j|ˈu|t|ɪ|ŋ|SIL0|h|w|ˈɪ|t͡ʃ|SIL0|w|ˈɑ|z|SIL0|ð|ʌ|SIL0|s|t|r|ˈɔ|ŋ|ɝ|,|SIL1|h|w|ˈɛ|n|SIL0|ʌ|SIL0|t|r|ˈæ|v|ʌ|l|ɝ|SIL0|k|ˈeɪ|m|SIL0|ʌ|l|ˈɔ|ŋ|SIL0|r|ˈæ|p|t|SIL0|ɪ|n|SIL0|ʌ|SIL0|w|ˈɔ|r|m|SIL0|k|l|ˈoʊ|k|.|SIL2",
                "modelInput": "ljspeech11",
                "voiceInput": "Linda Johnson",
                "sentenceInput": 1,
            };
            break;

        default:
            projectInformation = {
                "projectName": "Example synthesis",
                "textInput": "",
                "ipaInput": "",
                "modelInput": "ljspeech11",
                "voiceInput": "Linda Johnson",
                "sentenceInput": 1,
            };
    };
    updateInputFields(projectInformation);
};


/**
 * Clears existing elements in the given element. 
 * This function is intended for use within the changeModelOptions function.
 * @param {*} element - The element to be emptied.
 */
function _emptyElement (element) {
    if (element) {
        while (element.firstChild) {
            element.removeChild(element.firstChild);
        };
    };
};


/**
 * Returns object with data of a model of choice. 
 * This function is intended for use within the changeModelOptions function.
 *
 * @param {string} selectedModel - The model for which data should be returned.
 * @returns {object} - An object containing data for the specified model, including voices, vowels, consonants, etc.
 */
function _getModelsData (selectedModel) {
    let modelData;
    switch(selectedModel) {
        case "6208-IPA-3500":
            modelData = {
                "voices": [["6208 (sdp)", "6208 (sdp)"]],
                "vowels": [["aɪ"], ["aʊ"], ["eɪ"], ["i"], ["oʊ"], ["u"], ["æ"], ["ɑ"], ["ɔ"], ["ɔɪ"], ["ɛ"], ["ɝ"], ["ɪ"], ["ʊ"], ["ʌ"]],
                "consonants": [["b"], ["d"], ["d͡ʒ"], ["f"], ["h"], ["j"], ["k"], ["l"], ["m"], ["n"], ["p"], ["s"], ["t"], ["t͡ʃ"], ["v"], ["w"], ["z"], ["ð"], ["ŋ"], ["ɡ"], ["ɹ"], ["ʃ"], ["ʒ"], ["θ"]],
                "silenceSymbols": [["SIL0"], ["SIL1"], ["SIL2"]],
                "specialSymbols": [["!"], ["'"], [","], ["-"], ["."], ["?"], ["\""], ["("], [")"], [":"], [";"], ["["], ["]"]],
            };
            break;

        case "MagK-IPA-6400":
            modelData = {
                "voices": [["6446-MagK (sdp)", "6446-MagK (sdp)"]],
                "vowels": [["a"], ["aɪ"], ["aʊ"], ["e"], ["eɪ"], ["i"], ["o"], ["oʊ"], ["u"], ["ə"], ["ɛ"], ["ɛɪ"], ["ɑ"], ["ɔ"], ["ɔɪ"], ["ɝ"], ["ʊ"], ["ʌ"], ["ɪ"], ["æ"]],
                "consonants": [["b"], ["d"], ["f"], ["h"], ["j"], ["k"], ["l"], ["m"], ["n"], ["p"], ["r"], ["s"], ["t"], ["v"], ["w"], ["z"], ["ð"], ["ŋ"], ["ɡ"], ["ɹ"], ["ʃ"], ["ʒ"], ["ʤ"], ["ʧ"], ["θ"], ["d͡ʒ"], ["t͡ʃ"]],
                "silenceSymbols": [["SIL0"], ["SIL1"], ["SIL2"], ["SIL3"]],
                "specialSymbols": [["!"], [","], ["-"], ["."], [";"], ["?"], ["\""], ["'"], ["("], [")"], [":"], ["["], ["]"]],
            };
            break;

        case "TZ-IPA-6000":
            modelData = {
                "voices": [["6450 (sdp)", "6450 (sdp)"]],
                "vowels": [["aɪ"], ["aʊ"], ["eɪ"], ["i"], ["oʊ"], ["u"], ["æ"], ["ɑ"], ["ɔ"], ["ɔɪ"], ["ɛ"], ["ɝ"], ["ɪ"], ["ʊ"], ["ʌ"]],
                "consonants": [["b"], ["d"], ["f"], ["h"], ["j"], ["k"], ["l"], ["m"], ["n"], ["p"], ["s"], ["t"], ["v"], ["w"], ["z"], ["ð"], ["ŋ"], ["ɡ"], ["ɹ"], ["ʃ"], ["ʒ"], ["ʤ"], ["ʧ"], ["θ"], ["d͡ʒ"], ["t͡ʃ"]],
                "silenceSymbols": [["SIL0"], ["SIL1"], ["SIL2"], ["SIL3"]],
                "specialSymbols": [["!"], ["'"], [","], ["-"], ["."], [";"], ["?"], ["\""], ["("], [")"], [":"], ["["], ["]"]],
            };
            break;
            
        default:
            modelData = {
                "voices": [["Linda Johnson", "Linda Johnson"],],
                "vowels": [["aɪ"], ["aʊ"], ["eɪ"], ["i"], ["oʊ"], ["u"], ["æ"], ["ɑ"], ["ɔ"], ["ɔr"], ["ɔɪ"], ["ə"], ["ər"], ["ɛ"], ["ɛr"], ["ɪ"], ["ɪr"], ["ʊ"], ["ʊr"], ["ʌ"], ["ʌr"]],
                "consonants": [["b"], ["d"], ["dʒ"], ["f"], ["h"], ["j"], ["k"], ["l"], ["m"], ["n"], ["p"], ["r"], ["s"], ["t"], ["tʃ"], ["v"], ["w"], ["z"], ["ð"], ["ŋ"], ["ɡ"], ["ʃ"], ["ʒ"], ["θ"]],
                "silenceSymbols": [["SIL0"], ["SIL1"], ["SIL2"], ["SIL3"]],
                "specialSymbols": [["!"], ["\""], ["'"], ["("], [")"], [","], ["-"], ["."], [":"], [";"], ["?"], ["["], ["]"], ["—"]],
            };
    };
    
    modelData["stressSymbols"] = [[""], ["'"], ["ˌ"]];
    modelData["durationSymbols"] = [["˘"], [""], ["ˑ"], ["ː"]];

    return modelData;
};


/**
 * Adds voice options from the model data to the voice dropdown menu.
 * This function is intended for use within the changeModelOptions function.
 *
 * @param {HTMLElement} voiceDropdown - The voice dropdown element to add voice options to.
 * @param {Array} voices - The array with available voice options.
 *                        Each element should be a pair [displayText, optionValue].
 * @returns {void} - This function does not return a value directly, but it modifies the DOM.
 */
function _addVoiceOptions (voiceDropdown, voices) {
    if (voiceDropdown) {
        voices.forEach(function (voice) {
            let option = document.createElement("option");
            option.value = voice[1];
            option.text = voice[0];
            voiceDropdown.appendChild(option);
        });
    };
};


/**
 * Creates a subheading element for the IPA table.
 * This function is intended for use within the changeModelOptions function.
 *
 * @param {string} classValue - The CSS class for styling the subheading element.
 * @param {string} paddingTopValue - The value for the top padding of the subheading element.
 * @param {string} textContentValue - The text content to be displayed within the subheading element.
 * @returns {HTMLElement} - The created subheading element.
 */
function _createSubheadingIPATable(classValue, paddingTopValue, textContentValue) {
    let subheading = document.createElement(classValue);
    subheading.className = classValue;
    subheading.style.paddingTop = paddingTopValue;
    subheading.textContent = textContentValue;
    return subheading;
};


/**
 * Adds a button with the specified IPA symbol, stress, and duration to the symbol set.
 * The button triggers the insertSymbol function when clicked.
 * This function is intended for use within the changeModelOptions function.
 *
 * @param {string} stress - The stress component of the IPA symbol.
 * @param {string} symbol - The main IPA symbol to be displayed on the button.
 * @param {string} duration - The duration component of the IPA symbol.
 * @returns {HTMLElement | null} - The created button element, or null if no symbol is provided.
 */
function _getSymbolButton (stress, symbol, duration) {
    let div;
    if (symbol) {    
        div = document.createElement("div");
        div.className = "col";
        div.style.padding = "0rem";
        
        let button = document.createElement("button");
        button.type = "button";
        button.className = "btn btn-light btn-ipa";

        if (duration && stress) {
            button.textContent = stress + symbol + duration;
            button.addEventListener("click", function () {
                insertSymbol(stress + symbol + duration);
            });
        } else if (duration) {
            button.textContent = symbol + duration;
            button.addEventListener("click", function () {
                insertSymbol(symbol + duration);
            });
        } else {
            button.textContent = symbol;
            button.addEventListener("click", function () {
                insertSymbol(symbol);
            });
        };
        div.appendChild(button);
    };
    return div;
};


/**
 * Adds a heading for vowels available in the model and corresponding symbol buttons to the symbol set table.
 * This function is intended for use within the changeModelOptions function.
 *
 * @param {HTMLElement} symbolSet - The symbol set element to add a heading and symbols to.
 * @param {object} modelData - An object containing data for the specified model, including voices, vowels, consonants, etc.
 * @returns {void} - This function does not return a value.
 */
function _addSectionVowels (symbolSet, modelData) {
    const headingVowels = _createSubheadingIPATable("p", "0rem", "Vowels:");
    symbolSet.appendChild(headingVowels);

    modelData.vowels.forEach(function (vowel) {
        modelData.stressSymbols.forEach(function (stress) {
            modelData.durationSymbols.forEach(function (duration) {
                const symbolButton = _getSymbolButton(stress, vowel, duration);
                if (symbolButton) {
                    symbolSet.appendChild(symbolButton);
                };
            });
        });
    });
};


/**
 * Adds a heading for consonants available in the model and corresponding symbol buttons to the symbol set table.
 * This function is intended for use within the changeModelOptions function.
 *
 * @param {HTMLElement} symbolSet - The symbol set element to add a heading and symbols to.
 * @param {object} modelData - An object containing data for the specified model, including voices, vowels, consonants, etc.
 * @returns {void} - This function does not return a value.
 */
function _addSectionConsonants (symbolSet, modelData) {
    const headingConsonants = _createSubheadingIPATable("p", "1rem", "Consonants:");
    symbolSet.appendChild(headingConsonants);

    modelData.consonants.forEach(function (consonant) {
        modelData.durationSymbols.forEach(function (duration) {
            const symbolButton = _getSymbolButton("", consonant, duration);
            if (symbolButton) {
                symbolSet.appendChild(symbolButton);
            };
        });
    });
};


/**
 * Adds a heading for silence symbols available in the model and corresponding symbol buttons to the symbol set table.
 * This function is intended for use within the changeModelOptions function.
 *
 * @param {HTMLElement} symbolSet - The symbol set element to add a heading and symbols to.
 * @param {object} modelData - An object containing data for the specified model, including voices, vowels, consonants, etc.
 * @returns {void} - This function does not return a value.
 */
function _addSectionSilenceSymbols (symbolSet, modelData) {
    const headingSilenceSymbols = _createSubheadingIPATable("p", "1rem", "Silence symbols:");
    symbolSet.appendChild(headingSilenceSymbols);

    modelData.silenceSymbols.forEach(function (symbol) {
        const symbolButton = _getSymbolButton("", symbol, "");
        if (symbolButton) {
            symbolSet.appendChild(symbolButton);
        };
    });
};


/**
 * Adds a heading for special symbols available in the model and corresponding symbol buttons to the symbol set table.
 * This function is intended for use within the changeModelOptions function.
 *
 * @param {HTMLElement} symbolSet - The symbol set element to add a heading and symbols to.
 * @param {object} modelData - An object containing data for the specified model, including voices, vowels, consonants, etc.
 * @returns {void} - This function does not return a value.
 */
function _addSectionSpecialSymbols (symbolSet, modelData) {
    const headingSpecialSymbols = _createSubheadingIPATable("p", "1rem", "Special symbols:");
    symbolSet.appendChild(headingSpecialSymbols);

    modelData.specialSymbols.forEach(function (symbol) {
        const symbolButton = _getSymbolButton("", symbol, "");
        if (symbolButton) {
            symbolSet.appendChild(symbolButton);
        };
    });

};


/**
 * Changes voice options and the symbol set based on the selected model.
 * LJ Speech 1.1 is always the default option.
 *
 * @param {string} selectedModel - The selected model to determine voice options and symbol set.
 * @returns {void} - This function does not return a value.
 */
function changeModelOptions(selectedModel) {
    let voiceDropdown = document.getElementById("voice-select-field");
    let symbolSet = document.getElementById("ipa-symbol-set");

    _emptyElement(voiceDropdown);
    _emptyElement(symbolSet);

    const modelData = _getModelsData(selectedModel);

    _addVoiceOptions(voiceDropdown, modelData.voices);

    if (symbolSet) {
        _addSectionVowels(symbolSet, modelData);
        _addSectionConsonants(symbolSet, modelData);
        _addSectionSilenceSymbols(symbolSet, modelData);
        _addSectionSpecialSymbols(symbolSet, modelData);

    // Preselects options to avoid empty dropdown
    voiceDropdown.value = modelData.voices[0][1];
    };
};


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
    downloadBtn.addEventListener("click", function () {
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
}


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
}


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
}


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
}


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
/**
 * modelHandler.js
 *
 * This module stores functions and model data that can be used
 * to dynamically change the options available on the website.
 */


/**
 * Clears existing elements in the given element. 
 * This function is intended for use within the changeModelOptions function.
 * @param {*} element - The element to be emptied.
 */
function _emptyElement(element) {
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
function _getModelsData(selectedModel) {
    let modelData;
    switch (selectedModel) {
        case "1051-IPA-3000":
            modelData = {
                "voices": [["1051", "1051"],],
                "vowels": [["a"], ["aɪ"], ["aɪə"], ["aʊ"], ["e"], ["eə"], ["eɪ"], ["eʊ"], ["i"], ["o"], ["oʊ"], ["u"], ["æ"], ["ɐ"], ["ɑ"], ["ɑʊ"], ["ɒ"], ["ɔ"], ["ɔɪ"], ["ɘ"], ["ə"], ["əʊ"], ["ɚ"], ["ɛ"], ["ɛ̃"], ["ɜ"], ["ɝ"], ["ɪ"], ["ʊ"], ["ʌ"]],
                "consonants": [["b"], ["d"], ["d͡ʑ"], ["d͡ʒ"], ["f"], ["h"], ["j"], ["k"], ["l"], ["m"], ["n"], ["p"], ["r"], ["s"], ["t"], ["t̬"], ["t͡ʃ"], ["v"], ["w"], ["z"], ["ð"], ["ŋ"], ["ɔ̃"], ["ɕ"], ["ɡ"], ["ɪ"], ["ɲ"], ["ɹ"], ["ɾ"], ["ʃ"], ["ʒ"], ["ʦ"], ["ʨ"], ["θ"]],
                "silenceSymbols": [["SIL0"], ["SIL1"], ["SIL2"], ["SIL3"]],
                "specialSymbols": [["!"], ["\""], ["'"], [","], ["-"], ["."], [":"], [";"], ["?"]]                
            };
            break;
            
        case "6208-IPA-3500":
                modelData = {
                    "voices": [["6208 (sdp)", "6208 (sdp)"]],
                    "vowels": [["aɪ"], ["aʊ"], ["eɪ"], ["i"], ["oʊ"], ["u"], ["æ"], ["ɑ"], ["ɔ"], ["ɔɪ"], ["ɛ"], ["ɝ"], ["ɪ"], ["ʊ"], ["ʌ"]],
                    "consonants": [["b"], ["d"], ["d͡ʒ"], ["f"], ["h"], ["j"], ["k"], ["l"], ["m"], ["n"], ["p"], ["s"], ["t"], ["t͡ʃ"], ["v"], ["w"], ["z"], ["ð"], ["ŋ"], ["ɡ"], ["ɹ"], ["ʃ"], ["ʒ"], ["θ"]],
                    "silenceSymbols": [["SIL0"], ["SIL1"], ["SIL2"]],
                    "specialSymbols": [["!"], ["\""], ["'"], ["("], [")"], [","], ["-"], ["."], [":"], [";"], ["?"], ["["], ["]"]],
                };
                break;

        case "101000-with-markers":
            modelData = {
                "voices": [["Linda Johnson", "Linda Johnson"],],
                "vowels": [["aɪ"], ["aʊ"], ["eɪ"], ["i"], ["oʊ"], ["u"], ["æ"], ["ɑ"], ["ɔ"], ["ɔr"], ["ɔɪ"], ["ə"], ["ər"], ["ɛ"], ["ɛr"], ["ɪ"], ["ɪr"], ["ʊ"], ["ʊr"], ["ʌ"], ["ʌr"]],
                "consonants": [["b"], ["d"], ["dʒ"], ["f"], ["h"], ["j"], ["k"], ["l"], ["m"], ["n"], ["p"], ["r"], ["s"], ["t"], ["tʃ"], ["v"], ["w"], ["z"], ["ð"], ["ŋ"], ["ɡ"], ["ʃ"], ["ʒ"], ["θ"]],
                "silenceSymbols": [["SIL0"], ["SIL1"], ["SIL2"], ["SIL3"]],
                "specialSymbols": [["!"], ["\""], ["'"], ["("], [")"], [","], ["-"], ["."], [":"], [";"], ["?"], ["["], ["]"], ["—"]],
            };
            break;

        case "101000-without-markers":
            modelData = {
                "voices": [["Linda Johnson", "Linda Johnson"],],
                "vowels": [["aɪ"], ["aʊ"], ["eɪ"], ["i"], ["oʊ"], ["u"], ["æ"], ["ɑ"], ["ɔ"], ["ɔr"], ["ɔɪ"], ["ə"], ["ər"], ["ɛ"], ["ɛr"], ["ɪ"], ["ɪr"], ["ʊ"], ["ʊr"], ["ʌ"], ["ʌr"]],
                "consonants": [["b"], ["d"], ["dʒ"], ["f"], ["h"], ["j"], ["k"], ["l"], ["m"], ["n"], ["p"], ["r"], ["s"], ["t"], ["tʃ"], ["v"], ["w"], ["z"], ["ð"], ["ŋ"], ["ɡ"], ["ɪ"], ["ʃ"], ["ʒ"], ["θ"]],
                "silenceSymbols": [["SIL0"], ["SIL1"], ["SIL2"], ["SIL3"]],
                "specialSymbols": [["!"], ["\""], ["'"], ["("], [")"], [","], ["-"], ["."], [":"], [";"], ["?"], ["["], ["]"], ["—"]],
            };
            break;

        case "103500-with-markers":
            modelData = {
                "voices": [["A11", "A11"], ["A12", "A12"], ["A13", "A13"], ["A14", "A14"], ["A19", "A19"], ["A2", "A2"], ["A22", "A22"], ["A23", "A23"], ["A32", "A32"], ["A33", "A33"], ["A34", "A34"], ["A35", "A35"], ["A36", "A36"], ["A4", "A4"], ["A5", "A5"], ["A6", "A6"], ["A7", "A7"], ["A8", "A8"], ["A9", "A9"], ["B11", "B11"], ["B12", "B12"], ["B15", "B15"], ["B2", "B2"], ["B21", "B21"], ["B22", "B22"], ["B31", "B31"], ["B32", "B32"], ["B33", "B33"], ["B34", "B34"], ["B4", "B4"], ["B6", "B6"], ["B7", "B7"], ["B8", "B8"], ["C12", "C12"], ["C13", "C13"], ["C14", "C14"], ["C17", "C17"], ["C18", "C18"], ["C19", "C19"], ["C2", "C2"], ["C20", "C20"], ["C21", "C21"], ["C22", "C22"], ["C23", "C23"], ["C31", "C31"], ["C32", "C32"], ["C4", "C4"], ["C6", "C6"], ["C7", "C7"], ["C8", "C8"], ["D11", "D11"], ["D12", "D12"], ["D13", "D13"], ["D21", "D21"], ["D31", "D31"], ["D32", "D32"], ["D4", "D4"], ["D6", "D6"], ["D7", "D7"], ["D8", "D8"]],
                "vowels": [["a"], ["ai̯"], ["au̯"], ["e"], ["ei̯"], ["i"], ["o"], ["ou̯"], ["u"], ["y"]],
                "consonants": [["f"], ["j"], ["k"], ["kʰ"], ["l"], ["m"], ["n"], ["p"], ["pʰ"], ["s"], ["t"], ["ts"], ["tsʰ"], ["tɕ"], ["tɕʰ"], ["tʰ"], ["w"], ["x"], ["ŋ"], ["ɕ"], ["ə"], ["ɚ"], ["ɛ"], ["ɤ"], ["ɥ"], ["ɹ̩"], ["ɻ"], ["ɻ̩"], ["ʂ"], ["ʈʂ"], ["ʈʂʰ"], ["ʊ"]],
                "silenceSymbols": [["SIL0"], ["SIL1"], ["SIL2"], ["SIL3"]],
                "specialSymbols": [["。"], ["？"]],
            };
            break;

        case "103500-without-markers":
            modelData = {
                "voices": [["A11", "A11"], ["A12", "A12"], ["A13", "A13"], ["A14", "A14"], ["A19", "A19"], ["A2", "A2"], ["A22", "A22"], ["A23", "A23"], ["A32", "A32"], ["A33", "A33"], ["A34", "A34"], ["A35", "A35"], ["A36", "A36"], ["A4", "A4"], ["A5", "A5"], ["A6", "A6"], ["A7", "A7"], ["A8", "A8"], ["A9", "A9"], ["B11", "B11"], ["B12", "B12"], ["B15", "B15"], ["B2", "B2"], ["B21", "B21"], ["B22", "B22"], ["B31", "B31"], ["B32", "B32"], ["B33", "B33"], ["B34", "B34"], ["B4", "B4"], ["B6", "B6"], ["B7", "B7"], ["B8", "B8"], ["C12", "C12"], ["C13", "C13"], ["C14", "C14"], ["C17", "C17"], ["C18", "C18"], ["C19", "C19"], ["C2", "C2"], ["C20", "C20"], ["C21", "C21"], ["C22", "C22"], ["C23", "C23"], ["C31", "C31"], ["C32", "C32"], ["C4", "C4"], ["C6", "C6"], ["C7", "C7"], ["C8", "C8"], ["D11", "D11"], ["D12", "D12"], ["D13", "D13"], ["D21", "D21"], ["D31", "D31"], ["D32", "D32"], ["D4", "D4"], ["D6", "D6"], ["D7", "D7"], ["D8", "D8"]],
                "vowels": [["a"], ["ai̯"], ["au̯"], ["e"], ["ei̯"], ["i"], ["i"], ["o"], ["ou̯"], ["u"], ["y"], ["y"]],
                "consonants": [["f"], ["j"], ["k"], ["kʰ"], ["l"], ["m"], ["n"], ["p"], ["pʰ"], ["s"], ["t"], ["ts"], ["tsʰ"], ["tɕ"], ["tɕʰ"], ["tʰ"], ["w"], ["x"], ["ŋ"], ["ɕ"], ["ə"], ["ɚ"], ["ɛ"], ["ɤ"], ["ɥ"], ["ɹ̩"], ["ɻ"], ["ɻ̩"], ["ʂ"], ["ʈʂ"], ["ʈʂʰ"], ["ʊ"]],
                "silenceSymbols": [["SIL0"], ["SIL1"], ["SIL2"], ["SIL3"]],
                "specialSymbols": [["。"], ["？"]],
            };
            break;

        case "MagK-IPA-6400":
            modelData = {
                "voices": [["6446-MagK (sdp)", "6446-MagK (sdp)"]],
                "vowels": [["a"], ["aɪ"], ["aʊ"], ["e"], ["eɪ"], ["i"], ["o"], ["oʊ"], ["u"], ["æ"], ["ɑ"], ["ɔ"], ["ɔɪ"], ["ə"], ["ɛ"], ["ɛɪ"], ["ɝ"], ["ɪ"], ["ʊ"], ["ʌ"]],
                "consonants": [["b"], ["d"], ["d͡ʒ"], ["f"], ["h"], ["j"], ["k"], ["l"], ["m"], ["n"], ["p"], ["r"], ["s"], ["t"], ["t͡ʃ"], ["v"], ["w"], ["z"], ["ð"], ["ŋ"], ["ɡ"], ["ɹ"], ["ʃ"], ["ʒ"], ["ʤ"], ["ʧ"], ["θ"]],
                "silenceSymbols": [["SIL0"], ["SIL1"], ["SIL2"], ["SIL3"]],
                "specialSymbols": [["!"], ["\""], ["'"], ["("], [")"], [","], ["-"], ["."], [":"], [";"], ["?"], ["["], ["]"]],
            };
            break;

        case "TZ-IPA-6000":
            modelData = {
                "voices": [["6450 (sdp)", "6450 (sdp)"]],
                "vowels": [["aɪ"], ["aʊ"], ["eɪ"], ["i"], ["oʊ"], ["u"], ["æ"], ["ɑ"], ["ɔ"], ["ɔɪ"], ["ɛ"], ["ɝ"], ["ɪ"], ["ʊ"], ["ʌ"]],
                "consonants": [["b"], ["d"], ["d͡ʒ"], ["f"], ["h"], ["j"], ["k"], ["l"], ["m"], ["n"], ["p"], ["s"], ["t"], ["t͡ʃ"], ["v"], ["w"], ["z"], ["ð"], ["ŋ"], ["ɡ"], ["ɹ"], ["ʃ"], ["ʒ"], ["ʤ"], ["ʧ"], ["θ"]],
                "silenceSymbols": [["SIL0"], ["SIL1"], ["SIL2"], ["SIL3"]],
                "specialSymbols": [["!"], ["\""], ["'"], ["("], [")"], [","], ["-"], ["."], [":"], [";"], ["?"], ["["], ["]"]],
            };
            break;

        default: // 101000-with-markers
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
function _addVoiceOptions(voiceDropdown, voices) {
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
function _getSymbolButton(stress, symbol, duration) {
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
function _addSectionVowels(symbolSet, modelData) {
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
function _addSectionConsonants(symbolSet, modelData) {
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
function _addSectionSilenceSymbols(symbolSet, modelData) {
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
function _addSectionSpecialSymbols(symbolSet, modelData) {
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
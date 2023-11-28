/**
 * exampleHandler.js
 *
 * This module manages exemplary data, providing functions to store and retrieve
 * data that can be loaded into form fields for demonstration or testing purposes.
 */


/**
 * Populates input fields with the chosen example.
 *
 * @param {string} chosenExample - The selected example keyword.
 * @returns {void} - This function does not return a value.
 */
function loadExample(chosenExample) {
    let projectInformation;
    switch (chosenExample) {
        case "quick-101000":
            projectInformation = {
                "projectName": "Quick test with model 101000",
                "textInput": "printing",
                "ipaInput": "p˘|r˘|ɪː|n˘|t|ɪː|ŋː",
                "modelInput": "101000",
                "voiceInput": "Linda Johnson",
                "sentenceInput": 1,
            };
            break;

        case "printing-101000":
            projectInformation = {
                "projectName": "Example printing with model 101000",
                "textInput": "Printing, in the only sense with which we are at present concerned, differs from most if not from all the arts and crafts represented in the Exhibition in being comparatively modern.",
                "ipaInput": "p˘|r˘|ɪː|n˘|t|ɪː|ŋː|,|SIL2|ɪː|n|SIL0|ð|əː|SIL1|ˈoʊ|n|l˘|i|SIL0|sː|ˈɛˑ|n|s|SIL0|w˘|ˈɪ˘|ðː|SIL0|w|ˈɪ|tʃ|SIL0|w|ˈi|SIL0|ˈɑ|r|SIL0|ˈæ|t|SIL0|p˘|r˘|ˈɛ|z|ə|n˘|t|SIL0|k˘|ə˘|n|s|ˈʌrː|n|dː|,|SIL3|d|ˈɪ|f|ərˑ|zː|SIL1|f˘|r˘|ˈʌ˘|mˑ|SIL0|m˘|ˈoʊˑ|s|t˘|SIL0|ˈɪ|f|SIL0|n|ˈɑ|t|SIL0|f˘|r˘|ˈʌ˘|m|SIL0|ˈɔ|lˑ|SIL0|ðˑ|əː|SIL0|ˈɑ|r|t|s˘|SIL0|ə|n|d|SIL0|k|r˘|ˈæ|f|t˘|s|SIL0|r|ˌɛ˘|p|r˘|ɪ˘|z|ˈɛ|n˘|t|ɪ|d|SIL0|ɪː|n|SIL0|ð˘|ə|SIL0|ˌɛˑ|k|s˘|ə|b|ˈɪˑ|ʃ|əˑ|nː|SIL2|ɪ|n|SIL0|b˘|ˈi˘|ɪː|ŋ˘|SIL0|k˘|ə˘|m|p|ˈɛr|ə|t|ɪ|v|l|i|SIL0|mˑ|ˈɑː|d|",
                "modelInput": "101000",
                "voiceInput": "Linda Johnson",
                "sentenceInput": 1,
            };
            break;

        case "mountain-101000":
            projectInformation = {
                "projectName": "Example mountain with model 101000",
                "textInput": "As the overlying plate lifts up, it also forms mountain ranges.",
                "ipaInput": "ˈæ|z|SIL0|ð|ʌ|SIL0|ˌoʊ|v|ɝ|l|ˈaɪ|ɪ|ŋ|SIL0|p|l|ˈeɪ|t|SIL0|l|ˈɪ|f|t|s|SIL0|ˈʌ|p|,|SIL1|ɪ|t|SIL0|ˈɔ|l|s|oʊ|SIL0|f|ˈɔ|r|m|z|SIL0|m|ˈaʊ|n|t|ʌ|n|SIL0|r|ˈeɪ|n|dʒ|ʌ|z|.|SIL2",
                "modelInput": "101000",
                "voiceInput": "Linda Johnson",
                "sentenceInput": 1,
            };
            break;

        case "wind-101000":
            projectInformation = {
                "projectName": "Example north wind with model 101000",
                "textInput": "The North Wind and the Sun were disputing which was the stronger, when a traveler came along wrapped in a warm cloak.",
                "ipaInput": "ð|ʌ|SIL0|n|ˈɔ|r|θ|SIL0|w|ˈɪ|n|d|SIL0|ˈæ|n|d|SIL0|ð|ʌ|SIL0|s|ˈʌ|n|SIL0|w|ɝ|SIL0|d|ɪ|s|p|j|ˈu|t|ɪ|ŋ|SIL0|h|w|ˈɪ|t͡ʃ|SIL0|w|ˈɑ|z|SIL0|ð|ʌ|SIL0|s|t|r|ˈɔ|ŋ|ɝ|,|SIL1|h|w|ˈɛ|n|SIL0|ʌ|SIL0|t|r|ˈæ|v|ʌ|l|ɝ|SIL0|k|ˈeɪ|m|SIL0|ʌ|l|ˈɔ|ŋ|SIL0|r|ˈæ|p|t|SIL0|ɪ|n|SIL0|ʌ|SIL0|w|ˈɔ|r|m|SIL0|k|l|ˈoʊ|k|.|SIL2",
                "modelInput": "101000",
                "voiceInput": "Linda Johnson",
                "sentenceInput": 1,
            };
            break;

        default:
            projectInformation = {
                "projectName": "Example synthesis",
                "textInput": "",
                "ipaInput": "",
                "modelInput": "101000",
                "voiceInput": "Linda Johnson",
                "sentenceInput": 1,
            };
    };
    updateInputFields(projectInformation);
};
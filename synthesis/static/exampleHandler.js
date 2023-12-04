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
        case "image-1051-IPA-3000":
            projectInformation = {
                "projectName": "Example image with 1051 IPA 3000",
                "textInput": "The first image that we analyze in this chapter is an advertisement for a cosmetic surgery clinic in which typography works well with other elements of the composition.",
                "ipaInput": "ð|ə|SIL0|f|ˈɝ|s|SIL0|ˈɪ|m|ʌ|d͡ʒ|SIL0|ð|æ|t|SIL0|w|i˘|SIL0|ˈæ|n|ʌ|l|ˌaɪ|z|SIL0|i|n|SIL0|ð|ɪ|s|SIL0|t͡ʃ|ˈæ|p|t|ɝ|SIL0|ɪ|z|SIL0|æ|n|SIL0|æ|d|v|ˈɝ|t|ʌ|z|m|ʌ|n|t|SIL0|f|ɔ˘|SIL0|ə|SIL0|k|ɑ|z|m|ˈɛ|t|ɪ|k|SIL0|s|ˈɝ|d͡ʒ|ɝ|i|SIL0|k|l|ˈɪ|n|ɪ|k|SIL0|i|n|SIL0|w|i|t͡ʃ|SIL0|t|ʌ|p|ˈɑ|ɡ|ɹ|ʌ|f|i|SIL0|w|ˈɝ|k|s|SIL0|\"|wː|ʌ|ʊː|SIL0|w|ɪ˘|s˘|SIL0|ˈɑ|ð|ɚ|SIL0|ˈɛ|l|ʌ|m|ʌ|n|t|s|SIL0|ɒ|f˘|SIL0|ð|ə|SIL0|k|ˌɑ|m|p|ʌ|z|ˈɪ|ʃ|ʌ|n|.|SIL2",
                "modelInput": "1051-IPA-3000",
                "voiceInput": "1051",
                "sentenceInput": 1,
            };
            break;

        case "wind-6208-IPA-3500":
            projectInformation = {
                "projectName": "Example wind with 6208 IPA 3500",
                "textInput": "The North Wind and the Sun were disputing which was the stronger, when a traveler came along wrapped in a warm cloak.",
                "ipaInput": "ð|ʌ|SIL0|n|ˈɔ|ɹ|θ|SIL0|w|ˈɪ|n|d|SIL0|ˈæ|n|d|SIL0|ð|ʌ|SIL0|s|ˈʌ|n|SIL0|w|ɝ|SIL0|d|ɪ|s|p|j|ˈu|t|ɪ|ŋ|SIL0|h|w|ˈɪ|t͡ʃ|SIL0|w|ˈɑ|z|SIL0|ð|ʌ|SIL0|s|t|ɹ|ˈɔ|ŋ|ɝ|,|SIL1|h|w|ˈɛ|n|SIL0|ʌ|SIL0|t|ɹ|ˈæ|v|ʌ|l|ɝ|SIL0|k|ˈeɪ|m|SIL0|ʌ|l|ˈɔ|ŋ|SIL0|ɹ|ˈæ|p|t|SIL0|ɪ|n|SIL0|ʌ|SIL0|w|ˈɔ|ɹ|m|SIL0|k|l|ˈoʊ|k|.|SIL2",
                "modelInput": "6208-IPA-3500",
                "voiceInput": "6208 (sdp)",
                "sentenceInput": 1,
            };
            break;

        case "tsunami-6208-IPA-3500":
            projectInformation = {
                "projectName": "Example tsunami with 6208 IPA 3500",
                "textInput": "A tsunami is a series of ocean waves that sends surges of water, sometimes reaching heights of over 30 meters, onto land.",
                "ipaInput": "ʌ|SIL0|t|s|u|n|ˈɑ|m|i|SIL0|ɪ|z|SIL0|ʌ|SIL0|s|ˈɪ|ɹ|i|z|SIL0|ʌ|v|SIL0|ˈoʊ|ʃ|ʌ|n|SIL0|w|ˈeɪ|v|z|SIL1|ð|ˈæ|t|SIL0|s|ˈɛ|n|d|z|SIL0|s|ˈɝ|d͡ʒ|ʌ|z|SIL0|ʌ|v|SIL0|w|ˈɔ|t|ɝ|,|SIL1|s|ʌ|m|t|ˈaɪ|m|z|SIL0|ɹ|ˈi|t͡ʃ|ɪ|ŋ|SIL0|h|ˈaɪ|t|s|SIL0|ʌ|v|SIL0|ˈoʊ|v|ɝ|SIL0|θ|ˈɝ|d|i|SIL0|m|ˈi|t|ɝ|z|,|SIL1|ˈɑ|n|t|u|SIL0|l|ˈæ|n|d|.|SIL2",
                "modelInput": "6208-IPA-3500",
                "voiceInput": "6208 (sdp)",
                "sentenceInput": 1,
            };
            break;

        case "plates-6208-IPA-3500":
            projectInformation = {
                "projectName": "Example plates with 6208 IPA 3500",
                "textInput": "The Earth's plates jostle about in fits and starts that are punctuated with earthquakes and volcanic eruptions.",
                "ipaInput": "ð|ʌ|SIL0|ˈɝ|θ|s|SIL0|p|l|ˈeɪ|t|s|SIL0|d͡ʒ|ˈɑ|s|ʌ|l|SIL0|ʌ|b|ˈaʊ|t|SIL0|ɪ|n|SIL0|f|ˈɪ|t|s|SIL0|ˈæ|n|d|SIL0|s|t|ˈɑ|ɹ|t|s|SIL0|ð|ˈæ|t|SIL0|ˈɑ|ɹ|SIL0|p|ˈʌ|ŋ|k|t͡ʃ|u|ˌeɪ|t|ɪ|d|SIL0|w|ɪ|ð|SIL0|ˈɝ|θ|k|w|ˌeɪ|k|s|SIL0|ˈæ|n|d|SIL0|v|ɑ|l|k|ˈæ|n|ɪ|k|SIL0|ˌɪ|ɹ|ˈʌ|p|ʃ|ʌ|n|z|.|SIL2",
                "modelInput": "6208-IPA-3500",
                "voiceInput": "6208 (sdp)",
                "sentenceInput": 1,
            };
            break;

        case "printing-101000-with-markers":
            projectInformation = {
                "projectName": "Example printing with 101000 with markers",
                "textInput": "Printing, in the only sense with which we are at present concerned, differs from most if not from all the arts and crafts represented in the Exhibition in being comparatively modern.",
                "ipaInput": "p˘|r˘|ɪː|n˘|t|ɪː|ŋː|,|SIL2|ɪː|n|SIL0|ð|əː|SIL1|ˈoʊ|n|l˘|i|SIL0|sː|ˈɛˑ|n|s|SIL0|w˘|ˈɪ˘|ðː|SIL0|w|ˈɪ|tʃ|SIL0|w|ˈi|SIL0|ˈɑ|r|SIL0|ˈæ|t|SIL0|p˘|r˘|ˈɛ|z|ə|n˘|t|SIL0|k˘|ə˘|n|s|ˈʌrː|n|dː|,|SIL3|d|ˈɪ|f|ərˑ|zː|SIL1|f˘|r˘|ˈʌ˘|mˑ|SIL0|m˘|ˈoʊˑ|s|t˘|SIL0|ˈɪ|f|SIL0|n|ˈɑ|t|SIL0|f˘|r˘|ˈʌ˘|m|SIL0|ˈɔ|lˑ|SIL0|ðˑ|əː|SIL0|ˈɑ|r|t|s˘|SIL0|ə|n|d|SIL0|k|r˘|ˈæ|f|t˘|s|SIL0|r|ˌɛ˘|p|r˘|ɪ˘|z|ˈɛ|n˘|t|ɪ|d|SIL0|ɪː|n|SIL0|ð˘|ə|SIL0|ˌɛˑ|k|s˘|ə|b|ˈɪˑ|ʃ|əˑ|nː|SIL2|ɪ|n|SIL0|b˘|ˈi˘|ɪː|ŋ˘|SIL0|k˘|ə˘|m|p|ˈɛr|ə|t|ɪ|v|l|i|SIL0|mˑ|ˈɑː|d|",
                "modelInput": "101000-with-markers",
                "voiceInput": "Linda Johnson",
                "sentenceInput": 1,
            };
            break;
            
        case "mountain-101000-with-markers":
            projectInformation = {
                "projectName": "Example mountain with 101000 with markers",
                "textInput": "As the overlying plate lifts up, it also forms mountain ranges.",
                "ipaInput": "ˈæ|z|SIL0|ð|ʌ|SIL0|ˌoʊ|v|ɝ|l|ˈaɪ|ɪ|ŋ|SIL0|p|l|ˈeɪ|t|SIL0|l|ˈɪ|f|t|s|SIL0|ˈʌ|p|,|SIL1|ɪ|t|SIL0|ˈɔ|l|s|oʊ|SIL0|f|ˈɔ|r|m|z|SIL0|m|ˈaʊ|n|t|ʌ|n|SIL0|r|ˈeɪ|n|dʒ|ʌ|z|.|SIL2",
                "modelInput": "101000-with-markers",
                "voiceInput": "Linda Johnson",
                "sentenceInput": 1,
            };
            break;
            
        case "wind-101000-with-markers":
            projectInformation = {
                "projectName": "Example wind with 101000 with markers",
                "textInput": "The North Wind and the Sun were disputing which was the stronger, when a traveler came along wrapped in a warm cloak.",
                "ipaInput": "ð˘|ə|SIL0|n|ˈɔr|θ|SIL0|w|ˈɪ|nː|dː|SIL0|ə|n˘|d|SIL0|ð|ə|SIL0|sː|ˈʌː|nː|SIL0|w|ˈʌr˘|SIL0|d|ɪ|s|p|j|ˈu|t|ɪ|ŋ|SIL0|w|ˈɪ˘|tʃ|SIL0|w|ˈɑ˘|z|SIL0|ð|ə|SIL0|s|t|r|ˈɔ˘|ŋ|ərˑ|,|SIL1|w|ˈɛ˘|n|SIL0|ə|SIL0|t|r|ˈæ|v|ə|l|ər|SIL0|k|ˈeɪ|m|SIL0|ə|l|ˈɔ|ŋ|SIL0|r|ˈæ|p|t˘|SIL0|ɪ|n|SIL0|ə|SIL0|wː|ˈɔrː|mː|SIL0|kː|l|ˈoʊ|k|.|SIL2",
                "modelInput": "101000-with-markers",
                "voiceInput": "Linda Johnson",
                "sentenceInput": 1,
            };
            break;

        case "wind-101000-without-markers":
            projectInformation = {
                "projectName": "Example wind with 101000 without markers",
                "textInput": "The North Wind and the Sun were disputing which was the stronger, when a traveler came along wrapped in a warm cloak.",
                "ipaInput": "ð|ə|SIL0|n|ˈɔr|θ|SIL0|w|ˈɪ|n|d|SIL0|ə|n|d|SIL0|ð|ə|SIL0|s|ˈʌ|n|SIL0|w|ˈʌr|SIL0|d|ɪ|s|p|j|ˈu|t|ɪ|ŋ|SIL0|w|ˈɪ|tʃ|SIL0|w|ˈɑ|z|SIL0|ð|ə|SIL0|s|t|r|ˈɔ|ŋ|ər|,|SIL1|w|ˈɛ|n|SIL0|ə|SIL0|t|r|ˈæ|v|ə|l|ər|SIL0|k|ˈeɪ|m|SIL0|ə|l|ˈɔ|ŋ|SIL0|r|ˈæ|p|t|SIL0|ɪ|n|SIL0|ə|SIL0|w|ˈɔr|m|SIL0|k|l|ˈoʊ|k|.|SIL2",
                "modelInput": "101000-without-markers",
                "voiceInput": "Linda Johnson",
                "sentenceInput": 1,
            };
            break;

        case "wind-103500-with-markers":
            projectInformation = {
                "projectName": "Example wind with 103500 with markers",
                "textInput": "",
                "ipaInput": "j|ou̯˧˩˧|i˥|tsʰ|ɹ̩˥˩|SIL2|p|ei̯˧˩˧|f|ə˥|ŋ|SIL0|x|ɤ˧˥|SIL0|tʰ|ai̯˥˩|j|a˧˥˘|ŋ˘|SIL0|ʈʂ|ə˥˩|ŋ|ts|ai̯˥˩|SIL0|ʈʂ|ə˥|ŋ|l|w|ə˥˩ː|nˑ|SIL0|ʂ|w˘|ei̯˧˥|SIL0|p|i˧˩˧|tɕ˘|j|au̯˥˩˘|SIL0|j|ou̯˧˩˧|p|ə˧˩˧|n|ʂ|ɻ̩˥˩|。",
                "modelInput": "103500-with-markers",
                "voiceInput": "A11",
                "sentenceInput": 1,
            };
            break;

        case "wind-103500-without-markers":
            projectInformation = {
                "projectName": "Example wind with 103500 without markers",
                "textInput": "",
                "ipaInput": "j|ou̯˧˩˧|i˥|tsʰ|ɹ̩˥˩|SIL2|p|ei̯˧˩˧|f|ə˥|ŋ|SIL0|x|ɤ˧˥|SIL0|tʰ|ai̯˥˩|j|a˧˥|ŋ|SIL0|ʈʂ|ə˥˩|ŋ|ts|ai̯˥˩|SIL0|ʈʂ|ə˥|ŋ|l|w|ə˥˩|n|SIL0|ʂ|w|ei̯˧˥|SIL0|p|i˧˩˧|tɕ|j|au̯˥˩|SIL0|j|ou̯˧˩˧|p|ə˧˩˧|n|ʂ|ɻ̩˥˩|。",
                "modelInput": "103500-without-markers",
                "voiceInput": "A11",
                "sentenceInput": 1,
            };
            break;

        case "wind-MagK-IPA-6400":
            projectInformation = {
                "projectName": "Example wind with MagK IPA 6400",
                "textInput": "The North Wind and the Sun were disputing which was the stronger, when a traveler came along wrapped in a warm cloak.",
                "ipaInput": "ð|ʌ|SIL0|n|ˈɔ|ɹ|θ|SIL0|w|ˈɪ|n|d|SIL0|ˈæ|n|d|SIL0|ð|ʌ|SIL0|s|ˈʌ|n|SIL0|w|ɝ|SIL0|d|ɪ|s|p|j|ˈu|t|ɪ|ŋ|SIL0|h|w|ˈɪ|t͡ʃ|SIL0|w|ˈɑ|z|SIL0|ð|ʌ|SIL0|s|t|ɹ|ˈɔ|ŋ|ɝ|,|SIL1|h|w|ˈɛ|n|SIL0|ʌ|SIL0|t|ɹ|ˈæ|v|ʌ|l|ɝ|SIL0|k|ˈeɪ|m|SIL0|ʌ|l|ˈɔ|ŋ|SIL0|ɹ|ˈæ|p|t|SIL0|ɪ|n|SIL0|ʌ|SIL0|w|ˈɔ|ɹ|m|SIL0|k|l|ˈoʊ|k|.|SIL2",
                "modelInput": "MagK-IPA-6400",
                "voiceInput": "6446-MagK (sdp)",
                "sentenceInput": 1,
            };
            break;

        case "wind-TZ-IPA-6000":
                projectInformation = {
                    "projectName": "Example wind with TZ IPA 6000",
                    "textInput": "The North Wind and the Sun were disputing which was the stronger, when a traveler came along wrapped in a warm cloak.",
                    "ipaInput": "ð|ʌ|SIL0|n|ˈɔ|ɹ|θ|SIL0|w|ˈɪ|n|d|SIL0|ˈæ|n|d|SIL0|ð|ʌ|SIL0|s|ˈʌ|n|SIL0|w|ɝ|SIL0|d|ɪ|s|p|j|ˈu|t|ɪ|ŋ|SIL0|h|w|ˈɪ|t͡ʃ|SIL0|w|ˈɑ|z|SIL0|ð|ʌ|SIL0|s|t|ɹ|ˈɔ|ŋ|ɝ|,|SIL1|h|w|ˈɛ|n|SIL0|ʌ|SIL0|t|ɹ|ˈæ|v|ʌ|l|ɝ|SIL0|k|ˈeɪ|m|SIL0|ʌ|l|ˈɔ|ŋ|SIL0|ɹ|ˈæ|p|t|SIL0|ɪ|n|SIL0|ʌ|SIL0|w|ˈɔ|ɹ|m|SIL0|k|l|ˈoʊ|k|.|SIL2",
                    "modelInput": "TZ-IPA-6000",
                    "voiceInput": "6450 (sdp)",
                    "sentenceInput": 1,
                };
            break;
            
        default:
            projectInformation = {
                "projectName": "Example synthesis",
                "textInput": "",
                "ipaInput": "",
                "modelInput": "101000-with-markers",
                "voiceInput": "Linda Johnson",
                "sentenceInput": 1,
            };
        };
        updateInputFields(projectInformation);
    };
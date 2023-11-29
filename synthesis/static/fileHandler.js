/**
 * fileHandler.js
 *
 * This module provides functions for handling file-related operations,
 * such as saving field input to a text file, loading a text file to
 * populate the input fields with saved data, preparing data for saving and loading.
 */

/**
 * Creates a sanitized filename for a text file based on the project name.
 * This function is intended for use within the saveFile function.
 *
 * @param {string} originalFilename - The original project name used to generate the filename.
 * @returns {string} - The sanitized filename for the text file.
 */
function _createFilename(originalFilename) {
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
function _getFileContent(projectInformation) {
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
function _startDownload(fileContent, fileName) {
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
};


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
};


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
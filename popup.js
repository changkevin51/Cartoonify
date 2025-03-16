// Get references to the DOM elements
const inputText = document.getElementById('inputText');
const saveButton = document.getElementById('saveButton');
const outputText = document.getElementById('outputText');
const applyStylesButton = document.getElementById('applyStyles');

// Load saved text from storage
chrome.storage.sync.get(['savedText'], function (result) {
    if (result.savedText) {
        outputText.textContent = `Saved: ${result.savedText}`;
    }
});

// Save text to storage when the button is clicked
saveButton.addEventListener('click', () => {
    const text = inputText.value;
    if (text) {
        chrome.storage.sync.set({ savedText: text }, function () {
            outputText.textContent = `Saved: ${text}`;
        });
    }
});

// Apply styles when the applyStyles button is clicked
applyStylesButton.addEventListener('click', () => {
    chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
        chrome.tabs.sendMessage(tabs[0].id, {action: "applyStyles"}, function(response) {
            if (response && response.status) {
                outputText.textContent = response.status;
            }
        });
    });
});
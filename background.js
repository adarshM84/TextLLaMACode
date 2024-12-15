let selectedText = ""; // Store the selected text globally

// Create the context menu when the extension is installed
chrome.runtime.onInstalled.addListener(() => {
  chrome.contextMenus.create({
    id: "showSelectedText",
    title: "View Selected Text",
    contexts: ["selection"] // Show only when text is selected
  });
});

// Listen for the context menu click
chrome.contextMenus.onClicked.addListener((info, tab) => {
  if (info.menuItemId === "showSelectedText") {
    selectedText = info.selectionText; // Save the selected text
    chrome.action.openPopup(); // Open the extension popup
  }
});

// Provide selected text to the popup when requested
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.type === "getSelectedText") {
    sendResponse({ text: selectedText });
  }
});


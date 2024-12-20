let selectedText = ""; // Store the selected text globally
let responseMessage = "";

// Create the context menu when the extension is installed
chrome.runtime.onInstalled.addListener(() => {
  const menuItems = [
    { id: "correctGrammar", title: "Correct Grammar" },
    { id: "explainText", title: "Explain the Text" },
    { id: "translateText", title: "Translate (Hindi & English)" },
    { id: "writeEmail", title: "Write an Email" },
    { id: "writeAutoResponse", title: "Write an Auto Response for Email" }
  ];

  // Create a parent context menu
  chrome.contextMenus.create({
    id: "parentMenu",
    title: "Text Actions",
    contexts: ["selection"] // Show only when text is selected
  });

  // Create submenus for different functionalities
  menuItems.forEach((item) => {
    chrome.contextMenus.create({
      id: item.id,
      title: item.title,
      parentId: "parentMenu", // Add under the parent menu
      contexts: ["selection"]
    });
  });
});

// Listen for the context menu click
chrome.contextMenus.onClicked.addListener((info, tab) => {
  if (info.menuItemId) {
    selectedText = info.selectionText || ""; // Save the selected text

    // Generate the message based on the selected context menu item
    switch (info.menuItemId) {
      case "correctGrammar":
        responseMessage = `Corrected grammar for: ${selectedText}`;
        break;

      case "explainText":
        responseMessage = `Explanation for: ${selectedText}`;
        break;

      case "translateText":
        responseMessage = `Translation of "${selectedText}" in Hindi`;
        break;

      case "writeEmail":
        responseMessage = `Suggested email for "${selectedText}"`;
        break;

      case "writeAutoResponse":
        responseMessage = `Auto response for "${selectedText}":\nThank you for your message. We have received the following query:\n"${selectedText}"\nOur team will respond shortly.`;
        break;

      default:
        responseMessage = "Action not recognized.";
    }

    // Open the popup programmatically
    console.log(1);
    chrome.action.openPopup();
  }
});

// Provide the selected text when requested by the popup
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.type === "getSelectedText") {
    console.log(2,request);
    sendResponse({ text: responseMessage });
    responseMessage="No Text Selected.";
  }
});

let selectedText = ""; // Store the selected text globally
let responseMessage = "";

const menuItems = [
  { id: "correctGrammar", title: "Correct Grammar" },
  { id: "explainText", title: "Explain the Text" },
  { id: "translateText", title: "Translate" },
  { id: "writeEmail", title: "Write an Email" },
  { id: "writeAutoResponse", title: "Write an Auto Response for Email" }
];

// Create a parent context menu
chrome.runtime.onInstalled.addListener(() => {
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

  // Add submenu items under "Translate"
  const translateLanguages = [
    { id: "translateToHindi", title: "Hindi" },
    { id: "translateToEnglish", title: "English" },
    { id: "translateToSpanish", title: "Spanish" },
    { id: "translateToFrench", title: "French" },
    { id: "translateToGerman", title: "German" },
    { id: "translateToItalian", title: "Italian" },
    { id: "translateToPortuguese", title: "Portuguese" },
    { id: "translateToDutch", title: "Dutch" },
    { id: "translateToRussian", title: "Russian" },
    { id: "translateToJapanese", title: "Japanese" },
    { id: "translateToKorean", title: "Korean" }
  ];

  translateLanguages.forEach((language) => {
    chrome.contextMenus.create({
      id: language.id,
      title: language.title,
      parentId: "translateText", // Nest under the Translate menu
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
      case "translateToHindi":
        responseMessage = `Translation of "${selectedText}" to Hindi.`;
        break;
      case "translateToEnglish":
        responseMessage = `Translation of "${selectedText}" to English.`;
        break;
      case "translateToSpanish":
        responseMessage = `Translation of "${selectedText}" to Spanish.`;
        break;
      case "translateToFrench":
        responseMessage = `Translation of "${selectedText}" to French.`;
        break;
      case "translateToGerman":
        responseMessage = `Translation of "${selectedText}" to German.`;
        break;
      case "translateToItalian":
        responseMessage = `Translation of "${selectedText}" to Italian.`;
        break;
      case "translateToPortuguese":
        responseMessage = `Translation of "${selectedText}" to Portuguese.`;
        break;
      case "translateToDutch":
        responseMessage = `Translation of "${selectedText}" to Dutch.`;
        break;
      case "translateToRussian":
        responseMessage = `Translation of "${selectedText}" to Russian.`;
        break;
      case "translateToJapanese":
        responseMessage = `Translation of "${selectedText}" to Japanese.`;
        break;
      case "translateToKorean":
        responseMessage = `Translation of "${selectedText}" to Korean.`;
        break;
      case "writeEmail":
        responseMessage = `Suggested email for "${selectedText}".`;
        break;
      case "writeAutoResponse":
        responseMessage = `Auto response for "${selectedText}":\nThank you for your message. We have received the following query:\n"${selectedText}"\nOur team will respond shortly.`;
        break;
      default:
        responseMessage = "Action not recognized.";
    }

    // Ensure the side panel is enabled and configured
    chrome.sidePanel.open({ windowId: tab.windowId });
  }
});

// Provide the selected text when requested by the popup
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  console.log("========== Called")
  if (request.type === "getSelectedText") {
    sendResponse({ text: responseMessage });
    responseMessage = "No Text Selected."; // Reset response message after sending
  }
});

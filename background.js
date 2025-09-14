let selectedText = ""; // Store the selected text globally
let responseMessage = "";

// Create the context menu when the extension is installed
chrome.runtime.onInstalled.addListener(() => {
  const menuItems = [
    { id: "correctGrammar", title: "✍️ Correct Grammar" },
    { id: "askQuestion", title: "❓ Ask" },
    { id: "explainText", title: "📖 Explain the Text" },
    { id: "translateText", title: "🌐 Translate to" },
    { id: "writeEmail", title: "📧 Write an Email For " },
    { id: "writeAutoResponse", title: "🤖 Write an Auto Response for Email" }
  ];

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
    { id: "translateToArabic", title: "Arabic" },
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

  //Add submenu for mail compose
  const mailRequest = [
    { id: "leaveMail", title: "Leave Request." },
    { id: "roomBookMail", title: "Meeting Room Book Request." },
    { id: "givenSubjectMail", title: "Given Subject." },
    { id: "descMail", title: "Given Details." }
  ];

  mailRequest.forEach((subject) => {
    chrome.contextMenus.create({
      id: subject.id,
      title: subject.title,
      parentId: "writeEmail", // Nest under the Translate menu
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
      case "askQuestion":
        responseMessage = selectedText;
        break;
      case "explainText":
        responseMessage = `Explanation for: ${selectedText}`;
        break;
      case "translateToHindi":
        responseMessage = `Translation of given text to  Hindi : "${selectedText}`;
        break;
      case "translateToEnglish":
        responseMessage = `Translation of given text to English : "${selectedText}" `;
        break;
      case "translateToArabic":
        responseMessage = `Translation of given text to Arabic : "${selectedText}" `;
        break;
      case "translateToSpanish":
        responseMessage = `Translation of of given text  to Spanish :"${selectedText}"`;
        break;
      case "translateToFrench":
        responseMessage = `Translation of of given text  to French :"${selectedText}" `;
        break;
      case "translateToGerman":
        responseMessage = `Translation of of given text  to German :"${selectedText}"`;
        break;
      case "translateToItalian":
        responseMessage = `Translation of of given text  to Italian : "${selectedText}"`;
        break;
      case "translateToPortuguese":
        responseMessage = `Translation of of given text  to Portuguese : "${selectedText}"`;
        break;
      case "translateToDutch":
        responseMessage = `Translation of of given text  to Dutch : "${selectedText}"`;
        break;
      case "translateToRussian":
        responseMessage = `Translation of of given text  to Russian :"${selectedText}"`;
        break;
      case "translateToJapanese":
        responseMessage = `Translation of of given text  to Japanese : "${selectedText}".`;
        break;
      case "translateToKorean":
        responseMessage = `Translation of of given text  to Korean : "${selectedText}"`;
        break;
      case "leaveMail":
        responseMessage = `Wrire email for leave request.`;
        break;
      case "roomBookMail":
        responseMessage = `Write email for metting room book request.`;
        break;
      case "givenSubjectMail":
        responseMessage = `Write email for given subject : "${selectedText}".`;
        break;
      case "descMail":
        responseMessage = `Write email for given details :"${selectedText}".`;
        break;
      case "writeAutoResponse":
        responseMessage = `Auto response for "${selectedText}":\nThank you for your message. We have received the following query:\n"${selectedText}"\nOur team will respond shortly.`;
        break;
      default:
        responseMessage = "Action not recognized.";
    }

    // Open the popup programmatically
    chrome.action.openPopup();
  }
});

// Provide the selected text when requested by the popup
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.type === "getSelectedText") {
    sendResponse({ text: responseMessage });
    responseMessage = "No Text Selected.";
  }
});

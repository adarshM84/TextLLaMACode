document.getElementById("getSelection").addEventListener("click", async () => {

  // Get the active tab
  const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });

  // Execute script to fetch selected text
  const [result] = await chrome.scripting.executeScript({
    target: { tabId: tab.id },
    func: () => window.getSelection().toString()
  });

  // Display the result in the popup
  document.getElementById("selectedText").textContent = result.result || "No text selected.";
});
// Request the selected text from the background script
chrome.runtime.sendMessage({ type: "getSelectedText" }, (response) => {
  const selectedText = response.text || "No text selected.";
  document.getElementById("selectedText").textContent = selectedText;
});


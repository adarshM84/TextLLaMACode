document.addEventListener("DOMContentLoaded", () => {

  // Request the selected text when the popup loads
  chrome.runtime.sendMessage({ type: "getSelectedText" }, (response) => {
    const selectedTextElement = document.getElementById("selectedText");
    console.log(3,response);
    if (selectedTextElement && response.text) {
      selectedTextElement.textContent = response.text;
      if(!document.getElementById("showAnswer").classList.contains("process")){
        document.getElementById("showAnswer").classList.add("process");
      }
      getQuestionAnswer(response.text);
    }
  });
});

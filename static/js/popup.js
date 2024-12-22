function emptyChatDIv(){
  document.getElementById("selectedText").innerHTML = localStorage.getItem("oldQuestion") ? localStorage.getItem("oldQuestion") : "No Text Selected.";
  document.getElementById("showAnswer").innerHTML = localStorage.getItem("oldAnswer") ? localStorage.getItem("oldAnswer") : "Please select the text.";
}

document.addEventListener("DOMContentLoaded", () => {

  // Request the selected text when the popup loads
  chrome.runtime.sendMessage({ type: "getSelectedText" }, (response) => {
    console.log(response);
    const selectedTextElement = document.getElementById("selectedText");
    if (selectedTextElement && response.text) {
      selectedTextElement.textContent = response.text;
      if (!document.getElementById("showAnswer").classList.contains("process")) {
        document.getElementById("showAnswer").classList.add("process");
      }
      if (response.text.trim() == "No Text Selected." || response.text.trim()=="") {
        emptyChatDIv();
      } else {
        getQuestionAnswer(response.text);
      }
    }else{
      emptyChatDIv();
    }
  });
});

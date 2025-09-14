var botMessage = "";
var rebuildRules = undefined;
if (typeof chrome !== "undefined" && chrome.runtime && chrome.runtime.id) {
    rebuildRules = async function (domain) {
        const domains = [domain];
        /** @type {chrome.declarativeNetRequest.Rule[]} */
        const rules = [{
            id: 1,
            condition: {
                requestDomains: domains
            },
            action: {
                type: 'modifyHeaders',
                requestHeaders: [{
                    header: 'origin',
                    operation: 'set',
                    value: `http://${domain}`,
                }],
            },
        }];
        await chrome.declarativeNetRequest.updateDynamicRules({
            removeRuleIds: rules.map(r => r.id),
            addRules: rules,
        });
    }
}

function setHostAddress(hostName) {
    if (rebuildRules) {
        rebuildRules("localhost");
    }
    else if (hostName.length > 0) rebuildRules("localhost");;
}

function openMailClient(client) {
    const to = "";
    const subject = "";
    const body = document.getElementById("showAnswer").textContent.trim();

    const encodedSubject = encodeURIComponent(subject);
    const encodedBody = encodeURIComponent(body);

    let url = "";

    if (client === "gmail") {
        url = `https://mail.google.com/mail/?view=cm&fs=1&to=${to}&su=${encodedSubject}&body=${encodedBody}`;
    } else if (client === "outlook") {
        url = `https://outlook.office.com/mail/deeplink/compose?to=${to}&subject=${encodedSubject}&body=${encodedBody}`;
    }

    if (url) {
        window.open(url, '_blank');
    }
}


window.onload = () => {
    initializeLocalStorageDefaults();
    setHostAddress(localStorage.getItem("hostAddress"));//To Do a post call for chat with ollama modals
    setModalSettingsList();
    setFunctionCallByClass("ollamaSettings", "change", setSettings);

    document.getElementById("openGmail").addEventListener("click", function () {
        openMailClient("gmail");
    });

    document.getElementById("openOutlook").addEventListener("click", function () {
        openMailClient("outlook");
    });

    document.getElementById("stopChat").addEventListener("click", function () {
        localStorage.setItem("stopChat", true);
    });
    document.getElementById("restartChat").addEventListener("click", function () {
         getQuestionAnswer(document.getElementById("selectedText").textContent);
    });

    document.getElementById("openSettingIcon").addEventListener("click", function (event) {
        showElement("chatDiv", !document.getElementById("ollamaSettings").hidden);
        showElement("ownerDiv", false);
        showElement("ollamaSettings", document.getElementById("ollamaSettings").hidden);
        setModalSettingsList();
    });
    document.getElementById("opneIntroIcon").addEventListener("click", function (event) {
        showElement("ollamaSettings", false);
        showElement("chatDiv", !document.getElementById("ownerDiv").hidden);
        showElement("ownerDiv", document.getElementById("ownerDiv").hidden);
    });

    document.getElementById("headTitle").addEventListener("click", function (event) {
        showElement("ollamaSettings", false);
        showElement("chatDiv", true);
        showElement("ownerDiv", false);
    });

    document.getElementById("chatDiv").addEventListener("click", function (event) {
        window.navigator.clipboard.writeText(document.getElementById("showAnswer").textContent);
    });
    if (localStorage.getItem("ollamaModal") && localStorage.getItem("ollamaModal") !== null && localStorage.getItem("ollamaModal").length != 0) {
        document.getElementById("modalInfo").innerHTML = `<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-shield-check" viewBox="0 0 16 16">
        <path d="M5.338 1.59a61 61 0 0 0-2.837.856.48.48 0 0 0-.328.39c-.554 4.157.726 7.19 2.253 9.188a10.7 10.7 0 0 0 2.287 2.233c.346.244.652.42.893.533q.18.085.293.118a1 1 0 0 0 .101.025 1 1 0 0 0 .1-.025q.114-.034.294-.118c.24-.113.547-.29.893-.533a10.7 10.7 0 0 0 2.287-2.233c1.527-1.997 2.807-5.031 2.253-9.188a.48.48 0 0 0-.328-.39c-.651-.213-1.75-.56-2.837-.855C9.552 1.29 8.531 1.067 8 1.067c-.53 0-1.552.223-2.662.524zM5.072.56C6.157.265 7.31 0 8 0s1.843.265 2.928.56c1.11.3 2.229.655 2.887.87a1.54 1.54 0 0 1 1.044 1.262c.596 4.477-.787 7.795-2.465 9.99a11.8 11.8 0 0 1-2.517 2.453 7 7 0 0 1-1.048.625c-.28.132-.581.24-.829.24s-.548-.108-.829-.24a7 7 0 0 1-1.048-.625 11.8 11.8 0 0 1-2.517-2.453C1.928 10.487.545 7.169 1.141 2.692A1.54 1.54 0 0 1 2.185 1.43 63 63 0 0 1 5.072.56"/>
        <path d="M10.854 5.146a.5.5 0 0 1 0 .708l-3 3a.5.5 0 0 1-.708 0l-1.5-1.5a.5.5 0 1 1 .708-.708L7.5 7.793l2.646-2.647a.5.5 0 0 1 .708 0"/>
      </svg> `+ localStorage.getItem("ollamaModal");
    }
    document.getElementById("closeChat").addEventListener("click", function (event) {
        window.close();
    });

    if (localStorage.getItem("chatTheme")) document.getElementById("coustomStyle").innerHTML = localStorage.getItem("chatTheme");

}

//This will set the function call by class name
function setFunctionCallByClass(elementClassName, actionType, func, funcElementId = false) {
    var tmpClassElementList = document.getElementsByClassName(elementClassName);
    for (i = 0; i < tmpClassElementList.length; i++) {
        tmpClassElementList[i].addEventListener(actionType, function (event) {
            if (funcElementId) func(funcElementId)
            else func(event)
        });
    }
}

//Set Settings On Changes
function setSettings(event) {
    // console.log(event.target.name, event.target.type)
    if (event.target.type == "text" && event.target.id == "modalConnectionUri") {
        if (event.target.value.trim().length == 0) {
            alert("Please enter valid uri");
            return;
        }
        localStorage.setItem("modalConnectionUri", event.target.value);
    } else if (event.target.type == "select-one" && event.target.id == "modalList") {
        if (event.target.value.trim().length == 0) {
            alert("Please select modal");
            return;
        }
        localStorage.setItem("ollamaModal", event.target.value);
        document.getElementById("modalInfo").innerHTML = `<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="currentColor" class="bi bi-shield-check" viewBox="0 0 16 16">
  <path d="M5.338 1.59a61 61 0 0 0-2.837.856.48.48 0 0 0-.328.39c-.554 4.157.726 7.19 2.253 9.188a10.7 10.7 0 0 0 2.287 2.233c.346.244.652.42.893.533q.18.085.293.118a1 1 0 0 0 .101.025 1 1 0 0 0 .1-.025q.114-.034.294-.118c.24-.113.547-.29.893-.533a10.7 10.7 0 0 0 2.287-2.233c1.527-1.997 2.807-5.031 2.253-9.188a.48.48 0 0 0-.328-.39c-.651-.213-1.75-.56-2.837-.855C9.552 1.29 8.531 1.067 8 1.067c-.53 0-1.552.223-2.662.524zM5.072.56C6.157.265 7.31 0 8 0s1.843.265 2.928.56c1.11.3 2.229.655 2.887.87a1.54 1.54 0 0 1 1.044 1.262c.596 4.477-.787 7.795-2.465 9.99a11.8 11.8 0 0 1-2.517 2.453 7 7 0 0 1-1.048.625c-.28.132-.581.24-.829.24s-.548-.108-.829-.24a7 7 0 0 1-1.048-.625 11.8 11.8 0 0 1-2.517-2.453C1.928 10.487.545 7.169 1.141 2.692A1.54 1.54 0 0 1 2.185 1.43 63 63 0 0 1 5.072.56"/>
  <path d="M10.854 5.146a.5.5 0 0 1 0 .708l-3 3a.5.5 0 0 1-.708 0l-1.5-1.5a.5.5 0 1 1 .708-.708L7.5 7.793l2.646-2.647a.5.5 0 0 1 .708 0"/>
</svg> `+ localStorage.getItem("ollamaModal");
    }
    else if (event.target.type == "select-one" && event.target.id == "chatTheme") {
        if (event.target.value.trim().length == 0) {
            alert("Please select modal");
            return;
        }
        localStorage.setItem("chatTheme", event.target.value);
        document.getElementById("coustomStyle").innerHTML = event.target.value;
    }
    setModalSettingsList();
}

function showElement(elementId, flag) {
    document.getElementById(elementId).hidden = !flag;
}

function initializeLocalStorageDefaults() {
    setDefault("hostAddress", "localhost");
    setDefault("modalConnectionUri", "http://localhost:11434");
}

//Set Localstorage value
function setDefault(key, defaultValue, setForce = false) {
    if (!localStorage.getItem(key) || localStorage.getItem(key).length === 0 || setForce) {
        localStorage.setItem(key, defaultValue);
    }
}

//To Stop The Chat
function stpoChat(flag) {
    localStorage.setItem("stopChat", flag);
    showElement("stopChat", !flag)
    showElement("restartChat", flag)
}

//To Get Answer
function getQuestionAnswer(useQuestion) {
    stpoChat(false);
    botMessage = "";
    if (localStorage.getItem("ModalWorking") != 1) {
        alert("Not able to connect with ollama please check the settings.");
        return;
    }

    if (!localStorage.getItem("ollamaModal") || localStorage.getItem("ollamaModal").trim().length == 0) {
        alert("Oops.Please select the modal or do the ollama setting from setting tab.");
        document.getElementById("showAnswer").innerHTML = "Oops.Please select the modal or do the ollama setting from setting tab.";
        return false;
    }

    let modalName = localStorage.getItem("ollamaModal") ? localStorage.getItem("ollamaModal") : "llama3.2:1b";

    localStorage.setItem("oldQuestion", useQuestion);
    const data = {
        model: modalName,
        prompt: useQuestion,
        stream: true
    };

    const storedUrl = localStorage.getItem("modalConnectionUri");
    const baseUrl = storedUrl && storedUrl.trim() !== "" ? storedUrl : "http://localhost:11434";
    const apiUrl = `${baseUrl}/api/generate`;

    fetch(apiUrl, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(data)
    })
        .then(response => {
            console.log("response  -level 2")
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            return response.body.getReader();
        }).then(reader => {
            let decoder = new TextDecoder();
            let buffer = ''; // Buffer to store incomplete JSON strings

            // Define recursive function to continuously fetch responses
            function readStream() {
                reader.read().then(({ done, value }) => {
                    if (localStorage.getItem("stopChat") == 'true') {
                        stpoChat(true);
                        return;
                    }
                    if (done) {
                        // Process any remaining buffer at the end of stream
                        if (buffer !== '') {
                            processJSON(buffer);
                        }
                        return;
                    }

                    // Append the new chunk of data to the buffer
                    buffer += decoder.decode(value, { stream: true });

                    // Process complete JSON objects in the buffer
                    processBuffer();
                });
            }

            // Function to process the buffer and extract complete JSON objects
            function processBuffer() {
                let chunks = buffer.split('\n');
                buffer = '';

                // Process each chunk
                for (let i = 0; i < chunks.length - 1; i++) {
                    let chunk = chunks[i];
                    processJSON(chunk);
                }

                // Store the incomplete JSON for the next iteration
                buffer = chunks[chunks.length - 1];
            }

            // Function to parse and process a JSON object
            function processJSON(jsonString) {
                try {
                    let jsonData = JSON.parse(jsonString);
                    if (jsonData.error) {
                        alert("Not able to chat please check console for more.")
                        console.log(jsonData.error);
                        return;
                    }
                    if (document.getElementById("showAnswer").classList.contains("process")) {
                        document.getElementById("showAnswer").classList.remove("process");
                        document.getElementById("showAnswer").textContent = "";
                    }
                    jsonData.response = jsonData.response.replace(/"/g, '');
                    botMessage += jsonData.response;
                    document.getElementById("showAnswer").innerHTML = parseText(botMessage);
                    localStorage.setItem("oldAnswer", document.getElementById("showAnswer").innerHTML);

                    // Check if the response indicates "done: true"
                    if (jsonData.done) {
                        stpoChat(true)
                        console.log("Done");
                    } else {
                        // Continue reading the stream
                        readStream();
                    }
                } catch (error) {
                    console.error('Error parsing JSON:', error);
                }
            }

            // Start reading the stream
            readStream();
        })
        .catch(error => {
            document.getElementById("showAnswer").innerHTML = "Opps!! not able to conect with ollama server.Please check settngs or ollama is runing or not.";
            alert("Opps!! not able to conect with ollama server.Please check settngs or ollama is runing or not.")
            console.error('There was a problem with the fetch operation:', error);
        });

}

//To Parse Html Content
function parseText(input) {
    // Escape any HTML in the input to prevent parsing
    const escapedInput = input
        .replace(/&/g, "&amp;") // Escape `&`
        .replace(/</g, "&lt;") // Escape `<`
        .replace(/>/g, "&gt;"); // Escape `>`

    // Replace **text** with <b>text</b> while preserving escaped content
    let formatted = escapedInput.replace(/\*\*(.*?)\*\*/g, "<b>$1</b>");

    // Map of language types to their code block styles and badges
    const languageStyles = {
        html: { className: "htmlCode", label: "HTML" },
        css: { className: "cssCode", label: "CSS" },
        javascript: { className: "jsCode", label: "JS" },
        php: { className: "phpCode", label: "PHP" },
        cpp: { className: "cppCode", label: "cpp" },
        general: { className: "generalCode", label: "Code" }
    };

    // Function to wrap the code block
    function wrapCodeBlock(lang, code) {
        const { className, label } = languageStyles[lang] || languageStyles.general;
        var preparedContents = `
                <div class="${className} customCodeBlock">
                    <p class="codeBage" title="Copy Response"><span>${label}</span>
                        <svg xmlns="http://www.w3.org/2000/svg" width="15" height="20" fill="currentColor" class="bi bi-clipboard2-fill reactSvg copyResponse mx-1" viewBox="0 0 16 16" id="copy67">
                            <path id="67" d="M9.5 0a.5.5 0 0 1 .5.5.5.5 0 0 0 .5.5.5.5 0 0 1 .5.5V2a.5.5 0 0 1-.5.5h-5A.5.5 0 0 1 5 2v-.5a.5.5 0 0 1 .5-.5.5.5 0 0 0 .5-.5.5.5 0 0 1 .5-.5z"></path>
                            <path id="67" d="M3.5 1h.585A1.5 1.5 0 0 0 4 1.5V2a1.5 1.5 0 0 0 1.5 1.5h5A1.5 1.5 0 0 0 12 2v-.5q-.001-.264-.085-.5h.585A1.5 1.5 0 0 1 14 2.5v12a1.5 1.5 0 0 1-1.5 1.5h-9A1.5 1.5 0 0 1 2 14.5v-12A1.5 1.5 0 0 1 3.5 1"></path>
                        </svg>
                        <svg style="display:none;" xmlns="http://www.w3.org/2000/svg" width="15" height="20" fill="currentColor" class="bi bi-clipboard-check-fill reactSvg" viewBox="0 0 16 16"><path d="M6.5 0A1.5 1.5 0 0 0 5 1.5v1A1.5 1.5 0 0 0 6.5 4h3A1.5 1.5 0 0 0 11 2.5v-1A1.5 1.5 0 0 0 9.5 0zm3 1a.5.5 0 0 1 .5.5v1a.5.5 0 0 1-.5.5h-3a.5.5 0 0 1-.5-.5v-1a.5.5 0 0 1 .5-.5z"></path><path d="M4 1.5H3a2 2 0 0 0-2 2V14a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V3.5a2 2 0 0 0-2-2h-1v1A2.5 2.5 0 0 1 9.5 5h-3A2.5 2.5 0 0 1 4 2.5zm6.854 7.354-3 3a.5.5 0 0 1-.708 0l-1.5-1.5a.5.5 0 0 1 .708-.708L7.5 10.793l2.646-2.647a.5.5 0 0 1 .708.708"></path><title>Copied</title></svg>
                    </p>
                    <span class="mainCodeContent">${code}</span>
                </div>`;
        return preparedContents;
    }


    // Detect and format code blocks with triple backticks
    formatted = formatted.replace(/```(html|css|javascript|php|cpp|)(.*?)```/gs, (match, lang, code) => {
        lang = lang || "general"; // Default to 'general' if no language is specified
        return wrapCodeBlock(lang, code);
    });
    return formatted;
}

//Set Modal And Load Data Of Settings
function setModalSettingsList() {
    loadChatTheme();
    document.getElementById("modalConnectionUri").value = localStorage.getItem("modalConnectionUri");

    var apiUrl = "http://localhost:11434";

    if (localStorage.getItem("modalConnectionUri")) {
        apiUrl = localStorage.getItem("modalConnectionUri") + "/api/tags";
    }

    fetch(apiUrl, {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json'
        }
    }).then((response) => response.json())
        .then((data) => {
            var modelsList = data.models;
            var modelSelect = document.getElementById("modalList");
            modelSelect.innerHTML = "";
            modelSelect.innerHTML = "<option disabled selected>Select Modal</option>";

            for (i = 0; i < modelsList.length; i++) {
                var tmpOption = document.createElement("option");
                tmpOption.value = modelsList[i].name;
                tmpOption.innerHTML = modelsList[i].name + " " + modelsList[i].details.parameter_size;

                var selectedModal = localStorage.getItem("ollamaModal");

                if (selectedModal == modelsList[i].name) {
                    tmpOption.selected = true;
                }

                modelSelect.appendChild(tmpOption);
            }
            localStorage.setItem("ModalWorking", 1);
            setMessage("settingsMessage", "");
        })
        .catch((error => {
            var modelSelect = document.getElementById("modalList");
            modelSelect.innerHTML = "";
            setTimeout(function () { setMessage("settingsMessage", `<img class='customIcon' src='static/images/cross.gif' />Unable to connect to ollama.Please check server running or not through below url.<br><a target='_blank' href='${apiUrl}'>${apiUrl}<a><br><span class='text-success'> To install or make setup of ollama server use <a href="https://chromewebstore.google.com/detail/opentalkgpt/idknomikbgopkhpepapoehhoafacddlk">OpenTalkGpt Extention</a> </span>`, 1) }, 100);
            localStorage.setItem("ModalWorking", 0);
            console.error('There was a problem with the fetch operation:', error);
            alert("Opps!! not able to conect with ollama server.Please check settngs or ollama is runing or not.")
        }));

}

//To Load Theme
function loadChatTheme() {
    var themeSelect = document.getElementById("chatTheme");
    themeSelect.innerHTML = "";
    themeSelect.innerHTML = "<option disabled selected>Select Theme</option>";

    for (i = 0; i < chatTheme.length; i++) {
        var tmpOption = document.createElement("option");
        tmpOption.value = chatTheme[i].value;
        tmpOption.innerHTML = chatTheme[i].name;

        var selectedTheme = localStorage.getItem("chatTheme");

        if (selectedTheme == chatTheme[i].value) {
            tmpOption.selected = true;
        }

        themeSelect.appendChild(tmpOption);
    }
}

//To Show Message
function setMessage(elemId, msg, isError) {
    document.getElementById(elemId).innerHTML = msg;
    var messageCss = isError ? "color:red;" : "color:green;";
    document.getElementById(elemId).setAttribute("style", messageCss);
}
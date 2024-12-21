var rebuildRules = undefined;
if (typeof chrome !== "undefined" && chrome.runtime && chrome.runtime.id) {
    rebuildRules = async function (domain) {
        console.log("data us ", domain)
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

window.onload = () => {
    console.log(chrome.runtime.id)
    setHostAddress();
}

function getQuestionAnswer(useQuestion) {
    const data = {
        model: "llama3.2:1b",
        prompt: useQuestion,
        stream: true
    };

    var apiUrl = "http://localhost:11434/api/generate";

    fetch("http://localhost:11434/api/generate", {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(data)
    })
        .then(response => {
            console.log("response")
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
                    console.log(jsonData, jsonData.done)
                    if (document.getElementById("showAnswer").classList.contains("process")) {
                        document.getElementById("showAnswer").classList.remove("process");
                        document.getElementById("showAnswer").textContent="";
                    }
                    jsonData.response = jsonData.response.replace(/"/g, '');
                    document.getElementById("showAnswer").innerHTML += parseText(jsonData.response);

                    // Check if the response indicates "done: true"
                    if (jsonData.done) {
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
            console.error('There was a problem with the fetch operation:', error);
        });

}

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

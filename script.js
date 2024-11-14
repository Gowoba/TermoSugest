const API_KEY = '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';
let lastRequestTime = 0;

async function sendMessage() {
    const userInput = document.getElementById("user-input").value;
    if (!userInput) return;

    addMessage("Você", userInput);
    document.getElementById("user-input").value = "";

    // Limita a frequência das requisições para evitar o erro 429
    const now = Date.now();
    if (now - lastRequestTime < 1000) {  // Tempo em milissegundos
        addMessage("ChatGPT", "Você está enviando mensagens rápido demais. Aguarde um momento.");
        return;
    }
    lastRequestTime = now;

    try {
        const response = await fetch("https://api.openai.com/v1/chat/completions", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${API_KEY}`
            },
            body: JSON.stringify({
                model: "gpt-3.5-turbo",
                messages: [{ role: "user", content: userInput }]
            })
        });

        if (response.status === 429) {
            addMessage("ChatGPT", "Muitas requisições em pouco tempo. Aguarde alguns segundos e tente novamente.");
            return;
        }

        if (!response.ok) {
            throw new Error(`Erro HTTP! Status: ${response.status}`);
        }

        const data = await response.json();
        const botMessage = data.choices[0].message.content;
        addMessage("ChatGPT", botMessage);
    } catch (error) {
        console.error("Erro:", error);
        addMessage("ChatGPT", "Desculpe, ocorreu um erro. Tente novamente mais tarde.");
    }
}

function addMessage(sender, text) {
    const chatLog = document.getElementById("chat-log");
    const messageElement = document.createElement("div");
    messageElement.innerHTML = `<strong>${sender}:</strong> ${text}`;
    chatLog.appendChild(messageElement);
    chatLog.scrollTop = chatLog.scrollHeight;
}

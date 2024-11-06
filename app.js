const btn = document.querySelector('.talk');
const content = document.querySelector('.content');

// Chave da API do OpenWeather
const apiKey = 'fa89c5d2e9cb65ea98ba5b710ceeba8f';

// Função para buscar clima
function getWeather() {
    const city = "Além Paraíba";
    const url = `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}&units=metric&lang=pt_br`;

    return fetch(url)
        .then(response => response.json())
        .then(data => {
            const temperature = data.main.temp;
            const description = data.weather[0].description;
            return `A temperatura em ${city} é de ${temperature}°C com ${description}`;
        })
        .catch(error => {
            console.error("Erro ao obter o clima:", error);
            return "Desculpe, não consegui obter a informação do clima agora.";
        });
}

// Função para sintetizar fala
function speak(sentence) {
    const text_speak = new SpeechSynthesisUtterance(sentence);
    text_speak.rate = 1;
    text_speak.pitch = 1;
    window.speechSynthesis.speak(text_speak);
}

// Função de saudação baseada no horário
function wishMe() {
    const day = new Date();
    const hr = day.getHours();

    if (hr >= 6 && hr < 12) {
        speak("Bom dia");
    } else if (hr >= 12 && hr < 18) {
        speak("Boa tarde");
    } else {
        speak("Boa noite");
    }
}

// Inicialização do assistente
window.addEventListener('load', () => {
    speak("Inicializando");
    speak("Sistema Online");
    wishMe();
});

// Configuração de reconhecimento de fala
const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
const recognition = new SpeechRecognition();

recognition.onresult = (event) => {
    const current = event.resultIndex;
    const transcript = event.results[current][0].transcript;
    content.textContent = transcript;
    speakThis(transcript.toLowerCase());
};

// Iniciar reconhecimento de fala ao clicar no botão
btn.addEventListener('click', () => {
    recognition.start();
});

// Função para processar respostas
function speakThis(message) {
    const speech = new SpeechSynthesisUtterance();

    // Respostas de saudação
    if (message.includes('oi') || message.includes('olá')) {
        speech.text = "Olá, como posso te ajudar?";
    } else if (message.includes('como você está') || message.includes('tudo bem')) {
        speech.text = "Estou bem, quando quiser começar, eu já estou pronto!";
    } else if (message.includes('qual é o seu nome') || message.includes('qual o seu nome')) {
        speech.text = "Meu nome é ALE, sou seu assistente virtual";

    // Comandos para abrir sites
    } else if (message.includes('abrir google')) {
        window.open("https://www.google.com", "_blank");
        speech.text = "Abrindo o Google";
    } else if (message.includes('o que está acontecendo hoje') || message.includes('me fale as notícias')) {
        window.open("https://g1.globo.com", "_blank");
        speech.text = "Abrindo portal de notícias, aqui você encontra desde esportes até economia mundial";
    } else if (message.includes('abrir youtube')) {
        window.open("https://www.youtube.com", "_blank");
        speech.text = "Abrindo o YouTube";
    } else if (message.includes('abrir spotify')) {
        window.open("https://open.spotify.com", "_blank");
        speech.text = "Abrindo o Spotify";
    } else if (message.includes('abrir filmora')) {
        window.open("///Wondershare Filmora", "_blank");
        speech.text = "Abrindo o Filmora";
    } else if (message.includes('qual o clima de hoje') || message.includes('como está o tempo')) {
        getWeather().then(clima => {
            speak(clima); // Chama a função speak diretamente para evitar conflitos
        });
        return; // Evita que o código abaixo execute até que o clima seja respondido

    // Comando para horário
    } else if (message.includes('que horas são') || message.includes('me fale as horas') || message.includes('qual é a hora') || message.includes('qual a hora')) {
        const time = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
        speech.text = `Agora são ${time}`;

    // Comando para data
    } else if (message.includes('que dia é hoje') || message.includes('me fala a data') || message.includes('qual a data de hoje')) {
        const date = new Date().toLocaleDateString('pt-BR', { day: 'numeric', month: 'long', year: 'numeric' });
        speech.text = `Hoje é ${date}`;

    // Caso não entenda a solicitação
    } else {
        window.open(`http://www.google.com/search?q=${message.replace(" ", "+")}`, "_blank");
        speech.text = "Desculpa, ainda estou em desenvolvimento, então não entendi. Deixa eu te encaminhar para o Google para procurar: " + message;
    }

    // Configuração final da fala
    speech.volume = 1;
    speech.pitch = 1;
    speech.rate = 1;

    window.speechSynthesis.speak(speech);
}
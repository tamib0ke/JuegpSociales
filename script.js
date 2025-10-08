document.addEventListener('DOMContentLoaded', () => {
    // --- Elementos del DOM ---
    const allScreens = document.querySelectorAll('.screen');
    const startGameBtn = document.getElementById('start-game-btn');
    const topicButtonsContainer = document.getElementById('topic-buttons');
    const questionText = document.getElementById('question-text');
    const optionBoxes = document.querySelectorAll('.option-box');
    const pointsDisplay = document.getElementById('points-display');
    const timerText = document.getElementById('timer-text');
    const comodinPistaBtn = document.getElementById('comodin-pista');
    const comodin5050Btn = document.getElementById('comodin-50-50');
    const hintBubble = document.getElementById('hint-bubble');
    const gameOverTitle = document.getElementById('game-over-title');
    const finalScoreEl = document.getElementById('final-score');
    const finalTimeEl = document.getElementById('final-time');
    const restartBtn = document.getElementById('restart-btn');
    const lobbyBtn = document.getElementById('lobby-btn');
    const muteBtn = document.getElementById('mute-btn'); // MUTE: Elemento del botón

    // --- AÑADIDO PARA SONIDOS ---
    const audioInicio = new Audio('sounds/sonido-inicio.mp3');
    const audioTemporizador = new Audio('sounds/sonido-temporizador.mp3');
    const audioCorrecto = new Audio('sounds/sonido-correcto.mp3');
    const audioIncorrecto = new Audio('sounds/sonido-incorrecto.mp3');
    audioTemporizador.loop = true;

    // --- Variables y Constantes del Juego ---
    let isMuted = false; // MUTE: Variable de estado
    let allQuestionsData = {};
    let currentQuestions = [];
    let currentQuestionIndex = 0;
    let score = 0;
    let correctAnswersCount = 0;
    let streakCounter = 0;
    let lifelines;
    let gameActive = false;
    let timer;
    let timeLeft = 45;
    let gameStartTime;
    let lastPlayedTopic = '';

    const TOTAL_QUESTIONS_PER_GAME = 10;
    const QUICK_ANSWER_THRESHOLD = 3;
    const MAX_BASE_SCORE = TOTAL_QUESTIONS_PER_GAME * 10;
    const MAX_SPEED_BONUS = TOTAL_QUESTIONS_PER_GAME * 2;
    const MAX_STREAK_BONUS = Math.floor(TOTAL_QUESTIONS_PER_GAME / 3) * 5;
    const COMPLETION_BONUS = 10;
    const MAX_POSSIBLE_SCORE = MAX_BASE_SCORE + MAX_SPEED_BONUS + MAX_STREAK_BONUS + COMPLETION_BONUS;


    // --- Configuración de la API ---
    const API_CONFIG = {
        BASE_URL: 'https://puramentebackend.onrender.com/api/gamedata/category/sociales'
    };

    // MUTE: Función para reproducir sonidos solo si no está silenciado
    function playSound(audioElement) {
        if (!isMuted) {
            audioElement.currentTime = 0;
            audioElement.play();
        }
    }
    
    // --- Función para extraer user_id de la URL ---
    function getUserIdFromURL() {
        const urlParams = new URLSearchParams(window.location.search);
        const userId = urlParams.get('user_id');
        return userId ? parseInt(userId) : null;
    }

    // --- Funciones de carga de mensajes ---
    function showLoadingMessage(message) {
        const loadingOverlay = document.createElement('div');
        loadingOverlay.id = 'loading-overlay';
        loadingOverlay.style.cssText = `
            position: fixed; top: 0; left: 0; width: 100%; height: 100%; background: rgba(0, 0, 0, 0.9);
            display: flex; justify-content: center; align-items: center; flex-direction: column;
            font-family: 'Quicksand', sans-serif; z-index: 9999; color: white;
        `;
        loadingOverlay.innerHTML = `
            <div style="font-size: 24px; margin-bottom: 20px;">${message}</div>
            <div style="width: 50px; height: 50px; border: 5px solid #f3f3f3; border-top: 5px solid #3498db; border-radius: 50%; animation: spin 1s linear infinite;"></div>
            <style> @keyframes spin { 0% { transform: rotate(0deg); } 100% { transform: rotate(360deg); } } </style>
        `;
        document.body.appendChild(loadingOverlay);
    }

    function hideLoadingMessage() {
        const loadingOverlay = document.getElementById('loading-overlay');
        if (loadingOverlay) loadingOverlay.remove();
    }

    // --- Función para cargar datos desde la API ---
    async function loadGameDataFromAPI() {
        const response = await fetch(API_CONFIG.BASE_URL);
        const apiData = await response.json();
        const gameTopics = {};
        apiData.data.forEach(item => {
            Object.keys(item.gamedata).forEach(subject => gameTopics[subject] = item.gamedata[subject]);
        });
        return gameTopics;
    }

    // --- Función principal para cargar datos del juego ---
    async function loadGameData() {
        showLoadingMessage('Cargando datos desde API...');
        const gameData = await loadGameDataFromAPI();
        hideLoadingMessage();
        return gameData;
    }

    // --- Carga de Preguntas (función principal) ---
    async function loadQuestions() {
        allQuestionsData = await loadGameData();
        showScreen('instructions-screen');
    }

    // --- Funciones del Temporizador ---
    function startTimer() {
        timeLeft = 45;
        timerText.textContent = timeLeft;
        playSound(audioTemporizador); // MUTE: Usa la nueva función
        timer = setInterval(() => {
            timeLeft--;
            timerText.textContent = timeLeft;
            if (timeLeft <= 0) {
                clearInterval(timer);
                checkAnswer(null, null, true);
            }
        }, 1000);
    }
    function stopTimer() {
        audioTemporizador.pause();
        audioTemporizador.currentTime = 0;
        clearInterval(timer);
    }

    // --- Funciones de Utilidad ---
    function showScreen(screenId) {
        allScreens.forEach(screen => screen.style.display = 'none');
        document.getElementById(screenId).style.display = 'flex';
    }

    function shuffleArray(array) {
        for (let i = array.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [array[i], array[j]] = [array[j], array[i]];
        }
        return array;
    }
    
    function formatTime(totalSeconds) {
        const minutes = Math.floor(totalSeconds / 60);
        const seconds = totalSeconds % 60;
        return `${minutes}:${seconds.toString().padStart(2, '0')}`;
    }

    // --- Lógica del Juego ---
    function initTopicSelectionScreen() {
        showScreen('topic-selection-screen');
        topicButtonsContainer.innerHTML = '';
        Object.keys(allQuestionsData).forEach(topic => {
            const button = document.createElement('button');
            button.textContent = topic;
            button.classList.add('topic-button');
            button.onclick = () => startGame(topic);
            topicButtonsContainer.appendChild(button);
        });
    }

    function startGame(topic) {
        playSound(audioInicio); // MUTE: Usa la nueva función

        lastPlayedTopic = topic;
        gameStartTime = Date.now();
        currentQuestions = shuffleArray([...allQuestionsData[topic]]).slice(0, TOTAL_QUESTIONS_PER_GAME);
        
        currentQuestionIndex = 0; score = 0; correctAnswersCount = 0; streakCounter = 0;
        lifelines = { pista: true, fiftyFifty: true };
        gameActive = true;
        
        updateLifelineButtons();
        updatePointsDisplay();
        showScreen('game-screen');
        loadQuestion();
    }

    function loadQuestion() {
        if (currentQuestionIndex >= currentQuestions.length) {
            endGame(); return;
        }
        resetOptions();
        stopTimer();
        startTimer();
        hintBubble.classList.remove('visible');

        const question = currentQuestions[currentQuestionIndex];
        questionText.textContent = question.enunciado;
        const shuffledOptions = shuffleArray([...question.opciones]);

        optionBoxes.forEach((box) => {
            const optionText = shuffledOptions.pop();
            box.dataset.originalOption = optionText;
            box.querySelector('.option-text').textContent = optionText;
            box.onclick = () => checkAnswer(box, optionText);
        });
    }

    function resetOptions() {
        optionBoxes.forEach(box => {
            box.classList.remove('correct', 'incorrect', 'selected', 'hidden');
            box.disabled = false;
        });
    }

    function checkAnswer(selectedBox, selectedText, timeUp = false) {
        if (!gameActive) return;
        gameActive = false;
        stopTimer();
        hintBubble.classList.remove('visible');

        const currentQ = currentQuestions[currentQuestionIndex];
        const correctText = currentQ.respuestaCorrecta;
        if (selectedBox) selectedBox.classList.add('selected');
        optionBoxes.forEach(box => box.disabled = true);

        setTimeout(() => {
            const correctBox = Array.from(optionBoxes).find(box => box.dataset.originalOption === correctText);
            if(correctBox) correctBox.classList.add('correct');

            if (timeUp) {
                playSound(audioIncorrecto); // MUTE: Usa la nueva función
                endGame();
            } else if (selectedText === correctText) {
                playSound(audioCorrecto); // MUTE: Usa la nueva función
                score += 10; correctAnswersCount++; streakCounter++;
                if ((45 - timeLeft) < QUICK_ANSWER_THRESHOLD) score += 2;
                if (streakCounter > 0 && streakCounter % 3 === 0) score += 5;
                updatePointsDisplay();
                setTimeout(() => {
                    currentQuestionIndex++; gameActive = true; loadQuestion();
                }, 1500);
            } else {
                playSound(audioIncorrecto); // MUTE: Usa la nueva función
                if(selectedBox) selectedBox.classList.add('incorrect');
                endGame();
            }
        }, 1000);
    }

    function updatePointsDisplay() {
        pointsDisplay.innerHTML = '';
        for (let i = 0; i < TOTAL_QUESTIONS_PER_GAME; i++) {
            const circle = document.createElement('div');
            circle.classList.add('point-circle');
            if (i < correctAnswersCount) circle.classList.add('earned');
            pointsDisplay.appendChild(circle);
        }
    }
    
    function updateLifelineButtons() {
        comodinPistaBtn.disabled = !lifelines.pista;
        comodin5050Btn.disabled = !lifelines.fiftyFifty;
    }

    function usePista() {
        if (!lifelines.pista || !gameActive) return;
        lifelines.pista = false;
        updateLifelineButtons();
        hintBubble.textContent = currentQuestions[currentQuestionIndex].pista;
        hintBubble.classList.add('visible');
    }

    function use5050() {
        if (!lifelines.fiftyFifty || !gameActive) return;
        lifelines.fiftyFifty = false;
        updateLifelineButtons();
        const correctText = currentQuestions[currentQuestionIndex].respuestaCorrecta;
        const wrongOptions = Array.from(optionBoxes).filter(box => box.dataset.originalOption !== correctText);
        shuffleArray(wrongOptions).slice(0, 2).forEach(box => box.classList.add('hidden'));
    }

    function endGame() {
        const totalTime = Math.round((Date.now() - gameStartTime) / 1000);
        if (correctAnswersCount === TOTAL_QUESTIONS_PER_GAME) score += COMPLETION_BONUS;
        
        showScreen('game-over-screen');
        gameOverTitle.textContent = (correctAnswersCount === TOTAL_QUESTIONS_PER_GAME) ? "¡Juego completado!" : "¡Juego Terminado!";
        finalScoreEl.textContent = `${score} / ${MAX_POSSIBLE_SCORE}`;
        finalTimeEl.textContent = formatTime(totalTime);

        const userId = getUserIdFromURL();
        if (userId) {
            const gameData = {
                user_id: userId, game_id: 3, correct_challenges: correctAnswersCount,
                total_challenges: TOTAL_QUESTIONS_PER_GAME, time_spent: totalTime
            };
            saveGameData(gameData);
        }
    }

    function saveGameData(data) { /* ... esta función no cambia ... */ }
    function showDataSendingIndicator() { /* ... esta función no cambia ... */ }
    function updateLoadingText(text) { /* ... esta función no cambia ... */ }
    function hideDataSendingIndicator() { /* ... esta función no cambia ... */ }

    // --- Asignación de Eventos ---
    startGameBtn.addEventListener('click', initTopicSelectionScreen);
    restartBtn.addEventListener('click', () => startGame(lastPlayedTopic));
    lobbyBtn.addEventListener('click', initTopicSelectionScreen);
    comodinPistaBtn.addEventListener('click', usePista);
    comodin5050Btn.addEventListener('click', use5050);

    // MUTE: Evento para el botón de silencio
    // MUTE: Evento para el botón de silencio (CORREGIDO)
muteBtn.addEventListener('click', () => {
    isMuted = !isMuted;
    muteBtn.classList.toggle('muted', isMuted);

    if (isMuted) {
        // Si muteamos, detenemos el sonido del temporizador
        audioTemporizador.pause();
    } else {
        // Si quitamos el mute, verificamos si el timer está activo para reanudar el sonido
        const gameScreenIsVisible = document.getElementById('game-screen').style.display === 'flex';
        if (gameScreenIsVisible && timeLeft > 0 && timeLeft < 45) {
            playSound(audioTemporizador);
        }
    }
});

    // --- Iniciar el juego ---
    loadQuestions();
});
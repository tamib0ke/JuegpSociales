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

    // --- Variables y Constantes del Juego ---
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

    // --- Función para extraer user_id de la URL ---
    function getUserIdFromURL() {
        const urlParams = new URLSearchParams(window.location.search);
        const userId = urlParams.get('user_id');
        return userId ? parseInt(userId) : null;
    }

    // --- Funciones de carga de mensajes ---
    function showLoadingMessage(message) {
        // Crear overlay de carga sin reemplazar el contenido del body
        const loadingOverlay = document.createElement('div');
        loadingOverlay.id = 'loading-overlay';
        loadingOverlay.style.cssText = `
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background: rgba(0, 0, 0, 0.9);
            display: flex;
            justify-content: center;
            align-items: center;
            flex-direction: column;
            font-family: 'Quicksand', sans-serif;
            z-index: 9999;
            color: white;
        `;
        
        loadingOverlay.innerHTML = `
            <div style="font-size: 24px; margin-bottom: 20px;">${message}</div>
            <div style="width: 50px; height: 50px; border: 5px solid #f3f3f3; border-top: 5px solid #3498db; border-radius: 50%; animation: spin 1s linear infinite;"></div>
            <style>
                @keyframes spin {
                    0% { transform: rotate(0deg); }
                    100% { transform: rotate(360deg); }
                }
            </style>
        `;
        
        document.body.appendChild(loadingOverlay);
    }

    function hideLoadingMessage() {
        const loadingOverlay = document.getElementById('loading-overlay');
        if (loadingOverlay) {
            loadingOverlay.remove();
        }
    }

    // --- Función para cargar datos desde la API ---
    async function loadGameDataFromAPI() {
        const response = await fetch(API_CONFIG.BASE_URL);
        const apiData = await response.json();
        
        // Transformar la estructura de la API al formato que usa el juego
        const gameTopics = {};
        
        apiData.data.forEach(item => {
            // Extraer los datos de cada subcategoría
            Object.keys(item.gamedata).forEach(subject => {
                gameTopics[subject] = item.gamedata[subject];
            });
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
        const apiData = await loadGameData();
        allQuestionsData = apiData;
        showScreen('instructions-screen');
    }

    // --- Funciones del Temporizador ---
    function startTimer() {
        timeLeft = 45;
        timerText.textContent = timeLeft;
        timer = setInterval(() => {
            timeLeft--;
            timerText.textContent = timeLeft;
            if (timeLeft <= 0) {
                clearInterval(timer);
                checkAnswer(null, null, true);
            }
        }, 1000);
    }
    function stopTimer() { clearInterval(timer); }

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
        const topics = Object.keys(allQuestionsData);
        topics.forEach(topic => {
            const button = document.createElement('button');
            button.textContent = topic;
            button.classList.add('topic-button');
            button.onclick = () => startGame(topic);
            topicButtonsContainer.appendChild(button);
        });
    }

    function startGame(topic) {
        lastPlayedTopic = topic;
        gameStartTime = Date.now();
        const questionsForTopic = allQuestionsData[topic];
        currentQuestions = shuffleArray([...questionsForTopic]).slice(0, TOTAL_QUESTIONS_PER_GAME);
        
        currentQuestionIndex = 0;
        score = 0;
        correctAnswersCount = 0;
        streakCounter = 0;
        lifelines = { pista: true, fiftyFifty: true };
        gameActive = true;
        
        updateLifelineButtons();
        updatePointsDisplay();
        showScreen('game-screen');
        loadQuestion();
    }

    function loadQuestion() {
        if (currentQuestionIndex >= currentQuestions.length) {
            endGame();
            return;
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
        const timeSpentOnQuestion = 45 - timeLeft;
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
                streakCounter = 0;
                endGame();
            } else if (selectedText === correctText) {
                score += 10;
                correctAnswersCount++;
                streakCounter++;
                if (timeSpentOnQuestion < QUICK_ANSWER_THRESHOLD) score += 2;
                if (streakCounter > 0 && streakCounter % 3 === 0) score += 5;
                updatePointsDisplay();
                setTimeout(() => {
                    currentQuestionIndex++;
                    gameActive = true;
                    loadQuestion();
                }, 1500);
            } else {
                streakCounter = 0;
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
            if (i < correctAnswersCount) {
                circle.classList.add('earned');
            }
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
        
        const hint = currentQuestions[currentQuestionIndex].pista;
        hintBubble.textContent = hint;
        hintBubble.classList.add('visible');
    }

    function use5050() {
        if (!lifelines.fiftyFifty || !gameActive) return;
        lifelines.fiftyFifty = false;
        updateLifelineButtons();
        
        const currentQ = currentQuestions[currentQuestionIndex];
        const correctText = currentQ.respuestaCorrecta;
        
        const wrongOptions = Array.from(optionBoxes).filter(box => box.dataset.originalOption !== correctText);
        shuffleArray(wrongOptions).slice(0, 2).forEach(box => {
            box.classList.add('hidden');
        });
    }
function endGame() {
        const totalTime = Math.round((Date.now() - gameStartTime) / 1000);
        
        if (correctAnswersCount === TOTAL_QUESTIONS_PER_GAME) {
            score += COMPLETION_BONUS;
        }

        const normalizedScore = Math.round((score / MAX_POSSIBLE_SCORE) * 100);

        showScreen('game-over-screen');
        
        // --- AÑADE ESTA LÍNEA AQUÍ ---
        console.log("Juego terminado. Mostrando pantalla de finalización.");

        gameOverTitle.textContent = (correctAnswersCount === TOTAL_QUESTIONS_PER_GAME) ? "¡Juego completado!" : "¡Juego Terminado!";
        finalScoreEl.textContent = `${score} / ${MAX_POSSIBLE_SCORE}`;
        finalTimeEl.textContent = formatTime(totalTime);

        // Extraer user_id de la URL
        const userId = getUserIdFromURL();
        
        if (userId) {
            const gameData = {
                user_id: userId,
                game_id: 3,
                correct_challenges: correctAnswersCount,
                total_challenges: TOTAL_QUESTIONS_PER_GAME,
                time_spent: totalTime
            };

            saveGameData(gameData);
        } else {
            console.log('No se encontró user_id en la URL. No se enviarán datos al servidor.');
        }
    }

    // --- Función para guardar datos del juego ---
    function saveGameData(data) {
        // Verificar que exista user_id antes de proceder
        if (!data.user_id) {
            console.log('No hay user_id disponible. No se enviarán datos al servidor.');
            return;
        }
        
        console.log("Datos del juego guardados:", JSON.stringify(data, null, 2));
        
        // Guardar en localStorage como respaldo
        localStorage.setItem('lastGameData', JSON.stringify(data));
        
        showDataSendingIndicator();
        
        // Enviar datos a la API
        fetch('https://puramentebackend.onrender.com/api/game-attempts/from-game', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(data)
        })
        .then(response => response.json())
        .then(data => {
            console.log('Datos enviados exitosamente:', data);
            // Mostrar mensaje de éxito temporalmente
            updateLoadingText('¡Datos enviados correctamente!');
            setTimeout(() => {
                hideDataSendingIndicator();
            }, 2000); // Ocultar después de 2 segundos
        })
        .catch(error => {
            console.error('Error enviando datos:', error);
            // Mostrar mensaje de error temporalmente
            updateLoadingText('Error al enviar datos');
            setTimeout(() => {
                hideDataSendingIndicator();
            }, 3000); // Ocultar después de 3 segundos
        });
        
        return data; // Retorna los datos para que puedas usarlos si necesitas
    }

    // --- Funciones auxiliares para mostrar el estado del envío ---
    function showDataSendingIndicator() {
        // Crear o mostrar un indicador de carga
        let indicator = document.getElementById('data-sending-indicator');
        if (!indicator) {
            indicator = document.createElement('div');
            indicator.id = 'data-sending-indicator';
            indicator.style.cssText = `
                position: fixed;
                top: 20px;
                right: 20px;
                background: rgba(0, 0, 0, 0.8);
                color: white;
                padding: 10px 20px;
                border-radius: 5px;
                z-index: 1000;
                font-family: 'Quicksand', sans-serif;
            `;
            document.body.appendChild(indicator);
        }
        indicator.textContent = 'Enviando datos...';
        indicator.style.display = 'block';
    }

    function updateLoadingText(text) {
        const indicator = document.getElementById('data-sending-indicator');
        if (indicator) {
            indicator.textContent = text;
        }
    }

    function hideDataSendingIndicator() {
        const indicator = document.getElementById('data-sending-indicator');
        if (indicator) {
            indicator.style.display = 'none';
        }
    }


    // --- Asignación de Eventos ---
    startGameBtn.addEventListener('click', initTopicSelectionScreen);
    restartBtn.addEventListener('click', () => startGame(lastPlayedTopic));
    lobbyBtn.addEventListener('click', initTopicSelectionScreen);
    comodinPistaBtn.addEventListener('click', usePista);
    comodin5050Btn.addEventListener('click', use5050);

    // --- Iniciar el juego ---
    loadQuestions();
});
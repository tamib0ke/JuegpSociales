document.addEventListener('DOMContentLoaded', () => {
    const questionsData = [
        // Tema: Guerra Civil (10 preguntas)
        { topic: "Guerra Civil", question: "¿Cuál fue el conflicto armado en Costa Rica en 1948?", options: ["Guerra del 48", "Revolución de Octubre", "Guerra de Limón", "Conflicto de Guanacaste"], correctAnswer: "Guerra del 48", hint: "También se le conoce como la Guerra Civil de 1948." },
        { topic: "Guerra Civil", question: "¿Quién lideró las fuerzas del Ejército de Liberación Nacional?", options: ["Rafael Ángel Calderón Guardia", "José Figueres Ferrer", "Teodoro Picado Michalski", "Jorge Volio Jiménez"], correctAnswer: "José Figueres Ferrer", hint: "Fue conocido como 'Don Pepe'." },
        { topic: "Guerra Civil", question: "¿Qué garantías sociales fueron defendidas en 1948?", options: ["Reforma Agraria", "Código de Trabajo y Seguro Social", "Derecho al voto femenino", "Libertad de prensa"], correctAnswer: "Código de Trabajo y Seguro Social", hint: "Beneficios para los trabajadores y acceso a servicios médicos." },
        { topic: "Guerra Civil", question: "¿Qué importante decisión sobre las fuerzas armadas se tomó tras la guerra?", options: ["Aumentar el ejército", "Modernizar su armamento", "Abolir el ejército", "Crear una fuerza aérea"], correctAnswer: "Abolir el ejército", hint: "Es uno de los hechos más distintivos de Costa Rica." },
        { topic: "Guerra Civil", question: "La Junta Fundadora de la Segunda República fue presidida por:", options: ["Otilio Ulate", "José Figueres Ferrer", "León Cortés Castro", "Santos León Herrera"], correctAnswer: "José Figueres Ferrer", hint: "El mismo líder del bando ganador." },
        { topic: "Guerra Civil", question: "¿En qué año se redactó la Constitución que rige actualmente, como consecuencia de la guerra?", options: ["1948", "1949", "1950", "1953"], correctAnswer: "1949", hint: "Un año después del conflicto armado." },
        { topic: "Guerra Civil", question: "¿Qué derecho fundamental se otorgó a las mujeres como resultado de la nueva constitución?", options: ["Derecho a la educación", "Derecho al trabajo", "Derecho al voto", "Derecho a la propiedad"], correctAnswer: "Derecho al voto", hint: "Un gran avance para la igualdad de género." },
        { topic: "Guerra Civil", question: "El bando perdedor estaba asociado a la figura de:", options: ["José Figueres Ferrer", "Rafael Ángel Calderón Guardia", "Otilio Ulate Blanco", "Alberto Martén"], correctAnswer: "Rafael Ángel Calderón Guardia", hint: "Fue presidente antes de Teodoro Picado." },
        { topic: "Guerra Civil", question: "¿Cuál fue el principal detonante de la Guerra Civil?", options: ["Una crisis económica", "La anulación de las elecciones", "La firma de un tratado", "Una invasión extranjera"], correctAnswer: "La anulación de las elecciones", hint: "Relacionado con las elecciones presidenciales de ese año." },
        { topic: "Guerra Civil", question: "¿Cuánto duró aproximadamente el conflicto armado?", options: ["Una semana", "44 días", "Seis meses", "Un año"], correctAnswer: "44 días", hint: "Fue un conflicto relativamente corto pero intenso." },
        
        // Tema: Garantías Sociales (10 preguntas)
        { topic: "Garantías Sociales", question: "¿En qué año se promulgaron las Garantías Sociales?", options: ["1920", "1943", "1948", "1953"], correctAnswer: "1943", hint: "Fue durante el gobierno de Rafael Ángel Calderón Guardia." },
        { topic: "Garantías Sociales", question: "¿Cuál institución administra el Seguro Social?", options: ["Ministerio de Salud", "INS", "CCSS", "PANI"], correctAnswer: "CCSS", hint: "Es conocida popularmente como 'La Caja'." },
        { topic: "Garantías Sociales", question: "¿Qué documento legal estableció las Garantías Sociales?", options: ["Constitución de 1871", "El Código de Trabajo", "Constitución de 1949", "Tratado de Límites"], correctAnswer: "El Código de Trabajo", hint: "Es el conjunto de leyes que regulan las relaciones laborales." },
        { topic: "Garantías Sociales", question: "¿Qué presidente impulsó la creación de las Garantías Sociales?", options: ["León Cortés Castro", "José Figueres Ferrer", "Rafael Ángel Calderón Guardia", "Teodoro Picado"], correctAnswer: "Rafael Ángel Calderón Guardia", hint: "Su gobierno es recordado por esta reforma." },
        { topic: "Garantías Sociales", question: "¿Qué líder político apoyó a Calderón Guardia para aprobar las reformas?", options: ["José Figueres Ferrer", "Manuel Mora Valverde", "Otilio Ulate", "Jorge Volio"], correctAnswer: "Manuel Mora Valverde", hint: "Era el líder del Partido Comunista." },
        { topic: "Garantías Sociales", question: "Las Garantías Sociales se incorporaron a la:", options: ["Declaración de Independencia", "Ley de Educación", "Constitución Política", "Reforma Agraria"], correctAnswer: "Constitución Política", hint: "Para darles el máximo rango legal." },
        { topic: "Garantías Sociales", question: "¿Qué derecho NO forma parte directa de las Garantías Sociales?", options: ["Seguro de enfermedad", "Jornada laboral de 8 horas", "Libertad de expresión", "Salario mínimo"], correctAnswer: "Libertad de expresión", hint: "Este es un derecho civil, no social." },
        { topic: "Garantías Sociales", question: "¿Qué sector de la sociedad se opuso inicialmente a estas reformas?", options: ["Los trabajadores", "La Iglesia Católica", "Los grandes cafetaleros", "Los pequeños agricultores"], correctAnswer: "Los grandes cafetaleros", hint: "Temían que las reformas afectaran sus ganancias." },
        { topic: "Garantías Sociales", question: "¿Qué universidad fue fundada durante el mismo gobierno reformista?", options: ["TEC", "UNA", "UCR", "UNED"], correctAnswer: "UCR", hint: "La Universidad de Costa Rica." },
        { topic: "Garantías Sociales", question: "El objetivo principal de las Garantías era buscar una mayor:", options: ["Riqueza nacional", "Justicia social", "Expansión territorial", "Influencia militar"], correctAnswer: "Justicia social", hint: "Reducir la desigualdad entre ricos y pobres." },

        // Tema: Estado Liberal (10 preguntas)
        { topic: "Estado Liberal", question: "¿Cuál fue una característica principal del Estado Liberal?", options: ["Intervención estatal en economía", "Desarrollo de la educación pública", "Creación del Seguro Social", "Protección laboral"], correctAnswer: "Desarrollo de la educación pública", hint: "Se buscaba formar ciudadanos para la república." },
        { topic: "Estado Liberal", question: "¿Presidente importante del Estado Liberal que impulsó la educación?", options: ["Juan Rafael Mora Porras", "Tomás Guardia Gutiérrez", "Ricardo Jiménez Oreamuno", "Mauro Fernández Acuña"], correctAnswer: "Mauro Fernández Acuña", hint: "Su reforma educativa marcó un hito." },
        { topic: "Estado Liberal", question: "¿Producto agrícola base de la economía durante el Estado Liberal?", options: ["Caña de azúcar", "Banano", "Café", "Piña"], correctAnswer: "Café", hint: "Nuestro 'grano de oro'." },
        { topic: "Estado Liberal", question: "La construcción del Ferrocarril al Atlántico fue impulsada por el presidente:", options: ["Tomás Guardia", "Juan Rafael Mora", "Próspero Fernández", "Bernardo Soto"], correctAnswer: "Tomás Guardia", hint: "Su dictadura modernizó el país." },
        { topic: "Estado Liberal", question: "El lema del Estado Liberal era:", options: ["'Paz, Justicia y Libertad'", "'Orden y Progreso'", "'Vivan siempre el trabajo y la paz'", "'Dios, Patria y Libertad'"], correctAnswer: "'Orden y Progreso'", hint: "Buscaban modernizar el país bajo un control estricto." },
        { topic: "Estado Liberal", question: "¿Qué sector fue el más beneficiado con las políticas liberales?", options: ["Campesinos", "Oligarquía cafetalera", "Artesanos", "Indígenas"], correctAnswer: "Oligarquía cafetalera", hint: "Un pequeño grupo de familias con mucho poder." },
        { topic: "Estado Liberal", question: "El Estado Liberal se caracterizó por la separación entre:", options: ["El Estado y la economía", "La Iglesia y el Estado", "El Presidente y los ministros", "El campo y la ciudad"], correctAnswer: "La Iglesia y el Estado", hint: "Se crearon el Registro Civil y los cementerios laicos." },
        { topic: "Estado Liberal", question: "¿Qué edificio icónico de San José se construyó como símbolo del progreso liberal?", options: ["El Museo Nacional", "El Teatro Nacional", "El Estadio Nacional", "La Catedral Metropolitana"], correctAnswer: "El Teatro Nacional", hint: "Financiado con un impuesto al café." },
        { topic: "Estado Liberal", question: "El fin del Estado Liberal da paso al surgimiento del Estado:", options: ["Benefactor", "Socialista", "Feudal", "Colonial"], correctAnswer: "Benefactor", hint: "Marcado por las Garantías Sociales de los años 40." },
        { topic: "Estado Liberal", question: "¿Qué contrato permitió la llegada de la United Fruit Company?", options: ["Contrato Soto-Keith", "Tratado Cañas-Jerez", "Contrato Chamorro-Bryan", "Pacto de la Embajada"], correctAnswer: "Contrato Soto-Keith", hint: "Relacionado con deudas del ferrocarril." },

        // Tema: Cultura General (10 preguntas)
        { topic: "Cultura General", question: "¿Cuál es el ave nacional de Costa Rica?", options: ["El colibrí", "El quetzal", "El yigüirro", "El tucán"], correctAnswer: "El yigüirro", hint: "Es conocido por su canto antes de las lluvias." },
        { topic: "Cultura General", question: "¿En qué provincia se encuentra el Volcán Arenal?", options: ["San José", "Guanacaste", "Alajuela", "Limón"], correctAnswer: "Alajuela", hint: "Es una provincia con muchos volcanes activos." },
        { topic: "Cultura General", question: "¿Qué océano baña la costa este de Costa Rica?", options: ["Océano Pacífico", "Océano Atlántico", "Mar Caribe", "Golfo de México"], correctAnswer: "Mar Caribe", hint: "Es la costa donde se ubica la provincia de Limón." },
        { topic: "Cultura General", question: "¿Cuál es el significado de la frase 'Pura Vida'?", options: ["Una vida de lujos", "Un saludo y un estado de ánimo positivo", "Solo se vive una vez", "Buena suerte"], correctAnswer: "Un saludo y un estado de ánimo positivo", hint: "Es la frase más representativa del país." },
        { topic: "Cultura General", question: "El platillo tradicional conocido como 'Gallo Pinto' combina principalmente:", options: ["Maíz y pollo", "Arroz y frijoles", "Papas y carne", "Yuca y pescado"], correctAnswer: "Arroz y frijoles", hint: "Es el desayuno típico por excelencia." },
        { topic: "Cultura General", question: "¿Cuál es la flor nacional de Costa Rica?", options: ["La orquídea", "La rosa", "La guaria morada", "El girasol"], correctAnswer: "La guaria morada", hint: "Es una especie de orquídea." },
        { topic: "Cultura General", question: "¿Qué presidente aparece en el billete de 10,000 colones?", options: ["José Figueres Ferrer", "Juan Rafael Mora", "Rafael Ángel Calderón Guardia", "Cleto González Víquez"], correctAnswer: "José Figueres Ferrer", hint: "El líder de la Guerra Civil del 48." },
        { topic: "Cultura General", question: "¿En qué fecha se celebra la Anexión del Partido de Nicoya a Costa Rica?", options: ["15 de setiembre", "12 de octubre", "25 de julio", "1 de mayo"], correctAnswer: "25 de julio", hint: "'De la patria por nuestra voluntad'." },
        { topic: "Cultura General", question: "El punto más alto de Costa Rica es el:", options: ["Volcán Irazú", "Cerro de la Muerte", "Cerro Chirripó", "Volcán Turrialba"], correctAnswer: "Cerro Chirripó", hint: "Se encuentra en la Cordillera de Talamanca." },
        { topic: "Cultura General", question: "¿Cuál es el Símbolo Nacional del Trabajo en Costa Rica?", options: ["El machete", "El trapiche", "La carreta típica", "El yugo"], correctAnswer: "La carreta típica", hint: "Famosa por sus decoraciones coloridas." }
    ];

    // --- Elementos del DOM ---
    const startScreen = document.getElementById('start-screen');
    const gameScreen = document.getElementById('game-screen');
    const gameOverScreen = document.getElementById('game-over-screen');
    const topicButtonsContainer = document.getElementById('topic-buttons');
    const questionText = document.getElementById('question-text');
    const optionBoxes = document.querySelectorAll('.option-box');
    const pointsCircles = document.querySelectorAll('.point-circle');
    const comodinPistaBtn = document.getElementById('comodin-pista');
    const comodin5050Btn = document.getElementById('comodin-50-50');
    const comodinCambioBtn = document.getElementById('comodin-cambio');
    const hintBubblePath = document.getElementById('hint-bubble-path');
    const hintTextContent = document.getElementById('hint-text-content');
    const gameOverTitle = document.getElementById('game-over-title');
    const gameOverMessage = document.getElementById('game-over-message');
    const playAgainBtn = document.getElementById('play-again-btn');
    const timerText = document.getElementById('timer-text');
    // Actualizado: Referencia al texto de "Puntos"
    const pointsTextDisplay = document.getElementById('points-text'); 

    // --- Variables del Juego ---
    let currentQuestions = [];
    let currentQuestionIndex = 0;
    let score = 0;
    let lifelines;
    let gameActive = false;
    let timer;
    let timeLeft = 45;
    const TOTAL_QUESTIONS_PER_GAME = 10;

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

    function stopTimer() {
        clearInterval(timer);
    }

    // --- Funciones de Utilidad ---
    function showScreen(screenId) {
        startScreen.style.display = 'none';
        gameScreen.style.display = 'none';
        gameOverScreen.style.display = 'none';
        document.getElementById(screenId).style.display = 'flex';
    }

    function shuffleArray(array) {
        for (let i = array.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [array[i], array[j]] = [array[j], array[i]];
        }
        return array;
    }

    function hideHintBubble() {
        hintBubblePath.style.display = 'none';
        hintTextContent.style.display = 'none';
    }

    // --- Lógica del Juego ---
    function initStartScreen() {
        showScreen('start-screen');
        topicButtonsContainer.innerHTML = '';
        const topics = [...new Set(questionsData.map(q => q.topic))];
        topics.forEach(topic => {
            const button = document.createElement('button');
            button.textContent = topic;
            button.classList.add('topic-button');
            button.onclick = () => startGame(topic);
            topicButtonsContainer.appendChild(button);
        });
    }

    function startGame(topic) {
        const filteredQuestions = questionsData.filter(q => q.topic === topic);
        currentQuestions = shuffleArray(filteredQuestions).slice(0, TOTAL_QUESTIONS_PER_GAME);
        currentQuestionIndex = 0;
        score = 0;
        lifelines = { pista: true, fiftyFifty: true, changeQuestion: true };
        gameActive = true;
        updateLifelineButtons();
        updatePointsDisplay();
        // Actualizado: Mostrar "Tiempo" en lugar de "Puntos"
        pointsTextDisplay.textContent = "Tiempo"; 
        showScreen('game-screen');
        loadQuestion();
    }

    function loadQuestion() {
        if (currentQuestionIndex >= TOTAL_QUESTIONS_PER_GAME) {
            endGame(true);
            return;
        }
        hideHintBubble();
        resetOptions();
        stopTimer();
        startTimer();

        const question = currentQuestions[currentQuestionIndex];
        questionText.textContent = question.question;
        const shuffledOptions = shuffleArray([...question.options]);

        optionBoxes.forEach((box, index) => {
            const optionChar = String.fromCharCode(65 + index);
            const optionTextElement = document.getElementById(`option-${optionChar}-text`);
            const originalOption = shuffledOptions[index];
            box.dataset.originalOption = originalOption;
            optionTextElement.textContent = `${optionChar}. ${originalOption}`;
            box.onclick = () => checkAnswer(box, originalOption);
        });
    }

    function resetOptions() {
        optionBoxes.forEach(box => {
            box.classList.remove('correct', 'incorrect', 'selected', 'hidden');
            box.style.pointerEvents = 'auto';
        });
    }

    async function checkAnswer(selectedBox, selectedText, timeUp = false) {
        if (!gameActive) return;

        gameActive = false; // Bloquear más clics
        stopTimer();
        const currentQ = currentQuestions[currentQuestionIndex];
        const correctText = currentQ.correctAnswer;
        
        if (selectedBox) selectedBox.classList.add('selected');

        // Retraso para crear suspenso
        setTimeout(() => {
            const correctBox = Array.from(optionBoxes).find(box => box.dataset.originalOption === correctText);
            correctBox.classList.add('correct');

            if (timeUp) {
                endGame(false, "¡Se acabó el tiempo!");
            } else if (selectedText === correctText) {
                score++;
                updatePointsDisplay();
                setTimeout(() => {
                    currentQuestionIndex++;
                    gameActive = true;
                    loadQuestion();
                }, 2000);
            } else {
                selectedBox.classList.add('incorrect');
                endGame(false, `La respuesta correcta era: ${correctText}`);
            }
        }, 1500);
    }

    function updatePointsDisplay() {
        pointsCircles.forEach((circle, index) => {
            circle.classList.toggle('earned', index < score);
        });
    }
    
    function updateLifelineButtons() {
        comodinPistaBtn.disabled = !lifelines.pista;
        comodin5050Btn.disabled = !lifelines.fiftyFifty;
        comodinCambioBtn.disabled = !lifelines.changeQuestion;
    }

    function usePista() {
        if (!lifelines.pista || !gameActive) return;
        lifelines.pista = false;
        updateLifelineButtons();
        
        const hint = currentQuestions[currentQuestionIndex].hint;
        hintTextContent.textContent = hint;
        hintBubblePath.style.display = 'block';
        hintTextContent.style.display = 'block';
    }

    function use5050() {
        if (!lifelines.fiftyFifty || !gameActive) return;
        lifelines.fiftyFifty = false;
        updateLifelineButtons();
        
        const currentQ = currentQuestions[currentQuestionIndex];
        const correctOptionText = currentQ.correctAnswer;
        
        const wrongOptions = Array.from(optionBoxes).filter(box => box.dataset.originalOption !== correctOptionText);
        shuffleArray(wrongOptions).slice(0, 2).forEach(box => {
            box.classList.add('hidden');
        });
    }

    function useChangeQuestion() {
        if (!lifelines.changeQuestion || !gameActive) return;
        lifelines.changeQuestion = false;
        updateLifelineButtons();
        
        currentQuestionIndex++;
        loadQuestion();
    }

    function endGame(isWinner, message = "") {
        stopTimer();
        gameActive = false;
        showScreen('game-over-screen');

        if (isWinner) {
            gameOverTitle.textContent = "¡Felicidades, Millonario!";
            gameOverMessage.textContent = `¡Respondiste correctamente las ${TOTAL_QUESTIONS_PER_GAME} preguntas!`;
        } else {
            gameOverTitle.textContent = "¡Juego Terminado!";
            gameOverMessage.textContent = `Lograste ${score} aciertos. ${message}`;
        }
    }

    // --- Asignación de Eventos ---
    comodinPistaBtn.addEventListener('click', usePista);
    comodin5050Btn.addEventListener('click', use5050);
    comodinCambioBtn.addEventListener('click', useChangeQuestion);
    playAgainBtn.addEventListener('click', initStartScreen);

    // --- Iniciar el juego ---
    initStartScreen();
});
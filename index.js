import { Team } from "./Team.js";
import { questions } from "./familiada-pytania.js";

// it is number of images in assets/img/
const IMAGES_NUMBERS = 8;

const teamRed = new Team("Czerwoni");
const teamBlue = new Team("Niebiescy");
const teams = [teamRed, teamBlue];
const pointsEl = document.querySelector("#points");
const mistakesEl = document.querySelector("#mistakes");
const team1El = document.querySelector("#team1");
const team2El = document.querySelector("#team2");
const team1mistakesEl = document.querySelector("#team1-mistakes");
const team2mistakesEl = document.querySelector("#team2-mistakes");
const headingEl = document.querySelector("#heading");
const allAnswersEl = document.querySelector("#answers");
const usersAnswersEl = document.querySelector("#users-answers");
const formEl = document.querySelector("#answer-form");
const submitButtonEl = document.querySelector("#submit-button");
const popupEl = document.querySelector("#popup");
const popupTitleEl = document.querySelector("#popup-title");
const popupImgEl = document.querySelector("#popup-img");

let _roundNumber = 1;
let points = 0;
let mistakes = 0;
let currentTeam = null;
let firstTeam = null;
let secondTeam = null;
let playersQuestionAnswers = [];
let playersLeftQuestionAnswers = [];

const startingTeamNumber = Math.floor(Math.random() * teams.length);
let currentTeamNumber = startingTeamNumber;
const startingTeam = teams[startingTeamNumber];
const endingTeam = teams.find((team) => team.name !== startingTeam.name);

const jsConfetti = new JSConfetti();

const updatePoints = () => {
  team1El.innerHTML = `${teams[0].name} \n<span>${teams[0].points}</span>`;
  team2El.innerHTML = `${teams[1].name} \n<span>${teams[1].points}</span>`;
};

const updateSum = () => {
  pointsEl.innerHTML = `SUMA ${points}`;
};

const updatePopup = () => {
  popupTitleEl.innerHTML = `Koniec rundy ${roundNumber}. <br /> Wygrała drużyna \"${currentTeam.name}\". <br /> Zdobyli ${points} punktów.`;
  const randomImgNumber = Math.floor(Math.random() * (IMAGES_NUMBERS - 1)) + 1;
  popupImgEl.src = `assets/img/${randomImgNumber}.jpeg`;
  popupEl.classList.remove("popup-hide");
};

const finishRound = () => {
  submitButtonEl.disabled = true;
  updatePoints();
  updateSum();
  jsConfetti.addConfetti();
  updatePopup();

  formEl.removeEventListener("submit", handleAnswer);
  setTimeout(() => {
    roundNumber++;
    popupEl.classList.add("popup-hide");
  }, 6000);
};

const updateActiveTeam = () => {
  if (currentTeamNumber === 0) {
    team1El.classList.add("team-active");
    team2El.classList.remove("team-active");
  } else {
    team2El.classList.add("team-active");
    team1El.classList.remove("team-active");
  }
};

const initBoard = () => {
  headingEl.innerHTML = `Familiada - runda ${_roundNumber}`;
  team1mistakesEl.innerHTML = "";
  team2mistakesEl.innerHTML = "";
  points = 0;
  mistakes = 0;
  updateSum();
  allAnswersEl.replaceChildren([]);
  usersAnswersEl.replaceChildren([]);
  submitButtonEl.disabled = false;
  updateActiveTeam();
};

const handleAnswer = (e) => {
  e.preventDefault();
  const currentAnswerInput = document.querySelector("#answer-input");
  const currentAnswerText = currentAnswerInput.value;
  currentAnswerInput.value = "";

  const playerAnswer = playersLeftQuestionAnswers.find(
    (answer) => answer.ans.toLowerCase() === currentAnswerText.toLowerCase()
  );

  if (playerAnswer) {
    points += playerAnswer.points;
    updateSum();

    playersLeftQuestionAnswers = [
      ...playersLeftQuestionAnswers.filter(
        (answer) => answer.ans.toLowerCase() !== currentAnswerText.toLowerCase()
      ),
    ];
    playersQuestionAnswers.push(currentAnswerText);

    // update asked questions on board
    if (playerAnswer.ans) {
      const usersAnswersElements = document.querySelectorAll(
        "#users-answers > li"
      );

      usersAnswersElements[
        playerAnswer.lp - 1
      ].innerHTML = `${playerAnswer.lp}. ${playerAnswer.ans}`;
    }

    // all questions answered - current team win
    if (
      playersLeftQuestionAnswers.length === 0 ||
      mistakes === 3 ||
      mistakes === 4
    ) {
      currentTeam.points += points;
      finishRound();

      return;
    }
  } else {
    mistakes += 1;
    mistakesEl.innerHTML = `Błędy: ${mistakes}`;

    if (currentTeamNumber === 0) {
      team1mistakesEl.innerHTML += "x";
    } else {
      team2mistakesEl.innerHTML += "x";
    }

    // 3 mistakes - second team answer once
    if (mistakes === 3) {
      currentTeam = secondTeam;
      currentTeamNumber = currentTeamNumber === 0 ? 1 : 0;
      updateActiveTeam();
    }

    // 4 mistakes - first team win
    if (mistakes === 4) {
      currentTeam = firstTeam;
      currentTeamNumber = currentTeamNumber === 0 ? 1 : 0;
      updateActiveTeam();
      currentTeam.points += points;
      finishRound();
    }
  }
};

const playRound = (leftQuestions) => {
  // select teams answering order
  firstTeam = startingTeam;
  secondTeam = endingTeam;

  if (_roundNumber % 2 == 0) {
    firstTeam = endingTeam;
    secondTeam = startingTeam;
    currentTeamNumber = startingTeamNumber === 0 ? 1 : 0;
  }

  initBoard();

  currentTeam = firstTeam;

  const questionKeys = Object.keys(leftQuestions);

  const currentQuestion =
    questionKeys[Math.floor(Math.random() * questionKeys.length)];

  const questionEl = document.querySelector("#question");

  questionEl.innerHTML = currentQuestion;

  playersQuestionAnswers = [];
  const questionAnswers = Object.values(leftQuestions[currentQuestion]).filter(
    (item) => item != null
  );
  playersLeftQuestionAnswers = [...questionAnswers];

  questionAnswers.forEach((answer, i) => {
    const allAnswerEl = document.createElement("li");
    allAnswerEl.innerHTML = `${i + 1}. ${answer.ans}`;
    allAnswersEl.appendChild(allAnswerEl);

    const usersAnswerEl = document.createElement("li");
    usersAnswerEl.innerHTML = `${i + 1}. ------------------------------`;
    usersAnswersEl.appendChild(usersAnswerEl);
  });

  delete leftQuestions[currentQuestion];

  formEl.addEventListener("submit", handleAnswer);
};

const playTheGame = () => {
  const leftQuestions = { ...questions };

  // observer for _roundNumber
  Object.defineProperty(window, "roundNumber", {
    get: function () {
      return _roundNumber;
    },
    set: function (value) {
      _roundNumber = value;
      playRound(leftQuestions);
    },
  });

  console.log(
    "🚀 ~ file: index.js:19 ~ playTheGame ~ leftQuestions:",
    leftQuestions
  );
  console.log(questions);
  playRound(leftQuestions);

  updatePoints();
};

playTheGame();

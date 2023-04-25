import { Team } from "./Team.js";
import { questions } from "./familiada-pytania.js";

const teamRed = new Team("Red");
const teamBlue = new Team("Blue");
const teams = [teamRed, teamBlue];
const pointsEl = document.querySelector("#points");
const mistakesEl = document.querySelector("#mistakes");
const team1El = document.querySelector("#team1");
const team2El = document.querySelector("#team2");
const team1mistakesEl = document.querySelector("#team1-mistakes");
const team2mistakesEl = document.querySelector("#team2-mistakes");
const roundNumber = 1;

const startingTeamNumber = Math.floor(Math.random() * teams.length);
let currentTeamNumber = startingTeamNumber;
const startingTeam = teams[startingTeamNumber];
const endingTeam = teams.find((team) => team.name !== startingTeam.name);

const playRound = (leftQuestions) => {
  let points = 0;
  let mistakes = 0;

  // select teams answering order
  let firstTeam = startingTeam;
  let secondTeam = endingTeam;

  if (roundNumber % 2 == 0) {
    firstTeam = endingTeam;
    secondTeam = startingTeam;
    currentTeamNumber = startingTeamNumber === 0 ? 1 : 0;
  }

  let currentTeam = firstTeam;

  const questionKeys = Object.keys(leftQuestions);

  const currentQuestion =
    questionKeys[Math.floor(Math.random() * questionKeys.length)];

  const questionEl = document.querySelector("#question");

  questionEl.innerHTML = currentQuestion;

  const playersQuestionAnswers = [];
  const questionAnswers = Object.values(leftQuestions[currentQuestion]).filter(
    (item) => item != null
  );
  let playersLeftQuestionAnswers = [...questionAnswers];

  const answersEl = document.querySelector("#answers");

  questionAnswers.forEach((answer) => {
    const answerEl = document.createElement("li");
    answerEl.innerHTML = answer.ans;
    answersEl.appendChild(answerEl);
  });

  console.log(
    "🚀 ~ file: index.js:15 ~ playRound ~ questionAnswers:",
    questionAnswers
  );

  const formEl = document.querySelector("#answer-form");

  const updatePoints = () => {
    team1El.innerHTML = `${teams[0].name}: ${teams[0].points}`;
    team2El.innerHTML = `${teams[1].name}: ${teams[1].points}`;
  };

  const handleAnswer = (e) => {
    e.preventDefault();
    const currentAnswerInput = document.querySelector("#answer-input");
    const currentAnswerText = currentAnswerInput.value;
    currentAnswerInput.value = "";
    console.log(
      "🚀 ~ file: index.js:56 ~ formEl.addEventListener ~ currentAnswerText:",
      currentAnswerText
    );

    const playerAnswer = playersLeftQuestionAnswers.find(
      (answer) => answer.ans.toLowerCase() === currentAnswerText.toLowerCase()
    );

    if (playerAnswer) {
      points += playerAnswer.points;
      pointsEl.innerHTML = points;

      playersLeftQuestionAnswers = [
        ...playersLeftQuestionAnswers.filter(
          (answer) =>
            answer.ans.toLowerCase() !== currentAnswerText.toLowerCase()
        ),
      ];
      playersQuestionAnswers.push(currentAnswerText);

      // all questions answered - current team win
      if (playersLeftQuestionAnswers.length === 0) {
        currentTeam.points += points;
        updatePoints();

        return;
      }
    } else {
      mistakes += 1;
      mistakesEl.innerHTML = mistakes;

      if (currentTeamNumber === 0) {
        team1mistakesEl.innerHTML += "x";
      } else {
        team2mistakesEl.innerHTML += "x";
      }

      // 3 mistakes - second team answer once
      if (mistakes === 3) {
        currentTeam = secondTeam;
        currentTeamNumber = currentTeamNumber === 0 ? 1 : 0;
      }

      // 4 mistakes - first team win
      if (mistakes === 4) {
        currentTeam = firstTeam;
        currentTeamNumber = currentTeamNumber === 0 ? 1 : 0;
        updatePoints();
      }
    }
  };

  formEl.addEventListener("submit", (e) => handleAnswer(e));

  // while (mistakes < 3) {}
};

const playTheGame = () => {
  const leftQuestions = { ...questions };
  console.log(
    "🚀 ~ file: index.js:19 ~ playTheGame ~ leftQuestions:",
    leftQuestions
  );
  console.log(questions);
  playRound(leftQuestions);

  team1El.innerHTML = `${teams[0].name}: ${teams[0].points}`;
  team2El.innerHTML = `${teams[1].name}: ${teams[1].points}`;
};

playTheGame();

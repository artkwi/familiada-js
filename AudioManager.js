const audioFail = new Audio("assets/music/fail_v2.mp3");
const audioCorrect = new Audio("assets/music/correct.mp3");
const audioIntro = new Audio("assets/music/familiada-intro.mp3");
const audioAfterRound = new Audio("assets/music/after-round.mp3");
const audioEndGame = new Audio("assets/music/outro.mp3");

export class AudioManager {
  playFailSound() {
    audioFail.currentTime = 0;
    audioFail.play();
  }

  playCorrectSound() {
    audioCorrect.currentTime = 0;
    audioCorrect.play();
  }

  playIntroSound() {
    setTimeout(() => {
      audioIntro.play();
    }, 3000);
  }

  playAfterRoundSound() {
    audioAfterRound.currentTime = 0;
    audioAfterRound.play();
  }

  playEndSound() {
    audioEndGame.play();
  }

  playMusic(isGameContinue) {
    audioIntro.pause();
    audioIntro.currentTime = 0;
    if (isGameContinue) {
      this.playAfterRoundSound();
    } else {
      this.playEndSound();
    }
  }
}

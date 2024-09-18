import { IMAGES_NUMBERS } from "./index.js";

const popupEl = document.querySelector("#popup");
const popupTitleEl = document.querySelector("#popup-title");
const popupImgEl = document.querySelector("#popup-img");
const popupEndTitleEl = document.querySelector("#popup-end-title");
const popupEndEl = document.querySelector("#popup-end");
const popupNotSupportedEl = document.querySelector("#popup-not-supported");

export class PopupManager {
  updateRoundPopup(roundNumber, currentTeam, points) {
    popupTitleEl.innerHTML = `Koniec rundy ${roundNumber}. <br /> Wygrała drużyna \"${currentTeam.name}\". <br /> Zdobyli ${points} punktów.`;
    const randomImgNumber =
      Math.floor(Math.random() * (IMAGES_NUMBERS - 1)) + 1;
    popupImgEl.src = `assets/img/${randomImgNumber}.jpeg`;
    popupEl.classList.remove("popup-hide");
  }

  updateEndPopup(winner) {
    popupEndTitleEl.innerHTML = `Koniec gry. <br /> Wygrała drużyna \"${winner.name}\". <br /> Zdobyli ${winner.points} punktów. <br /> Gratulacje!`;
    popupEndEl.classList.remove("popup-hide");
  }

  hideRoundAndEndPopup() {
    popupEl.classList.add("popup-hide");
  }

  hideNotSupportedPopup() {
    popupNotSupportedEl.classList.remove("popup-hide");
  }
}

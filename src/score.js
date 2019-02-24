export default class {
  constructor(element) {
    this._winCounter = element.querySelector("[ref=wins]");
    this._tieCounter = element.querySelector("[ref=ties]");
    this._lossCounter = element.querySelector("[ref=losses]");
    this._wins = 0;
    this._ties = 0;
    this._losses = 0;

    this._updateElement();
  }

  addWin() {
    this._wins++;
    this._updateElement();
  }

  addTie() {
    this._ties++;
    this._updateElement();
  }

  addLoss() {
    this._losses++;
    this._updateElement();
  }

  _updateElement() {
    this._winCounter.innerText = this._wins;
    this._tieCounter.innerText = this._ties;
    this._lossCounter.innerText = this._losses;
  }
}

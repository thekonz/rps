import Score from "@/score";
import Renderer from "@/renderer";

export default class {
  /**
   * @param  {DOMElement} element
   */
  constructor(element) {
    this._hands = [];
    this._score = new Score(element.querySelector("[ref=score]"));
    this._renderer = new Renderer(element);
    this._roundInProgress = false;
  }

  /**
   * @return {Hand}
   */
  getRandomHand() {
    const randomIndex = Math.floor(Math.random() * this._hands.length);
    return this._hands[randomIndex];
  }

  /**
   * @param {Hand[]} hands
   */
  setHands(hands) {
    this._hands = hands;
    this._renderer.renderHands(hands, this);
  }

  async playRandom() {
    return this.playRound(this.getRandomHand());
  }

  /**
   * @param  {Hand} hand
   */
  async playRound(hand) {
    if (this._roundInProgress) {
      return;
    }
    this._roundInProgress = true;
    await this._renderer.hideCurrentStage();
    await this._renderer.renderWindup();
    await this._renderer.renderRound(this._fight(hand));
    this._roundInProgress = false;
  }

  /**
   * @param  {Hand} hand
   * @return {Object}  The player's Hand, the enemy's Hand and the result (win, loss or tie)
   */
  _fight(hand) {
    const enemyHand = this.getRandomHand();
    let result;
    if (hand.fight(enemyHand)) {
      result = "win";
      this._score.addWin();
    } else if (enemyHand.fight(hand)) {
      result = "loss";
      this._score.addLoss();
    } else {
      result = "tie";
      this._score.addTie();
    }
    return { hand, enemyHand, result };
  }
}

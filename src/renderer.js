export default class {
  /**
   * @param  {DOMElement} element
   */
  constructor(element) {
    this._empty = element.querySelector("[ref=empty]");
    this._windup = element.querySelector("[ref=windup]");
    this._result = element.querySelector("[ref=result]");
    this._actions = element.querySelector("[ref=actions]");
    this._history = element.querySelector("[ref=history]");
  }

  renderWindup() {
    this._windup.classList.remove("hidden");
    const windupAnimations = [];
    this._windup
      .querySelectorAll("[ref=animate]")
      .forEach(element =>
        windupAnimations.push(this._animate(element, "animate-windup"))
      );
    return Promise.all(windupAnimations).then(() =>
      this._windup.classList.add("hidden")
    );
  }

  async hideCurrentStage() {
    if (!this._empty.classList.contains("hidden")) {
      // no round has been played, so the empty state
      // is still visible and we fade it out
      await this._animate(this._empty, "animate-fade-out").then(() =>
        this._empty.classList.add("hidden")
      );
    } else {
      // we played a round aleady, so we hide that result screen
      this._result.classList.add("hidden");
    }
  }

  /**
   * @param  {Object} round   @see the return value of game::_fight
   */
  async renderRound(round) {
    this._renderHistoryItem(round);
    this._renderResult(round);
  }

  renderHands(hands, game) {
    // create a fragment here to prevent unnecessary re-renders
    const fragment = document.createDocumentFragment();

    // to play computer vs computer, we add a random button here
    const randomButton = this._makeActionButton("computer");
    randomButton.addEventListener("click", () => game.playRandom());
    fragment.appendChild(randomButton);

    hands.forEach(hand => {
      const button = this._makeActionButton(hand.name);
      button.addEventListener("click", () => game.playRound(hand));
      fragment.appendChild(button);
    });

    // performance of innerHTML vs looping through child nodes
    // is worse, could be improved
    this._actions.innerHTML = "";
    this._actions.appendChild(fragment);
  }

  /**
   * @param  {Hand} options.hand
   * @param  {Hand} options.enemyHand
   */
  _renderResult({ hand, enemyHand }) {
    const left = this._result.querySelector("[ref=left]");
    const right = this._result.querySelector("[ref=right]");
    left.innerHTML = "";
    right.innerHTML = "";
    left.appendChild(this._makeHand(hand.name));
    right.appendChild(this._makeHand(enemyHand.name, true));
    this._result.classList.remove("hidden");
  }

  /**
   * @param  {String} icon
   * @return {DOMElement}
   */
  _makeActionButton(icon) {
    const actionButton = document.createElement("button");
    actionButton.appendChild(this._makeHand(icon));
    actionButton.classList.add("actions__button");
    return actionButton;
  }

  /**
   * [_makeHand description]
   * @param  {String}  icon
   * @param  {Boolean} flipped
   * @return {DOMElement}
   */
  _makeHand(icon, flipped = false) {
    const hand = document.createElement("span");
    hand.classList.add("hand", `hand--${icon}`);
    if (flipped) {
      hand.classList.add("hand--flipped");
    }
    return hand;
  }

  /**
   * @param  {DOMElement} element
   * @param  {String} className
   * @return {DOMElement}
   */
  _animate(element, className) {
    return new Promise(resolve => {
      element.classList.add(className);
      element.addEventListener("animationend", resolve);
    }).then(() => element.classList.remove(className));
  }

  /**
   * @param  {Hand} options.hand
   * @param  {Hand} options.enemyHand
   * @param  {String} options.result    win, loss or tie
   */
  _renderHistoryItem({ hand, enemyHand, result }) {
    // creating a fragment to prevent re-renders
    const fragment = document.createDocumentFragment();
    const historyItem = document.createElement("div");
    historyItem.classList.add("history__item", `history__item--${result}`);
    fragment.appendChild(historyItem);

    historyItem.appendChild(document.createTextNode(result));
    historyItem.appendChild(this._makeHand(hand.name));
    historyItem.appendChild(document.createTextNode("vs"));
    historyItem.appendChild(this._makeHand(enemyHand.name));

    if (this._history.firstChild) {
      this._history.insertBefore(fragment, this._history.firstChild);
    } else {
      this._history.appendChild(fragment);
    }
  }
}

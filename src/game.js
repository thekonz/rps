import Score from "@/score";

export default class {
  /**
   * @param  {DOMElement}
   */
  constructor(element) {
    this._element = element;
    this._hands = [];
    this._score = new Score(element.querySelector("[ref=score]"));
    this._history = element.querySelector("[ref=history]");
    this._empty = element.querySelector("[ref=empty]");
    this._windup = element.querySelector("[ref=windup]");
    this._result = element.querySelector("[ref=result]");
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
   * @param {Hand[]}
   */
  setHands(hands) {
    this._hands = hands;
    this._renderHands();
  }

  _animate(element, className) {
    return new Promise(resolve => {
      element.classList.add(className);
      element.addEventListener("animationend", resolve);
    }).then(() => element.classList.remove(className));
  }

  _renderWindup() {
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

  async playRound(hand) {
    if (this._roundInProgress) {
      return;
    }
    this._roundInProgress = true;
    if (!this._empty.classList.contains("hidden")) {
      await this._animate(this._empty, "animate-fade-out").then(() =>
        this._empty.classList.add("hidden")
      );
    } else {
      //await this._animate(this._result, "animate-fade-out").then(() =>
      this._result.classList.add("hidden");
      //);
    }
    await this._renderWindup();
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
    await this._renderRound({
      hand,
      enemyHand,
      result
    });
    this._roundInProgress = false;
  }

  _renderRound({ hand, enemyHand, result }) {
    // creating a fragment to prevent re-renders
    const fragment = document.createDocumentFragment();
    const historyItem = document.createElement("div");
    fragment.appendChild(historyItem);

    const handElement = document.createElement("span");
    const enemyHandElement = document.createElement("span");

    const addLeftClasses = element =>
      element.classList.add("hand", `hand--${hand.name}`);
    const addRightClasses = element =>
      element.classList.add("hand", `hand--${enemyHand.name}`, "hand--flipped");
    historyItem.classList.add("history__item", `history__item--${result}`);
    addLeftClasses(handElement);
    addRightClasses(enemyHandElement);

    historyItem.appendChild(document.createTextNode(result));
    historyItem.appendChild(handElement);
    historyItem.appendChild(document.createTextNode("vs"));
    historyItem.appendChild(enemyHandElement);

    if (this._history.firstChild) {
      this._history.insertBefore(fragment, this._history.firstChild);
    } else {
      this._history.appendChild(fragment);
    }

    this._result.classList.remove("hidden");
    const left = this._result.querySelector("[ref=left]");
    const right = this._result.querySelector("[ref=right]");
    left.className = "";
    addLeftClasses(left);
    addRightClasses(right);
  }

  _renderHands() {
    const makeActionButton = icon => {
      const actionButton = document.createElement("button");
      const hand = document.createElement("span");
      actionButton.appendChild(hand);
      actionButton.classList.add("actions__button");
      hand.classList.add("hand", `hand--${icon}`);
      return actionButton;
    };
    const element = this._element.querySelector("[ref=actions]");

    // create a fragment here to prevent unnecessary re-renders
    const fragment = document.createDocumentFragment();

    // to play computer vs computer, we add a random button here
    const randomButton = makeActionButton("computer");
    randomButton.addEventListener("click", () =>
      this.playRound(this.getRandomHand())
    );
    fragment.appendChild(randomButton);

    this._hands.forEach(hand => {
      const button = makeActionButton(hand.name);
      button.addEventListener("click", () => this.playRound(hand));
      fragment.appendChild(button);
    });

    // performance of innerHTML vs looping through child nodes
    // is worse, could be improved
    element.innerHTML = "";
    element.appendChild(fragment);
  }
}

export default class {
  constructor(element) {
    this._history = element.querySelector("[ref=history]");
    this._empty = element.querySelector("[ref=empty]");
    this._windup = element.querySelector("[ref=windup]");
    this._result = element.querySelector("[ref=result]");
    this._actions = element.querySelector("[ref=actions]");
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
      await this._animate(this._empty, "animate-fade-out").then(() =>
        this._empty.classList.add("hidden")
      );
    } else {
      this._result.classList.add("hidden");
    }
  }

  async renderRound({ hand, enemyHand, result }) {
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

  renderHands(hands, game) {
    const makeActionButton = icon => {
      const actionButton = document.createElement("button");
      const hand = document.createElement("span");
      actionButton.appendChild(hand);
      actionButton.classList.add("actions__button");
      hand.classList.add("hand", `hand--${icon}`);
      return actionButton;
    };

    // create a fragment here to prevent unnecessary re-renders
    const fragment = document.createDocumentFragment();

    // to play computer vs computer, we add a random button here
    const randomButton = makeActionButton("computer");
    randomButton.addEventListener("click", () => game.playRandom());
    fragment.appendChild(randomButton);

    hands.forEach(hand => {
      const button = makeActionButton(hand.name);
      button.addEventListener("click", () => game.playRound(hand));
      fragment.appendChild(button);
    });

    // performance of innerHTML vs looping through child nodes
    // is worse, could be improved
    this._actions.innerHTML = "";
    this._actions.appendChild(fragment);
  }

  _animate(element, className) {
    return new Promise(resolve => {
      element.classList.add(className);
      element.addEventListener("animationend", resolve);
    }).then(() => element.classList.remove(className));
  }
}

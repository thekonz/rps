export default class {
  /**
   * @param  {String}
   */
  constructor(name) {
    this._name = name;
    this._winsAgainst = [];
  }

  /**
   * @return {String}
   */
  get name() {
    return this._name;
  }

  /**
   * @param {Hand[]|Hand}
   */
  winsAgainst(hands) {
    this._winsAgainst = hands.constructor === Array ? hands : [hands];
  }

  /**
   * @param  {Hand}
   * @return {Boolean}
   */
  fight(versus) {
    return this._winsAgainst.indexOf(versus) > -1;
  }
}

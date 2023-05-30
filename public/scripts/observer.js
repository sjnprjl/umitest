/**
 * @template T
 */
export class ObservableStore {
  /**
   * @param {T} initialState
   */
  constructor(initialState) {
    /**@type {T} */
    this.state = initialState;
    /**@type {Array<(state:T)=>void>} */
    this.listeners = [];
  }
  getState() {
    return this.state;
  }
  /**
   * @param {T | (prevState:T)=>T} newStateOrSetter
   * @returns {void}
   * */
  setState(newStateOrSetter) {
    const prevState = this.state;
    const nextState =
      typeof newStateOrSetter === "function"
        ? newStateOrSetter(prevState)
        : newStateOrSetter;
    this.state = nextState;
    this.listeners.forEach((listener) => listener(nextState));
  }
  /**
   * @param {(state:T)=>void} listener
   * @returns {void}
   * */
  subscribe(listener) {
    this.listeners.push(listener);
  }
  /**
   * @param {(state:T)=>void} listener
   * @returns {void}
   * */
  unsubscribe(listener) {
    this.listeners = this.listeners.filter((l) => l !== listener);
  }

  notify() {
    this.listeners.forEach((listener) => listener(this.state));
  }
}

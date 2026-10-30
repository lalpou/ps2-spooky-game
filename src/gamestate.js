export class GameState {
  constructor(initState = 0) {
    this.state = initState;
  }

  getState() {
    return this.state;
  }

  setState(state) {
    this.state = state;
  }
}

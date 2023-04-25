export class Team {
  constructor(name) {
    this.name = name;
    this.points = 0;
  }
  setPoints (points) {
    this.points = points;
  }
}
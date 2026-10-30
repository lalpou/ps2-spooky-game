import { Character } from "./character.js";

const playerSprites = {
  east: new Image("assets/enemy-east.png"),
  north: new Image("assets/enemy-north.png"),
  south: new Image("assets/enemy-south.png"),
  west: new Image("assets/enemy-west.png"),
};

const playerHitboxes = {
  east: { w: 0.4, h: 0.5 },
  north: { w: 0.6, h: 0.5 },
  south: { w: 0.6, h: 0.5 },
  west: { w: 0.4, h: 0.5 },
};

export class Player extends Character {
  constructor(health, x, y) {
    super(playerSprites, x, y, playerHitboxes, 0.8);
    this.health = health;
  }
}

import { Character } from "./character.js";

const enemySprites = {
  east: new Image("assets/enemy-east.png"),
  north: new Image("assets/enemy-north.png"),
  south: new Image("assets/enemy-south.png"),
  west: new Image("assets/enemy-west.png"),
};

const enemyHitboxes = {
  east: { w: 0.3, h: 0.5 },
  north: { w: 0.5, h: 0.5 },
  south: { w: 0.5, h: 0.5 },
  west: { w: 0.3, h: 0.5 },
};

export class Enemy extends Character {
  constructor(x, y) {
    super(enemySprites, x, y, enemyHitboxes, 0.8);
  }
}

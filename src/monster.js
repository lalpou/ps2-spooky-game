import { Character } from "./character.js";

const monsterSprites = {
  east: new Image("assets/enemy-east.png"),
  north: new Image("assets/enemy-north.png"),
  south: new Image("assets/enemy-south.png"),
  west: new Image("assets/enemy-west.png"),
};

const monsterHitboxes = {
  east: { w: 0.3, h: 0.5 },
  north: { w: 0.5, h: 0.5 },
  south: { w: 0.5, h: 0.5 },
  west: { w: 0.3, h: 0.5 },
};

export class Monster extends Character {
  constructor(x, y) {
    super(monsterSprites, x, y, monsterHitboxes, 0.8);
  }
}

import { Character } from "./character.js";
import { Ability, BREAK_WALL, SCREAM } from "./abilities.js";

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
    this.speed = 3.5; // A little faster than the player's 3.
    this.abilities = {
      cross: new Ability(SCREAM),
      circle: new Ability(BREAK_WALL),
    };
  }
}

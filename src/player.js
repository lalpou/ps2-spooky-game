import { Character } from "./character.js";
import { Ability, POCKET_SAND, SPRINT } from "./abilities.js";

const playerSprites = {
  east: new Image("assets/main-east.png"),
  north: new Image("assets/main-north.png"),
  south: new Image("assets/main-south.png"),
  west: new Image("assets/main-west.png"),
};

const playerHitboxes = {
  east: { w: 0.3, h: 0.3 },
  north: { w: 0.3, h: 0.3 },
  south: { w: 0.3, h: 0.3 },
  west: { w: 0.3, h: 0.3 },
};

export class Player extends Character {
  constructor(health, x, y) {
    super(playerSprites, x, y, playerHitboxes, 0.6);
    this.health = health;
    this.abilities = {
      cross: new Ability(SPRINT),
      circle: new Ability(POCKET_SAND),
    };
  }
}

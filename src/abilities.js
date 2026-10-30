// Most abilities apply a timed effect. Without a radius it affects the user;
// with one it affects the opponent, if they're within `radius` cells, and the
// cooldown starts when the effect ends. Abilities with an `action` instead do
// something to the world once, and only go on cooldown if the action succeeded.
// Times are in seconds.
export const SPRINT = { name: "SPRINT", effect: "sprinting", duration: 10, cooldown: 20 };
export const POCKET_SAND = { name: "SAND", effect: "stunned", duration: 5, cooldown: 15, radius: 1.5 };
export const SCREAM = { name: "SCREAM", effect: "confused", duration: 5, cooldown: 20, radius: 10 };
export const BREAK_WALL = {
  name: "BREAK",
  cooldown: 30,
  action: (user, world) => world.breakWallInFront(user),
};

export class Ability {
  constructor(definition) {
    this.definition = definition;
    /** Seconds until it can be used again: the effect's duration plus the cooldown. */
    this.timeLeft = 0;
  }

  get ready() {
    return this.timeLeft <= 0;
  }

  update(dt) {
    this.timeLeft = Math.max(0, this.timeLeft - dt);
  }

  // A ranged ability used out of range is wasted and still goes on cooldown.
  use(user, opponent, world) {
    if (!this.ready) return;
    const { effect, duration, cooldown, radius, action } = this.definition;

    if (action) {
      if (action(user, world)) this.timeLeft = cooldown;
      return;
    }

    this.timeLeft = duration + cooldown;
    if (radius === undefined) {
      user.addEffect(effect, duration);
    } else if (Math.hypot(opponent.x - user.x, opponent.y - user.y) <= radius) {
      opponent.addEffect(effect, duration);
    }
  }
}

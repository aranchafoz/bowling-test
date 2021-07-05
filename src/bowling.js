class Bowling {
    constructor() {
        this.pins = [];
        this.total = 0;
        this.rounds = 0;
        this.bonusRolls = 1;
        this.isGameOver = false;
    }

    isStrike(roll) {
        return roll === 10;
    }
    isSpare(roll1, roll2) {
        return roll1 + roll2 === 10 && roll1 < 10 && roll2 < 10;
    }

    roll(pins) {
        const previousRoll = this.pins[this.pins.length - 1];
        const isStrike = pins === 10;
        const previousFrameIsSpare = this.isSpare(this.pins[this.pins.length - 2], previousRoll);

        if (pins < 0) throw new Error('Negative roll is invalid');
        if (pins > 10) throw new Error('Pin count exceeds pins on the lane');
        if (!this.isStrike(previousRoll) && !previousFrameIsSpare && previousRoll + pins > 10) throw new Error('Pin count exceeds pins on the lane');
        if (this.isGameOver) throw new Error('Cannot roll after game is over');


        this.pins.push(pins);

        // normal frames
        if (this.rounds < 9) {
            if (isStrike && this.rounds % 1 === 0) {
                this.rounds += 1;
            } else {
                this.rounds += 0.5;
            }
        } else if (this.rounds === 9) {
            // decide how many bonus rolls
            if (isStrike) {
                this.bonusRolls = 2;
            } else {
                this.bonusRolls = 1;
            }
            this.rounds += 0.5;
        } else if (this.rounds > 9) {
            // bonus roll
            this.bonusRolls -= 1;
            this.rounds += 0.5;
            if (this.bonusRolls === 0 && this.rounds === 10 & this.isSpare(previousRoll, pins)) {
                this.bonusRolls = 1;
            } else if (this.bonusRolls === 0) {
                this.isGameOver = true;
            }
        }
    }

    score() {
        if (!this.isGameOver) throw new Error('Score cannot be taken until the end of the game');

        for (const [index, value] of this.pins.entries()) {
            const isStrike = this.isStrike(this.pins[index - 2]);
            const isSpare = this.isSpare( this.pins[index - 2],  this.pins[index - 1]);
            const isOpen = this.pins[index - 2] + this.pins[index - 1] < 10;
            const lastFrame =  this.pins.length === index + 1;

            if (isStrike && !lastFrame) {
                this.total += this.pins[index - 1] + value + value;
            } else if (isSpare && !lastFrame) {
                this.total += value + value;
            } else {
                this.total += value;
            }
        }

        return this.total;
    }
}

module.exports = Bowling;
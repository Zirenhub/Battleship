class Ship {
  constructor(shipClass) {
    this.shipClass = shipClass;
    this.length = this.assignClassLength();
    this.isHit = false;
    this.isSunk = false;
  }

  assignClassLength() {
    if (this.shipClass === 'Carrier') {
      return [0, 1, 2, 3, 4];
    }
    if (this.shipClass === 'Battleship') {
      return [0, 1, 2, 3];
    }
    if (this.shipClass === 'Destroyer') {
      return [0, 1, 2];
    }
    if (this.shipClass === 'Submarine') {
      return [0, 1, 2];
    }
    if (this.shipClass === 'Patrol Boat') {
      return [0, 1];
    }
    return console.log('something went wrong');
  }

  hit(num) {
    if (this.length.length >= num) {
      this.isHit = true;
      this.length[num] = 'hit';
    }
  }

  // isSunk() {
  //   // calculate based on length whether all positions are hit.
  // }
}

const carrier = new Ship('Destroyer');

console.log(carrier);

export default Ship;

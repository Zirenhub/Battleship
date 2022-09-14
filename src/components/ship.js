class Ship {
  constructor(shipClass) {
    this.shipClass = shipClass;
    this.length = this.assignClassLength();
    // this.isHit = false;
    this.isSunk = false;
  }

  assignClassLength() {
    if (this.shipClass === 'Carrier') {
      return [1, 2, 3, 4, 5];
    }
    if (this.shipClass === 'Battleship') {
      return [1, 2, 3, 4];
    }
    if (this.shipClass === 'Destroyer') {
      return [1, 2, 3];
    }
    if (this.shipClass === 'Submarine') {
      return [1, 2, 3];
    }
    if (this.shipClass === 'Patrol Boat') {
      return [1, 2];
    }
    return console.log('something went wrong');
  }

  getLength() {
    return this.length.length;
  }

  getShipName() {
    return this.shipClass.slice(0, 3);
  }

  hit(num) {
    if (this.length.length >= num && num > 0) {
      // this.isHit = true;
      this.length[num - 1] = 'hit';
      this.sunk();
    }
  }

  sunk() {
    const checkSunk = (current) => current === 'hit';

    if (this.length.every(checkSunk)) this.isSunk = true;
  }
}

export default Ship;

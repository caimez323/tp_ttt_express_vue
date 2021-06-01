class Game {
  constructor(id, grid) {
    this.id = id;
    this.grid = grid;
  }
  playcell(ncell, nplayer) {
    this.grid[ncell].state = 1;
    //return this.height * this.width;
    if (nplayer == 1) {
      this.grid[ncell].display = 1;
    } else if (nplayer == 2) {
      this.grid[ncell].display = 2;
    }
  }
}
module.exports = Game;

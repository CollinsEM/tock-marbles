const colors = [ 0x00ff00, 0xff0000, 0x0000ff, 0xff00ff ];

class Marble extends THREE.Sprite {
  constructor(mat, idx, player, team) {
    super(mat);
    this.idx = idx;
    this.player = player;
    this.team = team;
    this.lit = false;
    this.selected = false;
  }
  setColor(color) {
    this.material.color = color;
  }
  select() {
    this.selected = true;
  }
  deselect() {
    this.selected = false;
  }
};

function createMarbles(texture) {
  let theta = Math.PI/4;
  for (let j=0; j<4; ++j) {
    marbleMat[j] = new THREE.SpriteMaterial({ color: colors[j],
                                              map: texture });
    marbles[j] = [ ];
    for (let i=0; i<4; ++i) {
      marbles[j][i] = new Marble(marbleMat[j], i, j, j%2);
      marbles[j][i].position.set((7+i)*Math.cos(theta),
                                 (7+i)*Math.sin(theta),
                                 1.0);
    }
    theta += Math.PI/2;
  }
  marbleMat[4] = new THREE.SpriteMaterial({ color: 0x888888,
                                            map: texture });
}
// function createMarbles(texture) {
//   let theta = Math.PI/4;
//   for (let j=0; j<4; ++j) {
//     marbleMat[j] = new THREE.SpriteMaterial({ color: colors[j],
//                                               map: texture });
//     marbles[j] = [ ];
//     for (let i=0; i<4; ++i) {
//       marbles[j][i] = new THREE.Sprite(marbleMat[j]);
//       marbles[j][i].position.set((7.5+i)*Math.cos(theta),
//                                  (7.5+i)*Math.sin(theta),
//                                  1.0);
//     }
//     theta += Math.PI/2;
//   }
//   marbleMat[4] = new THREE.SpriteMaterial({ color: 0x888888,
//                                             map: texture });
// }

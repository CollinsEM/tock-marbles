const holeGeom = new THREE.CircleBufferGeometry( 0.375, 32 );
const holeMat = new THREE.MeshBasicMaterial( { color: 0x764A34 } );
const holeLit = new THREE.MeshBasicMaterial( { color: 0x888888 } );

class Hole extends THREE.Mesh {
  constructor() {
    super(holeGeom, holeMat);
    this.rotateX(-Math.PI/2);
    this.lit = false;
    this.selected = false;
  }
  setColor(color) {
    this.material.color = color;
  }
};

class Board extends THREE.Mesh {
  constructor() {
    const geom = new THREE.CylinderBufferGeometry(12, 12, 1, 64);
    const mat = new THREE.MeshBasicMaterial({ map: boardTex,
                                              // transparent: true, opacity: 0.25
                                              /* color: 0xDEB887 */ });
    super(geom, mat);
    this.rotateX(Math.PI/2);
    
    const hole = new Hole();
    var theta = Math.PI/4;
    for (let j=0; j<4; ++j) {
      for (let i=0; i<4; ++i) {
        const obj = hole.clone();
        obj.position.set((7+i)*Math.cos(theta), 0.55,
                         (7+i)*Math.sin(theta));
        this.add(obj);
      }
      theta += Math.PI/2;
    }
    var theta = 0.0;
    for (let j=0; j<4; ++j) {
      for (let i=0; i<4; ++i) {
        const obj = hole.clone();
        obj.position.set((7+i)*Math.cos(theta), 0.55,
                         (7+i)*Math.sin(theta));
        this.add(obj);
      }
      theta += Math.PI/2;
    }
    const x = [ 11, 11, 10 ];
    const y = [ -0.5, -1.5, -1.5 ];
    for (let t=0; t<Math.PI/4; t+=Math.PI/22) {
      x.push( 9-7.5*Math.sin(t));
      y.push(-9+7.5*Math.cos(t));
    }
    for (let i=0; i<9; ++i) {
      x.push(-y[8-i]);
      y.push(-x[8-i]);
    }
    for (let i=0; i<9; ++i) {
      x.push( y[i]);
      y.push(-x[i]);
    }
    for (let i=0; i<9; ++i) {
      x.push(-x[8-i]);
      y.push( y[8-i]);
    }
    for (let i=0; i<9; ++i) {
      x.push(-x[i]);
      y.push(-y[i]);
    }
    for (let i=0; i<9; ++i) {
      x.push( y[8-i]);
      y.push( x[8-i]);
    }
    for (let i=0; i<9; ++i) {
      x.push(-y[i]);
      y.push( x[i]);
    }
    for (let i=0; i<9; ++i) {
      x.push( x[8-i]);
      y.push(-y[8-i]);
    }
    for (let i=0; i<x.length; ++i) {
      const obj = hole.clone();
      obj.translateX(x[i]);
      obj.translateY(y[i]);
      obj.translateZ(0.55);
      this.add(obj);
      // for (let j=0; j<4; ++j) {
      //   const obj = hole.clone();
      //   obj.translateX(j&1?+x[i]:-x[i]);
      //   obj.translateY(j&2?+y[i]:-y[i]);
      //   obj.translateZ(0.55);
      //   this.add(obj);
      // }
      // for (let j=0; j<4; ++j) {
      //   const obj = hole.clone();
      //   obj.translateX(j&1?+y[i]:-y[i]);
      //   obj.translateY(j&2?+x[i]:-x[i]);
      //   obj.translateZ(0.55);
      //   this.add(obj);
      // }
    }
  }
}

function createBoard(texture) {
}

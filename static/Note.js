const noteHeight = 1;
const noteWidth = 2;
const zIndex = 3;

class Note {
  constructor(x, y, z, width, height, uid) {
    this.z = z;
    this.width = width;
    this.height = height;
    this.y = y;
    this.x = x;
    this.uid = uid;
  }

  update(mode, value) {
    switch (mode) {
      case noteHeight:
        this.height = value;
        break;
      case noteWidth:
        this.width = value;
        break;
      case zIndex:
        this.z = value;
        break;
    }
  }
}

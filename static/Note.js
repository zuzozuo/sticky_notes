const noteHeight = 1;
const noteWidth = 2;
const zIndex = 3;
const newText = 4;
const noteX = 5;
const noteY = 6;

class Note {
  constructor(x, y, z, width, height, uid, text) {
    this.z = z;
    this.width = width;
    this.height = height;
    this.y = y;
    this.x = x;
    this.uid = uid;
    this.text = text;
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
      case newText:
        this.text = value;
        break;
      case noteX:
        this.x = value;
        break;
      case noteY:
        this.y = value;
    }
  }

  save(parameters) {
    let obj = {};

    for (let i = 0; i < parameters.length; i++) {
      switch (parameters[i]) {
        case noteX:
          obj.positionX = this.x;
          break;
        case noteY:
          obj.positionY = this.y;
          break;
        case noteHeight:
          obj.height = this.height;
          break;
        case noteWidth:
          obj.width = this.width;
          break;
        case newText:
          obj.text = this.text;
          break;
        case zIndex:
          obj.z = this.z;
          break;
      }
    }

    console.log(obj)
  }

}

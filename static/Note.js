const noteHeight = 1;
const noteWidth = 2;
const zIndex = 3;
const newText = 4;
const noteX = 5;
const noteY = 6;

class Note {
  constructor(x, y, z, width, height, text, uid) {
    this.z = z;
    this.width = width;
    this.height = height;
    this.y = y;
    this.x = x;
    this.text = text;
    this.uid = uid;
  }


  create(func) {
    let xhttp = new XMLHttpRequest();
    let obj = this.tempFunc([noteX, noteY, noteHeight, noteWidth, newText,
      zIndex
    ]);
    let json = JSON.stringify(obj)
    let that = this;
    xhttp.onreadystatechange = function() {
      if (this.readyState == 4 && this.status == 200) {
        that.uid = this.responseText;
        //console.log(that)
        return func();
      }
    };
    xhttp.open("POST", "ajax", true);
    xhttp.setRequestHeader("Content-type",
      "text/plain");
    xhttp.send(json);
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

  tempFunc(parameters) {
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

    return obj;
  }

  save(parameters) { //put aktualizacja rekordow w bazie
    let obj = this.tempFunc(parameters);
    let xhttp = new XMLHttpRequest();
    let temp = {
      uid: this.uid,
      tempObj: obj
    };

    console.log(temp)

    xhttp.onreadystatechange = function() {
      if (this.readyState == 4 && this.status == 200) {

      }
    }
    xhttp.open("PUT", "ajax", true);
    xhttp.setRequestHeader("Content-type",
      "text/plain");
    xhttp.send(JSON.stringify(temp));
  }

}

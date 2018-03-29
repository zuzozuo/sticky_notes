class NoteController {
  constructor(stickyNote, whiteBoard) {
    this.stickyNote = stickyNote;
    this.whiteBoard = whiteBoard;
    this.div = null;
    this.resizeDiv = null;
    this.noteArea = null;
    this.removeSticky = null;

  }

  showDiv() {

    tinymce.init({
      selector: '#toWrite',
      height: 120,
      resize: false
    });

    this.div = document.createElement("div");
    this.div.className = "stickyNote";
    this.div.style.height = this.stickyNote.height + "px";
    this.div.style.width = this.stickyNote.width + "px";
    this.div.style.height = this.stickyNote.height + "px";
    this.div.style.zIndex = this.stickyNote.z;

    this.resizeDiv = document.createElement("div");
    this.resizeDiv.className = "resizeIcon";

    this.noteArea = document.createElement("div");
    this.noteArea.className = "noteArea";
    this.noteArea.innerHTML = this.stickyNote.text;


    //this.noteArea.innerHTML = "NEW NO!!!" + this.stickyNote.uid;

    this.removeSticky = document.createElement("div");
    this.removeSticky.className = "removeSticky";

    this.textEditor = document.createElement("div");
    this.textEditor.className = "textEditor";

    this.div.appendChild(this.removeSticky);
    this.div.appendChild(this.noteArea);
    this.div.appendChild(this.resizeDiv);
    this.div.appendChild(this.textEditor);
    this.whiteBoard.appendChild(this.div);

    this.div.addEventListener("mousedown", this.mouseDown.bind(this));
    this.resizeDiv.addEventListener("mousedown", this.resizeDown.bind(this));
    this.div.addEventListener("mousedown", this.setActive.bind(this));
    this.removeSticky.addEventListener("mousedown", this.removeMe.bind(this));
    this.textEditor.addEventListener("mousedown", this.setTextEditor.bind(
      this));
  }

  setZIndex(value) {
    this.div.style.zIndex = value;
    this.stickyNote.update(zIndex, value);
  }

  saveZIndex() {
    this.stickyNote.save([zIndex])
  }

  getZIndex() {
    return this.stickyNote.z;
  }

  removeDiv() {
    this.whiteBoard.removeChild(this.div);
  }

  resizeDown(event) {
    console.log("resizeDown")
    event.stopPropagation();
    let sticky = this.stickyNote;
    let div = this.div;
    let posX = event.clientX;
    let posY = event.clientY;
    let startW = this.stickyNote.width;
    let startH = this.stickyNote.height;
    let resW = 0;
    let resH = 0;
    const minHeight = 130;
    const minWidth = 130;


    //console.log(posX, posY, startW, startH)

    document.addEventListener("mousemove", resizeMove);
    document.addEventListener("mouseup", resizeUp);

    function resizeUp() {
      console.log("resizeUp")
      if (resH > 0 && resW > 0) {
        sticky.update(noteHeight, resH)
        sticky.update(noteWidth, resW)

        sticky.save([noteHeight, noteWidth])
      }
      document.removeEventListener("mouseup", resizeUp);
      document.removeEventListener("mousemove", resizeMove);
    }

    function resizeMove(event) {
      console.log("resizeMove")
      resW = startW + event.clientX - posX;
      resH = startH + event.clientY - posY;

      if (resW < minWidth) {
        resW = minWidth;
      }

      if (resH < minHeight) {
        resH = minHeight;
      }

      div.style.width = resW + "px";
      div.style.height = resH + "px";
    }

  }

  mouseDown(event) {
    console.log("mouseDown")
    let sticky = this.stickyNote;
    let div = this.div;
    let posX = event.clientX;
    let posY = event.clientY;
    let finalPosX = 0;
    let finalPosY = 0;
    div.className = "active stickyNote";
    document.addEventListener("mouseup", mouseUp)
    document.addEventListener("mousemove", mouseMove);

    function mouseUp() {
      document.removeEventListener("mouseup", mouseUp)
      document.removeEventListener("mousemove", mouseMove);
      div.className = "stickyNote";
      //this.stickyNote.update(note)

      if (finalPosX > 0 && finalPosY > 0) {
        sticky.update(noteX, finalPosX);
        sticky.update(noteY, finalPosY);
        sticky.save([noteX, noteY]);
      }


      console.log("mouseUp")
    }

    function mouseMove(event) {
      let resX = posX - event.clientX;
      let resY = posY - event.clientY;
      posX = event.clientX;
      posY = event.clientY;
      finalPosY = div.offsetTop - resY;
      finalPosX = div.offsetLeft - resX;

      div.style.top = finalPosY + "px";
      div.style.left = finalPosX + "px";

    }
  }


  removeMe(event) {
    console.log("removeMe");
    event.stopPropagation();
    let rEvent = new CustomEvent("removeMe", {
      detail: {
        uid: this.stickyNote.uid
      }
    });

    this.whiteBoard.dispatchEvent(rEvent);
  }

  setActive() {
    //console.log("Active");
    let aEvent = new CustomEvent("setActive", {
      detail: {
        uid: this.stickyNote.uid
      }
    });

    this.whiteBoard.dispatchEvent(aEvent);
  }

  setStyle(name) {
    this.div.className = name + " stickyNote";
  }

  setTextEditor() {
    console.log("Editor");
    let eEvent = new CustomEvent("setTextEditor", {
      detail: {
        uid: this.stickyNote.uid,
        text: this.stickyNote.text
      }
    });

    this.whiteBoard.dispatchEvent(eEvent);
  }

  updateText(text) {
    this.stickyNote.update(newText, text);
    this.stickyNote.save([newText]);
    this.noteArea.innerHTML = this.stickyNote.text;
  }

}

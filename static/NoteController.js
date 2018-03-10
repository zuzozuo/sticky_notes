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
    this.noteArea.innerHTML = "NEW NOTE!!!" + this.stickyNote.uid;

    this.removeSticky = document.createElement("div");
    this.removeSticky.className = "removeSticky";

    this.div.appendChild(this.removeSticky)
    this.div.appendChild(this.noteArea)
    this.div.appendChild(this.resizeDiv)
    this.whiteBoard.appendChild(this.div);
    this.removeSticky.addEventListener("click", this.removeMe.bind(this));
    this.div.addEventListener("mousedown", this.mouseDown.bind(this));
    this.resizeDiv.addEventListener("mousedown", this.resizeDown.bind(this));
  }

  setZIndex(value) {
    this.div.style.zIndex = value;
    this.stickyNote.update(zIndex, value);
  }



  removeDiv() {
    this.whiteBoard.removeChild(this.div);
  }

  resizeDown(event) {
    //console.log("resizeDown")
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
      //console.log("resizeUp")
      sticky.update(noteHeight, resH)
      sticky.update(noteWidth, resW)
      document.removeEventListener("mouseup", resizeUp);
      document.removeEventListener("mousemove", resizeMove);
    }

    function resizeMove(event) {
      //console.log("resizeMove")
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
    //console.log("mouseDown")
    let div = this.div;
    let posX = event.clientX;
    let posY = event.clientY;
    document.addEventListener("mouseup", mouseUp)
    document.addEventListener("mousemove", mouseMove);

    function mouseUp() {
      document.removeEventListener("mouseup", mouseUp)
      document.removeEventListener("mousemove", mouseMove);
      //console.log("mouseUp")
    }

    function mouseMove(event) {
      let resX = posX - event.clientX;
      let resY = posY - event.clientY;
      posX = event.clientX;
      posY = event.clientY;

      div.style.top = (div.offsetTop - resY) + "px";
      div.style.left = (div.offsetLeft - resX) + "px";

    }
  }


  removeMe() {
    console.log("removeMe");
    let rEvent = new CustomEvent("removeMe", {
      detail: {
        uid: this.stickyNote.uid
      }
    });

    this.whiteBoard.dispatchEvent(rEvent);
  }
}

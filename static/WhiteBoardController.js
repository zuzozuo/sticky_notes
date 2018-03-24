class WhiteBoardController {
  constructor() {
    this.whiteBoard = document.getElementById("whiteBoard");
    this.button = document.getElementById("addNote");
    this.amountOfNotes = document.getElementById("amount");
    this.listOfNotes = [];
    this.allNotes = 0;

  }

  run() {
    this.button.addEventListener("click", this.addNewSticky.bind(this))
    this.whiteBoard.addEventListener("removeMe", this.removeSticky.bind(this));
    this.whiteBoard.addEventListener("setActive", this.changeActiveSticky.bind(
      this));
    this.whiteBoard.addEventListener("setTextEditor", this.getTextEditor.bind(
      this));
    document.getElementById("toConfirm").addEventListener("click", this.changeText
      .bind(this))
    this.updateAmount();

  }

  getTextEditor(event) {
    document.getElementById("tinyMCE").style.display = "block";
    document.getElementById("tinyMCE").dataset.uid = event.detail.uid;
    tinymce.activeEditor.setContent(event.detail.text);
  }

  changeText() {
    let attrib = document.getElementById("tinyMCE").dataset.uid
    for (let i = 0; i < this.listOfNotes.length; i++) {
      if (this.listOfNotes[i].stickyNote.uid == attrib) {
        let text = tinymce.activeEditor.getContent();
        this.listOfNotes[i].updateText(text);
      }
    }

    document.getElementById("tinyMCE").style.display = "none";
  }


  addNewSticky() {
    let newSticky = new Note(100, 100, this.listOfNotes.length, 200, 200,
      this.allNotes, "NEW NOTE   " + this.listOfNotes.length);
    let newController = new NoteController(newSticky, this.whiteBoard);
    this.listOfNotes.push(newController);
    newController.showDiv();
    this.allNotes += 1;
    this.updateAmount();
  }

  removeSticky(event) {
    for (let i = 0; i < this.listOfNotes.length; i++) {
      if (this.listOfNotes[i].stickyNote.uid == event.detail.uid) {
        let oldZIndex = this.listOfNotes[i].getZIndex();
        this.listOfNotes[i].removeDiv();
        this.listOfNotes.splice(i, 1)

        for (let k = 0; k < this.listOfNotes.length; k++) {
          if (oldZIndex < this.listOfNotes[k].getZIndex()) {
            let newZIndex = this.listOfNotes[k].getZIndex() - 1;
            this.listOfNotes[k].setZIndex(newZIndex);
          }
        }

        this.updateAmount();
        break;
      }
    }
  }

  changeActiveSticky(event) {
    console.log("Odebralem A");
    for (let i = 0; i < this.listOfNotes.length; i++) {

      if (this.listOfNotes[i].stickyNote.uid == event.detail.uid) {

        let oldZIndex = this.listOfNotes[i].getZIndex();
        let newZIndex = this.listOfNotes.length;
        console.log(oldZIndex, newZIndex)
        this.listOfNotes[i].setZIndex(newZIndex)

        for (let j = 0; j < this.listOfNotes.length; j++) {
          if (oldZIndex < this.listOfNotes[j].getZIndex()) {
            newZIndex = this.listOfNotes[j].getZIndex() - 1;
            this.listOfNotes[j].setZIndex(newZIndex);
            this.listOfNotes[j].saveZIndex();
          }
        }
        break;
      }

    }

  }


  updateAmount() {
    this.amountOfNotes.innerHTML = "Przebieg: " + this.allNotes + "<br>" +
      "Na tablicy: " + this.listOfNotes.length;
  }


}

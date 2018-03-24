class WhiteBoardController {
  constructor() {
    this.whiteBoard = document.getElementById("whiteBoard");
    this.button = document.getElementById("addNote");
    this.amountOfNotes = document.getElementById("amount");
    this.listOfNotes = [];
    this.allNotes = 0;
  }

  run() {
    //console.log("Biegnij")
    this.button.addEventListener("click", this.addNewSticky.bind(this))
    this.whiteBoard.addEventListener("removeMe", this.removeSticky.bind(this));
    //this.whiteBoard.addEventListener("setActive", this.changeActiveSticky.bind(
    //  this));
    this.updateAmount();
  }

  addNewSticky() {
    let newSticky = new Note(100, 100, this.listOfNotes.length, 200, 200,
      this.allNotes);
    let newController = new NoteController(newSticky, this.whiteBoard);
    this.listOfNotes.push(newController);
    newController.showDiv();
    this.allNotes += 1;
    this.updateAmount();
    //console.log(this.listOfNotes);
  }

  removeSticky(event) {
    //console.log(event)
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
        /*for (let j = 0; j < this.listOfNotes.length; j++) {
          this.listOfNotes[j].setZIndex(j);
        }*/
        break;
      }
    }
  }

  /*changeActiveSticky(event) {
    console.log("Odebralem A");
    for (let i = 0; i < this.listOfNotes.length; i++) {

      if (this.listOfNotes[i].stickyNote.uid == event.detail.uid) {

        let oldZIndex = this.listOfNotes[i].getZIndex();
        let newZIndex = this.listOfNotes.length;

        this.listOfNotes[i].setZIndex(newZIndex)

        for (let j = 0; j < this.listOfNotes.length; j++) {
          if (oldZIndex < this.listOfNotes[j].getZIndex()) {
            newZIndex = this.listOfNotes[j].getZIndex() - 1;
            this.listOfNotes[j].setZIndex(newZIndex);
          }
        }
        this.changeColor();
        break;
      }
    }

  }

  changeColor() {
    for (let i = 0; i < this.listOfNotes.length; i++) {
      if (this.listOfNotes[i].getZIndex() == this.listOfNotes.length - 1) {
        this.listOfNotes[i].setStyle("active")
      } else {
        this.listOfNotes[i].setStyle(" ");
      }
    }
  }*/

  updateAmount() {
    this.amountOfNotes.innerHTML = "Przebieg: " + this.allNotes + "<br>" +
      "Na tablicy: " + this.listOfNotes.length;
  }


}

class WhiteBoardController {
  constructor() {
    this.whiteBoard = document.getElementById("whiteBoard");
    this.button = document.getElementById("addNote");
    this.amountOfNotes = document.getElementById("amount");
    this.listOfNotes = [];
    this.allNotes = 0;
  }

  run() {
    console.log("Biegnij")
    this.button.addEventListener("click", this.addNewSticky.bind(this))
    this.whiteBoard.addEventListener("removeMe", this.removeSticky.bind(this));
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
    console.log(event)
    for (let i = 0; i < this.listOfNotes.length; i++) {
      if (this.listOfNotes[i].stickyNote.uid == event.detail.uid) {
        this.listOfNotes[i].removeDiv();
        console.log(this.listOfNotes.length)
        this.listOfNotes.splice(i, 1)
        this.updateAmount();

        for (let j = 0; j < this.listOfNotes.length; j++) {
          this.listOfNotes[j].setZIndex(j);
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

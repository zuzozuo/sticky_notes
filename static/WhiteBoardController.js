class WhiteBoardController {
  constructor() {
    this.whiteBoard = document.getElementById("whiteBoard");
    this.button = document.getElementById("addNote");
    this.amountOfNotes = document.getElementById("amount");
    this.listOfNotes = [];
    this.allNotes = 0;

  }

  run() {
    let that = this;
    let xhttp = new XMLHttpRequest();
    xhttp.onreadystatechange = function() {
      if (this.readyState == 4 && this.status == 200) {
        var recivedData = JSON.parse(this.responseText)
        if (recivedData.length > 0) {
          for (let i = 0; i < recivedData.length; i++) {
            var newSticky = new Note(recivedData[i].positionX, recivedData[
                i].positionY,
              recivedData[i].z, recivedData[i].width, recivedData[i].height,
              recivedData[i].text, recivedData[i]._id);
            console.log(newSticky)
            var newController = new NoteController(newSticky, that.whiteBoard);
            that.listOfNotes.push(newController);
            newController.showDiv();
            that.allNotes += 1;
            that.updateAmount();
          }
        }
      }
    };
    xhttp.open("GET", "ajax", true);
    xhttp.setRequestHeader("Content-type",
      "text/plain");
    xhttp.send();



    this.button.addEventListener("click", this.addNewSticky.bind(this))
    this.whiteBoard.addEventListener("removeMe", this.removeSticky.bind(this));
    this.whiteBoard.addEventListener("setActive", this.changeActiveSticky.bind(
      this));
    this.whiteBoard.addEventListener("setTextEditor", this.getTextEditor.bind(
      this));
    document.getElementById("toConfirm").addEventListener("click", this.changeText
      .bind(this));
    document.getElementById("toCancel").addEventListener("click", this.cancelEdition
      .bind(this));
    this.updateAmount();
  }

  cancelEdition() {
    document.getElementById("tinyMCE").style.display = "none";
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
    let newSticky = new Note(0, 0, this.listOfNotes.length, 200, 200,
      "NEW NOTE   " + this.listOfNotes.length, " ");
    newSticky.create(() => {
      let newController = new NoteController(newSticky, this.whiteBoard);
      this.listOfNotes.push(newController);
      newController.showDiv();
      this.allNotes += 1;
      this.updateAmount();
    });
  }

  removeFromDB(uid) {
    let that = this;
    let obj = {
      uid: uid
    }
    let xhttp = new XMLHttpRequest();
    xhttp.onreadystatechange = function() {
      if (this.readyState == 4 && this.status == 200) {
        console.log("Usunieto")
      }
    };
    xhttp.open("DELETE", "ajax", true);
    xhttp.setRequestHeader("Content-type",
      "text/plain");
    xhttp.send(JSON.stringify(obj));
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
        this.removeFromDB(event.detail.uid)
        this.updateAmount();
        break;
      }
    }
  }

  changeActiveSticky(event) {
    //console.log("Odebralem A");
    //console.log(event.detail.uid)
    for (let i = 0; i < this.listOfNotes.length; i++) {

      if (this.listOfNotes[i].stickyNote.uid == event.detail.uid) {

        let oldZIndex = this.listOfNotes[i].getZIndex();
        let newZIndex = this.listOfNotes.length;
        //console.log(oldZIndex, newZIndex)
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

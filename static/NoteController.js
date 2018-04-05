class NoteController {
	constructor(stickyNote, whiteBoard) {
		this.stickyNote = stickyNote;
		this.whiteBoard = whiteBoard;
		this.div = null;
		this.resizeDiv = null;
		this.noteArea = null;
		this.removeSticky = null;

	}

	showDiv() { //odpowiada za wszystko to, co jest w pokazywanej karteczce

		tinymce.init({
			selector: '#toWrite',
			height: 120,
			resize: false
		}); //podpiecie tinyMCE

		this.div = document.createElement("div");
		this.div.className = "stickyNote";
		this.div.style.height = this.stickyNote.height + "px";
		this.div.style.width = this.stickyNote.width + "px";
		this.div.style.left = this.stickyNote.x + "px";
		this.div.style.top = this.stickyNote.y + "px";
		this.div.style.zIndex = this.stickyNote.z;

		this.resizeDiv = document.createElement("div"); //ikona resize'u
		this.resizeDiv.className = "resizeIcon";

		this.noteArea = document.createElement("div"); //obszar wpisywania teskstu
		this.noteArea.className = "noteArea";
		this.noteArea.innerHTML = this.stickyNote.text;

		this.removeSticky = document.createElement("div"); //ikona usuwania
		this.removeSticky.className = "removeSticky";

		this.textEditor = document.createElement("div"); //ikona dodawania tekstu
		this.textEditor.className = "textEditor";

		this.div.appendChild(this.removeSticky);
		this.div.appendChild(this.noteArea);
		this.div.appendChild(this.resizeDiv);
		this.div.appendChild(this.textEditor);
		this.whiteBoard.appendChild(this.div);

		this.div.addEventListener("mousedown", this.mouseDown.bind(this)); //podpiecie listenerow
		this.resizeDiv.addEventListener("mousedown", this.resizeDown.bind(this));
		this.div.addEventListener("mousedown", this.setActive.bind(this));
		this.removeSticky.addEventListener("mousedown", this.removeMe.bind(this));
		this.textEditor.addEventListener("mousedown", this.setTextEditor.bind(
			this));
	}

	setZIndex(value) { //ustawienie i aktualizacja zIndexu
		this.div.style.zIndex = value;
		this.stickyNote.update(zIndex, value);
	}

	saveZIndex() { //zapisanie zIndexu do bay
		this.stickyNote.save([zIndex])
	}

	getZIndex() { // pobraznie zIndexu
		return this.stickyNote.z;
	}

	removeDiv() {
		this.whiteBoard.removeChild(this.div);
	}

	resizeDown(event) { //fukcja resize'u - po nacisnieciu
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

		function resizeUp() { //po puszczeniu klika na ikone resizeu
			//console.log("resizeUp")
			if (resH > 0 && resW > 0) { //minimalna wysokosc/szerokosc
				sticky.update(noteHeight, resH)
				sticky.update(noteWidth, resW)

				sticky.save([noteHeight, noteWidth]) // zapisanie zmienionych wlasciwosci do bazy
			}
			document.removeEventListener("mouseup", resizeUp);
			document.removeEventListener("mousemove", resizeMove);
		}

		function resizeMove(event) { //zmiana wielkosci po przystrzymaniu i resizowaniu
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

	mouseDown(event) { //ruszanie - mouseDownvent
		//console.log("mouseDown")
		let sticky = this.stickyNote;
		let div = this.div;
		let posX = event.clientX;
		let posY = event.clientY;
		let finalPosX = 0;
		let finalPosY = 0;
		div.className = "active stickyNote"; // dodanie flagi aktywnej
		document.addEventListener("mouseup", mouseUp)
		document.addEventListener("mousemove", mouseMove);

		function mouseUp() { // usuniecie listenerow i aktualizacja danych + zapisanie do bazy
			document.removeEventListener("mouseup", mouseUp)
			document.removeEventListener("mousemove", mouseMove);
			div.className = "stickyNote";
			//this.stickyNote.update(note)

			if (finalPosX > 0 && finalPosY > 0) {
				sticky.update(noteX, finalPosX);
				sticky.update(noteY, finalPosY);
				sticky.save([noteX, noteY]);
			}


			//console.log("mouseUp")
		}

		function mouseMove(event) { //zmiana pozycji
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


	removeMe(event) { //usuwanie
		//console.log("removeMe");
		event.stopPropagation();
		let rEvent = new CustomEvent("removeMe", { //utworzenie wlasnego eventu i przekazanie w nim uidu karteczki do klasy whiteboard
			detail: {
				uid: this.stickyNote.uid
			}
		});

		this.whiteBoard.dispatchEvent(rEvent);
	}

	setActive() { //ustawianie flagi aktywnej  i wyslanie eventu do whiteBoarda
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

	setTextEditor() { //event do uruchomienia edytora tekstu przekazanie go do whiteBOarda
		//console.log("Editor");
		let eEvent = new CustomEvent("setTextEditor", {
			detail: {
				uid: this.stickyNote.uid,
				text: this.stickyNote.text
			}
		});

		this.whiteBoard.dispatchEvent(eEvent);
	}

	updateText(text) { //update tekstu w karteczce i zapisanie go do bazy
		this.stickyNote.update(newText, text);
		this.stickyNote.save([newText]);
		this.noteArea.innerHTML = this.stickyNote.text;
	}

}
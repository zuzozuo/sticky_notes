var saveNickBtn = document.getElementById('sendNick');

saveNickBtn.addEventListener('click', sendNick());

function sendNick() {
	let nick = document.getElementById('nick').value;
	console.log(nick);
	console.log("Cos");
}

console.log(nick);
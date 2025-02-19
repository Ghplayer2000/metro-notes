const popup = document.getElementById('popup');
const overlay = document.getElementById('overlay');
const deleteLink = document.getElementById('deleteLink');
const topHeader = document.getElementById('top');
const newNoteButton = document.getElementById('newNoteButton');
const aboutButton = document.getElementById('aboutButton');
const notesContainer = document.getElementById('notesContainer');
const pageTitle = document.getElementById('pageTitle');
const appName = document.getElementById('appName');
const appbar = document.getElementById('appbar');
const darkbtn = document.getElementById('darkbtn');
const appmes = document.getElementById('appmes');

let selectedNote;
let timer;

showNotes();

window.setTimeout(() => {
	notesContainer.classList.remove('dx');
	pageTitle.classList.remove('dx');
	appName.classList.remove('d');
	appName.style = "opacity: 1";
}, 600);

function showNotes() {
	let notesHTML = '';
	let notes = localStorage.getItem('notes');
	if (notes === null) {
		return;
	} else {
		notes = JSON.parse(notes);
	}
	for (let i = 0; i < notes.length; i++) {
		notesHTML += `<div class="note" data-index="${i}">
		<img id="img" src="svg/file.svg" alt="Note Icon"/>
		<span><p style="font-size: 38px;">${notes[i].title === "" ? 'Note': notes[i].title}</p></span>
		</div>
		`;
	}
	notesContainer.innerHTML = notesHTML;

	const noteElements = document.querySelectorAll('.note');
	noteElements.forEach(noteElement => {
		noteElement.addEventListener('click', openEditor);

		noteElement.addEventListener('touchstart', (event) => {
			event.preventDefault();
			timer = setTimeout(() => {
				selectedNote = event.target.closest('.note');
				selectedNote.classList.add('selected');
				showPopup(selectedNote);
			}, 500);
		});

		noteElement.addEventListener('touchend', (event) => {
			clearTimeout(timer);
			if (!popup.classList.contains('active')) {
				openEditor(event);
			}
		});
	});
}

deleteLink.addEventListener('click', () => {
	if (selectedNote) {
		deleteNote(selectedNote.dataset.index);
		hidePopup();
	}
});

overlay.addEventListener('click', hidePopup);

function showPopup(note) {
	const rect = note.getBoundingClientRect();
	popup.style.top = rect.bottom + 'px';
	popup.style.display = 'block';
	popup.classList.add('active');
	overlay.classList.add('active');

	const dimmedElements = document.querySelectorAll('.note:not(.selected), #top');
	dimmedElements.forEach(element => {
		element.classList.remove('dimmedRestore');
		element.classList.add('dimmed');
	});

	newNoteButton.classList.remove('dimmedRestore');
	aboutButton.classList.remove('dimmedRestore');
	darkbtn.classList.remove('dimmedRestore');
	topHeader.classList.add('dimmed');
	newNoteButton.classList.add('dimmed');
	aboutButton.classList.add('dimmed');
	darkbtn.classList.add('dimmed');

	overlay.style.pointerEvents = 'auto';
}

function hidePopup() {
	popup.style.display = 'none';
	popup.classList.remove('active');
	overlay.classList.remove('active');
	overlay.style.pointerEvents = 'none';

	if (selectedNote) {
		selectedNote.classList.remove('selected');
		selectedNote = null;
	}

	const dimmedElements = document.querySelectorAll('.note:not(.selected), #top, #newNoteButton, #aboutButton, #darkbtn');
	dimmedElements.forEach(element => {
		element.classList.remove('dimmed');
		element.classList.add('dimmedRestore');
	});
}

function deleteNote(index) {
	let notes = localStorage.getItem('notes');
	if (notes === null) {
		return;
	} else {
		notes = JSON.parse(notes);
	}
	notes.splice(index, 1);
	localStorage.setItem('notes', JSON.stringify(notes));
	showNotes();
}

function openEditor(event) {
	appName.classList.remove('d');
	pageTitle.classList.remove('dx');
	notesContainer.classList.remove('dx');
	
	const noteIndex = event.target.closest('.note').dataset.index;
	notesContainer.classList.add('moveToLeft');
	pageTitle.classList.add('moveToLeft');
	appName.classList.remove('fadeIn');
	appName.style.opacity = 1;
	appName.classList.add('fadeOutAndMove');
	pageTitle.classList.add('fadeOut');
	notesContainer.classList.add('fadeOut');
	event.target.closest('.note').classList.remove('dimmedRestore');
	event.target.closest('.note').classList.add('titleAnimation');
	appbar.classList.remove('appbaranim');
	appbar.classList.add('appbaranim2');

	window.setTimeout(() => {
		window.location.href = `editor.html?index=${noteIndex}`, '_blank';
	}, 500);
}

let theme = localStorage.getItem('theme') || 'light';

function sendColorToNative(theme) {
	if (window.hasOwnProperty('InterfaceAndroid')) {
		InterfaceAndroid.changeColor(theme);
	}
}

function applyTheme(theme) {
	const img = document.getElementById('img');
	let mainEls = document.querySelectorAll('#top, #notesContainer');
	if (theme === 'dark') {
		document.body.classList.add('darktheme');
		mainEls.forEach(el => el.classList.add('darktheme'));
		appbar.classList.add('dthemeabar');
		newNoteButton.classList.add('dthemeabutton');
		aboutButton.classList.add('dthemeabutton');
		darkbtn.classList.add('dthemeabutton');
		popup.classList.add('dpopup');
		document.getElementById('dark').src = "svg/sun.svg";
		if (localStorage.getItem('first') !== false) {
        window.postMessage('themeChanged', '*'); }
	} else {
		document.body.classList.remove('darktheme');
		mainEls.forEach(el => el.classList.remove('darktheme'));
		appbar.classList.remove('dthemeabar');
		newNoteButton.classList.remove('dthemeabutton');
		aboutButton.classList.remove('dthemeabutton');
		darkbtn.classList.remove('dthemeabutton');
		popup.classList.remove('dpopup');
		document.getElementById('dark').src = "svg/moon.svg";
	}
	sendColorToNative(theme);
	localStorage.setItem('first', false);
}

function darkMode() {
	theme = theme === 'dark' ? 'light': 'dark';
	localStorage.setItem('theme', theme);
	applyTheme(theme);
}

const savedTheme = localStorage.getItem('theme');
if (savedTheme) {
	applyTheme(savedTheme);
}

function openAbout() {
	appName.classList.remove('d');
	pageTitle.classList.remove('dx');
	notesContainer.classList.remove('dx');
	
	notesContainer.classList.add('moveToLeft');
	pageTitle.classList.add('moveToLeft');
	appName.classList.remove('fadeIn');
	appName.classList.add('fadeOutAndMove');
	pageTitle.classList.add('fadeOut');
	notesContainer.classList.add('fadeOut');
	appbar.classList.remove('appbaranim');
	appbar.classList.add('appbaranim2');

	window.setTimeout(() => {
		window.location.href = `about.html`;
	}, 500);
}

function openNew() {
	appName.classList.remove('d');
	pageTitle.classList.remove('dx');
	notesContainer.classList.remove('dx');
	
	notesContainer.classList.add('moveToLeft');
	pageTitle.classList.add('moveToLeft');
	appName.classList.remove('d');
	appName.classList.add('fadeOutAndMove');
	pageTitle.classList.add('fadeOut');
	notesContainer.classList.add('fadeOut');
	appbar.classList.remove('appbaranim');
	appbar.classList.add('appbaranim2');

	window.setTimeout(() => {
		window.location.href = `new.html`;
	}, 500);
}

window.setTimeout(() => {
	appName.style.opacity = 1;
}, 500);
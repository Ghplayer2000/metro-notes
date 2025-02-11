const addTitle = document.getElementById('addTitle');
const addText = document.getElementById('addText');
const addNoteButton = document.getElementById('addNote');
const notesDiv = document.getElementById('notes');

function addNotes() {
    let notes = localStorage.getItem('notes');
    if (notes === null) {
        notes = [];
    } else {
        notes = JSON.parse(notes);
    }

    if (addText.value === '') {
        alert('Add your note');
        return;
    }

    const noteTitle = addTitle.value;
    
    const existingNoteIndex = notes.findIndex(note => note.title === noteTitle);

    const noteObj = {
        title: noteTitle,
        text: addText.value,
    };

    if (existingNoteIndex !== -1) {
        
        notes[existingNoteIndex] = noteObj;
    } else {
        
        notes.push(noteObj);
    }

    localStorage.setItem('notes', JSON.stringify(notes));
}

addNoteButton.addEventListener('click', addNotes);
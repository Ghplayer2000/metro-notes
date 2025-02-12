const addTitle = document.getElementById('addTitle');
const addText = document.getElementById('addText');
const addNoteButton = document.getElementById('addNote');
const notesDiv = document.getElementById('notes');
const time = document.getElementById('time');

time.innerHTML = new Date().toLocaleString();

function addNotes() {
    let notes = localStorage.getItem('notes');
    if (notes === null) {
        notes = [];
    } else {
        notes = JSON.parse(notes);
    }

    if (addText.value === '') {
        alert('Note text cannot be empty :)');
        return;
    }

    const noteTitle = addTitle.value;
    
    const existingNoteIndex = notes.findIndex(note => note.title === noteTitle);

    const noteObj = {
        title: noteTitle,
        text: addText.value,
        timestamp: new Date().toLocaleString() // Adiciona o timestamp
    };

    if (existingNoteIndex !== -1) {
        
        notes[existingNoteIndex] = noteObj;
    } else {
        
        notes.push(noteObj);
    }

    localStorage.setItem('notes', JSON.stringify(notes));
    window.location.href = 'index.html';
    
}

addNoteButton.addEventListener('click', addNotes); 
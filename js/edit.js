const urlParams = new URLSearchParams(window.location.search);
const noteIndex = urlParams.get('index');
const editorTitle = document.getElementById('editorTitle'); // Novo campo de título
const editorContent = document.getElementById('editorContent');
const editorTime = document.getElementById('editorTime');

const notes = JSON.parse(localStorage.getItem('notes'));
const note = notes[noteIndex];

editorTitle.value = note.title || "";
editorContent.value = note.text || "";
editorTime.innerHTML = note.timestamp || "";

function saveNote() {
    note.title = editorTitle.value;
    note.text = editorContent.value;
    note.timestamp = new Date().toLocaleString()
    notes[noteIndex] = note;
    localStorage.setItem('notes', JSON.stringify(notes));
    window.location.href = 'index.html';
}


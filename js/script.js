document.addEventListener('DOMContentLoaded', function() {
    const addTitle = document.getElementById('addTitle');
    const addText = document.getElementById('addText');
    const addNoteButton = document.getElementById('addNote');
    const time = document.getElementById('time');

    time.innerHTML = new Date().toLocaleString();

    const quill = new Quill('#addText', {
        theme: 'snow',
        modules: {
            toolbar: [
                ['bold', 'italic', 'underline', 'image'],
                [{ 'list': 'ordered'}, { 'list': 'bullet' }]
            ]
        }
    });

    function addNotes() {
        let notes = localStorage.getItem('notes');
        if (notes === null) {
            notes = [];
        } else {
            notes = JSON.parse(notes);
        }

        const noteText = quill.root.innerHTML;

        if (noteText === '<p><br></p>') {
            alert('Note text cannot be empty :)');
            return;
        }

        const noteTitle = addTitle.value;

        const existingNoteIndex = notes.findIndex(note => note.title === noteTitle);

        const noteObj = {
            title: noteTitle,
            text: noteText,
            timestamp: new Date().toLocaleString()
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
    
    const theme = localStorage.getItem('theme');
    
    if (theme === 'dark') {
	document.body.classList.add('darktheme');
	document.getElementById('container').classList.add('darktheme');
	document.getElementById('appbar').classList.add('dthemeabar');
	document.getElementById('addNote').classList.add('dthemeabutton');
	document.querySelector('.ql-toolbar').classList.add('dql-toolbar');
	document.querySelector('.ql-editor').classList.add('dql-editor');
	document.querySelector('.ql-container').classList.add('dql-container');
}
});
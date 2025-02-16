document.addEventListener('DOMContentLoaded', function() {
    const urlParams = new URLSearchParams(window.location.search);
    const noteIndex = urlParams.get('index');
    const editorTitle = document.getElementById('editorTitle');
    const editorContent = document.getElementById('editorContent');
    const editorTime = document.getElementById('editorTime');
    const saveButton = document.getElementById('saveButton');

    const notes = JSON.parse(localStorage.getItem('notes'));
    const note = notes[noteIndex];

    const quill = new Quill('#editorContent', { // Inicializa o Quill *aqui*
        theme: 'snow',
        modules: {
            toolbar: [['bold', 'italic', 'underline', 'image'],
                [{ 'list': 'ordered'}, { 'list': 'bullet' }]]
        }
    });

    if (note) {
        editorTitle.value = note.title || "";
        editorTime.innerHTML = note.timestamp || "";
        quill.root.innerHTML = note.text;
    } else {
        console.error("Nota não encontrada!");
        window.location.href = 'index.html';
    }

    function saveNote() {
        note.title = editorTitle.value;
        note.text = quill.root.innerHTML;
        note.timestamp = new Date().toLocaleString();
        notes[noteIndex] = note;
        localStorage.setItem('notes', JSON.stringify(notes));
        window.location.href = 'index.html';
    }

    saveButton.addEventListener('click', saveNote);
}); // Fim do DOMContentLoaded

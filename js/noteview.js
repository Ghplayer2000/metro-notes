const notesDiv = document.getElementById('notes');

showNotes();

function showNotes(){
    let notesHTML = '';
    let notes = localStorage.getItem('notes');
    if(notes === null){
        return;
    }else{
        notes = JSON.parse(notes);
    }
    for(let i=0; i<notes.length; i++){
        notesHTML += `<div class="note" data-index="${i}">
                    <img src="svg/file.svg"/>
                    <button class="deleteNote" id=${i} onclick="deleteNote(${i})">Delete</button>
                    <span class="title"><p style="font-size: 38px;">${notes[i].title === "" ? 'Note' : notes[i].title}</p></span>
                </div>
        `;
    }
    notesDiv.innerHTML = notesHTML;

    const noteElements = document.querySelectorAll('.title');
    noteElements.forEach(noteElement => {
        noteElement.addEventListener('click', openEditor);
    });
}

function deleteNote(ind){
    let notes = localStorage.getItem('notes');
    if(notes === null){
        return;
    }else{
        notes = JSON.parse(notes);
    }
    notes.splice(ind, 1);
    localStorage.setItem('notes', JSON.stringify(notes));
    showNotes();
}

function openEditor(event) {
    const noteIndex = event.target.closest('.note').dataset.index;
    window.location.href = `editor.html?index=${noteIndex}`, '_blank';
}

const notesDiv = document.getElementById('notes');
const title = document.getElementById('title');
const name = document.getElementById('name');

showNotes();

if (history.length > 1) {
  notesDiv.classList.add('from');
  title.classList.add('from');
  name.classList.add('from');
  name.classList.add('d');
  window.setTimeout(() => {
        notesDiv.classList.remove('from');
        title.classList.remove('from');
        name.classList.remove('from');
        name.classList.remove('d');
    }, 600);
}


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
    notesDiv.classList.add('to');
    title.classList.add('to');
    name.classList.add('to');
    name.classList.add('d');
  
    window.setTimeout(() => {
        window.location.href = `editor.html?index=${noteIndex}`, '_blank';
    }, 500);
}
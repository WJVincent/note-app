import {
  addNote,
  updateNote,
  getNoteById,
  getNoteByTag,
  parseNote,
  getAllNotes,
  getAllTags,
  getAllNotesFromTagList
} from "./db-actions.js";

const MONTHS = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

const textContent = document.getElementById("content");
const addNoteButton = document.getElementById("submit-note");
const noteList = document.getElementById("note-list");
const newNoteButton = document.getElementById("create-new");
const filterInput = document.getElementById("filter-notes-input");
const allNotesButton = document.getElementById("all-notes-button");
const tagList = document.getElementById("tag-list");
const modalCloseButton = document.getElementById("modal-close");
const modal = document.getElementById("help-dialog")

const populateNoteList = async (list) => {
  noteList.innerHTML = "";

  for (let i = 0; i < list.length; i++) {
    const note = list[i];
    const li = document.createElement("li");
    const titleSpan = document.createElement("span");
    const updatedDateSpan = document.createElement("span");
    const month = MONTHS[note.updatedAt.getMonth()];
    const day = note.updatedAt.getDate();
    const year = note.updatedAt.getFullYear();

    updatedDateSpan.innerText = `${month} ${day} ${year}`;
    titleSpan.innerText = note.title;
    li.dataset.id = note.id;

    li.setAttribute("class", "note-li");
    li.append(titleSpan);
    li.append(updatedDateSpan);

    li.addEventListener("click", async () => {
      const note = await getNoteById(li.dataset.id);
      textContent.value = note.content;
      textContent.dataset.shouldUpdate = true;
      textContent.dataset.id = li.dataset.id;
    });

    noteList.appendChild(li);
  }
};

const populateTagList = (list) => {
  tagList.innerHTML = "";
  list.forEach(el => {
    const option = document.createElement('option');
    option.value = el;
    tagList.appendChild(option);
  })
}

addNoteButton.addEventListener("click", async () => {
  const content = textContent.value;
  if (!content) return;

  const shouldUpdate = textContent.dataset.shouldUpdate;
  const { headerVal, tagValues } = parseNote(content);

  if (shouldUpdate === "true") {
    await updateNote(textContent.dataset.id, {
      content,
      title: headerVal,
      tags: tagValues,
    });
  } else {
    await addNote(content, tagValues, headerVal);
  }
  const allNotes = await getAllNotes();
  await populateNoteList(allNotes);
});

newNoteButton.addEventListener("click", () => {
  filterInput.value = "";
  textContent.value = "";
  textContent.dataset.shouldUpdate = false;
});

filterInput.addEventListener("input", async (e) => {
  const searchInput = filterInput.value;
  const tags = await getAllTags(searchInput);
  const notes = await getAllNotesFromTagList(tags);
  populateTagList(tags);
  populateNoteList(notes);
})

allNotesButton.addEventListener("click", async () => {
  filterInput.value = "";
  textContent.value = "";
  const allNotes = await getAllNotes();
  populateNoteList(allNotes);
});

modalCloseButton.addEventListener('click', () => {
  modal.close();
})

document.addEventListener("DOMContentLoaded", async () => {
  textContent.dataset.shouldUpdate = false;
  const allNotes = await getAllNotes();
  const tags = await getAllTags();
  await populateNoteList(allNotes);
  populateTagList(tags);
});

document.onkeydown = async (e) => {
  if (e.key === '?' && e.ctrlKey === true && e.altKey === true) {
    console.log(modal.open);
   if(modal.open){
     modal.close();
   } else {
     modal.showModal();
   }
  } else if (e.key === 'n' && e.ctrlKey === true && e.altKey === true) {
    filterInput.value = "";
    textContent.value = "";
    textContent.dataset.shouldUpdate = false;
  } else if (e.key === 'a' && e.ctrlKey === true && e.altKey === true) {
    filterInput.value = "";
    textContent.value = "";
    const allNotes = await getAllNotes();
    populateNoteList(allNotes);
  }
}

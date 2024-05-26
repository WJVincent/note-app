const db = new Dexie("notes-db");
const textContent = document.getElementById("content");
const contentSubmitButton = document.getElementById("submit-note");
const searchButton = document.getElementById("search");
const noteList = document.getElementById("note-list");

db.version(1).stores({
    notes: "++id, *tags, title, content, createdAt, updatedAt",
});

const addItem = (content, tags, title) => {
    // title -> parsed from # header lines
    // tags -> parsed from [tags]:- tagName
    const timestamp = new Date();
    db.notes.add({ title, content, tags, createdAt: timestamp, updatedAt: timestamp });
};

const getItemById = async (id) => {
    const note = await db.notes.get(+id);
    return note;
}

const getItemByTag = (tag) => {
    db.notes
        .where("tags")
        .equals(tag)
        .toArray()
        .then((res) => console.log(res));
};

const getAll = async () => await db.notes.toArray();

const populateNoteList = async () => {
    const allNotes = await getAll();

    allNotes.forEach(note => {
        const li = document.createElement('li');
        li.innerText = note.title;
        li.dataset.id = note.id;
        li.addEventListener('click', async () => {
            const note = await getItemById(li.dataset.id);
            console.log(note);
            textContent.innerHTML = note.content;
        })
        noteList.appendChild(li);
    })
}

contentSubmitButton.addEventListener("click", async() => {
    const content = textContent.value;
    const splitLines = content.split("\n");

    const headerLine = splitLines.find(el => el.startsWith("# "));
    const headerVal = headerLine.split(" ")[1];

    const tagLines = splitLines.filter((el) => el.startsWith("[tag]"));
    const tagValues = tagLines.map((el) => el.split(" ")[1]);

   addItem(content, tagValues, headerVal);
   await populateNoteList();
});

document.addEventListener("DOMContentLoaded", async () => {
   await populateNoteList();
})

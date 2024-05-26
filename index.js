const db = new Dexie("notes-db");
const textContent = document.getElementById("content");
const addNoteButton = document.getElementById("submit-note");
const searchButton = document.getElementById("search");
const noteList = document.getElementById("note-list");
const newNoteButton = document.getElementById("create-new");

db.version(1).stores({
  notes: "++id, *tags, title, content, createdAt, updatedAt",
});

const addItem = async (content, tags, title) => {
  // title -> parsed from # header lines
  // tags -> parsed from [tags]:- tagName
  const timestamp = new Date();
  await db.notes.add({
    title,
    content,
    tags,
    createdAt: timestamp,
    updatedAt: timestamp,
  });
};

const updateItem = async (id, changes) => {
  const opts = {};

  if (changes.content) opts.content = changes.content;
  if (changes.title) opts.title = changes.title;
  if (changes.tags) opts.tags = changes.tags;

  await db.notes.update(id, {
    ...opts,
    updatedAt: new Date(),
  });
};

const getItemById = async (id) => {
  const note = await db.notes.get(+id);
  return note;
};

const getItemByTag = (tag) => {
  db.notes
    .where("tags")
    .equals(tag)
    .toArray()
    .then((res) => console.log(res));
};

const getAll = async () => await db.notes.toArray();

const parseNote = (input) => {
  const splitLines = input.split("\n");

  const headerLine = splitLines.find((el) => el.startsWith("# "));
  const headerVal = headerLine ? headerLine.split(" ").slice(1).join(' ') : false;

  const tagLines = splitLines.filter(
    (el) => el.startsWith("[tag]") || el.startsWith("[tags]"),
  );
  const tagValues = tagLines.reduce((out, el) => [...out, ...el.split(" ").slice(1)], []);

  return { headerVal, tagValues };
};

const populateNoteList = async () => {
  const allNotes = await getAll();
  // noteList.innerHTML = "";
  Array.from(noteList.children).forEach((el) => el.remove());

  for (let i = 0; i < allNotes.length; i++) {
    const note = allNotes[i];
    const li = document.createElement("li");
    li.innerText = note.title;
    li.dataset.id = note.id;

    li.addEventListener("click", async () => {
      const note = await getItemById(li.dataset.id);
      console.log({ oldContent: textContent.innerHTML, note});
      textContent.value = note.content;
      textContent.dataset.shouldUpdate = true;
    });
    noteList.appendChild(li);
  }
};

addNoteButton.addEventListener("click", async () => {
  const content = textContent.value;
  if (!content) return;

  const shouldUpdate = textContent.dataset.shouldUpdate;
  const { headerVal, tagValues } = parseNote(content);

  if (shouldUpdate === "true") {
    console.log('eventually will run update func');
  } else {
    await addItem(content, tagValues, headerVal);
  }
  await populateNoteList();
});

newNoteButton.addEventListener("click", () => {
  textContent.value = "";
  textContent.dataset.shouldUpdate = false;
});

document.addEventListener("DOMContentLoaded", async () => {
  textContent.dataset.shouldUpdate = false;
  await populateNoteList();
});



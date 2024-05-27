const db = new Dexie("notes-db");
const textContent = document.getElementById("content");
const addNoteButton = document.getElementById("submit-note");
const searchButton = document.getElementById("search");
const noteList = document.getElementById("note-list");
const newNoteButton = document.getElementById("create-new");
const filterButton = document.getElementById("filter-notes-button");

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
  const prevNote = await getItemById(id);
  prevNote.updatedAt = new Date();
  prevNote.title = changes.title;
  prevNote.content = changes.content;
  prevNote.tags = changes.tags;

  await db.notes.put(prevNote);
};

const getItemById = async (id) => {
  const note = await db.notes.get(+id);
  return note;
};

const getItemByTag = async (tag) =>
  await db.notes.where("tags").equals(tag).toArray();

const getAll = async () => await db.notes.toArray();

const parseNote = (input) => {
  const splitLines = input.split("\n");

  const headerLine = splitLines.find((el) => el.startsWith("# "));
  const headerVal = headerLine
    ? headerLine.split(" ").slice(1).join(" ")
    : false;

  const tagLines = splitLines.filter(
    (el) => el.startsWith("[tag]") || el.startsWith("[tags]"),
  );
  const tagValues = tagLines.reduce(
    (out, el) => [...out, ...el.split(" ").slice(1)],
    [],
  );

  return { headerVal, tagValues };
};

const populateNoteList = async (list) => {
  noteList.innerHTML = "";

  for (let i = 0; i < list.length; i++) {
    const note = list[i];
    const li = document.createElement("li");
    li.innerText = note.title;
    li.dataset.id = note.id;

    li.addEventListener("click", async () => {
      const note = await getItemById(li.dataset.id);
      textContent.value = note.content;
      textContent.dataset.shouldUpdate = true;
      textContent.dataset.id = li.dataset.id;
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
    await updateItem(textContent.dataset.id, {
      content,
      title: headerVal,
      tags: tagValues,
    });
  } else {
    await addItem(content, tagValues, headerVal);
  }
  const allNotes = await getAll();
  await populateNoteList(allNotes);
});

newNoteButton.addEventListener("click", () => {
  textContent.value = "";
  textContent.dataset.shouldUpdate = false;
});

filterButton.addEventListener("click", async () => {
  const list = await getItemByTag("linux");
  populateNoteList(list);
})

document.addEventListener("DOMContentLoaded", async () => {
  textContent.dataset.shouldUpdate = false;
  const allNotes = await getAll();
  await populateNoteList(allNotes);
});

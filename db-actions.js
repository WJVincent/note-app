const db = new Dexie("notes-db");

db.version(1).stores({
  notes: "++id, *tags, title, content, createdAt, updatedAt",
});

const addNote = async (content, tags, title) => {
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

const updateNote = async (id, changes) => {
  const prevNote = await getNoteById(id);
  prevNote.updatedAt = new Date();
  prevNote.title = changes.title;
  prevNote.content = changes.content;
  prevNote.tags = changes.tags;

  await db.notes.put(prevNote);
};

const getNoteById = async (id) => {
  const note = await db.notes.get(+id);
  return note;
};

const getNoteByTag = async (tag) =>
  await db.notes.where("tags").equals(tag).toArray();

const getAllNotes = async () => await db.notes.toArray();

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

const getAllTags = async (input) => {
  const tags = await db.notes.orderBy('tags').uniqueKeys();
  const filtered = tags.filter(el => el.startsWith(input || ""));
  return filtered;
};

const getAllNotesFromTagList = async (tagList) => {
    const notes = await db.notes.where("tags").anyOf(tagList).distinct().toArray();
    return notes;
}

export {
  addNote,
  updateNote,
  getNoteById,
  getNoteByTag,
  parseNote,
  getAllNotes,
  getAllTags,
  getAllNotesFromTagList
};

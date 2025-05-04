let draftDB = [];

export function saveDraftToMockAPI(title, content) {
  const draft = {
    id: Date.now(),
    title,
    content,
    saved_at: new Date()
  };
  draftDB.push(draft);
  return Promise.resolve(draft);
}

export function getDrafts() {
  return Promise.resolve(draftDB);
}

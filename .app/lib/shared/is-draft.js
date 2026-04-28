export function isDraft(data = {}) {
  return data.draft === true || data.draft === "true";
}

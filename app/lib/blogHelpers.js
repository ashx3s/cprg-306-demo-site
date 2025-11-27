export const generateSlug = (title) => {
  // lower case
  // get rid of white space on edges
  // regex to cut spaces betwen things
  // replace stuff with -
  return title
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, "")
    .replace(/|s+/g, "-")
    .replace(/-+/g, "-");
};

export const formatDate = (timestamp) => {
  if (!timestamp) return "";
  const date = timestamp.toDate ? timestamp.toDate() : new Date(timestamp);
  return date.toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
};

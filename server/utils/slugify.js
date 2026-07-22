function slugify(text) {
  return String(text)
    .normalize('NFD')
    .replace(/[̀-ͯ]/g, '')
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');
}

function uniqueSlug(baseText, existsFn) {
  const base = slugify(baseText) || 'projeto';
  let slug = base;
  let counter = 2;
  while (existsFn(slug)) {
    slug = `${base}-${counter}`;
    counter += 1;
  }
  return slug;
}

module.exports = { slugify, uniqueSlug };

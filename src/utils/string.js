function json2stringCompact(json) {
  return JSON.stringify(json, null, 2).slice(1, -1).replace(/\,/g, '');
}

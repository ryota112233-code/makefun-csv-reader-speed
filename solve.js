// Slice ordinary text in one piece; only escapes and discarded CRs need joins.
export function run(input) {
  const text = String(input.text);
  const header = input.header === true;
  const size = text.length;
  const rows = [];
  const errors = [];
  let columns = null;
  let width = -1;
  let pos = text.charCodeAt(0) === 0xfeff ? 1 : 0;
  let line = 1;

  while (pos < size) {
    // Empty physical lines do not start records.
    let c = text.charCodeAt(pos);
    if (c === 10) {
      ++pos;
      ++line;
      continue;
    }
    if (c === 13 && text.charCodeAt(pos + 1) === 10) {
      pos += 2;
      ++line;
      continue;
    }

    const recordLine = line;
    const recordRow = header && columns === null ? null : rows.length;
    const fields = [];
    let quoted;
    let more;
    do {
      quoted = text.charCodeAt(pos) === 34;
      let value = '';
      let junk = false;

      if (quoted) {
        const opening = pos;
        const openingLine = line;
        let start = ++pos;
        let closed = false;
        while (pos < size) {
          c = text.charCodeAt(pos);
          if (c === 34) {
            value += text.slice(start, pos);
            if (text.charCodeAt(pos + 1) === 34) {
              value += '"';
              pos += 2;
              start = pos;
              continue;
            }
            ++pos;
            closed = true;
            break;
          }
          if (c === 13) {
            value += text.slice(start, pos) + '\n';
            pos += text.charCodeAt(pos + 1) === 10 ? 2 : 1;
            ++line;
            start = pos;
            continue;
          }
          if (c === 10) ++line;
          ++pos;
        }
        if (closed) {
          junk = true;
        } else {
          // Reparse from the literal opening quote, restoring physical lines.
          errors.push({ code: 'unterminated_quote', line: recordLine, row: recordRow });
          pos = opening;
          line = openingLine;
          value = '';
        }
      }

      // This also consumes any unquoted suffix after a closing quote.
      let start = pos;
      let added = 0;
      while (pos < size) {
        c = text.charCodeAt(pos);
        if (c === 44 || c === 10) break;
        if (c === 13) {
          if (text.charCodeAt(pos + 1) === 10) break;
          added += pos - start;
          value += text.slice(start, pos);
          errors.push({ code: 'stray_cr', line: recordLine, row: recordRow });
          start = ++pos;
          continue;
        }
        ++pos;
      }
      added += pos - start;
      value += text.slice(start, pos);
      if (junk && added !== 0) {
        errors.push({ code: 'quote_junk', line: recordLine, row: recordRow });
      }
      fields.push(value);

      c = text.charCodeAt(pos);
      more = c === 44;
      if (more) {
        ++pos;
      } else if (c === 10) {
        ++pos;
        ++line;
      } else if (c === 13) {
        pos += 2; // The scan stops at CR only when followed by LF.
        ++line;
      }
    } while (more);

    // A record consisting entirely of discarded CRs is empty too.
    if (fields.length === 1 && fields[0] === '' && !quoted) continue;
    if (width === -1) width = fields.length;
    if (header && columns === null) {
      columns = fields;
    } else {
      const count = fields.length;
      if (count < width) {
        errors.push({ code: 'short_row', line: recordLine, row: recordRow, fields: count });
        while (fields.length < width) fields.push('');
      } else if (count > width) {
        errors.push({ code: 'long_row', line: recordLine, row: recordRow, extra: fields.slice(width) });
        fields.length = width;
      }
      rows.push(fields);
    }
  }
  return { columns: header ? (columns ?? []) : null, rows, errors };
}

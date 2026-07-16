"""Tighten sanitize pass on existing book.js without re-OCR."""
from __future__ import annotations

import json
import re
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
PATH = ROOT / 'src' / 'data' / 'book.js'

GU = re.compile(r'[\u0A80-\u0AFF]')
AR = re.compile(r'[\u0600-\u06FF\u0750-\u077F\u08A0-\u08FF\uFB50-\uFDFF\uFE70-\uFEFF]')
LATIN = re.compile(r'[A-Za-z]')
DIGITS = re.compile(r'[0-9૦-૯٠-٩]')
HEADER_RE = re.compile(
    r'^\s*(?:[\[\(]?\s*\d{1,3}\s*[\]\)]?\s*)?'
    r'હજ\s*અને\s*ઉમરા(?:ના)?\s*મસાઈલ'
    r'(?:\s*[\[\(]?\s*\d{1,3}\s*[\]\)]?)?\s*$'
)
PAGE_MARK_RE = re.compile(r'^---\s*PDF p\.\d+.*---\s*$', re.I)
JUNK_ONLY_RE = re.compile(r'^[\s\-–—_*=~.|;:\'\"~<>/@#$%^&+={}()[\]]+$')
FOOTER_RE = re.compile(r'^[\s—\-_–*oO0]+\s*$')


def counts(line: str):
    return len(GU.findall(line)), len(AR.findall(line)), len(LATIN.findall(line)), len(DIGITS.findall(line))


def is_noise(line: str) -> bool:
    s = line.strip()
    if not s:
        return False
    if PAGE_MARK_RE.match(s) or HEADER_RE.match(s) or FOOTER_RE.match(s) or JUNK_ONLY_RE.match(s):
        return True
    if re.search(r'હજ\s*અને\s*ઉમરા', s) and len(s) < 40 and '[' in s:
        return True
    gu, ar, la, di = counts(s)
    meaningful = gu + ar
    if meaningful == 0 and la >= 3:
        return True
    if meaningful == 0 and la + di > 0 and len(s) <= 8:
        return True
    if meaningful <= 2 and la >= 5:
        return True
    return False


def clean_line(line: str) -> str:
    gu, ar, la, di = counts(line)
    if ar >= 4 and ar >= gu:
        cleaned = ''.join(
            ch for ch in line
            if AR.match(ch) or DIGITS.match(ch) or ch.isspace()
            or ch in ".,;:!?\'\"“”‘’()-–—/،؛؟«»"
        )
        return re.sub(r'\s+', ' ', cleaned).strip()
    if gu or di or ar:
        kept = []
        for tok in line.split():
            tg, ta, tl, td = counts(tok)
            if tg or ta or td:
                kept.append(tok)
            elif not LATIN.search(tok) and len(tok) <= 3:
                kept.append(tok)
        return ' '.join(kept)
    return line


def sanitize(raw: str) -> str:
    out = []
    blank = 0
    for line in raw.splitlines():
        line = line.replace('\u200c', '').replace('\ufeff', '')
        line = re.sub(r'[ \t]+', ' ', line).strip()
        if not line:
            blank += 1
            if blank <= 1:
                out.append('')
            continue
        if is_noise(line):
            continue
        line = clean_line(line)
        if not line or is_noise(line):
            continue
        blank = 0
        out.append(line)
    text = '\n'.join(out).strip()
    text = re.sub(r'([^\s\-])-\n([^\s])', r'\1\2', text)
    text = re.sub(r'\n{3,}', '\n\n', text)
    text = (
        text.replace('(c)', '(૬)')
        .replace('(£)', '(૬)')
        .replace('(ce)', '(૬)')
        .replace('(2)', '(૨)')
    )
    return text.strip()


def main():
    src = PATH.read_text(encoding='utf-8')
    start = src.index('export const BOOK_SECTIONS = ') + len('export const BOOK_SECTIONS = ')
    arr = src[start:].strip()
    if arr.endswith(';'):
        arr = arr[:-1]
    sections = json.loads(arr)
    for section in sections:
        if section.get('text'):
            section['text'] = sanitize(section['text'])
            section['hasOcr'] = bool(section['text'])
        section.pop('pdfPages', None)

    header = """/** Sanitized book OCR for Hajj ane Umrah na Masail (Gujarati + Arabic).
 * Page markers/headers removed; Latin OCR junk stripped. Verify against the printed PDF.
 */
export const BOOK_META = {
  title: ['Hajj ane Umrah na Masail', 'હજ અને ઉમરાના મસાઈલ'],
  author: ['Muhammad Iqbal Kilani', 'મુહમ્મદ ઇકબાલ કીલાની'],
  note: [
    'Sanitized OCR — Arabic in Arabic script, Gujarati cleaned of page junk. Still verify against the printed book.',
    'સાફ કરેલ OCR — અરબી અરબી લિપિમાં, ગુજરાતીમાંથી પૃષ્ઠ જંક કાઢ્યો. છાપેલી કિતાબ સાથે ચકાસો.',
  ],
};

export const BOOK_SECTIONS = """
    PATH.write_text(header + json.dumps(sections, ensure_ascii=False, indent=2) + ';\n', encoding='utf-8')
    sample = next(s for s in sections if s['id'] == '2')
    (ROOT / 'scripts' / '_sample2.txt').write_text(sample['text'][:2000], encoding='utf-8')
    ar = sum(len(AR.findall(s.get('text') or '')) for s in sections)
    gu = sum(len(GU.findall(s.get('text') or '')) for s in sections)
    print(f'done ar={ar} gu={gu} bytes={PATH.stat().st_size}')


if __name__ == '__main__':
    main()

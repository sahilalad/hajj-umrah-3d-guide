"""OCR all missing book-section PDF pages and regenerate sanitized book.js."""
from __future__ import annotations

import json
import os
import re
import subprocess
from pathlib import Path

import fitz

ROOT = Path(__file__).resolve().parents[1]
PDF = ROOT / 'HAJJ ANE UMRAH NA MASAIL.pdf'
OUT_OCR = ROOT / 'book-ocr-missing.txt'
OUT_JS = ROOT / 'src' / 'data' / 'book.js'
TMP = ROOT / '_ocr_tmp' / 'missing'
EXISTING = [ROOT / 'book-ocr-1-40.txt', ROOT / 'book-ocr-key.txt', OUT_OCR]

# index, gu, en, bookStart, bookEndExclusive
SECTIONS = [
  ('1', 'પ્રસ્તાવના', 'Preface', 5, 15),
  ('1b', 'હજની કેટલીક વિશિષ્ટ શિક્ષાઓ', 'Special lessons of Hajj', 15, 33),
  ('2', 'હજ અને ઉમરાના મસાઈલ - એક નજરમાં', 'Hajj & Umrah masaail at a glance', 33, 41),
  ('3', 'ઉમરાની મસનૂન રીત - એક નજરમાં', 'Sunnah method of Umrah at a glance', 41, 44),
  ('4', 'હજે-તમત્તોઅની મસનૂન રીત - એક નજરમાં', 'Sunnah method of Hajj Tamattu at a glance', 44, 47),
  ('5', 'હજે-ઇફરાદની મસનૂન રીત - એક નજરમાં', 'Sunnah method of Hajj Ifrad at a glance', 47, 48),
  ('6', 'હજે-કિરાનની મસનૂન રીત - એક નજરમાં', 'Sunnah method of Hajj Qiran at a glance', 48, 49),
  ('7', 'હજની અનિવાર્યતા (ફર્ઝિયત)', 'Obligation of Hajj', 49, 51),
  ('8', 'હજ અને ઉમરાની ફઝીલત', 'Virtues of Hajj and Umrah', 51, 59),
  ('10', 'હજ અને ઉમરા - કુરઆન-મજીદના પ્રકાશમાં', 'Hajj and Umrah in the light of the Quran', 59, 65),
  ('11', 'હજની શરતો', 'Conditions of Hajj', 65, 69),
  ('12a', 'મીકાતનો નક્શો અને નામ', 'Map and names of the Miqat', 69, 70),
  ('12', 'મીકાતના મસાઈલ', 'Masaail of the Miqat', 70, 77),
  ('13', 'અહરામના પ્રકાર', 'Types of Ihram', 77, 81),
  ('14', 'હજની નિયતને ઉમરાની નિયતમાં બદલવું', 'Changing Hajj intention to Umrah', 81, 82),
  ('15', 'અહરામના મસાઈલ', 'Masaail of Ihram', 82, 88),
  ('16', 'અહરામની હાલતમાં જાઈઝ કાર્યો', 'Permissible acts in Ihram', 88, 95),
  ('17', 'અહરામની હાલતમાં પ્રતિબંધિત કાર્યો', 'Prohibited acts in Ihram', 95, 101),
  ('18', 'ફિદયાના મસાઈલ', 'Masaail of Fidya', 101, 105),
  ('19', 'તલબિયાના મસાઈલ', 'Masaail of Talbiyah', 105, 109),
  ('20', 'મક્કા-મુકર્રમા અને મસ્જિદે-હરામમાં દાખલ થવાના મસાઈલ', 'Entering Makkah and Masjid al-Haram', 109, 113),
  ('21', 'તવાફના પ્રકાર', 'Types of Tawaf', 113, 115),
  ('22', 'તવાફના મસાઈલ', 'Masaail of Tawaf', 115, 129),
  ('23', 'હાજી પર કેટલા તવાફ વાજિબ છે?', 'How many Tawaf are wajib on the pilgrim?', 129, 139),
  ('25', 'હાજી પર કેટલી સઈ વાજિબ છે?', 'How many Sa‘i are wajib on the pilgrim?', 139, 142),
  ('26', 'હજના દિવસોના મસાઈલ', 'Masaail of the days of Hajj', 142, 142),
  ('26a', '૮ ઝિલહજ્જ - તરવિયહના દિવસના મસાઈલ', '8 Dhul-Hijjah — Day of Tarwiyah', 142, 144),
  ('26b', '૯ ઝિલહજ્જ - અરફાના દિવસના મસાઈલ', '9 Dhul-Hijjah — Day of Arafah', 144, 152),
  ('26c', '૯ ઝિલહજ્જ (મુઝદલિફા)ની રાતના મસાઈલ', 'Night of Muzdalifah', 152, 155),
  ('26d', '૧૦ ઝિલહજ્જ - કુરબાનીના મસાઈલ', '10 Dhul-Hijjah — Sacrifice', 155, 159),
  ('27', 'જમરા ઉકબાની રમીના મસાઈલ', 'Ramy of Jamarat al-Aqabah', 159, 170),
  ('29', 'માથું મુંડાવવા અને વાળ કપાવવાના મસાઈલ', 'Shaving and cutting the hair', 170, 173),
  ('30', 'તવાફે-ઝિયારતના મસાઈલ', 'Masaail of Tawaf al-Ziyarah', 173, 175),
  ('31', 'તશરીકના દિવસોના મસાઈલ', 'Masaail of the days of Tashriq', 175, 181),
  ('33', 'સ્ત્રીઓની હજ', 'Hajj for women', 181, 186),
  ('35', 'બીજા તરફથી હજ અદા કરવાના મસાઈલ', 'Performing Hajj on behalf of another', 186, 190),
  ('36', 'મક્કા-મુકર્રમાની હુરમતના મસાઈલ', 'Sanctity of Makkah', 190, 194),
  ('37', 'મદીના મુનવ્વરાની હુરમતના મસાઈલ', 'Sanctity of Madinah', 194, 198),
  ('38', 'મસ્જિદે-નબવીની ઝિયારતના મસાઈલ', 'Visiting Masjid an-Nabawi', 198, 201),
  ('39', 'કબ્ર-મુબારકની ઝિયારતના મસાઈલ', 'Visiting the Blessed Grave', 201, 207),
  ('40', 'મસ્જિદે-કૂબાની ઝિયારતના મસાઈલ', 'Visiting Masjid Quba', 207, 218),
  ('42', 'વિભિન્ન મસાઈલ', 'Miscellaneous masaail', 218, 229),
  ('43', 'કુરઆન-મજીદ અને હદીસ શરીફની દુઆઓ', 'Duas from Quran and Hadith', 229, 243),
]

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


def load_pages() -> dict[int, str]:
    pages: dict[int, str] = {}
    for path in EXISTING:
        if not path.exists():
            continue
        text = path.read_text(encoding='utf-8')
        for m in re.finditer(r'===== PAGE (\d+) =====\n(.*?)(?=\n===== PAGE |\Z)', text, re.S):
            pages[int(m.group(1))] = m.group(2)
    return pages


def needed_pdf_pages(have: set[int], page_count: int) -> list[int]:
    needed: set[int] = set()
    for _idx, _gu, _en, b0, b1 in SECTIONS:
        end = max(b0 + 1, b1)
        for book_p in range(b0, end):
            pdf_p = book_p + 3
            if 1 <= pdf_p <= page_count:
                needed.add(pdf_p)
    return sorted(p for p in needed if p not in have)


def ocr_page(doc, page_index: int) -> str:
    TMP.mkdir(parents=True, exist_ok=True)
    pix = doc[page_index].get_pixmap(matrix=fitz.Matrix(2.2, 2.2), colorspace=fitz.csGRAY)
    img = TMP / f'p{page_index + 1:03d}.png'
    pix.save(str(img))
    env = os.environ.copy()
    user_tess = Path.home() / 'tessdata'
    if (user_tess / 'guj.traineddata').exists():
        env['TESSDATA_PREFIX'] = str(user_tess)
    lang = 'guj+ara+eng' if (user_tess / 'ara.traineddata').exists() else 'guj+eng'
    r = subprocess.run(
        ['tesseract', str(img), 'stdout', '-l', lang, '--psm', '6', '-c', 'preserve_interword_spaces=1'],
        capture_output=True,
        text=True,
        encoding='utf-8',
        errors='replace',
        env=env,
    )
    return r.stdout or ''


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
    text = text.replace('(c)', '(૬)').replace('(£)', '(૬)').replace('(ce)', '(૬)').replace('(2)', '(૨)')
    return text.strip()


def build_sections(pages: dict[int, str]) -> list[dict]:
    out = []
    for idx, gu, en, b0, b1 in SECTIONS:
        end = max(b0 + 1, b1)
        pdf_pages = list(range(b0 + 3, end + 3))
        chunks = []
        for p in pdf_pages:
            if p not in pages:
                continue
            clean = sanitize(pages[p])
            if clean:
                chunks.append(clean)
        body = sanitize('\n\n'.join(chunks))
        out.append({
            'id': idx,
            'index': idx,
            'titleEn': en,
            'titleGu': gu,
            'bookPage': b0,
            'bookPageEnd': end - 1,
            'hasOcr': bool(body),
            'text': body,
        })
    return out


def write_book_js(sections: list[dict]) -> None:
    header = """/** Sanitized book OCR for Hajj ane Umrah na Masail (Gujarati + Arabic).
 * Page markers/headers removed. Verify against the printed PDF.
 */
export const BOOK_META = {
  title: ['Hajj ane Umrah na Masail', 'હજ અને ઉમરાના મસાઈલ'],
  author: ['Muhammad Iqbal Kilani', 'મુહમ્મદ ઇકબાલ કીલાની'],
  note: [
    'Sanitized OCR by section from the PDF pages. Verify against the printed book.',
    'PDF પૃષ્ઠો પરથી વિભાગ મુજબ સાફ OCR. છાપેલી કિતાબ સાથે ચકાસો.',
  ],
};

export const BOOK_SECTIONS = """
    OUT_JS.write_text(header + json.dumps(sections, ensure_ascii=False, indent=2) + ';\n', encoding='utf-8')


def main():
    pages = load_pages()
    doc = fitz.open(str(PDF))
    todo = needed_pdf_pages(set(pages), doc.page_count)
    print(f'have {len(pages)} pages; need to OCR {len(todo)} more', flush=True)

    new_parts = []
    if OUT_OCR.exists():
        new_parts.append(OUT_OCR.read_text(encoding='utf-8'))

    for i, p1 in enumerate(todo, 1):
        print(f'[{i}/{len(todo)}] OCR PDF p.{p1}', flush=True)
        raw = ocr_page(doc, p1 - 1)
        pages[p1] = raw
        new_parts.append(f'\n\n===== PAGE {p1} =====\n{raw}')
        # checkpoint every 10 pages
        if i % 10 == 0:
            OUT_OCR.write_text(''.join(new_parts), encoding='utf-8')
            sections = build_sections(pages)
            write_book_js(sections)
            filled = sum(1 for s in sections if s['hasOcr'])
            print(f'  checkpoint: sections with text {filled}/{len(sections)}', flush=True)

    OUT_OCR.write_text(''.join(new_parts), encoding='utf-8')
    sections = build_sections(pages)
    write_book_js(sections)
    filled = sum(1 for s in sections if s['hasOcr'])
    missing = [s['id'] for s in sections if not s['hasOcr']]
    print(f'done: {filled}/{len(sections)} sections have text; missing={missing}', flush=True)
    print(f'book.js bytes={OUT_JS.stat().st_size}', flush=True)


if __name__ == '__main__':
    main()

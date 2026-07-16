"""Sanitize OCR text and regenerate book.js for the app."""
from __future__ import annotations

import json
import re
import subprocess
from pathlib import Path

try:
    import fitz
except ImportError:
    fitz = None

ROOT = Path(__file__).resolve().parents[1]
PDF = ROOT / 'HAJJ ANE UMRAH NA MASAIL.pdf'
OCR_FILES = [ROOT / 'book-ocr-1-40.txt', ROOT / 'book-ocr-key.txt']
OUT = ROOT / 'src' / 'data' / 'book.js'
TMP = ROOT / '_ocr_tmp' / 'sanitized'

# Book TOC: index, gu title, en title, bookStart, bookEndExclusive
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
JUNK_ONLY_RE = re.compile(r'^[\s\-–—_*=~.|:;,\'"`~<>/\\@#$%^&+={}[\]()]+$')
FOOTER_RE = re.compile(r'^[\s—\-_–*oO0]+\s*$')


def load_pages() -> dict[int, str]:
    text = '\n'.join(p.read_text(encoding='utf-8') for p in OCR_FILES if p.exists())
    pages: dict[int, str] = {}
    for m in re.finditer(r'===== PAGE (\d+) =====\n(.*?)(?=\n===== PAGE |\Z)', text, re.S):
        pages[int(m.group(1))] = m.group(2)
    return pages


def char_counts(line: str) -> tuple[int, int, int, int]:
    gu = len(GU.findall(line))
    ar = len(AR.findall(line))
    la = len(LATIN.findall(line))
    di = len(DIGITS.findall(line))
    return gu, ar, la, di


def is_noise_line(line: str) -> bool:
    s = line.strip()
    if not s:
        return False
    if PAGE_MARK_RE.match(s) or HEADER_RE.match(s) or FOOTER_RE.match(s) or JUNK_ONLY_RE.match(s):
        return True
    # Common OCR header variants
    if re.search(r'હજ\s*અને\s*ઉમરા', s) and len(s) < 40 and '[' in s:
        return True
    gu, ar, la, di = char_counts(s)
    meaningful = gu + ar
    if meaningful == 0 and la >= 3 and di < 4:
        # Pure Latin garbage OCR of Arabic/glyphs
        return True
    if meaningful == 0 and la + di > 0 and len(s) <= 8:
        return True
    if meaningful > 0 and la > meaningful * 2 and la >= 8:
        # Mostly Latin noise mixed into a short line
        return True
    # Lines that are almost only Latin symbols / broken Arabic OCR
    if meaningful <= 2 and la >= 6 and len(re.sub(r'\s', '', s)) <= 40:
        return True
    return False


def keep_script_chars(line: str) -> str:
    """Prefer Gujarati/Arabic/punctuation; drop isolated Latin junk tokens."""
    gu, ar, la, _ = char_counts(line)
    if ar >= 4 and ar >= gu:
        # Arabic-dominant line: keep Arabic + digits + basic punctuation
        cleaned = ''.join(
            ch for ch in line
            if AR.match(ch) or DIGITS.match(ch) or ch.isspace()
            or ch in '.,;:!?\'"“”‘’()-–—/،؛؟«»'
        )
        return re.sub(r'\s+', ' ', cleaned).strip()
    if la and gu and la > gu * 1.5:
        # Strip Latin token noise from Gujarati lines
        tokens = line.split()
        kept = []
        for tok in tokens:
            tg, ta, tl, td = char_counts(tok)
            if tg or ta or td:
                kept.append(tok)
            elif len(tok) <= 2 and not LATIN.search(tok):
                kept.append(tok)
            # drop long Latin gibberish tokens
        return ' '.join(kept)
    return line


def sanitize_page(raw: str) -> str:
    lines = []
    for line in raw.splitlines():
        line = line.replace('\u200c', '').replace('\ufeff', '')
        line = re.sub(r'[ \t]+', ' ', line).strip()
        if not line:
            lines.append('')
            continue
        if is_noise_line(line):
            continue
        line = keep_script_chars(line)
        if not line or is_noise_line(line):
            continue
        lines.append(line)

    # Collapse blank runs
    out = []
    blank = 0
    for line in lines:
        if not line:
            blank += 1
            if blank <= 1:
                out.append('')
            continue
        blank = 0
        out.append(line)

    text = '\n'.join(out).strip()
    # Join hyphenated Gujarati line breaks: word-\nnext
    text = re.sub(r'([^\s\-])-\n([^\s])', r'\1\2', text)
    text = re.sub(r'\n{3,}', '\n\n', text)
    return text.strip()


def ocr_page(doc, page_index: int, lang: str = 'guj+ara+eng') -> str:
    import os
    TMP.mkdir(parents=True, exist_ok=True)
    page = doc[page_index]
    pix = page.get_pixmap(matrix=fitz.Matrix(2.5, 2.5), colorspace=fitz.csGRAY)
    img = TMP / f'p{page_index + 1:03d}.png'
    pix.save(str(img))
    env = os.environ.copy()
    user_tess = Path.home() / 'tessdata'
    if (user_tess / 'ara.traineddata').exists() and (user_tess / 'guj.traineddata').exists():
        env['TESSDATA_PREFIX'] = str(user_tess)
    r = subprocess.run(
        ['tesseract', str(img), 'stdout', '-l', lang, '--psm', '6', '-c', 'preserve_interword_spaces=1'],
        capture_output=True,
        text=True,
        encoding='utf-8',
        errors='replace',
        env=env,
    )
    return r.stdout or ''


def improve_key_pages(pages: dict[int, str]) -> dict[int, str]:
    """Re-OCR overview + Umrah + Hajj-day pages with Arabic+Gujarati."""
    if fitz is None or not PDF.exists():
        return pages
    # PDF pages (1-based) that matter most for ritual accuracy
    targets = list(range(36, 56)) + list(range(145, 186))
    doc = fitz.open(str(PDF))
    for p1 in targets:
        i = p1 - 1
        if i < 0 or i >= doc.page_count:
            continue
        print(f'Re-OCR {p1}…', flush=True)
        raw = ocr_page(doc, i)
        if len(raw.strip()) > 80:
            pages[p1] = raw
    return pages


def build_sections(pages: dict[int, str]) -> list[dict]:
    out = []
    for idx, gu, en, b0, b1 in SECTIONS:
        end = max(b0 + 1, b1)
        pdf_pages = list(range(b0 + 3, end + 3))
        chunks = []
        available = []
        for p in pdf_pages:
            if p not in pages:
                continue
            clean = sanitize_page(pages[p])
            if not clean:
                continue
            available.append(p)
            chunks.append(clean)
        body = '\n\n'.join(chunks).strip()
        # Final pass on joined section
        body = sanitize_page(body)
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


def main():
    pages = load_pages()
    print(f'Loaded {len(pages)} OCR pages')
    pages = improve_key_pages(pages)
    sections = build_sections(pages)
    header = """/** Sanitized book OCR for Hajj ane Umrah na Masail (Gujarati + Arabic).
 * Page headers/footers removed. Verify critical rulings against the printed PDF.
 */
export const BOOK_META = {
  title: ['Hajj ane Umrah na Masail', 'હજ અને ઉમરાના મસાઈલ'],
  author: ['Muhammad Iqbal Kilani', 'મુહમ્મદ ઇકબાલ કીલાની'],
  note: [
    'Sanitized OCR — Arabic kept in Arabic script, Gujarati cleaned. Still verify against the printed book.',
    'સાફ કરેલ OCR — અરબી અરબીમાં, ગુજરાતી સાફ. છાપેલી કિતાબ સાથે ચકાસો.',
  ],
};

export const BOOK_SECTIONS = """
    OUT.write_text(header + json.dumps(sections, ensure_ascii=False, indent=2) + ';\n', encoding='utf-8')
    with_ocr = sum(1 for s in sections if s['hasOcr'])
    sample = next(s for s in sections if s['id'] == '2')
    ar_count = len(AR.findall(sample['text']))
    print(f'sections {len(sections)} with OCR {with_ocr} sample2_ar_chars {ar_count} bytes {OUT.stat().st_size}', flush=True)
    (ROOT / 'scripts' / '_sample2.txt').write_text(sample['text'][:1500], encoding='utf-8')


if __name__ == '__main__':
    main()

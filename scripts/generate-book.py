from pathlib import Path
import re
import json

root = Path(__file__).resolve().parents[1]
parts = []
for name in ['book-ocr-1-40.txt', 'book-ocr-key.txt']:
    p = root / name
    if p.exists():
        parts.append(p.read_text(encoding='utf-8'))
text = '\n'.join(parts)
pages = {}
for m in re.finditer(r'===== PAGE (\d+) =====\n(.*?)(?=\n===== PAGE |\Z)', text, re.S):
    pages[int(m.group(1))] = m.group(2).strip()

sections = [
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

out = []
for idx, gu, en, b0, b1 in sections:
    end = max(b0 + 1, b1)
    pdf_pages = list(range(b0 + 3, end + 3))
    chunks = []
    available = []
    for p in pdf_pages:
        if p in pages:
            available.append(p)
            chunks.append(f'--- PDF p.{p} / book ~p.{p - 3} ---\n' + pages[p])
    body = '\n\n'.join(chunks).strip()
    out.append({
        'id': idx,
        'index': idx,
        'titleEn': en,
        'titleGu': gu,
        'bookPage': b0,
        'bookPageEnd': end - 1,
        'pdfPages': available,
        'hasOcr': bool(body),
        'text': body,
    })

header = """/** Auto-generated from book OCR. Source: Hajj ane Umrah na Masail (Gujarati). */
export const BOOK_META = {
  title: ['Hajj ane Umrah na Masail', 'હજ અને ઉમરાના મસાઈલ'],
  author: ['Muhammad Iqbal Kilani', 'મુહમ્મદ ઇકબાલ કીલાની'],
  note: [
    'OCR text may contain recognition errors. Verify against the printed book.',
    'OCR ટેક્સ્ટમાં ભૂલો હોઈ શકે. છાપેલી કિતાબ સાથે ચકાસો.',
  ],
};

export const BOOK_SECTIONS = """

path = root / 'src' / 'data' / 'book.js'
path.write_text(header + json.dumps(out, ensure_ascii=False, indent=2) + ';\n', encoding='utf-8')
print('ok', len(out), 'ocr', sum(1 for s in out if s['hasOcr']), 'bytes', path.stat().st_size)

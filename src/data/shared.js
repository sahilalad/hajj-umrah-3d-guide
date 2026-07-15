export const PHOTOS = {
  haram: 'https://upload.wikimedia.org/wikipedia/commons/thumb/b/b8/Edited_Great_Mosque_of_Mecca1_5-2019-ccsa4.0_%28cropped%29.jpg/1000px-Edited_Great_Mosque_of_Mecca1_5-2019-ccsa4.0_%28cropped%29.jpg',
  kaaba: 'https://upload.wikimedia.org/wikipedia/commons/thumb/8/89/The_Ka%27ba%2C_Great_Mosque_of_Mecca%2C_Saudi_Arabia_%284%29.jpg/900px-The_Ka%27ba%2C_Great_Mosque_of_Mecca%2C_Saudi_Arabia_%284%29.jpg',
  mina: 'https://upload.wikimedia.org/wikipedia/commons/thumb/6/6a/Mina_Overview.JPG/1000px-Mina_Overview.JPG',
  arafah: 'https://upload.wikimedia.org/wikipedia/commons/thumb/5/50/Pilgrims_cover_Arafat%27s_roads%2C_plains_and_mountain_-_Flickr_-_Al_Jazeera_English.jpg/1000px-Pilgrims_cover_Arafat%27s_roads%2C_plains_and_mountain_-_Flickr_-_Al_Jazeera_English.jpg',
  muz: 'https://upload.wikimedia.org/wikipedia/commons/thumb/3/35/Fajr_in_Muzdalifah.jpg/900px-Fajr_in_Muzdalifah.jpg',
  jamarat: 'https://upload.wikimedia.org/wikipedia/commons/thumb/9/91/Jamaraat_Bridge_2.jpg/1000px-Jamaraat_Bridge_2.jpg',
  safa: 'https://upload.wikimedia.org/wikipedia/commons/thumb/0/03/Mount_Safa_Mecca.jpg/800px-Mount_Safa_Mecca.jpg',
  marwah: 'https://upload.wikimedia.org/wikipedia/commons/thumb/2/26/Al-Marwah_2.JPG/800px-Al-Marwah_2.JPG',
};

export const TALBIYAH = [
  'لَبَّيْكَ اللَّهُمَّ لَبَّيْكَ',
  'Labbayk Allahumma labbayk.',
  'હે અલ્લાહ! હું હાજર છું.',
];

export const TAWHID = [
  'لَا إِلٰهَ إِلَّا اللّٰهُ وَحْدَهُ لَا شَرِيكَ لَهُ',
  'La ilaha illallahu wahdahu la sharika lah.',
  'અલ્લાહ સિવાય કોઈ સાચો ઉપાસ્ય નથી; તે એકલો છે.',
];

export const EMPTY_DUA = ['', '', ''];

export function item({
  name,
  guName,
  arabic,
  coordinates,
  day,
  distance,
  guDistance,
  intro,
  guIntro,
  tasks,
  guTasks,
  facts,
  guFacts,
  dua = EMPTY_DUA,
  photos = [],
}) {
  return {
    n: [name, guName],
    a: arabic,
    c: coordinates,
    day,
    d: [distance, guDistance],
    i: [intro, guIntro],
    t: [tasks, guTasks],
    f: [facts, guFacts],
    dua,
    p: photos,
  };
}

import type { Chapter } from '../types';

const pdf = (bookPage: number) => bookPage + 2;

export const chapters: Chapter[] = [
  { id:'introduction', number:'1', title:{en:'Introduction',gu:'પ્રસ્તાવના'}, bookPage:5, sourcePdfPage:6, category:'foundation', summary:{en:'The opening explains the spiritual purpose of the sacred journey and introduces Makkah, Madinah and the legacy of Ibrahim عليه السلام.',gu:'આ પ્રારંભિક વિભાગ પવિત્ર સફરના આધ્યાત્મિક હેતુને સમજાવે છે અને મક્કા, મદીના તથા ઇબ્રાહીમ عليه السلام ની વારસાની ઓળખ આપે છે.'}, subtopics:[
    {title:{en:'A brief history of Hajj',gu:'હજનો સંક્ષિપ્ત ઇતિહાસ'},bookPage:7},
    {title:{en:'Some distinctive teachings of Hajj',gu:'હજની કેટલીક વિશિષ્ટ શિક્ષાઓ'},bookPage:15},
    {title:{en:'The legal status of sacrifice',gu:'કુરબાનીની શરઈ હેસિયત'},bookPage:23}
  ]},
  { id:'overview', number:'2', title:{en:'Hajj and Umrah rulings at a glance',gu:'હજ અને ઉમરાના મસાઈલ - એક નજરમાં'}, bookPage:33, sourcePdfPage:pdf(33), category:'foundation' },
  { id:'umrah-method', number:'3', title:{en:'The Sunnah method of Umrah at a glance',gu:'ઉમરાની મસનૂન રીત - એક નજરમાં'}, bookPage:41, sourcePdfPage:pdf(41), category:'rites' },
  { id:'hajj-tamattu', number:'4', title:{en:'The Sunnah method of Hajj Tamattu at a glance',gu:'હજે-તમત્તુની મસનૂન રીત - એક નજરમાં'}, bookPage:44, sourcePdfPage:pdf(44), category:'rites' },
  { id:'hajj-qiran', number:'5', title:{en:'The Sunnah method of Hajj Qiran at a glance',gu:'હજે-કિરાનની મસનૂન રીત - એક નજરમાં'}, bookPage:47, sourcePdfPage:pdf(47), category:'rites' },
  { id:'hajj-ifrad', number:'6', title:{en:'The Sunnah method of Hajj Ifrad at a glance',gu:'હજે-ઇફરાદની મસનૂન રીત - એક નજરમાં'}, bookPage:48, sourcePdfPage:pdf(48), category:'rites' },
  { id:'obligation', number:'7', title:{en:'The obligation of Hajj',gu:'હજની અનિવાર્યતા (ફરજિયત)'}, bookPage:49, sourcePdfPage:pdf(49), category:'foundation' },
  { id:'virtues', number:'8', title:{en:'Virtues of Hajj and Umrah',gu:'હજ અને ઉમરાની ફઝીલત (શ્રેષ્ઠતા)'}, bookPage:51, sourcePdfPage:pdf(51), category:'foundation' },
  { id:'importance', number:'9', title:{en:'The importance of Hajj',gu:'હજનું મહત્વ'}, bookPage:57, sourcePdfPage:pdf(57), category:'foundation' },
  { id:'quran-light', number:'10', title:{en:'Hajj and Umrah in the light of the Quran',gu:'હજ અને ઉમરા - કુર્આન-મજીદના પ્રકાશમાં'}, bookPage:58, sourcePdfPage:pdf(58), category:'foundation' },
  { id:'conditions', number:'11', title:{en:'Conditions of Hajj',gu:'હજની શરતો'}, bookPage:65, sourcePdfPage:pdf(65), category:'rules' },
  { id:'miqat-map', number:'12', title:{en:'Map and names of the Miqat locations',gu:'મીકાતનો નકશો અને નામ'}, bookPage:68, sourcePdfPage:pdf(68), category:'rules' },
  { id:'miqat-rulings', number:'13', title:{en:'Rulings of Miqat',gu:'મીકાતના મસાઈલ'}, bookPage:70, sourcePdfPage:pdf(70), category:'rules' },
  { id:'ihram-types', number:'14', title:{en:'Types of Ihram',gu:'એહરામના પ્રકાર'}, bookPage:77, sourcePdfPage:pdf(77), category:'rules' },
  { id:'change-intention', number:'15', title:{en:'Changing the intention of Hajj into Umrah',gu:'હજની નિયતને ઉમરાની નિયતમાં બદલવું'}, bookPage:81, sourcePdfPage:pdf(81), category:'rules' },
  { id:'ihram-rulings', number:'16', title:{en:'Rulings of Ihram',gu:'એહરામના મસાઈલ'}, bookPage:82, sourcePdfPage:pdf(82), category:'rules' },
  { id:'ihram-permitted', number:'17', title:{en:'Permitted acts while in Ihram',gu:'એહરામની હાલતમાં જાઈઝ કાર્યો'}, bookPage:88, sourcePdfPage:pdf(88), category:'rules' },
  { id:'ihram-prohibited', number:'18', title:{en:'Prohibited acts while in Ihram',gu:'એહરામની હાલતમાં પ્રતિબંધિત કાર્યો'}, bookPage:95, sourcePdfPage:pdf(95), category:'rules' },
  { id:'fidyah', number:'19', title:{en:'Rulings of Fidyah',gu:'ફિદયાના મસાઈલ'}, bookPage:101, sourcePdfPage:pdf(101), category:'rules' },
  { id:'talbiyah', number:'20', title:{en:'Rulings of the Talbiyah',gu:'તલબિયાના મસાઈલ'}, bookPage:105, sourcePdfPage:pdf(105), category:'rites' },
  { id:'entering-makkah', number:'21', title:{en:'Entering Makkah and al-Masjid al-Haram',gu:'મક્કા-મુકર્રમા અને મસ્જિદે-હરામમાં દાખલ થવાના મસાઈલ'}, bookPage:108, sourcePdfPage:pdf(108), category:'rites' },
  { id:'tawaf-types', number:'22', title:{en:'Types of Tawaf',gu:'તવાફના પ્રકાર'}, bookPage:113, sourcePdfPage:pdf(113), category:'rites' },
  { id:'tawaf-rulings', number:'23', title:{en:'Rulings of Tawaf',gu:'તવાફના મસાઈલ'}, bookPage:115, sourcePdfPage:pdf(115), category:'rites' },
  { id:'required-tawaf', number:'24', title:{en:'How many Tawafs are obligatory in Hajj?',gu:'હજ પર કેટલા તવાફ વાજિબ છે?'}, bookPage:128, sourcePdfPage:pdf(128), category:'rites' },
  { id:'sai-rulings', number:'25', title:{en:'Rulings of Sa‘i',gu:'સઈના મસાઈલ'}, bookPage:131, sourcePdfPage:pdf(131), category:'rites' },
  { id:'required-sai', number:'26', title:{en:'How many Sa‘i are obligatory in Hajj?',gu:'હજ પર કેટલી સઈ વાજિબ છે?'}, bookPage:138, sourcePdfPage:pdf(138), category:'rites' },
  { id:'hajj-days', number:'27', title:{en:'Rulings for the days of Hajj',gu:'હજના દિવસોના મસાઈલ'}, bookPage:142, sourcePdfPage:pdf(142), category:'days', subtopics:[
    {title:{en:'8 Dhul-Hijjah - the Day of Tarwiyah',gu:'૮ ઝિલહજ્જ - તરવિયહના દિવસના મસાઈલ'},bookPage:142},
    {title:{en:'9 Dhul-Hijjah - the Day of Arafah',gu:'૯ ઝિલહજ્જ - અરફાના દિવસના મસાઈલ'},bookPage:144},
    {title:{en:'The night at Muzdalifah',gu:'મુઝદલિફાની રાતના મસાઈલ'},bookPage:152},
    {title:{en:'10 Dhul-Hijjah - the Day of Sacrifice',gu:'૧૦ ઝિલહજ્જ - કુરબાનીના દિવસના મસાઈલ'},bookPage:155}
  ]},
  { id:'jamarah-aqabah', number:'28', title:{en:'Ramy of Jamrat al-Aqabah',gu:'જમરા ઉકબાની રમીના મસાઈલ'}, bookPage:158, sourcePdfPage:pdf(158), category:'days' },
  { id:'sacrifice', number:'29', title:{en:'Rulings of sacrifice',gu:'કુરબાનીના મસાઈલ'}, bookPage:165, sourcePdfPage:pdf(165), category:'days' },
  { id:'halq-taqsir', number:'30', title:{en:'Shaving the head and shortening the hair',gu:'માથું મુંડાવવા અને વાળ કપાવવાના મસાઈલ'}, bookPage:170, sourcePdfPage:pdf(170), category:'days' },
  { id:'tawaf-ziyarah', number:'31', title:{en:'Rulings of Tawaf al-Ziyarah',gu:'તવાફ-ઝિયારતના મસાઈલ'}, bookPage:173, sourcePdfPage:pdf(173), category:'days' },
  { id:'tashriq', number:'32', title:{en:'Rulings for the days of Tashriq',gu:'તશરીકના દિવસોના મસાઈલ'}, bookPage:175, sourcePdfPage:pdf(175), category:'days' },
  { id:'farewell-tawaf', number:'33', title:{en:'Farewell Tawaf',gu:'તવાફ-વિદા'}, bookPage:178, sourcePdfPage:pdf(178), category:'days' },
  { id:'women-hajj', number:'34', title:{en:'Hajj for women',gu:'સ્ત્રીઓની હજ'}, bookPage:181, sourcePdfPage:pdf(181), category:'special' },
  { id:'children-hajj', number:'35', title:{en:'Hajj for children',gu:'બાળકોની હજ'}, bookPage:184, sourcePdfPage:pdf(184), category:'special' },
  { id:'hajj-on-behalf', number:'36', title:{en:'Performing Hajj on behalf of another person',gu:'બીજા તરફથી હજ અદા કરવાના મસાઈલ'}, bookPage:186, sourcePdfPage:pdf(186), category:'special', subtopics:[
    {title:{en:'Hajj on behalf of a living person',gu:'જીવિત વ્યક્તિ તરફથી હજ કરવી'},bookPage:186},
    {title:{en:'Hajj on behalf of a deceased person',gu:'મય્યત તરફથી હજ કરવી'},bookPage:188}
  ]},
  { id:'sanctity-makkah', number:'37', title:{en:'The sanctity of Makkah al-Mukarramah',gu:'મક્કા-મુકર્રમાની હુરમતના મસાઈલ'}, bookPage:190, sourcePdfPage:pdf(190), category:'ziyarah' },
  { id:'sanctity-madinah', number:'38', title:{en:'The sanctity of Madinah al-Munawwarah',gu:'મદીના મુનવ્વરાની હુરમતના મસાઈલ'}, bookPage:194, sourcePdfPage:pdf(194), category:'ziyarah' },
  { id:'masjid-nabawi', number:'39', title:{en:'Visiting al-Masjid an-Nabawi ﷺ',gu:'મસ્જિદે-નબવી ﷺ ની ઝિયારતના મસાઈલ'}, bookPage:198, sourcePdfPage:pdf(198), category:'ziyarah' },
  { id:'qabr-mubarak', number:'40', title:{en:'Rulings related to visiting the blessed grave',gu:'કબ્રે-મુબારક ﷺ ની ઝિયારતના મસાઈલ'}, bookPage:201, sourcePdfPage:pdf(201), category:'ziyarah' },
  { id:'masjid-quba', number:'41', title:{en:'Visiting Masjid Quba',gu:'મસ્જિદે-કુબા ની ઝિયારતના મસાઈલ'}, bookPage:207, sourcePdfPage:pdf(207), category:'ziyarah' },
  { id:'graves', number:'42a', title:{en:'Rulings of visiting graves',gu:'કબરોની ઝિયારતના મસાઈલ'}, bookPage:208, sourcePdfPage:pdf(208), category:'ziyarah' },
  { id:'farewell-sermon', number:'42b', title:{en:'The Farewell Sermon',gu:'ખુત્બાત હિજ્જતુલ વિદાય'}, bookPage:210, sourcePdfPage:pdf(210), category:'foundation' },
  { id:'misc-rulings', number:'42c', title:{en:'Various rulings',gu:'વિવિધ મસાઈલ'}, bookPage:218, sourcePdfPage:pdf(218), category:'special' },
  { id:'quran-hadith-duas', number:'43', title:{en:'Duas from the Quran and Hadith',gu:'કુર્આન-મજીદ અને હદીસ શરીફની દુઆઓ'}, bookPage:227, sourcePdfPage:229, category:'duas' }
];

export const categories = [
  {id:'all',label:{en:'All topics',gu:'બધા વિષયો'}},
  {id:'foundation',label:{en:'Foundations',gu:'મૂળભૂત વિષયો'}},
  {id:'rites',label:{en:'Rites and methods',gu:'મનાસિક અને રીત'}},
  {id:'rules',label:{en:'Rulings',gu:'મસાઈલ'}},
  {id:'days',label:{en:'Days of Hajj',gu:'હજના દિવસો'}},
  {id:'special',label:{en:'Special cases',gu:'વિશેષ મસાઈલ'}},
  {id:'ziyarah',label:{en:'Makkah and Madinah',gu:'મક્કા અને મદીના'}},
  {id:'duas',label:{en:'Duas',gu:'દુઆઓ'}}
] as const;

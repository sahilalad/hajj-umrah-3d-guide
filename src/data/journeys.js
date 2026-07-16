import { TALBIYAH, TAWHID, EMPTY_DUA } from './shared.js';

/**
 * Source: Muhammad Iqbal Kilani — "Hajj ane Umrah na Masail" (Gujarati),
 * Islamic Information Centre–Bhuj. Educational summary of the “at a glance”
 * chapters; always verify against the full book and your scholar/group.
 */
function step(config) {
  return {
    id: config.id,
    title: [config.title, config.guTitle],
    body: [config.body, config.guBody],
    scene: config.scene,
    place: config.place || null,
    dua: config.dua || EMPTY_DUA,
    circuits: config.circuits || null,
    when: [config.when || [], config.guWhen || config.when || []],
    where: [config.where || [], config.guWhere || config.where || []],
    do: [config.do || [], config.guDo || config.do || []],
    dont: [config.dont || [], config.guDont || config.dont || []],
    checklist: [config.checklist || [], config.guChecklist || config.checklist || []],
  };
}

export const JOURNEYS = {
  umrah: {
    id: 'umrah',
    title: ['Guided Umrah', 'માર્ગદર્શિત ઉમરહ'],
    steps: [
      step({
        id: 'miqat',
        title: 'Miqat & Ihram',
        guTitle: 'મીકાત અને અહરામ',
        body: 'At the Miqat, enter Ihram for Umrah: purify, wear Ihram, make the Umrah intention, then begin Talbiyah aloud. Plane travellers may wear Ihram earlier, but make the intention at/near the Miqat.',
        guBody: 'મીકાત પર ઉમરાનો અહરામ બાંધો: ગુસ્લ, અહરામનો પોશાક, ઉમરાની નિયત, પછી ઊંચા અવાજથી તલબિયા. વિમાનથી આવનારા અહરામ પહેલાં પહેરી શકે, પણ નિયત મીકાત પર કરો.',
        scene: 'haram',
        place: 'kaaba',
        dua: TALBIYAH,
        when: [
          'Before crossing the Miqat toward Makkah.',
          'Sunnah: after a ghusl; if possible after Fajr prayer.',
          'Men may apply perfume before Ihram — not after.',
        ],
        guWhen: [
          'મક્કા તરફ મીકાત પસાર કરતાં પહેલાં.',
          'સુન્નત: ગુસ્લ પછી; શક્ય હોય તો ફજર પછી.',
          'પુરુષો અહરામ પહેલાં ખુશ્બૂ લગાવી શકે — પછી નહીં.',
        ],
        where: [
          'At your designated Miqat (or on the plane before it, with intention at Miqat).',
          'Not inside the Haram boundary for first-time Umrah Ihram from outside.',
        ],
        guWhere: [
          'તમારા નક્કી મીકાત પર (અથવા વિમાનમાં પહેલાં પોશાક, નિયત મીકાત પર).',
          'બહારથી આવતા ઉમરા માટે હરમની હદ અંદરથી પહેલો અહરામ નહીં.',
        ],
        do: [
          'Ghusl; men: two unstitched sheets; footwear below the ankles.',
          'Make Umrah intention (Labbaik Allahumma Umrah).',
          'Recite Talbiyah aloud often after Ihram.',
        ],
        guDo: [
          'ગુસ્લ; પુરુષો: બે અસીવી ચાદરો; ઘૂંટી નીચે જૂતા.',
          'ઉમરાની નિયત (લબ્બૈક અલ્લાહુમ્મ ઉમરહ).',
          'અહરામ પછી તલબિયા વારંવાર ઊંચા અવાજથી.',
        ],
        dont: [
          'Do not delay Ihram past the Miqat without a valid reason.',
          'In Ihram: no perfume, cutting hair/nails, marital relations, hunting land animals.',
          'Men: no stitched clothes, no covering the head, no socks covering the ankles as prohibited.',
        ],
        guDont: [
          'માન્ય કારણ વગર મીકાત પછી અહરામ મુલતવી ન રાખો.',
          'અહરામમાં: ખુશ્બૂ, વાળ/નખ કાપવા, સંભોગ, જમીનના શિકાર નહીં.',
          'પુરુષો: સીવેલા કપડાં, માથું ઢાંકવું, મનાઈ જુરાબ/મોજા નહીં.',
        ],
        checklist: ['Ghusl done', 'Ihram worn', 'Umrah intention', 'Talbiyah started'],
        guChecklist: ['ગુસ્લ', 'અહરામ પહેર્યો', 'ઉમરાની નિયત', 'તલબિયા શરૂ'],
      }),
      step({
        id: 'tawaf',
        title: 'Tawaf around the Kaaba',
        guTitle: 'કાબાનો તવાફ',
        body: 'Stop Talbiyah when starting Tawaf. Men uncover the right shoulder (idtiba). Begin each circuit from Hajar al-Aswad with istilam, keep the Kaaba on your left, complete seven circuits outside Hijr Ismail.',
        guBody: 'તવાફ શરૂ કરતાં તલબિયા બંધ કરો. પુરુષો ઇઝતિબાઅ (જમણો ખભો ખુલ્લો). હજરે અસ્વદના ઇસ્તિલામથી શરૂ કરો, કાબા ડાબી બાજુ, હિજ્રની બહાર સાત ચક્કર.',
        scene: 'haram',
        place: 'blackstone',
        dua: TALBIYAH,
        circuits: { total: 7, label: ['Tawaf circuit', 'તવાફ ચક્કર'] },
        when: [
          'After arriving in Makkah and entering Masjid al-Haram in wudu.',
          'Stop Talbiyah just before beginning the first circuit.',
          'Men: ramal (brisk walk) in the first three circuits of Umrah Tawaf; normal pace in the last four.',
        ],
        guWhen: [
          'મક્કા પહોંચી વુઝૂ સાથે મસ્જિદે હરામમાં પ્રવેશ્યા પછી.',
          'પહેલું ચક્કર શરૂ કરતાં પહેલાં તલબિયા બંધ.',
          'પુરુષો: ઉમરાના તવાફના પહેલા ત્રણ ચક્કરમાં રમલ; છેલ્લા ચારમાં સામાન્ય ચાલ.',
        ],
        where: [
          'Mataf around the Kaaba — outside the Hijr / Hatim wall.',
          'Start and end each circuit at Hajar al-Aswad.',
          'Rukn Yamani: touch if possible without kissing; otherwise pass without pointing.',
        ],
        guWhere: [
          'કાબાની આસપાસ મતાફ — હિજ્ર / હાતીમની બહાર.',
          'દરેક ચક્કર હજરે અસ્વદથી શરૂ અને ત્યાં જ પૂર્ણ.',
          'રુક્ને યમાની: શક્ય હોય તો સ્પર્શ (ચૂમ્યા વગર); નહીં તો ઇશારા વગર પસાર.',
        ],
        do: [
          'Be in Ihram and in wudu.',
          'Istilam at Hajar al-Aswad each circuit: kiss, touch then kiss hand, or gesture — say Bismillah, Allahu Akbar.',
          'Between Rukn Yamani and Hajar al-Aswad recite Rabbana atina…',
        ],
        guDo: [
          'અહરામ અને વુઝૂમાં રહો.',
          'દરેક ચક્કરે હજરે અસ્વદનો ઇસ્તિલામ: ચૂમવું, હાથ સ્પર્શ, અથવા ઇશારો — બિસ્મિલ્લાહિ, અલ્લાહુ અકબર.',
          'રુક્ને યમાની અને હજરે અસ્વદ વચ્ચે રબ્બના આતિના… પઢો.',
        ],
        dont: [
          'Do not cut inside the Hijr wall.',
          'Do not push to kiss the Black Stone.',
          'Do not raise both hands high like takbir when gesturing at the Stone.',
        ],
        guDont: [
          'હિજ્રની અંદરથી ન કાપો.',
          'હજરે અસ્વદ ચૂમવા ધક્કા ન આપો.',
          'ઇશારા વખતે બંને હાથ તકબીરની જેમ ઊંચા ન કરો.',
        ],
        checklist: ['Talbiyah stopped', 'Seven circuits', 'Outside Hijr', 'Idtiba (men)'],
        guChecklist: ['તલબિયા બંધ', 'સાત ચક્કર', 'હિજ્ર બહાર', 'ઇઝતિબાઅ (પુરુષ)'],
      }),
      step({
        id: 'maqam',
        title: 'Maqam Ibrahim & Zamzam',
        guTitle: 'મકામે ઇબ્રાહીમ અને ઝમઝમ',
        body: 'After seven circuits, go toward Maqam Ibrahim (or wherever space allows), pray two rakahs, then drink Zamzam and lightly pour some on the head. Before Sa‘i, make istilam of Hajar al-Aswad again.',
        guBody: 'સાત ચક્કર પછી મકામે ઇબ્રાહીમ તરફ (અથવા જગ્યા મળે ત્યાં) બે રકાત, પછી ઝમઝમ પીઓ અને થોડું માથા પર નાખો. સઈ પહેલાં ફરી હજરે અસ્વદનો ઇસ્તિલામ કરો.',
        scene: 'haram',
        place: 'maqam',
        when: [
          'Immediately after completing the seven circuits of Tawaf.',
          'Two rakahs: ideally Surah al-Kafirun then Surah al-Ikhlas.',
        ],
        guWhen: [
          'તવાફના સાત ચક્કર પૂર્ણ થતાં તરત.',
          'બે રકાત: પહેલીમાં કાફિરૂન, બીજીમાં ઇખ્લાસ (સુન્નત).',
        ],
        where: [
          'Near Maqam Ibrahim if space allows — otherwise any clear place in the mosque.',
          'Zamzam stations after the prayer.',
          'Then return briefly to Hajar al-Aswad for istilam before going to Safa.',
        ],
        guWhere: [
          'જગ્યા હોય તો મકામે ઇબ્રાહીમ પાસે — નહીં તો મસ્જિદમાં ખુલ્લી જગ્યા.',
          'નમાઝ પછી ઝમઝમ સ્ટેશન.',
          'પછી સફા જતાં પહેલાં હજરે અસ્વદ પાસે ફરી ઇસ્તિલામ.',
        ],
        do: [
          'Walk toward Maqam reciting Wattakhidhu mim maqami Ibrahima musalla.',
          'Pray without blocking the Mataf flow; move aside after finishing.',
          'Drink Zamzam and put a little on the head.',
        ],
        guDo: [
          'મકામ તરફ જતાં વત્તખિઝૂ મિન મકામિ ઇબ્રાહીમ મુસલ્લા પઢો.',
          'મતાફ રોક્યા વગર નમાઝ; પૂર્ણ થતાં બાજુ સરો.',
          'ઝમઝમ પીઓ અને થોડું માથા પર નાખો.',
        ],
        dont: [
          'Do not force a spot directly in front of Maqam in peak crowd.',
          'Do not linger blocking walkers after prayer.',
        ],
        guDont: [
          'પીક ભીડમાં મકામ સામે જગ્યા માટે દબાણ ન કરો.',
          'નમાઝ પછી માર્ગ રોકીને ન ઊભા રહો.',
        ],
        checklist: ['Two rakahs', 'Zamzam drunk', 'Istilam before Sa‘i'],
        guChecklist: ['બે રકાત', 'ઝમઝમ પીધું', 'સઈ પહેલાં ઇસ્તિલામ'],
      }),
      step({
        id: 'sai',
        title: 'Sa‘i between Safa and Marwah',
        guTitle: 'સફા અને મરવા વચ્ચે સઈ',
        body: 'Start at Safa facing the Qiblah with the opening ayah and dhikr, then complete seven legs ending at Marwah. Men walk briskly between the green markers.',
        guBody: 'સફાથી કિબ્લા રૂખ શરૂઆતની આયત અને ઝિક્ર સાથે સઈ શરૂ કરો; સાત ભાગ મરવા પર પૂર્ણ. પુરુષો લીલા થાંભલા વચ્ચે ઝડપથી ચાલે.',
        scene: 'haram',
        place: 'safa',
        dua: TAWHID,
        circuits: { total: 7, label: ['Sa‘i leg', 'સઈ ભાગ'] },
        when: [
          'After Tawaf, Maqam prayer, Zamzam, and istilam of the Black Stone.',
          'Wudu is preferred but Sa‘i is allowed without it if needed.',
        ],
        guWhen: [
          'તવાફ, મકામની નમાઝ, ઝમઝમ અને હજરે અસ્વદના ઇસ્તિલામ પછી.',
          'વુઝૂ સારું; જરૂર હોય તો વુઝૂ વગર પણ સઈ ચાલે.',
        ],
        where: [
          'Mas‘a: start on Safa hill facing the Kaaba direction.',
          'End the seventh leg on Marwah.',
          'Green-light stretch: men (except elderly/ill) walk faster between the markers.',
        ],
        guWhere: [
          'મસ્આ: સફા પહાડી પર કાબા તરફ રૂખ થઈને શરૂ.',
          'સાતમો ભાગ મરવા પર પૂર્ણ.',
          'લીલા થાંભલા વચ્ચે: પુરુષો (વૃદ્ધ/બીમાર સિવાય) ઝડપી ચાલ.',
        ],
        do: [
          'Climb Safa, face Qiblah, make dua and the prescribed takbir/tahlil three times.',
          'Repeat the same on Marwah each time you arrive.',
          'Recite Qur’anic / prophetic duas you remember during Sa‘i.',
        ],
        guDo: [
          'સફા ચઢી કિબ્લા રૂખ દુઆ અને નિર્ધારિત તકબીર/તહલીલ ત્રણ વાર.',
          'મરવા પર પહોંચતાં એ જ અમલ.',
          'સઈ દરમ્યાન યાદ હોય તેવી કુરઆની/નબવી દુઆઓ.',
        ],
        dont: [
          'Do not reverse Safa–Marwah order.',
          'Do not sit in the walking lanes.',
          'Do not count a round incorrectly — Safa→Marwah is one; Marwah→Safa is two, etc., ending at Marwah.',
        ],
        guDont: [
          'સફા–મરવાનો ક્રમ ઊલટો ન કરો.',
          'ચાલવાના માર્ગમાં ન બેસો.',
          'ગણતરી ભૂલશો નહીં — સફા→મરવા એક; મરવા→સફા બે… અંત મરવા પર.',
        ],
        checklist: ['Started at Safa', 'Seven legs', 'Ended at Marwah'],
        guChecklist: ['સફાથી શરૂ', 'સાત ભાગ', 'મરવા પર અંત'],
      }),
      step({
        id: 'tahallul',
        title: 'Tahallul — completing Umrah',
        guTitle: 'તહલ્લુલ — ઉમરહ પૂર્ણ',
        body: 'After Sa‘i, men shave the head or shorten all hair; women cut about a fingertip’s length from their hair. Then remove Ihram and wear normal clothes — Umrah is complete.',
        guBody: 'સઈ પછી પુરુષો માથું મુંડાવે અથવા બધા વાળ કપાવે; સ્ત્રીઓ એક-બે આંગળ જેટલા વાળ કાપે. પછી અહરામ ઉતારી સામાન્ય પોશાક — ઉમરા પૂર્ણ.',
        scene: 'haram',
        place: 'marwah',
        when: [
          'Immediately after completing the seventh leg of Sa‘i at Marwah.',
          'Only after Tawaf and Sa‘i are finished.',
        ],
        guWhen: [
          'મરવા પર સઈનો સાતમો ભાગ પૂર્ણ થતાં તરત.',
          'તવાફ અને સઈ પૂર્ણ થયા પછી જ.',
        ],
        where: [
          'Hair cutting areas near Marwah / designated barber zones, or as your group arranges.',
          'Women usually cut privately (hotel/room) — a fingertip length.',
        ],
        guWhere: [
          'મરવા પાસેના વાળ કપાવાના વિસ્તાર / નક્કી હજામ, અથવા જૂથની વ્યવસ્થા.',
          'સ્ત્રીઓ સામાન્ય રીતે ખાનગીમાં (હોટલ) એક આંગળ જેટલું કાપે.',
        ],
        do: [
          'Men: shave (preferred) or shorten hair from all over the head.',
          'Women: cut about the length of one fingertip from the hair.',
          'Remove Ihram garments and wear ordinary clothes.',
        ],
        guDo: [
          'પુરુષો: મુંડન (વધુ સારું) અથવા આખા માથાના વાળ ટૂંકા.',
          'સ્ત્રીઓ: વાળમાંથી લગભગ એક આંગળ જેટલું કાપો.',
          'અહરામની ચાદરો ઉતારી સામાન્ય પોશાક પહેરો.',
        ],
        dont: [
          'Do not leave Ihram before Sa‘i is complete.',
          'Women should not shave the head.',
        ],
        guDont: [
          'સઈ પૂર્ણ કર્યા વગર અહરામ ન છોડો.',
          'સ્ત્રીઓ માથું ન મુંડાવે.',
        ],
        checklist: ['Sa‘i finished', 'Hair cut/shaved', 'Ihram ended'],
        guChecklist: ['સઈ પૂર્ણ', 'વાળ કપાયા/મુંડન', 'અહરામ સમાપ્ત'],
      }),
    ],
  },
  hajj: {
    id: 'hajj',
    title: ['Guided Hajj days', 'માર્ગદર્શિત હજના દિવસો'],
    steps: [
      step({
        id: 'day8',
        title: '8 Dhul-Hijjah — Mina (Tarwiyah)',
        guTitle: '૮ ઝિલહજ્જ — મીના (તરવિયહ)',
        body: 'Enter Ihram for Hajj (from Makkah if you did Tamattu‘). Reach Mina after sunrise and before Zuhr. Pray Zuhr, Asr, Maghrib, Isha and Fajr in Mina with qasr, and keep Talbiyah loud on the way.',
        guBody: 'હજનો અહરામ બાંધો (તમત્તોઅમાં મક્કાથી). સૂર્યોદય પછી અને ઝુહ્ર પહેલાં મીના પહોંચો. મીનામાં ઝુહ્રથી ફજર પાંચ નમાઝ કસ્ર સાથે; રસ્તે તલબિયા ઊંચા અવાજથી.',
        scene: 'hajj',
        place: 'mina',
        dua: TALBIYAH,
        when: [
          '8 Dhul-Hijjah (Yawm at-Tarwiyah).',
          'Arrive Mina after sunrise and before Zuhr.',
          'Spend the night in Mina; leave for Arafah after sunrise on the 9th.',
        ],
        guWhen: [
          '૮ ઝિલહજ્જ (યૌમુત તરવિયહ).',
          'સૂર્યોદય પછી અને ઝુહ્ર પહેલાં મીના પહોંચો.',
          'રાત મીનામાં; ૯મીએ સૂર્યોદય પછી અરફાત જાઓ.',
        ],
        where: [
          'Mina tent city — stay within Mina for the five prayers listed.',
          'If Tamattu‘: put on Hajj Ihram from your place in Makkah before leaving.',
        ],
        guWhere: [
          'મીનાની છાવણી — નિર્ધારિત પાંચ નમાઝ મીનામાં.',
          'તમત્તોઅ: મક્કાના રોકાણથી હજનો અહરામ બાંધી નીકળો.',
        ],
        do: [
          'Pray Zuhr, Asr, Maghrib, Isha and Fajr in Mina with qasr as guided.',
          'Keep Talbiyah alive loudly while travelling.',
          'Rest and prepare water/supplies for Arafah day.',
        ],
        guDo: [
          'મીનામાં ઝુહ્ર, અસર, મગરિબ, ઇશા, ફજર કસ્ર સાથે.',
          'સફરમાં તલબિયા ઊંચા અવાજથી.',
          'અરફાત માટે આરામ અને પાણી/સામાન તૈયાર.',
        ],
        dont: [
          'Do not leave for Arafah before sunrise on the 9th (per this book’s sequence).',
          'Do not skip the night in Mina without your group’s verified plan.',
        ],
        guDont: [
          '૯મીએ સૂર્યોદય પહેલાં અરફાત ન જાઓ (પુસ્તકની ક્રમ મુજબ).',
          'જૂથની માન્ય યોજના વગર મીનાની રાત ન છોડો.',
        ],
        checklist: ['Hajj Ihram', 'Arrived Mina before Zuhr', 'Night in Mina'],
        guChecklist: ['હજનો અહરામ', 'ઝુહ્ર પહેલાં મીના', 'મીનામાં રાત'],
      }),
      step({
        id: 'day9',
        title: '9 Dhul-Hijjah — Arafah',
        guTitle: '૯ ઝિલહજ્જ — અરફાત',
        body: 'After sunrise leave Mina for Arafah. After the sun declines, attend the sermon at Masjid Namirah if able, combine Zuhr and Asr, then stand in wuquf facing Qiblah with abundant dua until sunset. Do not leave before sunset.',
        guBody: 'સૂર્યોદય પછી મીનાથી અરફાત. ઝવાલ પછી નમિરામાં ખુત્બો (શક્ય હોય), ઝુહ્ર-અસર જમા, પછી કિબ્લા રૂખ વુકૂફ અને દુઆ સૂર્યાસ્ત સુધી. સૂર્યાસ્ત પહેલાં ન નીકળો.',
        scene: 'hajj',
        place: 'arafah',
        dua: TAWHID,
        when: [
          '9 Dhul-Hijjah after sunrise from Mina.',
          'Combined Zuhr–Asr after zawal (sun’s decline).',
          'Wuquf until sunset — then depart for Muzdalifah.',
        ],
        guWhen: [
          '૯ ઝિલહજ્જ — સૂર્યોદય પછી મીનાથી.',
          'ઝવાલ પછી ઝુહ્ર-અસર જમા.',
          'સૂર્યાસ્ત સુધી વુકૂફ — પછી મુઝદલિફા.',
        ],
        where: [
          'Inside the boundary of Arafah (confirm you are not outside).',
          'Near Masjid Namirah for the sermon if accessible; otherwise wherever you find space facing Qiblah.',
          'Prefer near Jabal ar-Rahmah area if space allows — any place inside Arafah counts.',
        ],
        guWhere: [
          'અરફાતની હદ અંદર (બહાર નથી તે ખાતરી કરો).',
          'શક્ય હોય તો મસ્જિદ નમિરા પાસે ખુત્બો; નહીં તો જગ્યા મળે ત્યાં કિબ્લા રૂખ.',
          'જબલે રહમત નજીક જગ્યા હોય તો સારું — અરફાત અંદર ગમે ત્યાં ચાલે.',
        ],
        do: [
          'Confirm you are inside Arafah for wuquf.',
          'Make abundant dua, istighfar, dhikr and Talbiyah.',
          'Leave only after sunset toward Muzdalifah; pass Wadi Muhassar quickly.',
        ],
        guDo: [
          'વુકૂફ માટે અરફાત અંદર હોવાની ખાતરી.',
          'ઘણી દુઆ, ઇસ્તિગફાર, ઝિક્ર અને તલબિયા.',
          'સૂર્યાસ્ત પછી જ મુઝદલિફા; વાદી મુહસ્સરમાંથી ઝડપથી પસાર.',
        ],
        dont: [
          'Do not leave Arafah before sunset.',
          'Do not waste wuquf time in idle talk or distraction.',
        ],
        guDont: [
          'સૂર્યાસ્ત પહેલાં અરફાત ન છોડો.',
          'વુકૂફનો સમય વ્યર્થ વાતોમાં ન ગુમાવો.',
        ],
        checklist: ['Inside Arafah', 'Zuhr–Asr combined', 'Stood until sunset'],
        guChecklist: ['અરફાત અંદર', 'ઝુહ્ર-અસર જમા', 'સૂર્યાસ્ત સુધી'],
      }),
      step({
        id: 'muzdalifah',
        title: 'Night of 10th — Muzdalifah',
        guTitle: '૧૦મીની રાત — મુઝદલિફા',
        body: 'Pray Maghrib and Isha combined in Muzdalifah. Sleep the night. Pray Fajr early, then stand briefly near Mash‘ar al-Haram (or wherever space) facing Qiblah. Leave for Mina shortly before sunrise. Collect pebbles as your guide requires.',
        guBody: 'મુઝદલિફામાં મગરિબ-ઇશા જમા. રાત સૂઈને વિતાવો. ફજર વહેલી, પછી મશઅરે હરામ નજીક (અથવા જગ્યા મળે) કિબ્લા રૂખ થોભો. સૂર્યોદયથી થોડું પહેલાં મીના. કંકરીઓ પુસ્તક/જૂથ મુજબ.',
        scene: 'hajj',
        place: 'muz',
        dua: TALBIYAH,
        when: [
          'After sunset on 9th — travel to Muzdalifah.',
          'Maghrib + Isha combined on arrival; sleep the night.',
          'Fajr early; depart Mina a little before sunrise.',
        ],
        guWhen: [
          '૯મીના સૂર્યાસ્ત પછી મુઝદલિફા.',
          'પહોંચીને મગરિબ+ઇશા જમા; રાત સૂઈને.',
          'ફજર વહેલી; સૂર્યોદયથી થોડું પહેલાં મીના.',
        ],
        where: [
          'Inside Muzdalifah for the night and combined prayers.',
          'Wuquf near Mash‘ar al-Haram if possible, otherwise any open space facing Qiblah.',
        ],
        guWhere: [
          'રાત અને જમા નમાઝ મુઝદલિફા અંદર.',
          'શક્ય હોય તો મશઅરે હરામ નજીક વુકૂફ; નહીં તો કિબ્લા રૂખ ખુલ્લી જગ્યા.',
        ],
        do: [
          'Combine Maghrib and Isha with congregation when possible.',
          'Rest; keep Talbiyah on the journey.',
          'Prepare pebbles for Ramy as your verified method requires.',
        ],
        guDo: [
          'શક્ય હોય તો જમાઅતથી મગરિબ-ઇશા જમા.',
          'આરામ; સફરમાં તલબિયા.',
          'રમી માટે કંકરીઓ ચકાસેલ રીત મુજબ તૈયાર.',
        ],
        dont: [
          'Do not rush dangerously in the dark.',
          'Do not leave for Mina so late that you miss the pre-sunrise departure window your group follows.',
        ],
        guDont: [
          'અંધારામાં જોખમી ઉતાવળ ન કરો.',
          'જૂથની સૂર્યોદય-પહેલાંની વિન્ડો ચૂકી જાય તેટલું મોડું ન નીકળો.',
        ],
        checklist: ['Maghrib–Isha in Muzdalifah', 'Night rest', 'Pebbles ready'],
        guChecklist: ['મગરિબ-ઇશા મુઝદલિફા', 'રાતનો આરામ', 'કંકરીઓ તૈયાર'],
      }),
      step({
        id: 'day10',
        title: '10 Dhul-Hijjah — Ramy, Hady, Tahallul',
        guTitle: '૧૦ ઝિલહજ્જ — રમી, કુરબાની, તહલ્લુલ',
        body: 'After sunrise stone only Jamarat al-Aqabah (the large one). Stop Talbiyah when starting Ramy. Then offer Hady (sacrifice), shave or shorten hair, go to Makkah for Tawaf al-Ziyarah and Sa‘i (if due), then return to Mina.',
        guBody: 'સૂર્યોદય પછી ફક્ત જમરા ઉકબા (મોટો)ની રમી. રમી શરૂ કરતાં તલબિયા બંધ. પછી કુરબાની, હલક/તકસીર, મક્કામાં તવાફે ઝિયારત અને સઈ (જરૂર હોય), પછી મીના પાછા.',
        scene: 'hajj',
        place: 'jamarat',
        when: [
          '10 Dhul-Hijjah after sunrise — Ramy of Jamarat al-Aqabah only.',
          'Order commonly followed in the book: Ramy → sacrifice → hair → Tawaf al-Ziyarah → Sa‘i → return Mina.',
        ],
        guWhen: [
          '૧૦ ઝિલહજ્જ સૂર્યોદય પછી — ફક્ત જમરા ઉકબાની રમી.',
          'પુસ્તકનો સામાન્ય ક્રમ: રમી → કુરબાની → વાળ → તવાફે ઝિયારત → સઈ → મીના.',
        ],
        where: [
          'Jamarat al-Aqabah (largest pillar) in Mina.',
          'Sacrifice at designated slaughter areas / vouchers as arranged.',
          'Tawaf al-Ziyarah at Masjid al-Haram; Sa‘i at Mas‘a if required for your Hajj type.',
        ],
        guWhere: [
          'મીનામાં જમરા ઉકબા (મોટો શૈતાન).',
          'કુરબાની નક્કી સ્લોટર / વાઉચર વ્યવસ્થા.',
          'તવાફે ઝિયારત મસ્જિદે હરામ; જરૂરી હોય તો મસ્આમાં સઈ.',
        ],
        do: [
          'Stop Talbiyah when you begin stoning.',
          'Use official routes; throw safely without endangering others.',
          'Complete hair cutting then Tawaf al-Ziyarah (and Sa‘i if due).',
        ],
        guDo: [
          'રમી શરૂ કરતાં તલબિયા બંધ.',
          'અધિકૃત માર્ગ; સુરક્ષિત રીતે ફેંકો.',
          'વાળ પછી તવાફે ઝિયારત (અને જરૂરી સઈ).',
        ],
        dont: [
          'Do not stone the other two jamaraat on the 10th.',
          'Do not push, run, or throw from unsafe positions.',
        ],
        guDont: [
          '૧૦મીએ બીજા બે જમરાની રમી ન કરો.',
          'ધક્કો ન આપો, દોડો નહીં, અસુરક્ષિત સ્થાનેથી ન ફેંકો.',
        ],
        checklist: ['Aqabah Ramy', 'Sacrifice', 'Hair cut', 'Tawaf Ziyarah'],
        guChecklist: ['ઉકબા રમી', 'કુરબાની', 'વાળ', 'તવાફે ઝિયારત'],
      }),
      step({
        id: 'tashriq',
        title: '11–13 Dhul-Hijjah — Tashriq in Mina',
        guTitle: '૧૧–૧૩ ઝિલહજ્જ — તશરીક મીના',
        body: 'Spend the nights in Mina. After the sun declines each day, stone all three jamaraat in order: small, middle, then Aqabah. If leaving on the 12th, exit Mina before sunset. Keep abundant takbir and dhikr.',
        guBody: 'રાતો મીનામાં. દરરોજ સૂર્ય ઢળ્યા પછી ત્રણેય જમરાની રમી: નાનો, વચ્ચેનો, પછી ઉકબા. ૧૨મીએ પાછા ફરવું હોય તો સૂર્યાસ્ત પહેલાં મીના છોડો. તકબીર અને ઝિક્ર વધારે કરો.',
        scene: 'hajj',
        place: 'jamarat',
        when: [
          'Nights of 11th and 12th (and 13th if staying) in Mina.',
          'Ramy each day after zawal (sun’s decline).',
          'If departing on 12th: leave Mina before sunset.',
        ],
        guWhen: [
          '૧૧–૧૨ (અને રોકાઓ તો ૧૩) ની રાતો મીનામાં.',
          'દરરોજ ઝવાલ (સૂર્ય ઢળ્યા) પછી રમી.',
          '૧૨મીએ નીકળવું હોય તો સૂર્યાસ્ત પહેલાં મીના છોડો.',
        ],
        where: [
          'Mina for overnight stay.',
          'All three jamaraat in sequence: al-Ula (small) → al-Wusta (middle) → al-Aqabah (large).',
        ],
        guWhere: [
          'રાત મીનામાં.',
          'ત્રણેય જમરા ક્રમે: ઊલા (નાનો) → વુસ્તા (વચ્ચે) → ઉકબા (મોટો).',
        ],
        do: [
          'Stone in the correct order after zawal.',
          'Increase takbir, tahlil, tahmid and dhikr.',
          'Plan exit on 12th before sunset if not staying for the 13th.',
        ],
        guDo: [
          'ઝવાલ પછી સાચા ક્રમે રમી.',
          'તકબીર, તહલીલ, તહમીદ અને ઝિક્ર વધારો.',
          '૧૩મી ન રોકાઓ તો ૧૨મીએ સૂર્યાસ્ત પહેલાં નીકળો.',
        ],
        dont: [
          'Do not stone before zawal on these days (per this book).',
          'Do not reverse the jamaraat order.',
        ],
        guDont: [
          'આ દિવસોમાં ઝવાલ પહેલાં રમી ન કરો (પુસ્તક મુજબ).',
          'જમરાનો ક્રમ ઊલટો ન કરો.',
        ],
        checklist: ['Nights in Mina', 'Three jamaraat each day', 'Exit timing checked'],
        guChecklist: ['મીનામાં રાતો', 'દરરોજ ત્રણ જમરા', 'નીકળવાનો સમય'],
      }),
      step({
        id: 'farewell',
        title: 'Tawaf al-Wada‘ — farewell',
        guTitle: 'તવાફે વિદાઅ — વિદાય',
        body: 'Before leaving Makkah for your city or country, perform the farewell Tawaf of the Kaaba. This is the last major rite of departure in the book’s overview.',
        guBody: 'પોતાના શહેર કે દેશ રવાના થતાં પહેલાં કાબાનો તવાફે વિદાઅ કરો. પુસ્તકના સાર મુજબ આ વિદાયનું મુખ્ય કાર્ય છે.',
        scene: 'hajj',
        place: 'haram',
        dua: TALBIYAH,
        when: [
          'After finishing the Mina / Jamarat days, when you are ready to leave Makkah.',
          'As the last act before departing the city.',
        ],
        guWhen: [
          'મીના / જમરાતના દિવસો પૂર્ણ પછી, મક્કા છોડતાં પહેલાં.',
          'શહેરથી રવાના થતાં પહેલાંનું છેલ્લું મુખ્ય કાર્ય.',
        ],
        where: [
          'Masjid al-Haram — seven circuits around the Kaaba (farewell Tawaf).',
        ],
        guWhere: [
          'મસ્જિદે હરામ — કાબાની આસપાસ સાત ચક્કર (તવાફે વિદાઅ).',
        ],
        do: [
          'Complete seven circuits calmly.',
          'Make dua for an accepted Hajj and safe return.',
          'Follow your group’s departure timing after the Tawaf.',
        ],
        guDo: [
          'શાંતિથી સાત ચક્કર પૂર્ણ કરો.',
          'કબૂલ હજ અને સલામત વાપસીની દુઆ.',
          'તવાફ પછી જૂથની રવાનગીનો સમય અનુસરો.',
        ],
        dont: [
          'Do not treat this 3D model as a substitute for live crowd or group instructions.',
          'Do not skip farewell Tawaf if it is required for your situation — confirm in the full book.',
        ],
        guDont: [
          'આ 3D મોડેલને જીવંત ભીડ/જૂથ સૂચનાનો વિકલ્પ ન માનો.',
          'તમારી સ્થિતિમાં વાજિબ હોય તો તવાફે વિદાઅ ન છોડો — પૂરી કિતાબમાં ચકાસો.',
        ],
        checklist: ['Mina days done', 'Farewell Tawaf', 'Ready to depart'],
        guChecklist: ['મીનાના દિવસો પૂર્ણ', 'તવાફે વિદાઅ', 'રવાનગી તૈયાર'],
      }),
    ],
  },
};

export const JOURNEY_KEYS = Object.keys(JOURNEYS);

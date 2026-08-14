import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';

const resources = {
  en: {
    translation: {
      app: { title: 'National Day', subtitle: 'Status Maker', tagline: 'Create Stunning Animated WhatsApp Statuses' },
      occasions: { independenceDay: 'Independence Day', republicDay: 'Republic Day', nationalDay: 'National Day' },
      gallery: { title: 'Choose Your Template', subtitle: 'Select a premium patriotic template', useTemplate: 'Use Template' },
      editor: {
        back: 'Back', export: 'Download Video', exporting: 'Creating...',
        uploadPhoto: 'Upload Your Photo', removePhoto: 'Remove Photo',
        customize: 'Customize', dragHint: 'Drag your photo to reposition',
        occasion: 'Occasion', language: 'Language',
        textContent: 'Text Content', badge: 'Occasion / Badge',
        heading: 'Main Heading', yourName: 'Your Name',
        patrioticMessage: 'Patriotic Message', music: 'Music',
        musicLabel: 'Patriotic Music', musicOn: 'ON', musicOff: 'OFF',
        localMusic: 'Upload Local Music', musicTrim: 'Trim Music (25s)',
        musicStart: 'Start Time', yourPhoto: 'Your Photo',
        namePlaceholder: 'e.g. Ravi Prasad'
      },
      independenceDay: {
        greeting: 'Happy Independence Day',
        subtitle: 'Jai Hind! 🇮🇳',
        quote: 'Freedom is not given, it is taken.'
      },
      republicDay: {
        greeting: 'Happy Republic Day',
        subtitle: 'Jai Bharat! 🇮🇳',
        quote: 'We the people of India.'
      },
      nationalDay: {
        greeting: 'Happy National Day',
        subtitle: 'Glory to the Nation! 🇮🇳',
        quote: 'United we stand, together we rise.'
      }
    }
  },
  hi: {
    translation: {
      app: { title: 'राष्ट्रीय दिवस', subtitle: 'स्टेटस मेकर', tagline: 'शानदार एनिमेटेड व्हाट्सएप स्टेटस बनाएं' },
      occasions: { independenceDay: 'स्वतंत्रता दिवस', republicDay: 'गणतंत्र दिवस', nationalDay: 'राष्ट्रीय दिवस' },
      gallery: { title: 'अपना टेम्पलेट चुनें', subtitle: 'एक प्रीमियम देशभक्ति टेम्पलेट चुनें', useTemplate: 'टेम्पलेट चुनें' },
      editor: {
        back: 'वापस', export: 'वीडियो डाउनलोड करें', exporting: 'बना रहे हैं...',
        uploadPhoto: 'अपनी फोटो अपलोड करें', removePhoto: 'फोटो हटाएं',
        customize: 'कस्टमाइज़', dragHint: 'अपनी फोटो को खींचकर स्थान बदलें',
        occasion: 'अवसर', language: 'भाषा',
        textContent: 'पाठ सामग्री', badge: 'अवसर / बैज',
        heading: 'मुख्य शीर्षक', yourName: 'आपका नाम',
        patrioticMessage: 'देशभक्ति संदेश', music: 'संगीत',
        musicLabel: 'देशभक्ति संगीत', musicOn: 'चालू', musicOff: 'बंद',
        localMusic: 'स्थानीय संगीत अपलोड करें', musicTrim: 'संगीत काटें (25 सेकंड)',
        musicStart: 'प्रारंभ समय', yourPhoto: 'आपकी फोटो',
        namePlaceholder: 'जैसे: रवि प्रसाद'
      },
      independenceDay: {
        greeting: 'स्वतंत्रता दिवस की शुभकामनाएं',
        subtitle: 'जय हिन्द! 🇮🇳',
        quote: 'स्वराज मेरा जन्मसिद्ध अधिकार है।'
      },
      republicDay: {
        greeting: 'गणतंत्र दिवस की शुभकामनाएं',
        subtitle: 'जय भारत! 🇮🇳',
        quote: 'हम भारत के लोग।'
      },
      nationalDay: {
        greeting: 'राष्ट्रीय दिवस की शुभकामनाएं',
        subtitle: 'राष्ट्र की जय! 🇮🇳',
        quote: 'एकता में अनेकता, भारत की विशेषता।'
      }
    }
  },
  bn: {
    translation: {
      app: { title: 'জাতীয় দিবস', subtitle: 'স্ট্যাটাস মেকার', tagline: 'চমৎকার অ্যানিমেটেড হোয়াটসঅ্যাপ স্ট্যাটাস তৈরি করুন' },
      occasions: { independenceDay: 'স্বাধীনতা দিবস', republicDay: 'প্রজাতন্ত্র দিবস', nationalDay: 'জাতীয় দিবস' },
      gallery: { title: 'আপনার টেমপ্লেট বেছে নিন', subtitle: 'একটি প্রিমিয়াম দেশপ্রেমমূলক টেমপ্লেট নির্বাচন করুন', useTemplate: 'টেমপ্লেট ব্যবহার করুন' },
      editor: {
        back: 'পিছনে', export: 'ভিডিও ডাউনলোড', exporting: 'তৈরি হচ্ছে...',
        uploadPhoto: 'আপনার ছবি আপলোড করুন', removePhoto: 'ছবি সরান',
        customize: 'কাস্টমাইজ', dragHint: 'আপনার ছবি টেনে স্থান পরিবর্তন করুন',
        occasion: 'উপলক্ষ্য', language: 'ভাষা',
        textContent: 'টেক্সট বিষয়বস্তু', badge: 'উপলক্ষ্য / ব্যাজ',
        heading: 'প্রধান শিরোনাম', yourName: 'আপনার নাম',
        patrioticMessage: 'দেশপ্রেমের বার্তা', music: 'সঙ্গীত',
        musicLabel: 'দেশাত্মবোধক সঙ্গীত', musicOn: 'চালূ', musicOff: 'বন্ধ',
        localMusic: 'স্থানীয় সঙ্গীত আপলোড করুন', musicTrim: 'সঙ্গীত ছাঁটাই (25 সে)',
        musicStart: 'শুরুর সময়', yourPhoto: 'আপনার ছবি',
        namePlaceholder: 'যেমন: রবি প্রসাদ'
      },
      independenceDay: {
        greeting: 'শুভ স্বাধীনতা দিবস',
        subtitle: 'জয় হিন্দ! 🇮🇳',
        quote: 'স্বাধীনতা আমার জন্মগত অধিকার।'
      },
      republicDay: {
        greeting: 'শুভ প্রজাতন্ত্র দিবস',
        subtitle: 'জয় ভারত! 🇮🇳',
        quote: 'আমরা ভারতের জনগণ।'
      },
      nationalDay: {
        greeting: 'শুভ জাতীয় দিবস',
        subtitle: 'জাতির জয়! 🇮🇳',
        quote: 'ঐক্যেই শক্তি।'
      }
    }
  },
  te: {
    translation: {
      app: { title: 'జాతీయ దినోత్సవం', subtitle: 'స్టేటస్ మేకర్', tagline: 'అద్భుతమైన యానిమేటెడ్ వాట్సాప్ స్టేటస్ రూపొందించండి' },
      occasions: { independenceDay: 'స్వాతంత్ర్య దినోత్సవం', republicDay: 'గణతంత్ర దినోత్సవం', nationalDay: 'జాతీయ దినోత్సవం' },
      gallery: { title: 'మీ టెంప్లేట్ ఎంచుకోండి', subtitle: 'ప్రీమియం దేశభక్తి టెంప్లేట్ ఎంచుకోండి', useTemplate: 'టెంప్లేట్ ఉపయోగించండి' },
      editor: {
        back: 'వెనక్కి', export: 'వీడియో డౌన్‌లోడ్', exporting: 'సృష్టిస్తోంది...',
        uploadPhoto: 'మీ ఫోటో అప్‌లోడ్ చేయండి', removePhoto: 'ఫోటో తీసివేయండి',
        customize: 'కస్టమైజ్', dragHint: 'మీ ఫోటోను లాగి స్థానం మార్చండి',
        occasion: 'సందర్భం', language: 'భాష',
        textContent: 'టెక్స్ట్ కంటెంట్', badge: 'సందర్భం / బ్యాడ్జ్',
        heading: 'ప్రధాన శీర్షిక', yourName: 'మీ పేరు',
        patrioticMessage: 'దేశభక్తి సందేశం', music: 'సంగీతం',
        musicLabel: 'దేశభక్తి సంగీతం', musicOn: 'ఆన్', musicOff: 'ఆఫ్',
        localMusic: 'స్థానిక సంగీతం అప్‌లోడ్', musicTrim: 'సంగీతం ట్రిమ్ (25సె)',
        musicStart: 'ప్రారంభ సమయం', yourPhoto: 'మీ ఫోటో',
        namePlaceholder: 'ఉదాహరణకు: రవి ప్రసాద్'
      },
      independenceDay: {
        greeting: 'స్వాతంత్ర్య దినోత్సవ శుభాకాంక్షలు',
        subtitle: 'జై హింద్! 🇮🇳',
        quote: 'స్వాతం్ర్యం నా జన్మహక్కు.'
      },
      republicDay: {
        greeting: 'గణతంత్ర దినోత్సవ శుభాకాంక్షలు',
        subtitle: 'జై భారత్! 🇮🇳',
        quote: 'మేము భారత ప్రజలు.'
      },
      nationalDay: {
        greeting: 'జాతీయ దినోత్సవ శుభాకాంక్షలు',
        subtitle: 'జాతికి జై! 🇮🇳',
        quote: 'ఐక్యంలోనే శక్తి.'
      }
    }
  },
  mr: {
    translation: {
      app: { title: 'राष्ट्रीय दिन', subtitle: 'स्टेटस मेकर', tagline: 'अप्रतिम एनिमेटेड व्हॉट्सअॅप स्टेटस बनवा' },
      occasions: { independenceDay: 'स्वातंत्र्य दिन', republicDay: 'प्रजासत्ताक दिन', nationalDay: 'राष्ट्रीय दिन' },
      gallery: { title: 'तुमचा टेम्पलेट निवडा', subtitle: 'प्रीमियम देशभक्ती टेम्पलेट निवडा', useTemplate: 'टेम्पलेट वापरा' },
      editor: {
        back: 'मागे', export: 'व्हिडिओ डाउनलोड', exporting: 'बनवत आहे...',
        uploadPhoto: 'तुमचा फोटो अपलोड करा', removePhoto: 'फोटो काढा',
        customize: 'सानुकूलित करा', dragHint: 'तुमचा फोटो ड्रॅग करून स्थान बदला',
        occasion: 'प्रसंग', language: 'भाषा',
        textContent: 'मजकूर विषयवस्तू', badge: 'प्रसंग / बॅज',
        heading: 'मुख्य शीर्षक', yourName: 'तुमचे नाव',
        patrioticMessage: 'देशभक्ती संदेश', music: 'संगीत',
        musicLabel: 'देशभक्तीपर संगीत', musicOn: 'चालू', musicOff: 'बंद',
        localMusic: 'स्थानिक संगीत अपलोड करा', musicTrim: 'संगीत ट्रिम करा (२५ सेकंद)',
        musicStart: 'सुरुवातीची वेळ', yourPhoto: 'तुमचा फोटो',
        namePlaceholder: 'उदा. रवी प्रसाद'
      },
      independenceDay: {
        greeting: 'स्वातंत्र्य दिनाच्या शुभेच्छा',
        subtitle: 'जय हिंद! 🇮🇳',
        quote: 'स्वराज हा माझा जन्मसिद्ध अधिकार आहे.'
      },
      republicDay: {
        greeting: 'प्रजासत्ताक दिनाच्या शुभेच्छा',
        subtitle: 'जय भारत! 🇮🇳',
        quote: 'आम्ही भारताचे लोक.'
      },
      nationalDay: {
        greeting: 'राष्ट्रीय दिनाच्या शुभेच्छा',
        subtitle: 'राष्ट्राचा जय! 🇮🇳',
        quote: 'एकतेत बळ.'
      }
    }
  },
  ta: {
    translation: {
      app: { title: 'தேசிய நாள்', subtitle: 'ஸ்டேட்டஸ் மேக்கர்', tagline: 'அற்புதமான அனிமேஷன் வாட்ஸ்அப் ஸ்டேட்டஸ் உருவாக்குங்கள்' },
      occasions: { independenceDay: 'சுதந்திர தினம்', republicDay: 'குடியரசு தினம்', nationalDay: 'தேசிய நாள்' },
      gallery: { title: 'உங்கள் டெம்ப்ளேட்டை தேர்வு செய்யுங்கள்', subtitle: 'பிரீமியம் தேசபக்தி டெம்ப்ளேட் தேர்வு செய்யுங்கள்', useTemplate: 'டெம்ப்ளேட்டைப் பயன்படுத்தவும்' },
      editor: {
        back: 'பின்', export: 'வீடியோ பதிவிறக்கம்', exporting: 'உருவாக்குகிறது...',
        uploadPhoto: 'உங்கள் புகைப்படத்தை பதிவேற்றுங்கள்', removePhoto: 'புகைப்படத்தை அகற்று',
        customize: 'தனிப்பயனாக்கு', dragHint: 'உங்கள் புகைப்படத்தை இழுத்து நகர்த்தவும்',
        occasion: 'சந்தர்ப்பம்', language: 'மொழி',
        textContent: 'உரை உள்ளடக்கம்', badge: 'சந்தர்ப்பம் / பேட்ஜ்',
        heading: 'முதன்மையான தலைப்பு', yourName: 'உங்கள் பெயர்',
        patrioticMessage: 'தேசபக்தி செய்தி', music: 'இசை',
        musicLabel: 'தேசபக்தி இசை', musicOn: 'ஆன்', musicOff: 'ஆஃப்',
        localMusic: 'உள்ளூர் இசையை பதிவேற்று', musicTrim: 'இசையை ட்ரிம் செய் (25வி)',
        musicStart: 'தொடக்க நேரம்', yourPhoto: 'உங்கள் புகைப்படம்',
        namePlaceholder: 'உதாரணம்: ரவி பிரசாத்'
      },
      independenceDay: {
        greeting: 'இனிய சுதந்திர தின நல்வாழ்த்துக்கள்',
        subtitle: 'ஜெய் ஹிந்த்! 🇮🇳',
        quote: 'சுதந்திரம் எனது பிறப்புரிமை.'
      },
      republicDay: {
        greeting: 'இனிய குடியரசு தின நல்வாழ்த்துக்கள்',
        subtitle: 'ஜெய் பாரத்! 🇮🇳',
        quote: 'நாம் இந்திய மக்கள்.'
      },
      nationalDay: {
        greeting: 'இனிய தேசிய நாள் நல்வாழ்த்துக்கள்',
        subtitle: 'நாட்டுக்கு ஜே! 🇮🇳',
        quote: 'ஒற்றுமையில் பலம்.'
      }
    }
  },
  gu: {
    translation: {
      app: { title: 'રાષ્ટ્રીય દિવસ', subtitle: 'સ્ટેટસ મેકર', tagline: 'અદ્ભુત એનિમેટેડ વોટ્સએપ સ્ટેટસ બનાવો' },
      occasions: { independenceDay: 'સ્વતંત્રતા દિવસ', republicDay: 'પ્રજાસત્તાક દિવસ', nationalDay: 'રાષ્ટ્રીય દિવસ' },
      gallery: { title: 'તમારો ટેમ્પલેટ પસંદ કરો', subtitle: 'પ્રીમિયમ દેશભક્તિ ટેમ્પલેટ પસંદ કરો', useTemplate: 'ટેમ્પલેટ વાપરો' },
      editor: {
        back: 'પાછળ', export: 'વિડિયો ડાઉનલોડ', exporting: 'બનાવી રહ્યા છીએ...',
        uploadPhoto: 'તમારો ફોટો અપલોડ કરો', removePhoto: 'ફોટો કાઢો',
        customize: 'કસ્ટમાઇઝ', dragHint: 'તમારો ફોટો ખેંચીને સ્થાન બદલો',
        occasion: 'પ્રસંગ', language: 'ભાષા',
        textContent: 'લખાણ સામગ્રી', badge: 'પ્રસંગ / બેજ',
        heading: 'મુખ્ય શીર્ષક', yourName: 'તમારું નામ',
        patrioticMessage: 'દેશભક્તિ સંદેશ', music: 'સંગીત',
        musicLabel: 'દેશભક્તિ સંગીત', musicOn: 'ચાલુ', musicOff: 'બંધ',
        localMusic: 'સ્થાનિક સંગીત અપલોડ કરો', musicTrim: 'સંગીત કાપો (25 સે)',
        musicStart: 'શરૂઆતનો સમય', yourPhoto: 'તમારો ફોટો',
        namePlaceholder: 'દા.ત. રવિ પ્રસાદ'
      },
      independenceDay: {
        greeting: 'સ્વતંત્રતા દિવસની શુભકામનાઓ',
        subtitle: 'જય હિન્દ! 🇮🇳',
        quote: 'સ્વતંત્રતા મારો જન્મસિદ્ધ અધિકાર છે.'
      },
      republicDay: {
        greeting: 'પ્રજાસત્તાક દિવસની શુભકામનાઓ',
        subtitle: 'જય ભારત! 🇮🇳',
        quote: 'અમે ભારતના લોકો.'
      },
      nationalDay: {
        greeting: 'રાષ્ટ્રીય દિવસની શુભકામનાઓ',
        subtitle: 'રાષ્ટ્રનો જય! 🇮🇳',
        quote: 'એકતામાં શક્તિ.'
      }
    }
  },
  ur: {
    translation: {
      app: { title: 'قومی دن', subtitle: 'اسٹیٹس میکر', tagline: 'شاندار اینیمیٹڈ واٹس ایپ اسٹیٹس بنائیں' },
      occasions: { independenceDay: 'یوم آزادی', republicDay: 'یوم جمہوریہ', nationalDay: 'قومی دن' },
      gallery: { title: 'اپنا ٹیمپلیٹ چنیں', subtitle: 'ایک پریمیم حب الوطنی ٹیمپلیٹ منتخب کریں', useTemplate: 'ٹیمپلیٹ استعمال کریں' },
      editor: {
        back: 'واپس', export: 'ویڈیو ڈاؤنلوڈ', exporting: 'بنا رہے ہیں...',
        uploadPhoto: 'اپنی تصویر اپ لوڈ کریں', removePhoto: 'تصویر ہٹائیں',
        customize: 'حسب ضرورت بنائیں', dragHint: 'اپنی تصویر گھسیٹ کر جگہ بدلیں',
        occasion: 'موقع', language: 'زبان',
        textContent: 'تحریری مواد', badge: 'موقع / بیج',
        heading: 'بنیادی سرخی', yourName: 'آپ کا نام',
        patrioticMessage: 'حب الوطنی کا پیغام', music: 'موسیقی',
        musicLabel: 'ملی نغمہ', musicOn: 'آن', musicOff: 'آف',
        localMusic: 'لوکل میوزک اپ لوڈ کریں', musicTrim: 'میوزک ٹرم کریں (25 سیکنڈ)',
        musicStart: 'شروع کا وقت', yourPhoto: 'آپ کی تصویر',
        namePlaceholder: 'مثلاً: روی پرساد'
      },
      independenceDay: {
        greeting: 'یوم آزادی مبارک',
        subtitle: 'جے ہند! 🇮🇳',
        quote: 'آزادی میرا جنم سدھ حق ہے۔'
      },
      republicDay: {
        greeting: 'یوم جمہوریہ مبارک',
        subtitle: 'جے بھارت! 🇮🇳',
        quote: 'ہم بھارت کے عوام۔'
      },
      nationalDay: {
        greeting: 'قومی دن مبارک',
        subtitle: 'قوم کی جے! 🇮🇳',
        quote: 'اتحاد میں طاقت۔'
      }
    }
  },
  kn: {
    translation: {
      app: { title: 'ರಾಷ್ಟ್ರೀಯ ದಿನ', subtitle: 'ಸ್ಟೇಟಸ್ ಮೇಕರ್', tagline: 'ಅದ್ಭುತ ಅನಿಮೇಟೆಡ್ ವಾಟ್ಸಾಪ್ ಸ್ಟೇಟಸ್ ರಚಿಸಿ' },
      occasions: { independenceDay: 'ಸ್ವಾತಂತ್ರ್ಯ ದಿನ', republicDay: 'ಗಣರಾಜ್ಯೋತ್ಸವ', nationalDay: 'ರಾಷ್ಟ್ರೀಯ ದಿನ' },
      gallery: { title: 'ನಿಮ್ಮ ಟೆಂಪ್ಲೇಟ್ ಆಯ್ಕೆಮಾಡಿ', subtitle: 'ಪ್ರೀಮಿಯಂ ದೇಶಭಕ್ತಿ ಟೆಂಪ್ಲೇಟ್ ಆಯ್ಕೆಮಾಡಿ', useTemplate: 'ಟೆಂಪ್ಲೇಟ್ ಬಳಸಿ' },
      editor: {
        back: 'ಹಿಂದೆ', export: 'ವೀಡಿಯೊ ಡೌನ್‌ಲೋಡ್', exporting: 'ರಚಿಸುತ್ತಿದೆ...',
        uploadPhoto: 'ನಿಮ್ಮ ಫೋಟೋ ಅಪ್‌ಲೋಡ್ ಮಾಡಿ', removePhoto: 'ಫೋಟೋ ತೆಗೆಯಿರಿ',
        customize: 'ಕಸ್ಟಮೈಜ್', dragHint: 'ನಿಮ್ಮ ಫೋಟೋ ಎಳೆದು ಸ್ಥಾನ ಬದಲಿಸಿ',
        occasion: 'ಸಂದರ್ಭ', language: 'ಭಾಷೆ',
        textContent: 'ಪಠ್ಯ ವಿಷಯ', badge: 'ಸಂದರ್ಭ / ಬ್ಯಾಡ್ಜ್',
        heading: 'ಮುಖ್ಯ ಶೀರ್ಷಿಕೆ', yourName: 'ನಿಮ್ಮ ಹೆಸರು',
        patrioticMessage: 'ದೇಶಭಕ್ತಿ ಸಂದೇಶ', music: 'ಸಂಗೀತ',
        musicLabel: 'ದೇಶಭಕ್ತಿ ಗೀತೆ', musicOn: 'ಆನ್', musicOff: 'ಆಫ್',
        localMusic: 'ಸ್ಥಳೀಯ ಸಂಗೀತ ಅಪ್‌ಲೋಡ್', musicTrim: 'ಸಂಗೀತ ಟ್ರಿಮ್ (25ಸೆ)',
        musicStart: 'ಪ್ರಾರಂಭದ ಸಮಯ', yourPhoto: 'ನಿಮ್ಮ ಫೋಟೋ',
        namePlaceholder: 'ಉದಾಹರಣೆಗೆ: ರವಿ ಪ್ರಸಾದ್'
      },
      independenceDay: {
        greeting: 'ಸ್ವಾತಂತ್ರ್ಯ ದಿನಾಚರಣೆಯ ಶುಭಾಶಯಗಳು',
        subtitle: 'ಜೈ ಹಿಂದ್! 🇮🇳',
        quote: 'ಸ್ವಾತಂತ್ರ್ಯ ನನ್ನ ಜನ್ಮಸಿದ್ಧ ಹಕ್ಕು.'
      },
      republicDay: {
        greeting: 'ಗಣರಾಜ್ಯೋತ್ಸವದ ಶುಭಾಶಯಗಳು',
        subtitle: 'ಜೈ ಭಾರತ್! 🇮🇳',
        quote: 'ನಾವು ಭಾರತದ ಜನತೆ.'
      },
      nationalDay: {
        greeting: 'ರಾಷ್ಟ್ರೀಯ ದಿನದ ಶುಭಾಶಯಗಳು',
        subtitle: 'ರಾಷ್ಟ್ರಕ್ಕೆ ಜೈ! 🇮🇳',
        quote: 'ಒಗ್ಗಟ್ಟಿನಲ್ಲಿ ಬಲ.'
      }
    }
  },
  or: {
    translation: {
      app: { title: 'ଜାତୀୟ ଦିବସ', subtitle: 'ଷ୍ଟେଟସ୍ ମେକର୍', tagline: 'ଅଦ୍ଭୁତ ଏନିମେଟେଡ୍ ହ୍ୱାଟ୍ସଆପ୍ ଷ୍ଟେଟସ୍ ତିଆରି କରନ୍ତು' },
      occasions: { independenceDay: 'ସ୍ୱାଧୀନତା ଦିବସ', republicDay: 'ଗଣତନ୍ତ୍ର ଦିବସ', nationalDay: 'ଜାତୀୟ ଦିବସ' },
      gallery: { title: 'ଆପଣଙ୍କ ଟେମ୍ପଲେଟ୍ ବାଛନ୍ତୁ', subtitle: 'ପ୍ରିମିୟମ୍ ଦେଶଭକ୍ତି ଟେମ୍ପଲେଟ୍ ବାଛନ୍ତು', useTemplate: 'ଟେମ୍ପଲେଟ୍ ବ୍ୟବହାର କରନ୍ତು' },
      editor: {
        back: 'ପଛକୁ', export: 'ଭିଡିଓ ଡାଉନଲୋଡ୍', exporting: 'ତିଆରି ହେଉଛି...',
        uploadPhoto: 'ଆପଣଙ୍କ ଫଟୋ ଅପଲୋଡ୍ କରନ୍ତು', removePhoto: 'ଫଟୋ ହଟାନ୍ତୁ',
        customize: 'କଷ୍ଟମାଇଜ୍', dragHint: 'ଆପଣଙ୍କ ଫଟୋ ଟାଣି ସ୍ଥាន ବଦଳାନ୍ତୁ',
        occasion: 'ଅବସର', language: 'ଭାଷା',
        textContent: 'ଲେଖା ବିଷୟବସ୍ତୁ', badge: 'ଅବସର / ବ୍ୟାଜ୍',
        heading: 'ମୁଖ୍ୟ ଶିରୋନାମା', yourName: 'ଆପଣଙ୍କ ନାମ',
        patrioticMessage: 'ଦେଶଭକ୍ତି ବାର୍ତ୍ତା', music: 'ସଙ୍ଗୀତ',
        musicLabel: 'ଦେଶଭକ୍ତି ସଙ୍ગୀତ', musicOn: 'ଅନ୍', musicOff: 'ଅଫ୍',
        localMusic: 'ସ୍ଥାନୀୟ ସଙ୍ଗୀତ ଅପଲୋଡ୍', musicTrim: 'ସଙ୍ଗୀତ କାଟନ୍ତୁ (୨୫ସେ)',
        musicStart: 'ଆରମ୍ଭ ସମୟ', yourPhoto: 'ଆପଣଙ୍କ ଫଟୋ',
        namePlaceholder: 'ଯଥା: ରବି ପ୍ରସାଦ'
      },
      independenceDay: {
        greeting: 'ସ୍ୱାଧୀନତା ଦିବସର ହାର୍ଦ୍ଦିକ ଶୁଭେଚ୍ଛା',
        subtitle: 'ଜୟ ହିନ୍ଦ! 🇮🇳',
        quote: 'ସ୍ୱାଧୀନତା ମୋର ଜନ୍ମସିଦ୍ଧ ଅଧିକାର।'
      },
      republicDay: {
        greeting: 'ଗଣତନ୍ତ୍ର ଦિବସର ହାର୍ଦ୍ଦିକ ଶୁଭେଚ୍ଛା',
        subtitle: 'ଜୟ ଭାରତ! 🇮🇳',
        quote: 'ଆମେ ଭାରତର ଲୋକ।'
      },
      nationalDay: {
        greeting: 'ଜାତୀୟ ଦିବସର ହାର୍ଦ୍ଦିକ ଶୁଭେଚ୍ଛା',
        subtitle: 'ଜାତିର ଜୟ! 🇮🇳',
        quote: 'ଏକତାରେ ଶକ୍ତି।'
      }
    }
  },
  ml: {
    translation: {
      app: { title: 'ദേശീയ ദിനം', subtitle: 'സ്റ്റാറ്റസ് മേക്കർ', tagline: 'അതിശയകരമായ ആനിമേറ്റഡ് വാട്ട്സ്ആപ്പ് സ്റ്റാറ്റസ് സൃഷ്ടിക്കൂ' },
      occasions: { independenceDay: 'സ്വാതന്ത്ര്യ ദിനം', republicDay: 'റിപ്പബ്ലിക് ദിനം', nationalDay: 'ദേശീയ ദിനം' },
      gallery: { title: 'നിങ്ങളുടെ ടെംപ്ലേറ്റ് തിരഞ്ഞെടുക്കൂ', subtitle: 'പ്രീമിയം ദേശഭക്തി ടെംപ്ലേറ്റ് തിരഞ്ഞെടുക്കൂ', useTemplate: 'ടെംപ്ലേറ്റ് ഉപയോഗിക്കുക' },
      editor: {
        back: 'പിന്നോട്ട്', export: 'വീഡിയോ ഡൗൺലോഡ്', exporting: 'സൃഷ്ടിക്കുന്നു...',
        uploadPhoto: 'നിങ്ങളുടെ ഫോട്ടോ അപ്‌ലോഡ് ചെയ്യൂ', removePhoto: 'ഫോട്ടോ നീക്കം ചെയ്യൂ',
        customize: 'ഇഷ്ടാനുസൃതമാക്കൂ', dragHint: 'നിങ്ങളുടെ ഫോട്ടോ വലിച്ച് സ്ഥാനം മാറ്റൂ',
        occasion: 'അവസരം', language: 'ഭാഷ',
        textContent: 'വാചക ഉള്ളടക്കം', badge: 'അവസരം / ബാഡ്ജ്',
        heading: 'പ്രധാന തലക്കെട്ട്', yourName: 'നിങ്ങളുടെ പേര്',
        patrioticMessage: 'ദേശഭക്തി സന്ദേശം', music: 'സംഗീതം',
        musicLabel: 'ദേശഭക്തി ഗാനം', musicOn: 'ഓൺ', musicOff: 'ഓഫ്',
        localMusic: 'ലോക്കൽ മ്യൂസിക് അപ്‌ലോഡ്', musicTrim: 'സംഗീതം ട്രിം ചെയ്യുക (25സെ)',
        musicStart: 'ആരംഭ സമയം', yourPhoto: 'നിങ്ങളുടെ ഫോട്ടോ',
        namePlaceholder: 'ഉദാഹരണത്തിന്: രവി പ്രസാദ്'
      },
      independenceDay: {
        greeting: 'സ്വാതന്ത്ര്യ ദിനാശംസകൾ',
        subtitle: 'ജയ് ഹിന്ദ്! 🇮🇳',
        quote: 'സ്വാതന്ത്ര്യം എന്റെ ജന്മാവകാശം.'
      },
      republicDay: {
        greeting: 'റിപ്പബ്ലിക് ദിനാശംസകൾ',
        subtitle: 'ജയ് ഭാരത്! 🇮🇳',
        quote: 'നാം ഭാരതത്തിന്റെ ജനങ്ങൾ.'
      },
      nationalDay: {
        greeting: 'ദേശീയ ദിനാശംസകൾ',
        subtitle: 'രാഷ്ട്രത്തിന് ജയ്! 🇮🇳',
        quote: '아이ക്യത്തിൽ ശക്തി.'
      }
    }
  }
};

i18n
  .use(initReactI18next)
  .init({
    resources,
    lng: 'en',
    fallbackLng: 'en',
    interpolation: { escapeValue: false }
  });

export default i18n;

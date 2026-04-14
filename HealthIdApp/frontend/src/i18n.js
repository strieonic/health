import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import LanguageDetector from 'i18next-browser-languagedetector';

const resources = {
  en: {
    translation: {
      "nav": {
        "login": "Login",
        "hospitalPortal": "Hospital Portal",
        "adminPortal": "Admin Portal",
        "getStarted": "Get Started",
        "dashboard": "Dashboard",
        "logout": "Logout",
        "records": "Records",
        "consents": "Consents",
        "healthCard": "Health Card",
        "search": "Search",
        "upload": "Upload",
        "directory": "Directory"
      },
      "hero": {
        "badge": "India's Digital Health Infrastructure",
        "headline": "The future of health records",
        "description": "One secure identity. Every hospital. Complete control. Your medical history, unified and protected by consent.",
        "cta": "Create Your Health ID",
        "forHospitals": "For Hospitals"
      },
      "features": {
        "label": "Why HealthID",
        "title": "Built for how healthcare actually works in India",
        "unified": {
          "title": "Unified Medical Timeline",
          "desc": "Every prescription, lab report, diagnosis, and doctor visit — from every hospital — in a single, chronological timeline."
        },
        "consent": {
          "title": "OTP-Based Consent",
          "desc": "You hold the keys. No hospital can access your records without your explicit, time-limited OTP permission."
        }
      }
    }
  },
  hi: {
    translation: {
      "nav": {
        "login": "लॉगिन",
        "hospitalPortal": "अस्पताल पोर्टल",
        "adminPortal": "एडमिन पोर्टल",
        "getStarted": "शुरू करें",
        "dashboard": "डैशबोर्ड",
        "logout": "लॉगआउट",
        "records": "रिकॉर्ड्स",
        "consents": "सहमति",
        "healthCard": "हेल्थ कार्ड",
        "search": "खोजें",
        "upload": "अपलोड",
        "directory": "डायरेक्टरी"
      },
      "hero": {
        "badge": "भारत का डिजिटल स्वास्थ्य इंफ्रास्ट्रक्चर",
        "headline": "स्वास्थ्य रिकॉर्ड का भविष्य",
        "description": "एक सुरक्षित पहचान। हर अस्पताल। पूर्ण नियंत्रण। आपका मेडिकल इतिहास, एक साथ और आपकी सहमति से सुरक्षित।",
        "cta": "अपनी हेल्थ आईडी बनाएं",
        "forHospitals": "अस्पतालों के लिए"
      },
      "features": {
        "label": "HealthID क्यों",
        "title": "भारत की स्वास्थ्य सेवा प्रणाली के लिए निर्मित",
        "unified": {
          "title": "यूनिफाइड मेडिकल टाइमलाइन",
          "desc": "हर पर्चे, लैब रिपोर्ट और क्लिनिक यात्रा का एक ही समयरेखा में रिकॉर्ड।"
        },
        "consent": {
          "title": "OTP-आधारित सहमति",
          "desc": "आप मालिक हैं। कोई भी अस्पताल बिना आपकी स्पष्ट OTP अनुमति के आपके रिकॉर्ड नहीं देख सकता।"
        }
      }
    }
  },
  mr: {
    translation: {
      "nav": {
        "login": "लॉगिन",
        "hospitalPortal": "हॉस्पिटल पोर्टल",
        "adminPortal": "एडमिन पोर्टल",
        "getStarted": "सुरु करा",
        "dashboard": "डॅशबोर्ड",
        "logout": "लॉगआउट",
        "records": "रेकॉर्ड्स",
        "consents": "संमती",
        "healthCard": "हेल्थ कार्ड",
        "search": "शोधा",
        "upload": "अपलोड",
        "directory": "डिरेक्टरी"
      },
      "hero": {
        "badge": "भारताची डिजिटल आरोग्य पायाभूत सुविधा",
        "headline": "आरोग्य नोंदींचे भविष्य",
        "description": "एक सुरक्षित ओळख. प्रत्येक हॉस्पिटल. पूर्ण नियंत्रण. तुमचा वैद्यकीय इतिहास, एकत्रित आणि तुमच्या संमतीने सुरक्षित.",
        "cta": "तुमची हेल्थ आयडी तयार करा",
        "forHospitals": "हॉस्पिटलसाठी"
      },
      "features": {
        "label": "HealthID का",
        "title": "भारताच्या आरोग्य व्यवस्थेसाठी खास तयार",
        "unified": {
          "title": "एकत्रित वैद्यकीय टाइमलाइन",
          "desc": "प्रत्येक प्रिस्क्रिप्शन आणि लॅब रिपोर्टचे एकाच ठिकाणी रेकॉर्ड."
        },
        "consent": {
          "title": "OTP-आधारित संमती",
          "desc": "तुम्ही मालक आहात. तुमच्या स्पष्ट OTP संमतीशिवाय कोणतेही हॉस्पिटल तुमचे रेकॉर्ड पाहू शकत नाही."
        }
      }
    }
  }
};

i18n
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    resources,
    fallbackLng: 'en',
    interpolation: {
      escapeValue: false,
    },
    detection: {
      order: ['localStorage', 'cookie', 'htmlTag', 'path', 'subdomain'],
      caches: ['localStorage'],
    },
  });

export default i18n;

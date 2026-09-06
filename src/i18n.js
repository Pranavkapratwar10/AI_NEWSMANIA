import i18n from "i18next";
import { initReactI18next } from "react-i18next";
import LanguageDetector from "i18next-browser-languagedetector";

const resources = {
  en: {
    translation: {
      // English translations
      welcome: "Welcome to AI Trip Planner",
      planTrip: "Plan Your Trip",
      destinations: "Destinations",
      itinerary: "Itinerary",
      budget: "Budget",
      language: "Language",
      login: "Login",
      signup: "Sign Up",
      logout: "Logout",
      profile: "Profile",
      settings: "Settings",
      help: "Help",
      contact: "Contact",
      about: "About",
      // Profile page
      profile: {
        menu: {
          bookmarks: "My Bookmarks",
          bookmarksDesc: "Access your saved articles",
          discussions: "My Discussions",
          discussionsDesc: "View your active discussions",
          readingList: "Reading List",
          readingListDesc: "Articles you want to read later",
          preferences: "News Preferences",
          preferencesDesc: "Customize your news feed",
          analytics: "Analytics",
          analyticsDesc: "Track your reading habits",
          achievements: "Achievements",
          achievementsDesc: "View your earned badges",
          premium: "Premium Features",
          premiumDesc: "Unlock exclusive content",
          assistant: "AI Assistant",
          assistantDesc: "Get personalized recommendations"
        },
        stats: {
          bookmarks: "Bookmarks",
          discussions: "Discussions",
          articlesRead: "Articles Read",
          achievements: "Achievements"
        },
        settings: {
          theme: "Theme",
          darkMode: "Dark Mode",
          lightMode: "Light Mode",
          language: "Language",
          notifications: "Notifications",
          notificationsEnabled: "Enabled",
          notificationsDisabled: "Disabled",
          privacy: "Privacy",
          public: "Public",
          private: "Private",
          friends: "Friends Only"
        },
        bookmarksSection: {
          title: "Bookmarked Articles",
          viewAll: "View All"
        }
      }
    },
  },
  hi: {
    translation: {
      // Hindi translations
      welcome: "एआई ट्रिप प्लानर में आपका स्वागत है",
      planTrip: "अपनी यात्रा की योजना बनाएं",
      destinations: "गंतव्य",
      itinerary: "यात्रा कार्यक्रम",
      budget: "बजट",
      language: "भाषा",
      login: "लॉग इन",
      signup: "साइन अप",
      logout: "लॉग आउट",
      profile: "प्रोफ़ाइल",
      settings: "सेटिंग्स",
      help: "मदद",
      contact: "संपर्क",
      about: "के बारे में",
      // Profile page
      profile: {
        menu: {
          bookmarks: "मेरी बुकमार्क",        
          bookmarksDesc: "अपने सहेजे गए लेख एक्सेस करें",
          discussions: "मेरी चर्चाएं",
          discussionsDesc: "अपनी सक्रिय चर्चाओं को देखें",
          readingList: "पढ़ने की सूची",
          readingListDesc: "लेख जिन्हें आप बाद में पढ़ना चाहते हैं",
          preferences: "समाचार प्राथमिकताएं",
          preferencesDesc: "अपना समाचार फ़ीड अनुकूलित करें",
          analytics: "विश्लेषण",
          analyticsDesc: "अपने पढ़ने की आदतों का ट्रैक रखें",
          achievements: "उपलब्धियां",
          achievementsDesc: "अपने अर्जित बैज देखें",
          premium: "प्रीमियम सुविधाएँ",
          premiumDesc: "विशेष सामग्री अनलॉक करें",
          assistant: "एआई सहायक",
          assistantDesc: "व्यक्तिगत सिफारिशें प्राप्त करें"
        },
        stats: {
          bookmarks: "बुकमार्क्स",
          discussions: "चर्चाएं",
          articlesRead: "पढ़े गए लेख",
          achievements: "उपलब्धियां"
        },
        settings: {
          theme: "थीम",
          darkMode: "डार्क मोड",
          lightMode: "लाइट मोड",
          language: "भाषा",
          notifications: "सूचनाएं",
          notificationsEnabled: "सक्षम",
          notificationsDisabled: "अक्षम",
          privacy: "गोपनीयता",
          public: "सार्वजनिक",
          private: "निजी",
          friends: "सिर्फ मित्रों के लिए"
        },
        bookmarksSection: {
          title: "बुकमार्क किए गए लेख",
          viewAll: "सभी देखें"
        }
      }
    },
  },
  mr: {
    translation: {
      // Marathi translations
      welcome: "एआई ट्रिप प्लानरमध्ये आपले स्वागत आहे",
      planTrip: "आपल्या ट्रिपची योजना करा",
      destinations: "गंतव्ये",
      itinerary: "प्रवास कार्यक्रम",
      budget: "बजेट",
      language: "भाषा",
      login: "लॉगिन",
      signup: "साइन अप",
      logout: "लॉग आउट",
      profile: "प्रोफाइल",
      settings: "सेटिंग्ज",
      help: "मदत",
      contact: "संपर्क",
      about: "विषयी",
      // Profile page
      profile: {
        menu: {
          bookmarks: "माझी बुकमार्क्स",
          bookmarksDesc: "आपली जतन केलेली लेख पहा",
          discussions: "माझ्या चर्चासत्रे",
          discussionsDesc: "आपल्या सक्रिय चर्चासत्रे पहा",
          readingList: "वाचण्याची यादी",
          readingListDesc: "नंतर वाचण्यासाठी लेख",
          preferences: "बातम्या पसंती",
          preferencesDesc: "आपले बातम्या फीड सानुकूलित करा",
          analytics: "विश्लेषण",
          analyticsDesc: "वाचनाची सवयी ट्रॅक करा",
          achievements: "कृतित्वे",
          achievementsDesc: "आपल्या मिळवलेल्या बॅज पहा",
          premium: "प्रीमियम वैशिष्ट्ये",
          premiumDesc: "विशेष सामग्री उघडा",
          assistant: "एआय सहाय्यक",
          assistantDesc: "वैयक्तिक शिफारसी मिळवा"
        },
        stats: {
          bookmarks: "बुकमार्क्स",
          discussions: "चर्चासत्रे",
          articlesRead: "वाचलेले लेख",
          achievements: "कृतित्वे"
        },
        settings: {
          theme: "थीम",
          darkMode: "डार्क मोड",
          lightMode: "लाइट मोड",
          language: "भाषा",
          notifications: "सूचना",
          notificationsEnabled: "सक्षम",
          notificationsDisabled: "अक्षम",
          privacy: "गोपनीयता",
          public: "सरकारी",
          private: "खाजगी",
          friends: "मित्रांसाठीच"
        },
        bookmarksSection: {
          title: "बुकमार्क केलेले लेख",
          viewAll: "सर्व पहा"
        }
      }
    },
  },
  ja: {
    translation: {
      // Japanese translations
      welcome: "AI旅行プランナーへようこそ",
      planTrip: "旅行を計画する",
      destinations: "目的地",
      itinerary: "旅程",
      budget: "予算",
      language: "言語",
      login: "ログイン",
      signup: "サインアップ",
      logout: "ログアウト",
      profile: "プロフィール",
      settings: "設定",
      help: "ヘルプ",
      contact: "お問い合わせ",
      about: "について",
    },
  },
};

i18n
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    resources,
    fallbackLng: "en",
    debug: true,
    interpolation: {
      escapeValue: false,
    },
  });

export default i18n;

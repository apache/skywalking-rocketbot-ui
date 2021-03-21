import Vue from 'vue';
import VueI18n from 'vue-i18n';

import zh from '@/assets/lang/zh';
import en from '@/assets/lang/en';

Vue.use(VueI18n);

const savedLanguage = window.localStorage.getItem('lang');
let language = navigator.language.split('-')[0];
if (!savedLanguage) {
  window.localStorage.setItem('lang', language);
}
language = savedLanguage ? savedLanguage : language;

const i18n = new VueI18n({
  locale: language,
  messages: {
    zh,
    en,
  },
});

export default i18n;

import './index.css';

import i18n from 'i18next';
import ReactDOM from 'react-dom/client';
import { initReactI18next } from 'react-i18next';
import { BrowserRouter } from 'react-router-dom'; //HashRouter

import en from '@/locales/en.json';
import ja from '@/locales/ja.json';
import ko from '@/locales/ko.json';
import zh from '@/locales/zh.json';

import MyApp from './MyApp';
import reportWebVitals from './reportWebVitals';

i18n
  .use(initReactI18next)
  .init({
    resources: {
      en: { translation: en },
      zh: { translation: zh },
      ja: { translation: ja },
      ko: { translation: ko }
    },
    fallbackLng: localStorage.getItem('language') || 'zh', // 默认语言
    debug: true, // 开启调试模式
    interpolation: {
      escapeValue: false // React 已经处理了转义
    }
  });
const root = ReactDOM.createRoot(
  document.getElementById('root') as HTMLElement
);
root.render(
  <BrowserRouter>
    {/* ui 框架降级 */}
    <MyApp />
  </BrowserRouter>);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();

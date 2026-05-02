import "./Header.scss";
import { useState } from "react";
import { useTranslation } from "react-i18next";


const Header = ({ toasterType, setToasterType, setModalActive}) => {

    const { t, i18n } = useTranslation();
    const [isLangOpen, setIsLangOpen] = useState(false);


    const languages = [
        {code: "en", label: "English"},
        {code: 'ru', label: "Русский"},
        {code: "de", label: "Deutsch"},
        {code: "ua", label: "Українська"}
    ]

    const currentLanguageLabel = languages.find(l => l.code === i18n.language)?.label ||"English";


  return (
    <header className="header">
        <div className="toaster-selector">
            <div className={`selection-slider ${toasterType === "super" ? "is-super" : ""}`}></div>

            <button className={`toasterType === "basic" ? "active" : ""}`} onClick={() => setToasterType('basic')}>
                {t('basic_model')}
            </button>

            <button className={`toasterType === "super" ? "active" : ""}`} onClick={() => setToasterType('super')}>
                {t('super_model')}
            </button>
        </div>

        <button className="history-btn" onClick={() => setModalActive(true)}>{t('history')}</button>

        <div className="language-selector" onClick={() => setIsLangOpen(!isLangOpen)}>
            <div className="current-lang">{currentLanguageLabel}</div>
            <div className={`dropdown ${isLangOpen ? "open" : ''}` }>
                {languages.map((language) => (
                    <li className="language-item" key={language.code} onClick={() => i18n.changeLanguage(language.code)}>
                        {language.label}
                    </li>
                ))}
            </div>
        </div>
    </header>
    )
}

export default Header
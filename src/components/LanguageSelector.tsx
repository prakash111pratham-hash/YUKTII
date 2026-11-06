import React, { useState, useRef, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { SUPPORTED_LANGUAGES, LanguageOption } from '../i18n';
import { Globe, Check, ChevronDown } from 'lucide-react';
import { useApp } from '../context/AppContext';

export const LanguageSelector: React.FC<{ compact?: boolean }> = ({ compact = false }) => {
  const { i18n } = useTranslation();
  const { setLanguage } = useApp();
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const currentLangCode = i18n.language || 'en';
  const currentLang =
    SUPPORTED_LANGUAGES.find((l) => l.code === currentLangCode) || SUPPORTED_LANGUAGES[0];

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleSelectLanguage = (lang: LanguageOption) => {
    i18n.changeLanguage(lang.code);
    setLanguage(lang.code === 'hi' ? 'hi' : 'en');
    try {
      localStorage.setItem('careerpath_locale', lang.code);
    } catch {}
    setIsOpen(false);
  };

  return (
    <div className="relative inline-block text-left" ref={dropdownRef}>
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className={`inline-flex items-center gap-1.5 rounded-xl border border-orange-200/90 bg-white/95 text-slate-800 shadow-2xs hover:bg-orange-50/80 transition-all cursor-pointer font-bold ${
          compact ? 'px-2.5 py-1.5 text-xs' : 'px-3 py-1.5 text-xs'
        }`}
        title="Select Regional Indian Language"
        aria-expanded={isOpen}
      >
        <Globe className="w-3.5 h-3.5 text-orange-600 shrink-0" />
        <span className="font-extrabold text-slate-900 tracking-tight">
          {currentLang.nativeName}
        </span>
        <span className="text-[10px] text-slate-500 font-medium hidden sm:inline">
          ({currentLang.code.toUpperCase()})
        </span>
        <ChevronDown
          className={`w-3 h-3 text-slate-400 transition-transform duration-200 ${
            isOpen ? 'rotate-180' : ''
          }`}
        />
      </button>

      {isOpen && (
        <div className="absolute right-0 mt-2 w-72 max-h-96 overflow-y-auto rounded-2xl bg-white shadow-2xl ring-1 ring-black/10 border border-orange-200/80 p-2 z-50 animate-in fade-in zoom-in-95 duration-150">
          <div className="px-3 py-2 border-b border-slate-100 mb-1">
            <span className="text-[11px] font-black text-orange-950 block uppercase tracking-wider">
              Choose Language / भाषा चुनें
            </span>
            <span className="text-[10px] text-slate-500">
              Languages across India (Rural to Urban)
            </span>
          </div>

          <div className="space-y-0.5">
            {SUPPORTED_LANGUAGES.map((lang) => {
              const isSelected = lang.code === currentLangCode;
              return (
                <button
                  key={lang.code}
                  type="button"
                  onClick={() => handleSelectLanguage(lang)}
                  className={`w-full text-left px-3 py-2 rounded-xl text-xs flex items-center justify-between transition-colors cursor-pointer ${
                    isSelected
                      ? 'bg-orange-50 text-orange-950 font-black border border-orange-200'
                      : 'hover:bg-slate-50 text-slate-700 font-semibold'
                  }`}
                >
                  <div className="flex flex-col">
                    <span className="text-xs font-bold text-slate-900 flex items-center gap-1.5">
                      {lang.nativeName}
                      <span className="text-[10px] text-slate-400 font-normal">
                        ({lang.name})
                      </span>
                    </span>
                    <span className="text-[10px] text-slate-500 line-clamp-1">
                      {lang.region}
                    </span>
                  </div>
                  {isSelected && (
                    <Check className="w-4 h-4 text-orange-600 shrink-0 ml-2" />
                  )}
                </button>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
};

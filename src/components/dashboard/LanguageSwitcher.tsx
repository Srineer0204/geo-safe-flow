import { useLanguage } from "@/i18n/LanguageContext";
import { Language, languageNames } from "@/i18n/translations";
import { Globe } from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

const LanguageSwitcher = () => {
  const { language, setLanguage } = useLanguage();

  return (
    <Select value={language} onValueChange={(v) => setLanguage(v as Language)}>
      <SelectTrigger className="w-[130px] h-8 text-xs bg-secondary border-border/50">
        <Globe className="h-3 w-3 mr-1.5" />
        <SelectValue />
      </SelectTrigger>
      <SelectContent>
        {(Object.keys(languageNames) as Language[]).map((lang) => (
          <SelectItem key={lang} value={lang} className="text-xs">
            {languageNames[lang]}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
};

export default LanguageSwitcher;

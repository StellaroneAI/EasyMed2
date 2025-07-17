import { Link, useLocation } from "wouter";
import { Bell, ChevronDown, Heart, Globe } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useLanguage, type Language } from "@/contexts/language-context";

export default function Header() {
  const [location] = useLocation();
  const { language, setLanguage, t } = useLanguage();

  const navigation = [
    { name: t("nav.dashboard"), href: "/dashboard" },
    { name: t("nav.patients"), href: "/patients" },
    { name: t("nav.appointments"), href: "/appointments" },
    { name: t("nav.records"), href: "/records" },
    { name: t("nav.labTests"), href: "/lab-tests" },
    { name: t("nav.aiChecker"), href: "/ai-checker" },
    { name: t("nav.family"), href: "/family" },
  ];

  const languages = [
    { key: "english" as Language, label: t("language.english") },
    { key: "hindi" as Language, label: t("language.hindi") },
    { key: "tamil" as Language, label: t("language.tamil") },
    { key: "telugu" as Language, label: t("language.telugu") },
  ];

  const getCurrentLanguageLabel = () => {
    return languages.find(lang => lang.key === language)?.label || "English";
  };

  return (
    <header className="header-glass sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo and Brand */}
          <div className="flex items-center space-x-4">
            <Link href="/" className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-medical-blue rounded-lg flex items-center justify-center">
                <Heart className="w-4 h-4 text-white" />
              </div>
              <span className="text-xl font-bold text-charcoal">EasyMed</span>
            </Link>
          </div>

          {/* Navigation Menu */}
          <nav className="hidden md:flex items-center space-x-8">
            {navigation.map((item) => {
              const isActive = location === item.href || (item.href === "/dashboard" && location === "/");
              return (
                <Link key={item.name} href={item.href}>
                  <span
                    className={`${
                      isActive
                        ? "text-medical-blue font-medium border-b-2 border-medical-blue pb-4"
                        : "text-gray-600 hover:text-medical-blue transition-colors"
                    }`}
                  >
                    {item.name}
                  </span>
                </Link>
              );
            })}
          </nav>

          {/* User Profile */}
          <div className="flex items-center space-x-4">
            {/* Language Selector */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="sm">
                  <Globe className="h-4 w-4 mr-2" />
                  <span className="hidden sm:inline">{getCurrentLanguageLabel()}</span>
                  <ChevronDown className="h-3 w-3 ml-1" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                {languages.map((lang) => (
                  <DropdownMenuItem
                    key={lang.key}
                    onClick={() => setLanguage(lang.key)}
                    className={language === lang.key ? "bg-medical-blue/10" : ""}
                  >
                    <span className="flex items-center">
                      🇮🇳 {lang.label}
                    </span>
                  </DropdownMenuItem>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>

            <Button variant="ghost" size="sm" className="relative">
              <Bell className="h-5 w-5 text-gray-400" />
              <Badge variant="destructive" className="absolute -top-1 -right-1 h-5 w-5 rounded-full p-0 text-xs">
                3
              </Badge>
            </Button>
            
            <div className="flex items-center space-x-3">
              <Avatar className="h-8 w-8">
                <AvatarImage src="https://images.unsplash.com/photo-1559839734-2b71ea197ec2?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=64&h=64" alt="Dr. Sarah Johnson" />
                <AvatarFallback>SJ</AvatarFallback>
              </Avatar>
              <div className="hidden sm:block">
                <p className="text-sm font-medium text-charcoal">Dr. Sarah Johnson</p>
                <p className="text-xs text-gray-500">Cardiologist</p>
              </div>
              <ChevronDown className="h-4 w-4 text-gray-400" />
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}

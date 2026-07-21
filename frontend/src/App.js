import { useState, useEffect } from 'react';
import { BrowserRouter, Routes, Route, Link, useLocation } from "react-router-dom";
import "@/App.css";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { GraduationCap, Building2, Users, BookOpen, Send, ArrowDown, Menu, X, Calendar, Lock, LogOut, Save, Eye, EyeOff, Plus, Trash2, Edit, FileText, Layers, Shield, Briefcase, Image, File, ExternalLink, Home, Mail, Settings, BarChart3, BookMarked, Inbox, ChevronRight, Bell, Search, MoreVertical, UserCheck, Upload, Loader2, Palette, Phone, MessageCircle, CheckCircle, Star, MousePointerClick, LayoutGrid, Award } from "lucide-react";

const API = "https://fss-akademi.onrender.com/api";
const BACKEND_URL = "https://fss-akademi.onrender.com";

const WHATSAPP_URL = "https://api.whatsapp.com/send?phone=905309482654&text=Merhaba,%20FSS%20Akademi%20hakk%C4%B1nda%20bilgi%20almak%20istiyorum.";
const LOGO_URL = "https://customer-assets.emergentagent.com/job_akademi-premium-1/artifacts/gt05fxv8_Ekran%20g%C3%B6r%C3%BCnt%C3%BCs%C3%BC%202026-02-27%20014942.png";

const SOCIAL_LINKS = {
  youtube: "https://www.youtube.com/@fatihsellumm",
  instagram: "https://www.instagram.com/fatihsellummm?utm_source=ig_web_button_share_sheet&igsh=ZDNlZDc0MzIxNw==",
  twitter: "https://x.com/fatihsellumm",
  linkedin: "https://www.linkedin.com/in/fatih-selim-sell%C3%BCm-9713933b1/",
  tiktok: "https://www.tiktok.com/@fatihsellumm"
};

const CATEGORIES = [
  { value: "", label: "Kategori Seçiniz" },
  { value: "akademik", label: "Akademik Danışmanlık" },
  { value: "kurumsal", label: "Kurumsal Hizmetler" },
  { value: "veli", label: "Veli Programları" },
  { value: "ogrenci", label: "Öğrenci Programları" }
];

const ICON_MAP = {
  graduation: <GraduationCap className="w-5 h-5" />,
  building: <Building2 className="w-5 h-5" />,
  users: <Users className="w-5 h-5" />,
  book: <BookOpen className="w-5 h-5" />
};

const ImageUploader = ({ value, onChange, label, shape = "rounded" }) => {
  const [uploading, setUploading] = useState(false);
  const handleFileChange = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploading(true);
    try {
      const formData = new FormData();
      formData.append("file", file);
      const res = await fetch(`${API}/upload`, { method: "POST", body: formData });
      if (res.ok) {
        const data = await res.json();
        onChange(`${BACKEND_URL}${data.url}`);
      }
    } catch (err) { console.error("Upload failed:", err); }
    finally { setUploading(false); }
  };
  const isCircle = shape === "circle";
  return (
    <div>
      {label && <label className="text-slate-400 text-sm block mb-2">{label}</label>}
      <div className="flex items-center gap-4">
        {value ? (
          <img src={value} alt="Önizleme" className={`${isCircle ? 'w-20 h-20 rounded-full' : 'w-24 h-16 rounded-lg'} object-cover border-2 border-academic-gold/30`} />
        ) : (
          <div className={`${isCircle ? 'w-20 h-20 rounded-full' : 'w-24 h-16 rounded-lg'} bg-slate-700 border-2 border-dashed border-slate-500 flex items-center justify-center`}>
            <Image className="w-6 h-6 text-slate-500" />
          </div>
        )}
        <div className="flex-1">
          <label className="flex items-center gap-2 px-4 py-2.5 bg-slate-700 border border-slate-600 rounded-lg text-slate-300 hover:bg-slate-600 hover:text-white cursor-pointer transition-colors w-fit">
            {uploading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Upload className="w-4 h-4" />}
            <span className="text-sm">{uploading ? "Yükleniyor..." : "Dosya Seç"}</span>
            <input type="file" accept="image/*" onChange={handleFileChange} className="hidden" disabled={uploading} />
          </label>
          {value && <button type="button" onClick={() => onChange("")} className="text-red-400 text-xs mt-1.5 hover:text-red-300">Görseli Kaldır</button>}
        </div>
      </div>
    </div>
  );
};

// ==================== FRONTEND COMPONENTS ====================

const DynamicIcon = ({ name, className }) => {
  switch (name) {
    case "Phone": return <Phone className={className} />;
    case "Mail": return <Mail className={className} />;
    case "MessageCircle": return <MessageCircle className={className} />;
    case "CheckCircle": return <CheckCircle className={className} />;
    case "Star": return <Star className={className} />;
    case "BookOpen": return <BookOpen className={className} />;
    case "Users": return <Users className={className} />;
    case "MousePointerClick": return <MousePointerClick className={className} />;
    case "LayoutGrid": return <LayoutGrid className={className} />;
    case "GraduationCap": return <GraduationCap className={className} />;
    case "Building2": return <Building2 className={className} />;
    case "Award": return <Award className={className} />;
    case "Briefcase": return <Briefcase className={className} />;
    case "Calendar": return <Calendar className={className} />;
    default: return <Calendar className={className} />;
  }
};

const StickyHeader = ({ siteTexts = {}, siteSettings = {} }) => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 50);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const navLinks = [
    { href: "/", label: "Ana Sayfa" },
    { href: "/hizmetler", label: "Hizmetler" },
    { href: "/ogretmenler", label: "Öğretmenler" },
    { href: "/iletisim", label: "İletişim" }
  ];

  return (
    <header className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${isScrolled ? "bg-[var(--theme-bg)]/90 backdrop-blur-xl border-b border-[var(--theme-accent)]/10 shadow-lg py-3" : "bg-transparent py-5"}`}>
      <div className="max-w-7xl mx-auto px-6 md:px-12 flex items-center justify-between">
        <a href="/" className="flex items-center gap-3 group">
          <img src={LOGO_URL} alt="FSS Akademi" className="w-10 h-10 rounded-full object-cover border-2 border-[var(--theme-accent)]/30 group-hover:scale-105 transition-transform" />
          <span className="font-playfair text-xl text-white group-hover:text-[var(--theme-accent)] transition-colors">FSS Akademi</span>
        </a>
        <nav className="hidden md:flex items-center gap-8">
          {navLinks.map((link) => (<Link key={link.href} to={link.href} className="font-manrope text-sm font-medium text-slate-300 hover:text-[var(--theme-accent)] transition-colors">{link.label}</Link>))}
          <a href={`https://wa.me/${siteSettings.whatsappNumber || "905436619340"}`} target="_blank" rel="noopener noreferrer" className="hidden md:flex items-center gap-2 bg-gradient-to-r from-[var(--theme-accent)] to-[var(--theme-accent-hover)] text-[var(--theme-bg)] px-6 py-2.5 rounded-full font-bold hover:scale-105 transition-transform shadow-lg text-sm">
            <DynamicIcon name={siteTexts.appointmentBtnIcon} className="w-4 h-4" />{siteTexts.appointmentBtnText || "Ücretsiz Randevu"}
          </a>
        </nav>
        <button onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)} className="md:hidden text-white p-2">
          {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
        </button>
      </div>
      {isMobileMenuOpen && (
        <nav className="md:hidden bg-academic-navy/98 backdrop-blur-lg border-t border-[var(--theme-accent)]/10 p-6 flex flex-col gap-4">
          {navLinks.map((link) => (<Link key={link.href} to={link.href} onClick={() => setIsMobileMenuOpen(false)} className="text-slate-300 hover:text-[var(--theme-accent)] py-2">{link.label}</Link>))}
          <a href={WHATSAPP_URL} target="_blank" rel="noopener noreferrer" className="flex items-center justify-center gap-2 bg-academic-gold text-academic-navy rounded-full px-5 py-3 font-semibold text-sm mt-2">
            <Calendar className="w-4 h-4" />Ücretsiz Randevu
          </a>
        </nav>
      )}
    </header>
  );
};

const WhatsAppButton = () => {
  const [isVisible, setIsVisible] = useState(false);
  useEffect(() => {
    const handleScroll = () => setIsVisible(window.scrollY > 300);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <a href={WHATSAPP_URL} target="_blank" rel="noopener noreferrer" className={`fixed bottom-24 right-6 z-40 flex items-center gap-3 bg-green-500 hover:bg-green-600 text-white rounded-full shadow-lg transition-all duration-300 ${isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10 pointer-events-none"}`}>
      <div className="p-3"><svg className="w-7 h-7" fill="currentColor" viewBox="0 0 24 24"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/></svg></div>
      <span className="pr-5 font-medium hidden sm:block">WhatsApp</span>
    </a>
  );
};

const HeroSection = ({ aboutContent, siteTexts = {}, siteSettings = {}, heroButtons = [] }) => {
  const [scrollY, setScrollY] = useState(0);
  useEffect(() => {
    const handleScroll = () => setScrollY(window.scrollY);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <section id="hero" className="hero-bg mesh-gradient-dark min-h-[85vh] flex flex-col items-center justify-center relative px-6 md:px-12 pt-24 pb-16">
      <div className="floating-shape floating-shape-1" style={{ transform: `translateY(${scrollY * 0.1}px)` }} />
      <div className="floating-shape floating-shape-2" style={{ transform: `translateY(${scrollY * -0.15}px)` }} />
      <div className="logo-container mb-8 opacity-0 animate-fade-in-up" style={{ animationDelay: "0.2s", animationFillMode: "forwards" }}>
        <img src={LOGO_URL} alt="FSS Akademi Logo" className="w-32 h-32 md:w-40 md:h-40 rounded-full object-cover border-4 border-[var(--theme-accent)]/50 shadow-[0_0_30px_rgba(212,175,55,0.3)]" />
      </div>
      <span className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-white/5 border border-[var(--theme-accent)]/20 text-white text-sm font-semibold backdrop-blur-md mb-6 opacity-0 animate-fade-in-up shadow-xl" style={{ animationDelay: "0.3s", animationFillMode: "forwards" }}>
        {siteTexts.heroBadgeText || "🚀 Geleceğin Eğitim Platformu"}
      </span>
      <h1 className="font-playfair text-4xl sm:text-5xl lg:text-7xl font-black text-white text-center mb-8 opacity-0 animate-fade-in-up tracking-tight" style={{ animationDelay: "0.4s", animationFillMode: "forwards" }}>
        <span className="text-gradient-gold italic pr-2">{siteTexts.heroTitle || "Biz Kimiz?"}</span>
      </h1>
      <p className="font-manrope text-base md:text-xl text-slate-300 text-center max-w-3xl leading-relaxed opacity-0 animate-fade-in-up px-4" style={{ animationDelay: "0.6s", animationFillMode: "forwards" }}>
        {aboutContent}<span className="text-[var(--theme-accent)] font-medium"> {siteTexts.heroSubtitle || "Başarı yolculuğunuzda güvenilir yol arkadaşınız olmaktan gurur duyuyoruz."}</span>
      </p>
      
      {heroButtons && heroButtons.length > 0 ? (
        <div className="mt-10 flex flex-wrap justify-center gap-4 opacity-0 animate-fade-in-up" style={{ animationDelay: "0.8s", animationFillMode: "forwards" }}>
          {heroButtons.map(btn => {
            // Internal links: start with '/' or exactly '#services'
            const isInternal = btn.url.startsWith('/') || btn.url === '#services';
            const internalPath = btn.url === '#services' ? '/hizmetler' : btn.url;
            
            const btnClass = `flex items-center gap-3 ${btn.styleType === 'outline' ? 'border-2 border-[var(--theme-accent)] text-[var(--theme-accent)]' : 'bg-gradient-to-r from-[var(--theme-accent)] to-[var(--theme-accent-hover)] text-[var(--theme-bg)]'} rounded-full px-8 py-4 font-bold text-lg hover:scale-105 transition-transform shadow-[0_10px_30px_rgba(212,175,55,0.3)]`;
            
            if (isInternal) {
              return (
                <Link key={btn.id} to={internalPath} className={btnClass}>
                  <DynamicIcon name={btn.icon || "MousePointerClick"} className="w-6 h-6" />{btn.text}
                </Link>
              );
            }
            
            // External links (http) or default WhatsApp fallback
            const finalUrl = btn.url.startsWith('http') ? btn.url : `https://wa.me/${siteSettings.whatsappNumber || "905436619340"}`;
            return (
              <a key={btn.id} href={finalUrl} target={btn.url.startsWith('http') ? '_blank' : '_self'} rel="noopener noreferrer" className={btnClass}>
                <DynamicIcon name={btn.icon || "MousePointerClick"} className="w-6 h-6" />{btn.text}
              </a>
            );
          })}
        </div>
      ) : (
        <a href={`https://wa.me/${siteSettings.whatsappNumber || "905436619340"}`} target="_blank" rel="noopener noreferrer" className="mt-10 flex items-center gap-3 bg-gradient-to-r from-[var(--theme-accent)] to-[var(--theme-accent-hover)] text-[var(--theme-bg)] rounded-full px-10 py-5 font-bold text-lg opacity-0 animate-fade-in-up hover:scale-105 transition-transform shadow-[0_10px_30px_rgba(212,175,55,0.3)]" style={{ animationDelay: "0.8s", animationFillMode: "forwards" }}>
          <DynamicIcon name={siteTexts.appointmentBtnIcon || "Calendar"} className="w-6 h-6" />{siteTexts.appointmentBtnText || "Ücretsiz Danışmanlık Randevusu Al"}
        </a>
      )}

      <Link to="/hizmetler" className="absolute bottom-4 left-1/2 -translate-x-1/2 text-[var(--theme-accent)] opacity-60 hover:opacity-100 hover:translate-y-2 transition-all"><ArrowDown className="w-8 h-8" /></Link>
    </section>
  );
};

const FeaturesSection = ({ features = [] }) => {
  const displayFeatures = features && features.length > 0 ? features : [
    { id: 1, title: "Uzman Eğitmenler", desc: "Alanında en iyi akademisyenler", icon: "BookOpen", colorTheme: "gold" },
    { id: 2, title: "Birebir İlgi", desc: "Öğrenciye özel programlama", icon: "Users", colorTheme: "gold" },
    { id: 3, title: "Tam Uyumlu", desc: "Sınav müfredatıyla %100 uyum", icon: "CheckCircle", colorTheme: "gold" }
  ];

  const getColorClasses = (theme) => {
    if (theme && theme.startsWith('#')) {
      return {
        isCustom: true,
        bg: '',
        styleBg: { backgroundImage: `linear-gradient(to bottom right, ${theme}, ${theme}cc)` },
        shadow: `${theme}26`, 
        textHover: '',
        iconColor: 'text-white'
      };
    }
    switch (theme) {
      case 'red': return { bg: 'from-red-500 to-red-600', shadow: 'rgba(239,68,68,0.15)', textHover: 'group-hover:text-red-500', iconColor: 'text-white' };
      case 'emerald': return { bg: 'from-emerald-500 to-emerald-600', shadow: 'rgba(16,185,129,0.15)', textHover: 'group-hover:text-emerald-500', iconColor: 'text-white' };
      case 'orange': return { bg: 'from-orange-500 to-orange-600', shadow: 'rgba(249,115,22,0.15)', textHover: 'group-hover:text-orange-500', iconColor: 'text-white' };
      case 'purple': return { bg: 'from-purple-500 to-purple-600', shadow: 'rgba(168,85,247,0.15)', textHover: 'group-hover:text-purple-500', iconColor: 'text-white' };
      case 'blue': return { bg: 'from-blue-500 to-blue-600', shadow: 'rgba(59,130,246,0.15)', textHover: 'group-hover:text-blue-500', iconColor: 'text-white' };
      default: return { bg: 'from-[var(--theme-accent)] to-[var(--theme-accent-hover)]', shadow: 'rgba(212,175,55,0.15)', textHover: 'group-hover:text-[var(--theme-accent)]', iconColor: 'text-[var(--theme-bg)]' }; // gold default
    }
  };

  return (
    <section className="py-12 px-6 md:px-12 bg-[var(--theme-bg)] relative z-20">
      <div className="max-w-6xl mx-auto grid grid-cols-2 md:grid-cols-3 gap-4 md:gap-8">
        {displayFeatures.map(feat => {
          const colors = getColorClasses(feat.colorTheme);
          return (
            <Link key={feat.id} id={`feat-${feat.id}`} to="/hizmetler" className="block group relative bg-[var(--theme-bg-light)] rounded-3xl p-6 md:p-8 shadow-xl border border-[var(--theme-accent)]/10 text-center md:text-left overflow-hidden hover:-translate-y-1 transition-transform">
              {colors.isCustom && <style>{`#feat-${feat.id}:hover h3 { color: ${feat.colorTheme} !important; }`}</style>}
              <div className="absolute inset-0 rounded-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" style={{ background: `linear-gradient(135deg, transparent 30%, ${colors.shadow} 50%, transparent 70%)`, backgroundSize: '200% 200%' }} />
              <div className="relative z-10">
                <div className={`w-14 h-14 md:w-16 md:h-16 rounded-2xl flex items-center justify-center mb-4 md:mb-6 shadow-lg mx-auto md:mx-0 ${colors.isCustom ? '' : 'bg-gradient-to-br ' + colors.bg}`} style={colors.isCustom ? colors.styleBg : {}}>
                  <DynamicIcon name={feat.icon} className={`w-7 h-7 md:w-8 md:h-8 ${colors.iconColor}`} />
                </div>
                <h3 className={`text-lg md:text-2xl font-bold text-white mb-2 transition-colors ${colors.isCustom ? '' : colors.textHover}`}>{feat.title}</h3>
                <p className="text-sm md:text-base text-slate-400">{feat.desc}</p>
              </div>
            </Link>
          );
        })}
      </div>
    </section>
  );
};

const DynamicServicesSection = ({ academicServices, studentServices, siteTexts = {} }) => (
  <section id="services" className="flex flex-col lg:flex-row min-h-screen relative z-10">
    <div className="lg:w-1/2 bg-[var(--theme-bg)] relative overflow-hidden py-16 md:py-24 px-6 md:px-12 lg:px-16 border-t border-[var(--theme-accent)]/10">
      <div className="absolute inset-0 opacity-50 pointer-events-none" style={{ background: 'radial-gradient(circle at 0% 0%, var(--theme-accent) 0%, transparent 75%)' }} />
      <div className="relative z-10 max-w-xl mx-auto lg:mx-0">
        <span className="font-space text-xs tracking-[0.3em] text-[var(--theme-accent)] uppercase mb-4 block">{siteTexts.academicLabel || "Profesyonel Eğitim"}</span>
        <h2 className="font-playfair text-3xl md:text-4xl lg:text-5xl mb-4" style={{ color: siteTexts.academicTitleColor || 'white' }}>{(siteTexts.academicTitle || "Akademik & Kurumsal").split("&").length > 1 ? <>{(siteTexts.academicTitle || "Akademik & Kurumsal").split("&")[0]}& <span className="italic" style={{ color: siteTexts.academicTitleColor || 'var(--theme-accent)' }}>{(siteTexts.academicTitle || "Akademik & Kurumsal").split("&")[1]}</span></> : <span style={{ color: siteTexts.academicTitleColor || 'var(--theme-accent)' }} className="italic">{siteTexts.academicTitle || "Akademik & Kurumsal"}</span>}</h2>
        <p className="font-manrope text-slate-400 mb-10">{siteTexts.academicDesc || "Araştırmacılar, akademisyenler ve kurumlar için profesyonel eğitim programları."}</p>
        <Accordion type="single" collapsible className="space-y-6">
          {academicServices.map((service) => (
            <AccordionItem key={service.id} value={service.id} className="bg-[var(--theme-bg-light)] rounded-3xl border border-[var(--theme-accent)]/20 hover:border-[var(--theme-accent)]/50 transition-all overflow-hidden shadow-xl">
              <AccordionTrigger className="px-8 py-6 hover:no-underline group">
                <div className="flex items-center gap-5">
                  <span className="w-12 h-12 rounded-2xl bg-gradient-to-br from-[var(--theme-accent)]/20 to-transparent flex items-center justify-center text-[var(--theme-accent)] shadow-inner">{ICON_MAP[service.icon] || <GraduationCap className="w-6 h-6" />}</span>
                  <span className="text-xl font-bold text-white text-left group-hover:text-[var(--theme-accent)] transition-colors">{service.title}</span>
                </div>
              </AccordionTrigger>
              <AccordionContent className="px-8 pb-8 pt-2">
                {service.mediaUrl && <div className="mb-6 rounded-2xl overflow-hidden shadow-lg"><img src={service.mediaUrl} alt={service.title} className="w-full h-56 object-cover" /></div>}
                <ul className="space-y-5">
                  {service.items?.map((item, i) => (
                    <li key={i} className="flex items-start gap-4 text-slate-300">
                      <span className="w-2 h-2 bg-[var(--theme-accent)] rounded-full mt-2 flex-shrink-0" />
                      <div><span className="font-bold text-white text-lg">{item.name}</span><p className="text-base text-slate-400 mt-1 leading-relaxed">{item.desc}</p></div>
                    </li>
                  ))}
                </ul>
                {service.fileUrl && <a href={service.fileUrl} target="_blank" rel="noopener noreferrer" className="mt-6 inline-flex items-center gap-2 bg-[var(--theme-accent)]/10 text-[var(--theme-accent)] px-4 py-2 rounded-xl text-sm font-semibold hover:bg-[var(--theme-accent)]/20 transition-colors"><File className="w-4 h-4" /> Materyali İndir</a>}
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </div>
    </div>
    <div className="lg:w-1/2 bg-[var(--theme-bg-light)] relative overflow-hidden py-16 md:py-24 px-6 md:px-12 lg:px-16 border-t border-[var(--theme-accent)]/10">
      <div className="absolute inset-0 opacity-50 pointer-events-none" style={{ background: 'radial-gradient(circle at 100% 100%, var(--theme-accent) 0%, transparent 75%)' }} />
      <div className="relative z-10 max-w-xl mx-auto lg:mx-0 lg:ml-auto">
        <span className="font-space text-xs tracking-[0.3em] text-[var(--theme-accent)] uppercase mb-4 block">{siteTexts.studentLabel || "Bireysel Gelişim"}</span>
        <h2 className="font-playfair text-3xl md:text-4xl lg:text-5xl mb-4" style={{ color: siteTexts.studentTitleColor || 'white' }}>{(siteTexts.studentTitle || "Veliler & Öğrenciler").split("&").length > 1 ? <>{(siteTexts.studentTitle || "Veliler & Öğrenciler").split("&")[0]}& <span className="italic" style={{ color: siteTexts.studentTitleColor || 'var(--theme-accent)' }}>{(siteTexts.studentTitle || "Veliler & Öğrenciler").split("&")[1]}</span></> : <span style={{ color: siteTexts.studentTitleColor || 'var(--theme-accent)' }} className="italic">{siteTexts.studentTitle || "Veliler & Öğrenciler"}</span>}</h2>
        <p className="font-manrope text-slate-400 mb-10">{siteTexts.studentDesc || "Çocuklarınızın matematik becerilerini geliştirmek için kapsamlı programlar."}</p>
        <Accordion type="single" collapsible className="space-y-6">
          {studentServices.map((service) => (
            <AccordionItem key={service.id} value={service.id} className="bg-[var(--theme-bg)] rounded-3xl border border-[var(--theme-accent)]/20 hover:border-[var(--theme-accent)]/50 transition-all overflow-hidden shadow-xl">
              <AccordionTrigger className="px-8 py-6 hover:no-underline group">
                <div className="flex items-center gap-5">
                  <span className="w-12 h-12 rounded-2xl bg-gradient-to-br from-[var(--theme-accent)]/20 to-transparent flex items-center justify-center text-[var(--theme-accent)] shadow-inner">{ICON_MAP[service.icon] || <Users className="w-6 h-6" />}</span>
                  <span className="text-xl font-bold text-white text-left group-hover:text-[var(--theme-accent)] transition-colors">{service.title}</span>
                </div>
              </AccordionTrigger>
              <AccordionContent className="px-8 pb-8 pt-2">
                {service.mediaUrl && <div className="mb-6 rounded-2xl overflow-hidden shadow-lg"><img src={service.mediaUrl} alt={service.title} className="w-full h-56 object-cover" /></div>}
                <ul className="space-y-5">
                  {service.items?.map((item, i) => (
                    <li key={i} className="flex items-start gap-4 text-slate-300">
                      <span className="w-2 h-2 bg-[var(--theme-accent)] rounded-full mt-2 flex-shrink-0" />
                      <div><span className="font-bold text-white text-lg">{item.name}</span><p className="text-base text-slate-400 mt-1 leading-relaxed">{item.desc}</p></div>
                    </li>
                  ))}
                </ul>
                {service.fileUrl && <a href={service.fileUrl} target="_blank" rel="noopener noreferrer" className="mt-6 inline-flex items-center gap-2 bg-[var(--theme-accent)]/10 text-[var(--theme-accent)] px-4 py-2 rounded-xl text-sm font-semibold hover:bg-[var(--theme-accent)]/20 transition-colors"><File className="w-4 h-4" /> Materyali İndir</a>}
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </div>
    </div>
  </section>
);

const CustomSectionsDisplay = ({ sections }) => {
  if (!sections?.length) return null;
  return sections.map((section) => (
    <section key={section.id} className="mesh-gradient-dark py-20 md:py-28 px-6 md:px-12">
      <div className="max-w-4xl mx-auto text-center">
        <h2 className="font-playfair text-3xl md:text-4xl lg:text-5xl text-white mb-8"><span className="text-gradient-gold italic">{section.title}</span></h2>
        <div className="glass-dark rounded-2xl p-8 md:p-12 border border-academic-gold/20">
          {section.mediaUrl && <div className="mb-6 rounded-xl overflow-hidden border-2 border-academic-gold/30 mx-auto max-w-2xl"><img src={section.mediaUrl} alt={section.title} className="w-full h-64 md:h-80 object-cover" /></div>}
          <p className="font-manrope text-base md:text-lg text-slate-300 leading-relaxed whitespace-pre-wrap">{section.content}</p>
          {section.fileUrl && <a href={section.fileUrl} target="_blank" rel="noopener noreferrer" className="mt-6 inline-flex items-center gap-2 bg-academic-gold/20 text-academic-gold px-6 py-3 rounded-full"><File className="w-5 h-5" /> Dosyayı İndir</a>}
        </div>
      </div>
    </section>
  ));
};

const ContentsSection = ({ contents }) => {
  if (!contents?.length) return null;
  const getCategoryLabel = (cat) => ({ education: "Eğitim", announcement: "Duyuru", blog: "Blog" }[cat] || cat);
  const formatDate = (d) => { try { return new Date(d).toLocaleDateString("tr-TR", { day: "numeric", month: "long", year: "numeric" }); } catch { return ""; } };
  return (
    <section id="contents" className="mesh-gradient-dark py-20 md:py-28 px-6 md:px-12">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-16">
          <span className="font-space text-xs tracking-[0.3em] text-academic-gold uppercase mb-4 block">Haberler & Duyurular</span>
          <h2 className="font-playfair text-3xl md:text-4xl lg:text-5xl text-white mb-4">
            <span className="text-gradient-gold italic">Son İçerikler</span>
          </h2>
          <p className="font-manrope text-slate-400 max-w-2xl mx-auto">Eğitim dünyasından en güncel içerikler ve duyurular.</p>
        </div>
        <div className={`grid gap-6 ${contents.length === 1 ? 'max-w-lg mx-auto' : contents.length === 2 ? 'grid-cols-1 md:grid-cols-2 max-w-4xl mx-auto' : 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3'}`}>
          {contents.slice(0, 6).map((item, index) => (
            <div key={item.id} className="glass-dark rounded-2xl overflow-hidden border border-academic-gold/10 hover:border-academic-gold/30 transition-all duration-300 group opacity-0 animate-fade-in-up" style={{ animationDelay: `${0.2 + index * 0.1}s`, animationFillMode: "forwards" }}>
              {item.coverImage && (
                <div className="aspect-video overflow-hidden">
                  <img src={item.coverImage} alt={item.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                </div>
              )}
              <div className="p-6">
                <div className="flex items-center gap-2 mb-3">
                  <span className="px-2.5 py-1 rounded-full text-xs font-medium bg-academic-gold/10 text-academic-gold border border-academic-gold/20">{getCategoryLabel(item.category)}</span>
                  {item.createdAt && <span className="text-xs text-slate-500">{formatDate(item.createdAt)}</span>}
                </div>
                <h3 className="font-playfair text-lg text-white group-hover:text-academic-gold transition-colors mb-2 line-clamp-2">{item.title}</h3>
                <p className="font-manrope text-sm text-slate-400 line-clamp-3">{item.content}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

const TeachersSection = ({ teachers, siteTexts = {} }) => {
  if (!teachers?.length) return null;
  return (
    <section id="teachers" className="mesh-gradient-dark py-20 md:py-28 px-6 md:px-12">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-16">
          <span className="font-space text-xs tracking-[0.3em] text-academic-gold uppercase mb-4 block">{siteTexts.teachersLabel || "Ekibimiz"}</span>
          <h2 className="font-playfair text-3xl md:text-4xl lg:text-5xl text-white mb-4">
            <span className="text-gradient-gold italic">{siteTexts.teachersTitle || "Öğretmenlerimiz"}</span>
          </h2>
          <p className="font-manrope text-slate-400 max-w-2xl mx-auto">{siteTexts.teachersDesc || "Alanında uzman, deneyimli eğitim kadromuzla tanışın."}</p>
        </div>
        <div className={`grid gap-8 ${teachers.length === 1 ? 'max-w-sm mx-auto' : teachers.length === 2 ? 'grid-cols-1 md:grid-cols-2 max-w-3xl mx-auto' : 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3'}`}>
          {teachers.map((teacher, index) => (
            <div key={teacher.id} className="glass-dark rounded-2xl p-6 border border-academic-gold/20 hover:border-academic-gold/40 transition-all duration-300 group opacity-0 animate-fade-in-up" style={{ animationDelay: `${0.2 + index * 0.15}s`, animationFillMode: "forwards" }}>
              <div className="flex flex-col items-center text-center">
                {teacher.photoUrl ? (
                  <img src={teacher.photoUrl} alt={teacher.name} className="w-28 h-28 rounded-full object-cover border-4 border-academic-gold/30 group-hover:border-academic-gold/60 transition-all mb-5" />
                ) : (
                  <div className="w-28 h-28 rounded-full bg-academic-navy-light border-4 border-academic-gold/30 group-hover:border-academic-gold/60 transition-all mb-5 flex items-center justify-center">
                    <UserCheck className="w-10 h-10 text-academic-gold/60" />
                  </div>
                )}
                <h3 className="font-playfair text-xl text-white group-hover:text-academic-gold transition-colors">{teacher.name}</h3>
                <p className="font-space text-xs tracking-wider text-academic-gold mt-1 uppercase">{teacher.title}</p>
                {teacher.bio && <p className="font-manrope text-sm text-slate-400 mt-4 leading-relaxed">{teacher.bio}</p>}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

const ContactSection = () => {
  const [formData, setFormData] = useState({ name: "", email: "", phone: "", category: "", message: "" });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      // 1. Send email via Web3Forms (client-side)
      const web3Data = new URLSearchParams();
      web3Data.append("access_key", "c872519d-1773-45ee-9b8a-e3fce5c1ffcf");
      web3Data.append("subject", `FSS Akademi - Yeni Mesaj: ${formData.name}`);
      web3Data.append("from_name", "FSS Akademi İletişim Formu");
      web3Data.append("replyto", formData.email);
      web3Data.append("name", formData.name);
      web3Data.append("email", formData.email);
      web3Data.append("phone", formData.phone || "Belirtilmedi");
      web3Data.append("message", formData.message);
      
      await fetch("https://api.web3forms.com/submit", { method: "POST", body: web3Data, mode: "no-cors" });
      
      // 2. Try to save to our database (ignoring failures so form still succeeds)
      fetch(`${API}/messages`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...formData, subject: formData.category || "Genel" })
      }).catch(err => console.warn("Backend kapalı:", err));

      setSubmitStatus("success");
      setFormData({ name: "", email: "", phone: "", category: "", message: "" });
    } catch (error) {
      setSubmitStatus("error");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <section id="contact" className="mesh-gradient-dark py-24 md:py-32 px-6 md:px-12">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-16">
          <span className="font-space text-xs tracking-[0.3em] text-academic-gold uppercase mb-4 block">İletişim</span>
          <h2 className="font-playfair text-3xl md:text-4xl lg:text-5xl text-white mb-4">Bizimle <span className="text-gradient-gold italic">İletişime Geçin</span></h2>
        </div>
        <div className="glass-dark rounded-2xl p-8 md:p-12 glow-gold">
          <form onSubmit={handleSubmit} className="contact-form space-y-8">
            <input type="hidden" name="access_key" value="c872519d-1773-45ee-9b8a-e3fce5c1ffcf" />
            <input type="hidden" name="subject" value="FSS Akademi - Yeni İletişim Formu" />
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <input type="text" name="name" value={formData.name} onChange={(e) => setFormData({...formData, name: e.target.value})} placeholder="Adınız Soyadınız" required className="w-full" />
              <input type="email" name="email" value={formData.email} onChange={(e) => setFormData({...formData, email: e.target.value})} placeholder="E-posta Adresiniz" required className="w-full" />
              <input type="tel" name="phone" value={formData.phone} onChange={(e) => setFormData({...formData, phone: e.target.value})} placeholder="Telefon Numaranız" className="w-full" />
              <select name="category" value={formData.category} onChange={(e) => setFormData({...formData, category: e.target.value})} required className="w-full cursor-pointer">
                {CATEGORIES.map((cat) => (<option key={cat.value} value={cat.value}>{cat.label}</option>))}
              </select>
            </div>
            <textarea name="message" value={formData.message} onChange={(e) => setFormData({...formData, message: e.target.value})} placeholder="Mesajınız" rows="4" required className="w-full resize-none" />
            <div className="flex flex-col items-center gap-4">
              <button type="submit" disabled={isSubmitting} className="bg-academic-gold text-academic-navy rounded-full px-12 py-4 font-semibold text-lg flex items-center gap-3 hover:bg-academic-gold-dim disabled:opacity-50">
                {isSubmitting ? "Gönderiliyor..." : "Gönder"} <Send className="w-5 h-5" />
              </button>
              {submitStatus === "success" && <p className="text-green-400">Mesajınız başarıyla gönderildi!</p>}
              {submitStatus === "error" && <p className="text-red-400">Mesaj gönderilirken bir hata oluştu. Lütfen daha sonra tekrar deneyiniz.</p>}
            </div>
          </form>
        </div>
      </div>
    </section>
  );
};

const Footer = () => (
  <footer className="bg-black py-16 px-6 md:px-12">
    <div className="max-w-7xl mx-auto">
      <div className="flex flex-col md:flex-row items-center justify-between gap-8 mb-12">
        <div className="flex items-center gap-4">
          <img src={LOGO_URL} alt="FSS Akademi" className="w-12 h-12 rounded-full border-2 border-academic-gold/30" />
          <span className="font-playfair text-xl text-white">FSS <span className="text-academic-gold">Akademi</span></span>
        </div>
        <div className="flex items-center gap-4">
          {Object.entries(SOCIAL_LINKS).map(([key, url]) => (
            <a key={key} href={url} target="_blank" rel="noopener noreferrer" className="social-icon" aria-label={key}>
              {key === 'linkedin' && <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/></svg>}
              {key === 'instagram' && <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z"/></svg>}
              {key === 'youtube' && <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/></svg>}
              {key === 'tiktok' && <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M12.525.02c1.31-.02 2.61-.01 3.91-.02.08 1.53.63 3.09 1.75 4.17 1.12 1.11 2.7 1.62 4.24 1.79v4.03c-1.44-.05-2.89-.35-4.2-.97-.57-.26-1.1-.59-1.62-.93-.01 2.92.01 5.84-.02 8.75-.08 1.4-.54 2.79-1.35 3.94-1.31 1.92-3.58 3.17-5.91 3.21-1.43.08-2.86-.31-4.08-1.03-2.02-1.19-3.44-3.37-3.65-5.71-.02-.5-.03-1-.01-1.49.18-1.9 1.12-3.72 2.58-4.96 1.66-1.44 3.98-2.13 6.15-1.72.02 1.48-.04 2.96-.04 4.44-.99-.32-2.15-.23-3.02.37-.63.41-1.11 1.04-1.36 1.75-.21.51-.15 1.07-.14 1.61.24 1.64 1.82 3.02 3.5 2.87 1.12-.01 2.19-.66 2.77-1.61.19-.33.4-.67.41-1.06.1-1.79.06-3.57.07-5.36.01-4.03-.01-8.05.02-12.07z"/></svg>}
              {key === 'twitter' && <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/></svg>}
            </a>
          ))}
        </div>
      </div>
      <div className="h-px bg-gradient-to-r from-transparent via-academic-gold/30 to-transparent mb-8" />
      <p className="text-center text-slate-500 text-sm">Copyright © 2026 FSS Akademi. Tüm hakları saklıdır.</p>
    </div>
  </footer>
);

// ==================== ADMIN PANEL ====================

const AdminLogin = ({ onLogin }) => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    if (username === "admin" && password === "admin123") {
      onLogin();
    } else {
      setError("Kullanıcı adı veya şifre hatalı");
    }
    setLoading(false);
  };

  return (
    <div className="min-h-screen bg-slate-900 flex items-center justify-center px-6">
      <div className="bg-slate-800 rounded-2xl p-8 md:p-12 w-full max-w-md border border-slate-700 shadow-2xl">
        <div className="text-center mb-8">
          <img src={LOGO_URL} alt="FSS Akademi" className="w-16 h-16 rounded-full mx-auto mb-4 border-2 border-academic-gold/30" />
          <h1 className="font-playfair text-2xl text-white">Yönetici Girişi</h1>
          <p className="text-slate-400 text-sm mt-2">FSS Akademi Admin Panel</p>
        </div>
        <form onSubmit={handleSubmit} className="space-y-6">
          <input data-testid="admin-username-input" type="text" value={username} onChange={(e) => setUsername(e.target.value)} placeholder="Kullanıcı Adı" className="w-full bg-slate-700 border border-slate-600 rounded-lg px-4 py-3 text-white placeholder-slate-400 focus:border-academic-gold focus:outline-none" required />
          <div className="relative">
            <input data-testid="admin-password-input" type={showPassword ? "text" : "password"} value={password} onChange={(e) => setPassword(e.target.value)} placeholder="Şifre" className="w-full bg-slate-700 border border-slate-600 rounded-lg px-4 py-3 pr-12 text-white placeholder-slate-400 focus:border-academic-gold focus:outline-none" required />
            <button data-testid="toggle-password-btn" type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-academic-gold p-1">
              {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
            </button>
          </div>
          {error && <p data-testid="login-error" className="text-red-400 text-sm text-center">{error}</p>}
          <button data-testid="admin-login-btn" type="submit" disabled={loading} className="w-full bg-academic-gold text-academic-navy font-semibold py-3 rounded-lg hover:bg-academic-gold-dim disabled:opacity-50">{loading ? "Giriş yapılıyor..." : "Giriş Yap"}</button>
        </form>
        <div className="mt-6 text-center"><a href="/" className="text-slate-500 hover:text-academic-gold text-sm">← Ana Sayfaya Dön</a></div>
      </div>
    </div>
  );
};

const AdminDashboard = ({ stats, recentMessages, recentContents, setActiveView }) => (
  <div className="space-y-8">
    <div>
      <h1 className="text-2xl font-bold text-white mb-2">Dashboard</h1>
      <p className="text-slate-400">FSS Akademi yönetim paneline hoş geldiniz.</p>
    </div>
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      <div className="bg-gradient-to-br from-blue-600 to-blue-700 rounded-2xl p-6 shadow-lg">
        <div className="flex items-center justify-between">
          <div><p className="text-blue-200 text-sm">Toplam İçerik</p><p className="text-3xl font-bold text-white mt-1">{stats.totalContents}</p></div>
          <div className="w-12 h-12 bg-blue-500/30 rounded-xl flex items-center justify-center"><BookMarked className="w-6 h-6 text-white" /></div>
        </div>
      </div>
      <div className="bg-gradient-to-br from-orange-500 to-orange-600 rounded-2xl p-6 shadow-lg">
        <div className="flex items-center justify-between">
          <div><p className="text-orange-200 text-sm">Okunmamış Mesaj</p><p className="text-3xl font-bold text-white mt-1">{stats.unreadMessages}</p></div>
          <div className="w-12 h-12 bg-orange-400/30 rounded-xl flex items-center justify-center"><Mail className="w-6 h-6 text-white" /></div>
        </div>
      </div>
      <div className="bg-gradient-to-br from-green-500 to-green-600 rounded-2xl p-6 shadow-lg">
        <div className="flex items-center justify-between">
          <div><p className="text-green-200 text-sm">Toplam Görüntüleme</p><p className="text-3xl font-bold text-white mt-1">{stats.totalViews}</p></div>
          <div className="w-12 h-12 bg-green-400/30 rounded-xl flex items-center justify-center"><Eye className="w-6 h-6 text-white" /></div>
        </div>
      </div>
      <div className="bg-gradient-to-br from-purple-500 to-purple-600 rounded-2xl p-6 shadow-lg">
        <div className="flex items-center justify-between">
          <div><p className="text-purple-200 text-sm">Öğretmenler</p><p className="text-3xl font-bold text-white mt-1">{stats.totalTeachers || 0}</p></div>
          <div className="w-12 h-12 bg-purple-400/30 rounded-xl flex items-center justify-center"><UserCheck className="w-6 h-6 text-white" /></div>
        </div>
      </div>
    </div>
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      <div className="bg-slate-800 rounded-2xl p-6 border border-slate-700">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold text-white">Son Gelen Mesajlar</h2>
          <button onClick={() => setActiveView("inbox")} className="text-academic-gold text-sm hover:underline">Tümünü Gör</button>
        </div>
        <div className="p-4 mt-4 bg-gray-800 rounded-lg text-gray-300 text-sm border border-gray-700">
          Siteden gelen iletişim mesajları altyapı üzerinden doğrudan kayıtlı e-posta adresinize iletilmektedir. Lütfen e-posta gelen kutunuzu kontrol ediniz.
        </div>
</div>
  ))}
</div>
      <div className="bg-slate-800 rounded-2xl p-6 border border-slate-700">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold text-white">Son Eklenen İçerikler</h2>
          <button onClick={() => setActiveView("contents")} className="text-academic-gold text-sm hover:underline">Tümünü Gör</button>
        </div>
        <div className="space-y-3">
          {recentContents.length === 0 ? <p className="text-slate-500 text-center py-4">Henüz içerik yok</p> : recentContents.map((content) => (
            <div key={content.id} className="p-4 bg-slate-700/50 rounded-xl flex items-center gap-4">
              {content.coverImage && <img src={content.coverImage} alt="" className="w-12 h-12 rounded-lg object-cover" />}
              <div className="flex-1 min-w-0">
                <p className="font-medium text-white truncate">{content.title}</p>
                <p className="text-slate-400 text-sm">{content.views} görüntüleme</p>
              </div>
              <span className={`px-2 py-1 rounded text-xs ${content.status === 'active' ? 'bg-green-500/20 text-green-400' : 'bg-yellow-500/20 text-yellow-400'}`}>{content.status === 'active' ? 'Aktif' : 'Taslak'}</span>
            </div>
          ))}
        </div>
      </div>
  </div>
);

export const AdminContents = () => {
  const [contents, setContents] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [editingContent, setEditingContent] = useState(null);
  const [formData, setFormData] = useState({ title: "", coverImage: "", content: "", status: "draft", category: "education" });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [message, setMessage] = useState({ type: "", text: "" });
  const [loading, setLoading] = useState(false);

  useEffect(() => { fetchContents(); }, []);

  const fetchContents = async () => {
    try { const res = await fetch(`${API}/contents`); setContents(await res.json()); } catch (err) { console.error(err); }
  };

  const showMsg = (type, text) => { setMessage({ type, text }); setTimeout(() => setMessage({ type: "", text: "" }), 3000); };

  const handleSubmit = async () => {
    if (!formData.title || !formData.content) { 
      showMsg("error", "Başlık ve içerik zorunludur"); 
      return; 
    }
    setLoading(true);
    try {
      const url = editingContent ? `${API}/contents/${editingContent.id}` : `${API}/contents`;
      const method = editingContent ? "PUT" : "POST";
      const res = await fetch(url, { method, headers: { "Content-Type": "application/json" }, body: JSON.stringify(formData) });
      if (res.ok) {
        showMsg("success", editingContent ? "İçerik güncellendi!" : "İçerik eklendi!");
        setShowForm(false);
        setEditingContent(null);
        setFormData({ title: "", coverImage: "", content: "", status: "draft", category: "education" });
        fetchContents();
      } else {
        showMsg("error", "İşlem başarısız oldu");
      }
    } catch (err) {
      showMsg("error", "Bir hata oluştu");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Bu içeriği silmek istediğinizden emin misiniz?")) return;
    try { await fetch(`${API}/contents/${id}`, { method: "DELETE" }); showMsg("success", "İçerik silindi"); fetchContents(); }
    catch (err) { showMsg("error", "Silme başarısız"); }
  };

  const handleEdit = (content) => {
    setEditingContent(content);
    setFormData({ title: content.title, coverImage: content.coverImage || "", content: content.content, status: content.status, category: content.category || "education" });
    setShowForm(true);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div><h1 className="text-2xl font-bold text-white">Eğitim / İçerik Yönetimi</h1><p className="text-slate-400 mt-1">Eğitim içeriklerini ve duyuruları yönetin.</p></div>
        <button onClick={() => { setShowForm(true); setEditingContent(null); setFormData({ title: "", coverImage: "", content: "", status: "draft", category: "education" }); }} className="flex items-center gap-2 bg-academic-gold text-academic-navy px-4 py-2 rounded-lg font-semibold hover:bg-academic-gold-dim">
          <Plus className="w-5 h-5" /> Yeni İçerik
        </button>
      </div>
      {message.text && <div className={`p-4 rounded-lg ${message.type === "success" ? "bg-green-500/20 text-green-400" : "bg-red-500/20 text-red-400"}`}>{message.text}</div>}
      {showForm && (
        <div className="bg-slate-800 rounded-2xl p-6 border border-slate-700">
          <h2 className="text-lg font-semibold text-white mb-4">{editingContent ? "İçerik Düzenle" : "Yeni İçerik Ekle"}</h2>
          <div className="space-y-4">
            <input type="text" value={formData.title} onChange={(e) => setFormData({...formData, title: e.target.value})} placeholder="İçerik Başlığı" className="w-full bg-slate-700 border border-slate-600 rounded-lg px-4 py-3 text-white placeholder-slate-400 focus:border-academic-gold focus:outline-none" />
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <ImageUploader value={formData.coverImage} onChange={(url) => setFormData({...formData, coverImage: url})} label="Kapak Görseli" />
              <div>
                <label className="text-slate-400 text-sm block mb-2">Kategori</label>
                <select value={formData.category} onChange={(e) => setFormData({...formData, category: e.target.value})} className="w-full bg-slate-700 border border-slate-600 rounded-lg px-4 py-3 text-white focus:border-academic-gold focus:outline-none">
                <option value="education">Eğitim</option>
                <option value="announcement">Duyuru</option>
                <option value="blog">Blog</option>
              </select>
              </div>
            </div>
            <textarea value={formData.content} onChange={(e) => setFormData({...formData, content: e.target.value})} placeholder="İçerik metni..." rows={8} className="w-full bg-slate-700 border border-slate-600 rounded-lg px-4 py-3 text-white placeholder-slate-400 focus:border-academic-gold focus:outline-none resize-none" />
            <div className="flex items-center justify-between">
              <select value={formData.status} onChange={(e) => setFormData({...formData, status: e.target.value})} className="bg-slate-700 border border-slate-600 rounded-lg px-4 py-2 text-white focus:border-academic-gold focus:outline-none">
                <option value="draft">Taslak</option>
                <option value="active">Aktif (Yayında)</option>
              </select>
              <div className="flex gap-3">
                <button onClick={() => { setShowForm(false); setEditingContent(null); }} className="px-4 py-2 rounded-lg bg-slate-700 text-white hover:bg-slate-600">İptal</button>
                <button onClick={handleSubmit} disabled={loading} className="px-4 py-2 rounded-lg bg-academic-gold text-academic-navy font-semibold hover:bg-academic-gold-dim disabled:opacity-50">{loading ? "Kaydediliyor..." : "Kaydet"}</button>
              </div>
            </div>
          </div>
        </div>
      )}
      <div className="bg-slate-800 rounded-2xl border border-slate-700 overflow-hidden">
        <table className="w-full">
          <thead className="bg-slate-700/50"><tr><th className="text-left p-4 text-slate-300 font-medium">Başlık</th><th className="text-left p-4 text-slate-300 font-medium hidden md:table-cell">Kategori</th><th className="text-left p-4 text-slate-300 font-medium hidden sm:table-cell">Durum</th><th className="text-left p-4 text-slate-300 font-medium hidden lg:table-cell">Görüntüleme</th><th className="text-right p-4 text-slate-300 font-medium">İşlemler</th></tr></thead>
          <tbody>
            {contents.length === 0 ? <tr><td colSpan="5" className="text-center p-8 text-slate-500">Henüz içerik eklenmemiş</td></tr> : contents.map((content) => (
              <tr key={content.id} className="border-t border-slate-700 hover:bg-slate-700/30">
                <td className="p-4"><div className="flex items-center gap-3">{content.coverImage && <img src={content.coverImage} alt="" className="w-10 h-10 rounded-lg object-cover" />}<span className="text-white font-medium">{content.title}</span></div></td>
                <td className="p-4 text-slate-400 hidden md:table-cell">{content.category === 'education' ? 'Eğitim' : content.category === 'announcement' ? 'Duyuru' : 'Blog'}</td>
                <td className="p-4 hidden sm:table-cell"><span className={`px-2 py-1 rounded text-xs ${content.status === 'active' ? 'bg-green-500/20 text-green-400' : 'bg-yellow-500/20 text-yellow-400'}`}>{content.status === 'active' ? 'Aktif' : 'Taslak'}</span></td>
                <td className="p-4 text-slate-400 hidden lg:table-cell">{content.views}</td>
                <td className="p-4 text-right">
                  <button onClick={() => handleEdit(content)} className="p-2 rounded-lg bg-slate-700 text-slate-300 hover:bg-slate-600 mr-2"><Edit className="w-4 h-4" /></button>
                  <button onClick={() => handleDelete(content.id)} className="p-2 rounded-lg bg-red-500/20 text-red-400 hover:bg-red-500/30"><Trash2 className="w-4 h-4" /></button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

const AdminInbox = () => {
  const [messages, setMessages] = useState([]);
  const [selectedMessage, setSelectedMessage] = useState(null);
  const [message, setMessage] = useState({ type: "", text: "" });

  useEffect(() => { fetchMessages(); }, []);

  const fetchMessages = async () => {
    try { const res = await fetch(`${API}/messages`); setMessages(await res.json()); } catch (err) { console.error(err); }
  };

  const showMsg = (type, text) => { setMessage({ type, text }); setTimeout(() => setMessage({ type: "", text: "" }), 3000); };

  const handleMarkRead = async (id) => {
    try { await fetch(`${API}/messages/${id}`, { method: "PUT", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ isRead: true }) }); fetchMessages(); }
    catch (err) { console.error(err); }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Bu mesajı silmek istediğinizden emin misiniz?")) return;
    try { await fetch(`${API}/messages/${id}`, { method: "DELETE" }); showMsg("success", "Mesaj silindi"); setSelectedMessage(null); fetchMessages(); }
    catch (err) { showMsg("error", "Silme başarısız"); }
  };

  const openMessage = (msg) => {
    setSelectedMessage(msg);
    if (!msg.isRead) handleMarkRead(msg.id);
  };

  return (
    <div className="space-y-6">
      <div><h1 className="text-2xl font-bold text-white">Gelen Kutusu</h1><p className="text-slate-400 mt-1">İletişim formundan gelen mesajları yönetin.</p></div>
      {message.text && <div className={`p-4 rounded-lg ${message.type === "success" ? "bg-green-500/20 text-green-400" : "bg-red-500/20 text-red-400"}`}>{message.text}</div>}
      <div className="bg-slate-800 rounded-2xl border border-slate-700 overflow-hidden">
        <table className="w-full">
          <thead className="bg-slate-700/50"><tr><th className="text-left p-4 text-slate-300 font-medium">Gönderen</th><th className="text-left p-4 text-slate-300 font-medium hidden md:table-cell">E-posta</th><th className="text-left p-4 text-slate-300 font-medium hidden sm:table-cell">Konu</th><th className="text-left p-4 text-slate-300 font-medium hidden lg:table-cell">Tarih</th><th className="text-center p-4 text-slate-300 font-medium">Durum</th><th className="text-right p-4 text-slate-300 font-medium">İşlemler</th></tr></thead>
          <tbody>
            {messages.length === 0 ? <tr><td colSpan="6" className="text-center p-8 text-slate-500">Henüz mesaj yok</td></tr> : messages.map((msg) => (
              <tr key={msg.id} className={`border-t border-slate-700 hover:bg-slate-700/30 cursor-pointer ${!msg.isRead ? 'bg-slate-700/20' : ''}`} onClick={() => openMessage(msg)}>
                <td className="p-4"><span className={`font-medium ${!msg.isRead ? 'text-white' : 'text-slate-300'}`}>{msg.name}</span></td>
                <td className="p-4 text-slate-400 hidden md:table-cell">{msg.email}</td>
                <td className="p-4 text-slate-400 hidden sm:table-cell">{msg.subject}</td>
                <td className="p-4 text-slate-400 hidden lg:table-cell">{msg.createdAt ? new Date(msg.createdAt).toLocaleDateString('tr-TR') : '-'}</td>
                <td className="p-4 text-center"><span className={`px-2 py-1 rounded text-xs ${msg.isRead ? 'bg-slate-600 text-slate-400' : 'bg-academic-gold/20 text-academic-gold'}`}>{msg.isRead ? 'Okundu' : 'Yeni'}</span></td>
                <td className="p-4 text-right" onClick={(e) => e.stopPropagation()}>
                  <button onClick={() => openMessage(msg)} className="p-2 rounded-lg bg-slate-700 text-slate-300 hover:bg-slate-600 mr-2"><Eye className="w-4 h-4" /></button>
                  <button onClick={() => handleDelete(msg.id)} className="p-2 rounded-lg bg-red-500/20 text-red-400 hover:bg-red-500/30"><Trash2 className="w-4 h-4" /></button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      {selectedMessage && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4" onClick={() => setSelectedMessage(null)}>
          <div className="bg-slate-800 rounded-2xl max-w-2xl w-full max-h-[80vh] overflow-auto border border-slate-700" onClick={(e) => e.stopPropagation()}>
            <div className="p-6 border-b border-slate-700">
              <div className="flex items-start justify-between">
                <div><h2 className="text-xl font-semibold text-white">{selectedMessage.subject}</h2><p className="text-slate-400 mt-1">{selectedMessage.name} • {selectedMessage.email}</p>{selectedMessage.phone && <p className="text-slate-500 text-sm">{selectedMessage.phone}</p>}</div>
                <button onClick={() => setSelectedMessage(null)} className="p-2 rounded-lg bg-slate-700 text-slate-300 hover:bg-slate-600"><X className="w-5 h-5" /></button>
              </div>
            </div>
            <div className="p-6"><p className="text-slate-300 whitespace-pre-wrap">{selectedMessage.message}</p></div>
            <div className="p-6 border-t border-slate-700 flex justify-end gap-3">
              <a href={`mailto:${selectedMessage.email}`} className="px-4 py-2 rounded-lg bg-academic-gold text-academic-navy font-semibold hover:bg-academic-gold-dim flex items-center gap-2"><Mail className="w-4 h-4" /> Yanıtla</a>
              <button onClick={() => handleDelete(selectedMessage.id)} className="px-4 py-2 rounded-lg bg-red-500/20 text-red-400 hover:bg-red-500/30 flex items-center gap-2"><Trash2 className="w-4 h-4" /> Sil</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

const AdminSiteSettings = () => {
  const [settings, setSettings] = useState({ phone: "", email: "", address: "", instagram: "", linkedin: "", youtube: "", tiktok: "", twitter: "", whatsappNumber: "", logoUrl: "", faviconUrl: "" });
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState({ type: "", text: "" });

  useEffect(() => { fetchSettings(); }, []);

  const fetchSettings = async () => {
    try { 
      const res = await fetch(`${API}/site-settings`); 
      const data = await res.json(); 
      if (data.fontFamily && !data.headingFontFamily) data.headingFontFamily = "'Playfair Display', serif";
      if (data.fontFamily && !data.bodyFontFamily) data.bodyFontFamily = data.fontFamily;
      setSettings(data); 
    } catch (err) { console.error(err); }
  };

  const showMsg = (type, text) => { setMessage({ type, text }); setTimeout(() => setMessage({ type: "", text: "" }), 3000); };

  const handleSave = async () => {
    setLoading(true);
    try {
      const res = await fetch(`${API}/site-settings`, { method: "PUT", headers: { "Content-Type": "application/json" }, body: JSON.stringify(settings) });
      if (res.ok) showMsg("success", "Ayarlar kaydedildi!");
      else showMsg("error", "Kaydetme başarısız");
    } catch (err) { showMsg("error", "Bağlantı hatası"); }
    finally { setLoading(false); }
  };

  return (
    <div className="space-y-6">
      <div><h1 className="text-2xl font-bold text-white">Site Genel Ayarları</h1><p className="text-slate-400 mt-1">Sitenin genel bilgilerini ve görsellerini düzenleyin.</p></div>
      {message.text && <div className={`p-4 rounded-lg ${message.type === "success" ? "bg-green-500/20 text-green-400" : "bg-red-500/20 text-red-400"}`}>{message.text}</div>}
      <div className="bg-slate-800 rounded-2xl p-6 border border-slate-700 space-y-6">
        <div><h2 className="text-lg font-semibold text-white mb-4">İletişim Bilgileri</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div><label className="text-slate-400 text-sm block mb-2">Telefon</label><input type="tel" value={settings.phone || ""} onChange={(e) => setSettings({...settings, phone: e.target.value})} className="w-full bg-slate-700 border border-slate-600 rounded-lg px-4 py-3 text-white focus:border-academic-gold focus:outline-none" /></div>
            <div><label className="text-slate-400 text-sm block mb-2">E-posta</label><input type="email" value={settings.email || ""} onChange={(e) => setSettings({...settings, email: e.target.value})} className="w-full bg-slate-700 border border-slate-600 rounded-lg px-4 py-3 text-white focus:border-academic-gold focus:outline-none" /></div>
            <div className="md:col-span-2"><label className="text-slate-400 text-sm block mb-2">Adres</label><input type="text" value={settings.address || ""} onChange={(e) => setSettings({...settings, address: e.target.value})} className="w-full bg-slate-700 border border-slate-600 rounded-lg px-4 py-3 text-white focus:border-academic-gold focus:outline-none" /></div>
            <div><label className="text-slate-400 text-sm block mb-2">WhatsApp Numarası</label><input type="tel" value={settings.whatsappNumber || ""} onChange={(e) => setSettings({...settings, whatsappNumber: e.target.value})} placeholder="905xxxxxxxxx" className="w-full bg-slate-700 border border-slate-600 rounded-lg px-4 py-3 text-white focus:border-academic-gold focus:outline-none" /></div>
          </div>
        </div>
        <div className="border-t border-slate-700 pt-6"><h2 className="text-lg font-semibold text-white mb-4">Sosyal Medya Linkleri</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div><label className="text-slate-400 text-sm block mb-2">Instagram</label><input type="url" value={settings.instagram || ""} onChange={(e) => setSettings({...settings, instagram: e.target.value})} className="w-full bg-slate-700 border border-slate-600 rounded-lg px-4 py-3 text-white focus:border-academic-gold focus:outline-none" /></div>
            <div><label className="text-slate-400 text-sm block mb-2">LinkedIn</label><input type="url" value={settings.linkedin || ""} onChange={(e) => setSettings({...settings, linkedin: e.target.value})} className="w-full bg-slate-700 border border-slate-600 rounded-lg px-4 py-3 text-white focus:border-academic-gold focus:outline-none" /></div>
            <div><label className="text-slate-400 text-sm block mb-2">YouTube</label><input type="url" value={settings.youtube || ""} onChange={(e) => setSettings({...settings, youtube: e.target.value})} className="w-full bg-slate-700 border border-slate-600 rounded-lg px-4 py-3 text-white focus:border-academic-gold focus:outline-none" /></div>
            <div><label className="text-slate-400 text-sm block mb-2">TikTok</label><input type="url" value={settings.tiktok || ""} onChange={(e) => setSettings({...settings, tiktok: e.target.value})} className="w-full bg-slate-700 border border-slate-600 rounded-lg px-4 py-3 text-white focus:border-academic-gold focus:outline-none" /></div>
            <div><label className="text-slate-400 text-sm block mb-2">X (Twitter)</label><input type="url" value={settings.twitter || ""} onChange={(e) => setSettings({...settings, twitter: e.target.value})} className="w-full bg-slate-700 border border-slate-600 rounded-lg px-4 py-3 text-white focus:border-academic-gold focus:outline-none" /></div>
          </div>
        </div>
        <div className="border-t border-slate-700 pt-6"><h2 className="text-lg font-semibold text-white mb-4 flex items-center gap-2"><Palette className="w-5 h-5 text-academic-gold" /> Site Renkleri</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="text-slate-400 text-sm block mb-2">Ana Arkaplan Rengi</label>
              <div className="flex items-center gap-3">
                <input type="color" value={settings.themeBg || "#0f172a"} onChange={(e) => setSettings({...settings, themeBg: e.target.value})} className="h-10 w-10 rounded cursor-pointer" />
                <input type="text" value={settings.themeBg || "#0f172a"} onChange={(e) => setSettings({...settings, themeBg: e.target.value})} className="flex-1 bg-slate-700 border border-slate-600 rounded-lg px-4 py-2 text-white" />
              </div>
            </div>
            <div>
              <label className="text-slate-400 text-sm block mb-2">İkincil Arkaplan Rengi (Kutu vb.)</label>
              <div className="flex items-center gap-3">
                <input type="color" value={settings.themeBgLight || "#1e293b"} onChange={(e) => setSettings({...settings, themeBgLight: e.target.value})} className="h-10 w-10 rounded cursor-pointer" />
                <input type="text" value={settings.themeBgLight || "#1e293b"} onChange={(e) => setSettings({...settings, themeBgLight: e.target.value})} className="flex-1 bg-slate-700 border border-slate-600 rounded-lg px-4 py-2 text-white" />
              </div>
            </div>
            <div>
              <label className="text-slate-400 text-sm block mb-2">Vurgu Rengi (Buton, Başlık, İkonlar)</label>
              <div className="flex items-center gap-3">
                <input type="color" value={settings.themeAccent || "#d4af37"} onChange={(e) => setSettings({...settings, themeAccent: e.target.value})} className="h-10 w-10 rounded cursor-pointer" />
                <input type="text" value={settings.themeAccent || "#d4af37"} onChange={(e) => setSettings({...settings, themeAccent: e.target.value})} className="flex-1 bg-slate-700 border border-slate-600 rounded-lg px-4 py-2 text-white" />
              </div>
            </div>
            <div>
              <label className="text-slate-400 text-sm block mb-2">Vurgu Hover Rengi (Buton Hover)</label>
              <div className="flex items-center gap-3">
                <input type="color" value={settings.themeAccentHover || "#bfa030"} onChange={(e) => setSettings({...settings, themeAccentHover: e.target.value})} className="h-10 w-10 rounded cursor-pointer" />
                <input type="text" value={settings.themeAccentHover || "#bfa030"} onChange={(e) => setSettings({...settings, themeAccentHover: e.target.value})} className="flex-1 bg-slate-700 border border-slate-600 rounded-lg px-4 py-2 text-white" />
              </div>
            </div>
          </div>
        </div>
        <div className="border-t border-slate-700 pt-6">
          <h2 className="text-lg font-semibold text-white mb-4 flex items-center gap-2"><FileText className="w-5 h-5 text-[var(--theme-accent)]" /> Tipografi (Yazı Tipi)</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="text-slate-400 text-sm block mb-2">Başlık Yazı Tipi (Heading Font)</label>
              <select value={settings.headingFontFamily || "'Playfair Display', serif"} onChange={(e) => setSettings({...settings, headingFontFamily: e.target.value})} className="w-full bg-slate-700 border border-slate-600 rounded-lg px-4 py-3 text-white focus:border-[var(--theme-accent)] focus:outline-none">
                <option value="'Manrope', sans-serif">Modern ve Okunaklı (Manrope)</option>
                <option value="'Inter', sans-serif">Temiz ve Profesyonel (Inter)</option>
                <option value="'Playfair Display', serif">Klasik ve Şık (Playfair Display)</option>
                <option value="'Times New Roman', serif">Resmi ve Akademik (Times New Roman)</option>
                <option value="'Space Grotesk', sans-serif">Teknolojik (Space Grotesk)</option>
              </select>
            </div>
            <div>
              <label className="text-slate-400 text-sm block mb-2">Genel Yazı Tipi (Body Font)</label>
              <select value={settings.bodyFontFamily || "'Manrope', sans-serif"} onChange={(e) => setSettings({...settings, bodyFontFamily: e.target.value})} className="w-full bg-slate-700 border border-slate-600 rounded-lg px-4 py-3 text-white focus:border-[var(--theme-accent)] focus:outline-none">
                <option value="'Manrope', sans-serif">Modern ve Okunaklı (Manrope)</option>
                <option value="'Inter', sans-serif">Temiz ve Profesyonel (Inter)</option>
                <option value="'Playfair Display', serif">Klasik ve Şık (Playfair Display)</option>
                <option value="'Times New Roman', serif">Resmi ve Akademik (Times New Roman)</option>
                <option value="'Space Grotesk', sans-serif">Teknolojik (Space Grotesk)</option>
              </select>
            </div>
          </div>
        </div>
        <div className="border-t border-slate-700 pt-6"><h2 className="text-lg font-semibold text-white mb-4">Görseller</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <ImageUploader value={settings.logoUrl || ""} onChange={(url) => setSettings({...settings, logoUrl: url})} label="Logo" shape="circle" />
            <ImageUploader value={settings.faviconUrl || ""} onChange={(url) => setSettings({...settings, faviconUrl: url})} label="Favicon" />
          </div>
        </div>
        <div className="pt-4"><button onClick={handleSave} disabled={loading} className="flex items-center gap-2 bg-academic-gold text-academic-navy px-6 py-3 rounded-lg font-semibold hover:bg-academic-gold-dim disabled:opacity-50"><Save className="w-5 h-5" /> {loading ? "Kaydediliyor..." : "Ayarları Kaydet"}</button></div>
      </div>
    </div>
  );
};

const AdminSiteTexts = () => {
  const [texts, setTexts] = useState({});
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState({ type: "", text: "" });

  useEffect(() => { fetchTexts(); }, []);

  const fetchTexts = async () => {
    try { 
      const [resTexts, resAbout] = await Promise.all([
        fetch(`${API}/site-texts`),
        fetch(`${API}/about`)
      ]);
      const textsData = await resTexts.json();
      const aboutData = await resAbout.json();
      setTexts({ ...textsData, aboutDesc: aboutData.content || "" });
    } catch (err) { console.error(err); }
  };

  const showMsg = (type, text) => { setMessage({ type, text }); setTimeout(() => setMessage({ type: "", text: "" }), 3000); };

  const handleSave = async () => {
    setLoading(true);
    try {
      const { aboutDesc, ...restTexts } = texts;
      const resTexts = await fetch(`${API}/site-texts`, { method: "PUT", headers: { "Content-Type": "application/json" }, body: JSON.stringify(restTexts) });
      const resAbout = await fetch(`${API}/about`, { method: "PUT", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ content: aboutDesc || "" }) });
      if (resTexts.ok && resAbout.ok) showMsg("success", "Site metinleri güncellendi!"); else showMsg("error", "Güncelleme başarısız");
    } catch (err) { showMsg("error", "Bağlantı hatası"); }
    finally { setLoading(false); }
  };

  const Field = ({ label, field, rows }) => (
    <div>
      <label className="text-slate-400 text-sm block mb-2">{label}</label>
      {rows ? (
        <textarea value={texts[field] || ""} onChange={(e) => setTexts({...texts, [field]: e.target.value})} rows={rows} className="w-full bg-slate-700 border border-slate-600 rounded-lg px-4 py-3 text-white placeholder-slate-400 focus:border-academic-gold focus:outline-none resize-none" />
      ) : (
        <input type="text" value={texts[field] || ""} onChange={(e) => setTexts({...texts, [field]: e.target.value})} className="w-full bg-slate-700 border border-slate-600 rounded-lg px-4 py-3 text-white placeholder-slate-400 focus:border-academic-gold focus:outline-none" />
      )}
    </div>
  );

  return (
    <div data-testid="admin-site-texts" className="space-y-6">
      <div><h1 className="text-2xl font-bold text-white">Site Metinleri</h1><p className="text-slate-400 mt-1">Ana sayfadaki başlıkları ve açıklamaları düzenleyin.</p></div>
      {message.text && <div className={`p-4 rounded-lg ${message.type === "success" ? "bg-green-500/20 text-green-400" : "bg-red-500/20 text-red-400"}`}>{message.text}</div>}
      <div className="space-y-6">
        <div className="bg-slate-800 rounded-2xl p-6 border border-slate-700">
          <h2 className="text-lg font-semibold text-white mb-4 flex items-center gap-2"><Home className="w-5 h-5 text-academic-gold" /> Ana Sayfa (Hero)</h2>
          <div className="space-y-4">
            <Field label="Hero Rozet Metni (Ör: 🚀 Geleceğin Platformu)" field="heroBadgeText" />
            <Field label="Başlık (ör: Biz Kimiz?)" field="heroTitle" />
            <Field label="Alt Yazı" field="heroSubtitle" rows={2} />
            <Field label="Hakkımızda Metni (Ana Paragraf)" field="aboutDesc" rows={5} />
            <div className="pt-4 border-t border-slate-700">
              <h3 className="text-md font-medium text-slate-300 mb-4">Randevu Butonu</h3>
              <Field label="Buton Metni (ör: Ücretsiz Randevu)" field="appointmentBtnText" />
              <div className="mt-4">
                <label className="block text-sm font-medium text-slate-400 mb-1">Buton İkonu</label>
                <select value={texts.appointmentBtnIcon || "Calendar"} onChange={(e) => setTexts({...texts, appointmentBtnIcon: e.target.value})} className="w-full bg-slate-700 border border-slate-600 rounded-lg px-4 py-3 text-white focus:border-academic-gold focus:outline-none">
                  <option value="Calendar">Takvim (Calendar)</option>
                  <option value="Phone">Telefon (Phone)</option>
                  <option value="Mail">Mail (Mail)</option>
                  <option value="MessageCircle">Mesaj (MessageCircle)</option>
                  <option value="CheckCircle">Onay (CheckCircle)</option>
                  <option value="Star">Yıldız (Star)</option>
                </select>
              </div>
            </div>
          </div>
        </div>
        <div className="bg-slate-800 rounded-2xl p-6 border border-slate-700">
          <h2 className="text-lg font-semibold text-white mb-4 flex items-center gap-2"><Briefcase className="w-5 h-5 text-academic-gold" /> Akademik & Kurumsal Bölümü</h2>
          <div className="space-y-4">
            <Field label="Üst Etiket (ör: Profesyonel Eğitim)" field="academicLabel" />
            <Field label="Başlık (ör: Akademik & Kurumsal)" field="academicTitle" />
            <Field label="Açıklama" field="academicDesc" rows={2} />
          </div>
        </div>
        <div className="bg-slate-800 rounded-2xl p-6 border border-slate-700">
          <h2 className="text-lg font-semibold text-white mb-4 flex items-center gap-2"><Users className="w-5 h-5 text-academic-gold" /> Veliler & Öğrenciler Bölümü</h2>
          <div className="space-y-4">
            <Field label="Üst Etiket (ör: Bireysel Gelişim)" field="studentLabel" />
            <Field label="Başlık (ör: Veliler & Öğrenciler)" field="studentTitle" />
            <Field label="Açıklama" field="studentDesc" rows={2} />
          </div>
        </div>
        <div className="bg-slate-800 rounded-2xl p-6 border border-slate-700">
          <h2 className="text-lg font-semibold text-white mb-4 flex items-center gap-2"><UserCheck className="w-5 h-5 text-academic-gold" /> Öğretmenlerimiz Bölümü</h2>
          <div className="space-y-4">
            <Field label="Üst Etiket (ör: Ekibimiz)" field="teachersLabel" />
            <Field label="Başlık (ör: Öğretmenlerimiz)" field="teachersTitle" />
            <Field label="Açıklama" field="teachersDesc" rows={2} />
          </div>
        </div>
        <button onClick={handleSave} disabled={loading} className="flex items-center gap-2 bg-academic-gold text-academic-navy px-6 py-3 rounded-lg font-semibold hover:bg-academic-gold-dim disabled:opacity-50"><Save className="w-5 h-5" /> {loading ? "Kaydediliyor..." : "Metinleri Kaydet"}</button>
      </div>
    </div>
  );
};

const AdminSecuritySettings = () => {
  const [adminUsername, setAdminUsername] = useState("");
  const [newUsername, setNewUsername] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState({ type: "", text: "" });

  useEffect(() => { fetchAdmin(); }, []);

  const fetchAdmin = async () => {
    try { const res = await fetch(`${API}/admin/settings`); const data = await res.json(); setAdminUsername(data.username || ""); setNewUsername(data.username || ""); } catch (err) { console.error(err); }
  };

  const showMsg = (type, text) => { setMessage({ type, text }); setTimeout(() => setMessage({ type: "", text: "" }), 3000); };

  const handleSave = async () => {
    setLoading(true);
    try {
      const updateData = {};
      if (newUsername && newUsername !== adminUsername) updateData.username = newUsername;
      if (newPassword) updateData.password = newPassword;
      if (Object.keys(updateData).length === 0) { showMsg("error", "Değişiklik yapılmadı"); setLoading(false); return; }
      const res = await fetch(`${API}/admin/settings`, { method: "PUT", headers: { "Content-Type": "application/json" }, body: JSON.stringify(updateData) });
      if (res.ok) { showMsg("success", "Güvenlik ayarları güncellendi!"); setNewPassword(""); fetchAdmin(); }
      else showMsg("error", "Güncelleme başarısız");
    } catch (err) { showMsg("error", "Bağlantı hatası"); }
    finally { setLoading(false); }
  };

  return (
    <div className="space-y-6">
      <div><h1 className="text-2xl font-bold text-white">Güvenlik Ayarları</h1><p className="text-slate-400 mt-1">Yönetici hesap bilgilerinizi güncelleyin.</p></div>
      {message.text && <div className={`p-4 rounded-lg ${message.type === "success" ? "bg-green-500/20 text-green-400" : "bg-red-500/20 text-red-400"}`}>{message.text}</div>}
      <div className="bg-slate-800 rounded-2xl p-6 border border-slate-700 max-w-md space-y-4">
        <div><label className="text-slate-400 text-sm block mb-2">Kullanıcı Adı</label><input type="text" value={newUsername} onChange={(e) => setNewUsername(e.target.value)} className="w-full bg-slate-700 border border-slate-600 rounded-lg px-4 py-3 text-white focus:border-academic-gold focus:outline-none" /></div>
        <div><label className="text-slate-400 text-sm block mb-2">Yeni Şifre</label><input type="password" value={newPassword} onChange={(e) => setNewPassword(e.target.value)} placeholder="Değiştirmek için girin" className="w-full bg-slate-700 border border-slate-600 rounded-lg px-4 py-3 text-white placeholder-slate-500 focus:border-academic-gold focus:outline-none" /></div>
        <button onClick={handleSave} disabled={loading} className="flex items-center gap-2 bg-academic-gold text-academic-navy px-6 py-3 rounded-lg font-semibold hover:bg-academic-gold-dim disabled:opacity-50"><Save className="w-5 h-5" /> {loading ? "Kaydediliyor..." : "Kaydet"}</button>
      </div>
    </div>
  );
};

const AdminTeachers = () => {
  const [teachers, setTeachers] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [editingTeacher, setEditingTeacher] = useState(null);
  const [formData, setFormData] = useState({ name: "", title: "", bio: "", photoUrl: "", isActive: true, order: 0 });
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState({ type: "", text: "" });

  useEffect(() => { fetchTeachers(); }, []);

  const fetchTeachers = async () => {
    try { const res = await fetch(`${API}/teachers`); setTeachers(await res.json()); } catch (err) { console.error(err); }
  };

  const showMsg = (type, text) => { setMessage({ type, text }); setTimeout(() => setMessage({ type: "", text: "" }), 3000); };

  const handleSubmit = async () => {
    if (!formData.name || !formData.title) { showMsg("error", "Ad ve ünvan zorunludur"); return; }
    setLoading(true);
    try {
      const url = editingTeacher ? `${API}/teachers/${editingTeacher.id}` : `${API}/teachers`;
      const method = editingTeacher ? "PUT" : "POST";
      const res = await fetch(url, { method, headers: { "Content-Type": "application/json" }, body: JSON.stringify(formData) });
      if (res.ok) {
        showMsg("success", editingTeacher ? "Öğretmen güncellendi!" : "Öğretmen eklendi!");
        setShowForm(false);
        setEditingTeacher(null);
        setFormData({ name: "", title: "", bio: "", photoUrl: "", isActive: true, order: 0 });
        fetchTeachers();
      }
    } catch (err) { showMsg("error", "Bir hata oluştu"); }
    finally { setLoading(false); }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Bu öğretmeni silmek istediğinizden emin misiniz?")) return;
    try { await fetch(`${API}/teachers/${id}`, { method: "DELETE" }); showMsg("success", "Öğretmen silindi"); fetchTeachers(); }
    catch (err) { showMsg("error", "Silme başarısız"); }
  };

  const handleEdit = (teacher) => {
    setEditingTeacher(teacher);
    setFormData({ name: teacher.name, title: teacher.title, bio: teacher.bio || "", photoUrl: teacher.photoUrl || "", isActive: teacher.isActive !== false, order: teacher.order || 0 });
    setShowForm(true);
  };

  return (
    <div data-testid="admin-teachers" className="space-y-6">
      <div className="flex items-center justify-between">
        <div><h1 className="text-2xl font-bold text-white">Öğretmenlerimiz</h1><p className="text-slate-400 mt-1">Öğretmen kadronuzu yönetin.</p></div>
        <button data-testid="add-teacher-btn" onClick={() => { setShowForm(true); setEditingTeacher(null); setFormData({ name: "", title: "", bio: "", photoUrl: "", isActive: true, order: 0 }); }} className="flex items-center gap-2 bg-academic-gold text-academic-navy px-4 py-2 rounded-lg font-semibold hover:bg-academic-gold-dim">
          <Plus className="w-5 h-5" /> Yeni Öğretmen
        </button>
      </div>
      {message.text && <div className={`p-4 rounded-lg ${message.type === "success" ? "bg-green-500/20 text-green-400" : "bg-red-500/20 text-red-400"}`}>{message.text}</div>}
      {showForm && (
        <div data-testid="teacher-form" className="bg-slate-800 rounded-2xl p-6 border border-slate-700">
          <h2 className="text-lg font-semibold text-white mb-4">{editingTeacher ? "Öğretmen Düzenle" : "Yeni Öğretmen Ekle"}</h2>
          <div className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="text-slate-400 text-sm block mb-2">Ad Soyad *</label>
                <input data-testid="teacher-name-input" type="text" value={formData.name} onChange={(e) => setFormData({...formData, name: e.target.value})} placeholder="Öğretmen adı" className="w-full bg-slate-700 border border-slate-600 rounded-lg px-4 py-3 text-white placeholder-slate-400 focus:border-academic-gold focus:outline-none" />
              </div>
              <div>
                <label className="text-slate-400 text-sm block mb-2">Ünvan / Branş *</label>
                <input data-testid="teacher-title-input" type="text" value={formData.title} onChange={(e) => setFormData({...formData, title: e.target.value})} placeholder="Örn: Matematik Öğretmeni" className="w-full bg-slate-700 border border-slate-600 rounded-lg px-4 py-3 text-white placeholder-slate-400 focus:border-academic-gold focus:outline-none" />
              </div>
            </div>
            <ImageUploader value={formData.photoUrl} onChange={(url) => setFormData({...formData, photoUrl: url})} label="Fotoğraf" shape="circle" />
            <div>
              <label className="text-slate-400 text-sm block mb-2">Biyografi</label>
              <textarea data-testid="teacher-bio-input" value={formData.bio} onChange={(e) => setFormData({...formData, bio: e.target.value})} placeholder="Öğretmen hakkında kısa bilgi..." rows={3} className="w-full bg-slate-700 border border-slate-600 rounded-lg px-4 py-3 text-white placeholder-slate-400 focus:border-academic-gold focus:outline-none resize-none" />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="text-slate-400 text-sm block mb-2">Sıralama</label>
                <input type="number" value={formData.order} onChange={(e) => setFormData({...formData, order: parseInt(e.target.value) || 0})} className="w-full bg-slate-700 border border-slate-600 rounded-lg px-4 py-3 text-white focus:border-academic-gold focus:outline-none" />
              </div>
              <div className="flex items-end">
                <label className="flex items-center gap-3 cursor-pointer">
                  <input type="checkbox" checked={formData.isActive} onChange={(e) => setFormData({...formData, isActive: e.target.checked})} className="w-5 h-5 rounded border-slate-600 bg-slate-700 text-academic-gold focus:ring-academic-gold" />
                  <span className="text-slate-300">Aktif (Sitede görünsün)</span>
                </label>
              </div>
            </div>
            <div className="flex justify-end gap-3 pt-2">
              <button onClick={() => { setShowForm(false); setEditingTeacher(null); }} className="px-4 py-2 rounded-lg bg-slate-700 text-white hover:bg-slate-600">İptal</button>
              <button data-testid="teacher-save-btn" onClick={handleSubmit} disabled={loading} className="px-4 py-2 rounded-lg bg-academic-gold text-academic-navy font-semibold hover:bg-academic-gold-dim disabled:opacity-50">{loading ? "Kaydediliyor..." : "Kaydet"}</button>
            </div>
          </div>
        </div>
      )}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {teachers.length === 0 ? (
          <div className="col-span-full bg-slate-800 rounded-2xl p-12 border border-slate-700 text-center">
            <UserCheck className="w-12 h-12 text-slate-600 mx-auto mb-4" />
            <p className="text-slate-500">Henüz öğretmen eklenmemiş</p>
          </div>
        ) : teachers.map((teacher) => (
          <div key={teacher.id} data-testid={`teacher-card-${teacher.id}`} className="bg-slate-800 rounded-2xl p-6 border border-slate-700 hover:border-slate-600 transition-all">
            <div className="flex flex-col items-center text-center">
              {teacher.photoUrl ? (
                <img src={teacher.photoUrl} alt={teacher.name} className="w-20 h-20 rounded-full object-cover border-3 border-academic-gold/30 mb-4" />
              ) : (
                <div className="w-20 h-20 rounded-full bg-slate-700 border-3 border-academic-gold/30 mb-4 flex items-center justify-center">
                  <UserCheck className="w-8 h-8 text-academic-gold/50" />
                </div>
              )}
              <h3 className="font-semibold text-white">{teacher.name}</h3>
              <p className="text-academic-gold text-sm mt-1">{teacher.title}</p>
              {teacher.bio && <p className="text-slate-400 text-sm mt-2 line-clamp-2">{teacher.bio}</p>}
              <div className="flex items-center gap-2 mt-3">
                <span className={`px-2 py-1 rounded text-xs ${teacher.isActive !== false ? 'bg-green-500/20 text-green-400' : 'bg-yellow-500/20 text-yellow-400'}`}>
                  {teacher.isActive !== false ? 'Aktif' : 'Pasif'}
                </span>
              </div>
              <div className="flex gap-2 mt-4">
                <button data-testid={`edit-teacher-${teacher.id}`} onClick={() => handleEdit(teacher)} className="p-2 rounded-lg bg-slate-700 text-slate-300 hover:bg-slate-600"><Edit className="w-4 h-4" /></button>
                <button data-testid={`delete-teacher-${teacher.id}`} onClick={() => handleDelete(teacher.id)} className="p-2 rounded-lg bg-red-500/20 text-red-400 hover:bg-red-500/30"><Trash2 className="w-4 h-4" /></button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

const AdminServices = () => {
  const [services, setServices] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [editingService, setEditingService] = useState(null);
  const [formData, setFormData] = useState({ category: "academic", title: "", icon: "GraduationCap", items: [], mediaUrl: "", fileUrl: "", order: 0 });
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState({ type: "", text: "" });

  useEffect(() => { fetchServices(); }, []);

  const fetchServices = async () => {
    try { const res = await fetch(`${API}/services`); setServices(await res.json()); } catch (err) { console.error(err); }
  };

  const showMsg = (type, text) => { setMessage({ type, text }); setTimeout(() => setMessage({ type: "", text: "" }), 3000); };

  const handleAddItem = () => {
    setFormData({ ...formData, items: [...formData.items, { name: "", desc: "" }] });
  };

  const handleRemoveItem = (index) => {
    const newItems = [...formData.items];
    newItems.splice(index, 1);
    setFormData({ ...formData, items: newItems });
  };

  const handleItemChange = (index, field, value) => {
    const newItems = [...formData.items];
    newItems[index][field] = value;
    setFormData({ ...formData, items: newItems });
  };

  const handleSubmit = async () => {
    if (!formData.title) { showMsg("error", "Ana başlık zorunludur"); return; }
    setLoading(true);
    try {
      const url = editingService ? `${API}/services/${editingService.id}` : `${API}/services`;
      const method = editingService ? "PUT" : "POST";
      const res = await fetch(url, { method, headers: { "Content-Type": "application/json" }, body: JSON.stringify(formData) });
      if (res.ok) {
        showMsg("success", editingService ? "Hizmet güncellendi!" : "Hizmet eklendi!");
        setShowForm(false);
        setEditingService(null);
        setFormData({ category: "academic", title: "", icon: "GraduationCap", items: [], mediaUrl: "", fileUrl: "", order: 0 });
        fetchServices();
      } else {
        showMsg("error", "İşlem başarısız oldu");
      }
    } catch (err) {
      showMsg("error", "Bir hata oluştu");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Bu hizmeti silmek istediğinizden emin misiniz?")) return;
    try { await fetch(`${API}/services/${id}`, { method: "DELETE" }); showMsg("success", "Hizmet silindi"); fetchServices(); }
    catch (err) { showMsg("error", "Silme başarısız"); }
  };

  const handleEdit = (service) => {
    setEditingService(service);
    setFormData({ category: service.category || "academic", title: service.title, icon: service.icon || "GraduationCap", items: service.items || [], mediaUrl: service.mediaUrl || "", fileUrl: service.fileUrl || "", order: service.order || 0 });
    setShowForm(true);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div><h1 className="text-2xl font-bold text-white">Hizmet Yönetimi</h1><p className="text-slate-400 mt-1">Akordiyon (Slider) alanlarındaki hizmetleri yönetin.</p></div>
        <button onClick={() => { setShowForm(true); setEditingService(null); setFormData({ category: "academic", title: "", icon: "GraduationCap", items: [], mediaUrl: "", fileUrl: "", order: 0 }); }} className="flex items-center gap-2 bg-academic-gold text-academic-navy px-4 py-2 rounded-lg font-semibold hover:bg-academic-gold-dim">
          <Plus className="w-5 h-5" /> Yeni Hizmet Ekle
        </button>
      </div>
      {message.text && <div className={`p-4 rounded-lg ${message.type === "success" ? "bg-green-500/20 text-green-400" : "bg-red-500/20 text-red-400"}`}>{message.text}</div>}
      {showForm && (
        <div className="bg-slate-800 rounded-2xl p-6 border border-slate-700">
          <h2 className="text-lg font-semibold text-white mb-4">{editingService ? "Hizmet Düzenle" : "Yeni Hizmet Ekle"}</h2>
          <div className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="text-slate-400 text-sm block mb-2">Kategori</label>
                <select value={formData.category} onChange={(e) => setFormData({...formData, category: e.target.value})} className="w-full bg-slate-700 border border-slate-600 rounded-lg px-4 py-3 text-white focus:border-academic-gold focus:outline-none">
                  <option value="academic">Akademik & Kurumsal</option>
                  <option value="student">Öğrencilere Yönelik</option>
                </select>
              </div>
              <div>
                <label className="text-slate-400 text-sm block mb-2">Ana Başlık</label>
                <input type="text" value={formData.title} onChange={(e) => setFormData({...formData, title: e.target.value})} placeholder="Örn: Lisans, Lisansüstü ve Akademisyenlere Yönelik" className="w-full bg-slate-700 border border-slate-600 rounded-lg px-4 py-3 text-white placeholder-slate-400 focus:border-academic-gold focus:outline-none" />
              </div>
              <div>
                <label className="text-slate-400 text-sm block mb-2">İkon</label>
                <select value={formData.icon} onChange={(e) => setFormData({...formData, icon: e.target.value})} className="w-full bg-slate-700 border border-slate-600 rounded-lg px-4 py-3 text-white focus:border-academic-gold focus:outline-none">
                  <option value="GraduationCap">Mezuniyet Şapkası (GraduationCap)</option>
                  <option value="Building2">Bina (Building2)</option>
                  <option value="Users">İnsanlar (Users)</option>
                  <option value="BookOpen">Açık Kitap (BookOpen)</option>
                  <option value="Briefcase">Çanta (Briefcase)</option>
                </select>
              </div>
              <div>
                <label className="text-slate-400 text-sm block mb-2">Sıralama (Küçükten Büyüğe)</label>
                <input type="number" value={formData.order} onChange={(e) => setFormData({...formData, order: parseInt(e.target.value) || 0})} className="w-full bg-slate-700 border border-slate-600 rounded-lg px-4 py-3 text-white focus:border-academic-gold focus:outline-none" />
              </div>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <ImageUploader value={formData.mediaUrl} onChange={(url) => setFormData({...formData, mediaUrl: url})} label="Medya/Resim (Opsiyonel)" />
              <div>
                <label className="text-slate-400 text-sm block mb-2">PDF/Dosya Linki (Opsiyonel)</label>
                <input type="text" value={formData.fileUrl} onChange={(e) => setFormData({...formData, fileUrl: e.target.value})} placeholder="Örn: https://example.com/file.pdf" className="w-full bg-slate-700 border border-slate-600 rounded-lg px-4 py-3 text-white placeholder-slate-400 focus:border-academic-gold focus:outline-none" />
              </div>
            </div>

            <div className="border-t border-slate-700 pt-4 mt-4">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-md font-semibold text-white">Alt Maddeler (İçerikler)</h3>
                <button onClick={handleAddItem} className="flex items-center gap-1 text-academic-gold text-sm hover:underline"><Plus className="w-4 h-4" /> Madde Ekle</button>
              </div>
              <div className="space-y-4">
                {formData.items.map((item, index) => (
                  <div key={index} className="p-4 bg-slate-900 rounded-xl border border-slate-700 flex gap-4 items-start">
                    <div className="flex-1 space-y-3">
                      <input type="text" value={item.name} onChange={(e) => handleItemChange(index, "name", e.target.value)} placeholder="Madde Başlığı (Örn: Özel Okullar için Danışmanlık)" className="w-full bg-slate-700 border border-slate-600 rounded-lg px-3 py-2 text-white placeholder-slate-400 focus:border-academic-gold focus:outline-none text-sm" />
                      <textarea value={item.desc} onChange={(e) => handleItemChange(index, "desc", e.target.value)} placeholder="Madde Açıklaması..." rows={2} className="w-full bg-slate-700 border border-slate-600 rounded-lg px-3 py-2 text-white placeholder-slate-400 focus:border-academic-gold focus:outline-none resize-none text-sm" />
                    </div>
                    <button onClick={() => handleRemoveItem(index)} className="p-2 text-red-400 hover:bg-red-500/20 rounded-lg"><Trash2 className="w-4 h-4" /></button>
                  </div>
                ))}
                {formData.items.length === 0 && <p className="text-slate-500 text-sm text-center">Henüz alt madde eklemediniz.</p>}
              </div>
            </div>

            <div className="flex justify-end gap-3 pt-4 border-t border-slate-700 mt-6">
              <button onClick={() => { setShowForm(false); setEditingService(null); }} className="px-4 py-2 rounded-lg bg-slate-700 text-white hover:bg-slate-600">İptal</button>
              <button onClick={handleSubmit} disabled={loading} className="px-4 py-2 rounded-lg bg-academic-gold text-academic-navy font-semibold hover:bg-academic-gold-dim disabled:opacity-50">{loading ? "Kaydediliyor..." : "Kaydet"}</button>
            </div>
          </div>
        </div>
      )}
      <div className="bg-slate-800 rounded-2xl border border-slate-700 overflow-hidden">
        {services.length === 0 ? (
          <div className="p-8 text-center text-slate-400">Henüz hizmet eklenmemiş.</div>
        ) : (
          <div className="divide-y divide-slate-700">
            {services.map((service) => (
              <div key={service.id} className="p-4 hover:bg-slate-700/30 transition-colors flex items-center justify-between group">
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 rounded-xl bg-slate-700 flex items-center justify-center text-academic-gold">
                    <Layers className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="text-white font-medium">{service.title}</h3>
                    <p className="text-slate-400 text-sm">{service.category === 'academic' ? 'Akademik & Kurumsal' : 'Öğrencilere Yönelik'} • {service.items?.length || 0} Madde</p>
                  </div>
                </div>
                <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                  <button onClick={() => handleEdit(service)} className="p-2 rounded-lg bg-slate-700 text-slate-300 hover:bg-slate-600"><Edit className="w-4 h-4" /></button>
                  <button onClick={() => handleDelete(service.id)} className="p-2 rounded-lg bg-red-500/20 text-red-400 hover:bg-red-500/30"><Trash2 className="w-4 h-4" /></button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
// ==================== ADMIN HERO BUTTONS ====================
export const AdminHeroButtons = () => {
  const [buttons, setButtons] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [editingBtn, setEditingBtn] = useState(null);
  const [formData, setFormData] = useState({ text: "", url: "", icon: "MousePointerClick", styleType: "primary", order: 0 });
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState({ type: "", text: "" });

  useEffect(() => { fetchButtons(); }, []);
  const fetchButtons = async () => {
    try { const res = await fetch(`${API}/hero-buttons`); setButtons(await res.json()); } catch (err) { console.error(err); }
  };

  const showMsg = (type, text) => { setMessage({ type, text }); setTimeout(() => setMessage({ type: "", text: "" }), 3000); };

  const handleSubmit = async () => {
    if (!formData.text || !formData.url) return showMsg("error", "Metin ve URL zorunludur!");
    setLoading(true);
    try {
      const url = editingBtn ? `${API}/hero-buttons/${editingBtn.id}` : `${API}/hero-buttons`;
      const method = editingBtn ? "PUT" : "POST";
      const res = await fetch(url, { method, headers: { "Content-Type": "application/json" }, body: JSON.stringify(formData) });
      if (res.ok) { showMsg("success", "Buton kaydedildi!"); setShowForm(false); setEditingBtn(null); fetchButtons(); }
      else showMsg("error", "Kaydedilemedi!");
    } catch (err) { showMsg("error", "Hata oluştu!"); }
    finally { setLoading(false); }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Bu butonu silmek istediğinize emin misiniz?")) return;
    try {
      const res = await fetch(`${API}/hero-buttons/${id}`, { method: "DELETE" });
      if (res.ok) { showMsg("success", "Silindi!"); fetchButtons(); }
    } catch (err) { showMsg("error", "Silinemedi!"); }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div><h1 className="text-2xl font-bold text-white">Hero Butonları</h1><p className="text-slate-400">Ana sayfadaki aksiyon butonlarını yönetin.</p></div>
        <button onClick={() => { setFormData({ text: "", url: "", icon: "MousePointerClick", styleType: "primary", order: 0 }); setEditingBtn(null); setShowForm(true); }} className="bg-[var(--theme-accent)] text-[var(--theme-bg)] px-4 py-2 rounded-lg font-semibold hover:bg-[var(--theme-accent-hover)]">Yeni Ekle</button>
      </div>
      {message.text && <div className={`p-4 rounded-lg ${message.type === "success" ? "bg-green-500/20 text-green-400" : "bg-red-500/20 text-red-400"}`}>{message.text}</div>}
      
      {showForm ? (
        <div className="bg-slate-800 rounded-2xl p-6 border border-slate-700 space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div><label className="text-slate-400 text-sm block mb-2">Buton Metni</label><input type="text" value={formData.text} onChange={e => setFormData({...formData, text: e.target.value})} className="w-full bg-slate-700 border border-slate-600 rounded-lg px-4 py-2 text-white focus:border-[var(--theme-accent)] focus:outline-none" /></div>
            <div><label className="text-slate-400 text-sm block mb-2">Yönlendirme Linki (URL)</label><input type="text" value={formData.url} onChange={e => setFormData({...formData, url: e.target.value})} className="w-full bg-slate-700 border border-slate-600 rounded-lg px-4 py-2 text-white focus:border-[var(--theme-accent)] focus:outline-none" /></div>
            <div><label className="text-slate-400 text-sm block mb-2">İkon</label>
              <select value={formData.icon} onChange={e => setFormData({...formData, icon: e.target.value})} className="w-full bg-slate-700 border border-slate-600 rounded-lg px-4 py-2 text-white focus:border-[var(--theme-accent)] focus:outline-none">
                <option value="Calendar">Takvim</option><option value="Phone">Telefon</option><option value="MousePointerClick">Tıklama</option><option value="ArrowRight">Ok</option>
              </select>
            </div>
            <div><label className="text-slate-400 text-sm block mb-2">Sıra No</label><input type="number" value={formData.order} onChange={e => setFormData({...formData, order: parseInt(e.target.value) || 0})} className="w-full bg-slate-700 border border-slate-600 rounded-lg px-4 py-2 text-white focus:border-[var(--theme-accent)] focus:outline-none" /></div>
          </div>
          <div className="flex justify-end gap-3 pt-4"><button onClick={() => setShowForm(false)} className="px-6 py-2 rounded-lg text-slate-300 hover:bg-slate-700">İptal</button><button onClick={handleSubmit} disabled={loading} className="bg-[var(--theme-accent)] text-[var(--theme-bg)] px-6 py-2 rounded-lg font-semibold hover:bg-[var(--theme-accent-hover)]">{loading ? "Kaydediliyor..." : "Kaydet"}</button></div>
        </div>
      ) : (
        <div className="grid gap-4">
          {buttons.map(btn => (
            <div key={btn.id} className="bg-slate-800 p-4 rounded-xl border border-slate-700 flex items-center justify-between group">
              <div className="flex items-center gap-4 text-white"><DynamicIcon name={btn.icon} className="w-5 h-5 text-[var(--theme-accent)]" /> <span className="font-semibold">{btn.text}</span> <span className="text-sm text-slate-400">{btn.url}</span></div>
              <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity"><button onClick={() => { setEditingBtn(btn); setFormData({ text: btn.text, url: btn.url, icon: btn.icon || "MousePointerClick", styleType: btn.styleType || "primary", order: btn.order || 0 }); setShowForm(true); }} className="p-2 text-blue-400 hover:bg-blue-400/10 rounded-lg"><Edit className="w-4 h-4" /></button><button onClick={() => handleDelete(btn.id)} className="p-2 text-red-400 hover:bg-red-400/10 rounded-lg"><Trash2 className="w-4 h-4" /></button></div>
            </div>
          ))}
          {buttons.length === 0 && <p className="text-slate-400 text-center py-8">Henüz buton eklenmemiş.</p>}
        </div>
      )}
    </div>
  );
};

// ==================== ADMIN FEATURES ====================
export const AdminFeatures = () => {
  const [features, setFeatures] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [editingFeat, setEditingFeat] = useState(null);
  const [formData, setFormData] = useState({ title: "", desc: "", icon: "CheckCircle", colorTheme: "blue", order: 0 });
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState({ type: "", text: "" });

  useEffect(() => { fetchFeatures(); }, []);
  const fetchFeatures = async () => {
    try { const res = await fetch(`${API}/features`); setFeatures(await res.json()); } catch (err) { console.error(err); }
  };

  const showMsg = (type, text) => { setMessage({ type, text }); setTimeout(() => setMessage({ type: "", text: "" }), 3000); };

  const handleSubmit = async () => {
    if (!formData.title || !formData.desc) return showMsg("error", "Başlık ve açıklama zorunludur!");
    setLoading(true);
    try {
      const url = editingFeat ? `${API}/features/${editingFeat.id}` : `${API}/features`;
      const method = editingFeat ? "PUT" : "POST";
      const res = await fetch(url, { method, headers: { "Content-Type": "application/json" }, body: JSON.stringify(formData) });
      if (res.ok) { showMsg("success", "Özellik kaydedildi!"); setShowForm(false); setEditingFeat(null); fetchFeatures(); }
      else showMsg("error", "Kaydedilemedi!");
    } catch (err) { showMsg("error", "Hata oluştu!"); }
    finally { setLoading(false); }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Bu özelliği silmek istediğinize emin misiniz?")) return;
    try {
      const res = await fetch(`${API}/features/${id}`, { method: "DELETE" });
      if (res.ok) { showMsg("success", "Silindi!"); fetchFeatures(); }
    } catch (err) { showMsg("error", "Silinemedi!"); }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div><h1 className="text-2xl font-bold text-white">Özellik Kartları</h1><p className="text-slate-400">Ana sayfadaki 3'lü renkli kartları yönetin.</p></div>
        <button onClick={() => { setFormData({ title: "", desc: "", icon: "CheckCircle", colorTheme: "blue", order: 0 }); setEditingFeat(null); setShowForm(true); }} className="bg-[var(--theme-accent)] text-[var(--theme-bg)] px-4 py-2 rounded-lg font-semibold hover:bg-[var(--theme-accent-hover)]">Yeni Ekle</button>
      </div>
      {message.text && <div className={`p-4 rounded-lg ${message.type === "success" ? "bg-green-500/20 text-green-400" : "bg-red-500/20 text-red-400"}`}>{message.text}</div>}
      
      {showForm ? (
        <div className="bg-slate-800 rounded-2xl p-6 border border-slate-700 space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div><label className="text-slate-400 text-sm block mb-2">Başlık</label><input type="text" value={formData.title} onChange={e => setFormData({...formData, title: e.target.value})} className="w-full bg-slate-700 border border-slate-600 rounded-lg px-4 py-2 text-white focus:border-[var(--theme-accent)] focus:outline-none" /></div>
            <div><label className="text-slate-400 text-sm block mb-2">Kısa Açıklama</label><input type="text" value={formData.desc} onChange={e => setFormData({...formData, desc: e.target.value})} className="w-full bg-slate-700 border border-slate-600 rounded-lg px-4 py-2 text-white focus:border-[var(--theme-accent)] focus:outline-none" /></div>
            <div><label className="text-slate-400 text-sm block mb-2">İkon</label>
              <select value={formData.icon} onChange={e => setFormData({...formData, icon: e.target.value})} className="w-full bg-slate-700 border border-slate-600 rounded-lg px-4 py-2 text-white focus:border-[var(--theme-accent)] focus:outline-none">
                <option value="CheckCircle">Onay (CheckCircle)</option><option value="BookOpen">Kitap (BookOpen)</option><option value="Users">Kullanıcılar (Users)</option><option value="Star">Yıldız (Star)</option><option value="Award">Ödül (Award)</option>
              </select>
            </div>
            <div><label className="text-slate-400 text-sm block mb-2">Tema Rengi</label>
              <div className="flex gap-2">
                <select value={formData.colorTheme?.startsWith('#') ? 'custom' : (formData.colorTheme || 'gold')} onChange={e => {
                  if (e.target.value === 'custom') setFormData({...formData, colorTheme: '#d4af37'});
                  else setFormData({...formData, colorTheme: e.target.value});
                }} className="w-full bg-slate-700 border border-slate-600 rounded-lg px-4 py-2 text-white focus:border-[var(--theme-accent)] focus:outline-none">
                  <option value="gold">Site Vurgu Rengi (Altın Sarısı vb.)</option>
                  <option value="blue">Mavi</option>
                  <option value="red">Kırmızı</option>
                  <option value="emerald">Yeşil</option>
                  <option value="orange">Turuncu</option>
                  <option value="purple">Mor</option>
                  <option value="custom">Özel Renk Seç (Renk Paleti)</option>
                </select>
                {formData.colorTheme?.startsWith('#') && (
                  <input type="color" value={formData.colorTheme} onChange={e => setFormData({...formData, colorTheme: e.target.value})} className="h-[42px] w-[42px] shrink-0 rounded cursor-pointer border border-slate-600 bg-slate-700" title="Renk Paleti" />
                )}
              </div>
            </div>
            <div><label className="text-slate-400 text-sm block mb-2">Sıra No</label><input type="number" value={formData.order} onChange={e => setFormData({...formData, order: parseInt(e.target.value) || 0})} className="w-full bg-slate-700 border border-slate-600 rounded-lg px-4 py-2 text-white focus:border-[var(--theme-accent)] focus:outline-none" /></div>
          </div>
          <div className="flex justify-end gap-3 pt-4"><button onClick={() => setShowForm(false)} className="px-6 py-2 rounded-lg text-slate-300 hover:bg-slate-700">İptal</button><button onClick={handleSubmit} disabled={loading} className="bg-[var(--theme-accent)] text-[var(--theme-bg)] px-6 py-2 rounded-lg font-semibold hover:bg-[var(--theme-accent-hover)]">{loading ? "Kaydediliyor..." : "Kaydet"}</button></div>
        </div>
      ) : (
        <div className="grid gap-4">
          {features.map(feat => (
            <div key={feat.id} className="bg-slate-800 p-4 rounded-xl border border-slate-700 flex items-center justify-between group">
              <div className="flex items-center gap-4 text-white"><DynamicIcon name={feat.icon} className="w-5 h-5 text-[var(--theme-accent)]" /> <div><span className="font-semibold block">{feat.title}</span> <span className="text-sm text-slate-400">{feat.desc} ({feat.colorTheme})</span></div></div>
              <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity"><button onClick={() => { setEditingFeat(feat); setFormData({ title: feat.title, desc: feat.desc, icon: feat.icon || "CheckCircle", colorTheme: feat.colorTheme || "blue", order: feat.order || 0 }); setShowForm(true); }} className="p-2 text-blue-400 hover:bg-blue-400/10 rounded-lg"><Edit className="w-4 h-4" /></button><button onClick={() => handleDelete(feat.id)} className="p-2 text-red-400 hover:bg-red-400/10 rounded-lg"><Trash2 className="w-4 h-4" /></button></div>
            </div>
          ))}
          {features.length === 0 && <p className="text-slate-400 text-center py-8">Henüz özellik eklenmemiş.</p>}
        </div>
      )}
    </div>
  );
};

const AdminPanel = ({ onLogout }) => {
  const [activeView, setActiveView] = useState("dashboard");
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [stats, setStats] = useState({ totalContents: 0, unreadMessages: 0, totalViews: 0 });
  const [recentMessages, setRecentMessages] = useState([]);
  const [recentContents, setRecentContents] = useState([]);

  useEffect(() => { fetchDashboardData(); }, []);

  const fetchDashboardData = async () => {
    try {
      const [statsRes, messagesRes, contentsRes] = await Promise.all([
        fetch(`${API}/dashboard/stats`),
        fetch(`${API}/dashboard/recent-messages`),
        fetch(`${API}/dashboard/recent-contents`)
      ]);
      setStats(await statsRes.json());
      setRecentMessages(await messagesRes.json());
      setRecentContents(await contentsRes.json());
    } catch (err) { console.error(err); }
  };

  const menuItems = [
    { id: "dashboard", label: "Dashboard", icon: <Home className="w-5 h-5" /> },
    { id: "hero-buttons", label: "Hero Butonları", icon: <MousePointerClick className="w-5 h-5" /> },
    { id: "features", label: "Özellik Kartları", icon: <LayoutGrid className="w-5 h-5" /> },
    { id: "services", label: "Hizmet Yönetimi", icon: <Layers className="w-5 h-5" /> },
    { id: "contents", label: "Eğitim / İçerik", icon: <BookMarked className="w-5 h-5" /> },
    { id: "teachers", label: "Öğretmenlerimiz", icon: <UserCheck className="w-5 h-5" /> },
    { id: "inbox", label: "Gelen Kutusu", icon: <Inbox className="w-5 h-5" />, badge: stats.unreadMessages },
    { id: "site-texts", label: "Site Metinleri", icon: <FileText className="w-5 h-5" /> },
    { id: "site-settings", label: "Site Ayarları", icon: <Settings className="w-5 h-5" /> },
    { id: "security", label: "Güvenlik", icon: <Shield className="w-5 h-5" /> }
  ];

  return (
    <div className="min-h-screen bg-slate-900 flex">
      {/* Sidebar */}
      <aside className={`fixed lg:static inset-y-0 left-0 z-50 w-64 bg-slate-800 border-r border-slate-700 transform transition-transform duration-300 ${sidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}`}>
        <div className="p-6 border-b border-slate-700">
          <div className="flex items-center gap-3">
            <img src={LOGO_URL} alt="FSS Akademi" className="w-10 h-10 rounded-full border-2 border-academic-gold/30" />
            <div><h1 className="font-playfair text-lg text-white">FSS <span className="text-academic-gold">Akademi</span></h1><p className="text-xs text-slate-500">Admin Panel</p></div>
          </div>
        </div>
        <nav className="p-4 space-y-2">
          {menuItems.map((item) => (
            <button key={item.id} onClick={() => { setActiveView(item.id); setSidebarOpen(false); }} className={`w-full flex items-center justify-between px-4 py-3 rounded-xl transition-all ${activeView === item.id ? 'bg-academic-gold text-academic-navy font-semibold' : 'text-slate-400 hover:bg-slate-700 hover:text-white'}`}>
              <div className="flex items-center gap-3">{item.icon}<span>{item.label}</span></div>
              {item.badge > 0 && <span className="w-5 h-5 bg-red-500 text-white text-xs rounded-full flex items-center justify-center">{item.badge}</span>}
            </button>
          ))}
        </nav>
        <div className="absolute bottom-0 left-0 right-0 p-4 border-t border-slate-700">
          <a href="/" target="_blank" className="flex items-center gap-3 px-4 py-3 text-slate-400 hover:text-white rounded-xl hover:bg-slate-700 transition-all"><Eye className="w-5 h-5" /><span>Siteyi Görüntüle</span></a>
          <button onClick={onLogout} className="w-full flex items-center gap-3 px-4 py-3 text-red-400 hover:text-red-300 rounded-xl hover:bg-slate-700 transition-all mt-2"><LogOut className="w-5 h-5" /><span>Çıkış Yap</span></button>
        </div>
      </aside>
      {/* Main Content */}
      <div className="flex-1 flex flex-col min-h-screen">
        <header className="bg-slate-800 border-b border-slate-700 px-6 py-4 flex items-center justify-between">
          <button onClick={() => setSidebarOpen(!sidebarOpen)} className="lg:hidden p-2 rounded-lg bg-slate-700 text-white"><Menu className="w-5 h-5" /></button>
          <div className="hidden lg:block"><h2 className="text-white font-semibold">{menuItems.find(m => m.id === activeView)?.label}</h2></div>
          <div className="flex items-center gap-4">
            <button className="relative p-2 rounded-lg bg-slate-700 text-slate-300 hover:text-white">
              <Bell className="w-5 h-5" />
              {stats.unreadMessages > 0 && <span className="absolute -top-1 -right-1 w-4 h-4 bg-red-500 text-white text-xs rounded-full flex items-center justify-center">{stats.unreadMessages}</span>}
            </button>
          </div>
        </header>
        <main className="flex-1 p-6 overflow-auto">
          {activeView === "dashboard" && <AdminDashboard stats={stats} recentMessages={recentMessages} recentContents={recentContents} setActiveView={setActiveView} />}
          {activeView === "hero-buttons" && <AdminHeroButtons />}
          {activeView === "features" && <AdminFeatures />}
          {activeView === "services" && <AdminServices />}
          {activeView === "contents" && <AdminContents />}
          {activeView === "teachers" && <AdminTeachers />}
          {activeView === "inbox" && <AdminInbox />}
          {activeView === "site-texts" && <AdminSiteTexts />}
          {activeView === "site-settings" && <AdminSiteSettings />}
          {activeView === "security" && <AdminSecuritySettings />}
        </main>
      </div>
      {/* Mobile Sidebar Overlay */}
      {sidebarOpen && <div className="fixed inset-0 bg-black/50 z-40 lg:hidden" onClick={() => setSidebarOpen(false)} />}
    </div>
  );
};

const AdminPage = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  return isLoggedIn ? <AdminPanel onLogout={() => setIsLoggedIn(false)} /> : <AdminLogin onLogin={() => setIsLoggedIn(true)} />;
};

// ==================== HOME PAGE ====================

const HomePage = () => {
  const [aboutContent, setAboutContent] = useState("");
  const [academicServices, setAcademicServices] = useState([]);
  const [studentServices, setStudentServices] = useState([]);
  const [customSections, setCustomSections] = useState([]);
  const [teachers, setTeachers] = useState([]);
  const [contents, setContents] = useState([]);
  const [siteTexts, setSiteTexts] = useState({});
  const [siteSettings, setSiteSettings] = useState({});
  const [heroButtons, setHeroButtons] = useState([]);
  const [features, setFeatures] = useState([]);

  useEffect(() => {
    fetchAbout();
    fetchServices();
    fetchCustomSections();
    fetchTeachers();
    fetchContents();
    fetchSiteTexts();
    fetchSiteSettings();
    fetchHeroButtons();
    fetchFeaturesData();
  }, []);

  const fetchHeroButtons = async () => {
    try { const res = await fetch(`${API}/hero-buttons`); setHeroButtons(await res.json()); } catch (err) {}
  };

  const fetchFeaturesData = async () => {
    try { const res = await fetch(`${API}/features`); setFeatures(await res.json()); } catch (err) {}
  };

  const fetchAbout = async () => {
    try { const res = await fetch(`${API}/about`); const data = await res.json(); if (data.content) { let content = data.content.replace(/\s*Başarı yolculuğunuzda güvenilir yol arkadaşınız olmaktan gurur duyuyoruz\.?\s*$/, ""); setAboutContent(content); } }
    catch (err) { setAboutContent("FSS Akademi, öğrenmenin yaşam boyu süren bir serüven olduğu inancıyla kurulmuş yenilikçi bir eğitim platformudur."); }
  };

  const fetchServices = async () => {
    try {
      const [academicRes, studentRes] = await Promise.all([fetch(`${API}/services/academic`), fetch(`${API}/services/student`)]);
      setAcademicServices(await academicRes.json());
      setStudentServices(await studentRes.json());
    } catch (err) { console.error(err); }
  };

  const fetchCustomSections = async () => {
    try { const res = await fetch(`${API}/custom-sections/active`); setCustomSections(await res.json()); } catch (err) { setCustomSections([]); }
  };

  const fetchTeachers = async () => {
    try { const res = await fetch(`${API}/teachers/active`); setTeachers(await res.json()); } catch (err) { setTeachers([]); }
  };

  const fetchContents = async () => {
    try { const res = await fetch(`${API}/contents/active/list`); setContents(await res.json()); } catch (err) { setContents([]); }
  };

  const fetchSiteTexts = async () => {
    try { const res = await fetch(`${API}/site-texts`); setSiteTexts(await res.json()); } catch (err) { setSiteTexts({}); }
  };

  const fetchSiteSettings = async () => {
    try { const res = await fetch(`${API}/site-settings`); setSiteSettings(await res.json()); } catch (err) { setSiteSettings({}); }
  };

  return (
    <div className="App bg-[var(--theme-bg)] min-h-screen">
      <style>{`
        :root {
          ${siteSettings.themeBg ? `--theme-bg: ${siteSettings.themeBg};` : ''}
          ${siteSettings.themeBgLight ? `--theme-bg-light: ${siteSettings.themeBgLight};` : ''}
          ${siteSettings.themeAccent ? `--theme-accent: ${siteSettings.themeAccent};` : ''}
          ${siteSettings.themeAccentHover ? `--theme-accent-hover: ${siteSettings.themeAccentHover};` : ''}
          ${siteSettings.fontFamily ? `--theme-font-body: ${siteSettings.fontFamily}; --theme-font-heading: ${siteSettings.fontFamily};` : ''}
          ${siteSettings.headingFontFamily ? `--theme-font-heading: ${siteSettings.headingFontFamily};` : `--theme-font-heading: 'Playfair Display', serif;`}
          ${siteSettings.bodyFontFamily ? `--theme-font-body: ${siteSettings.bodyFontFamily};` : `--theme-font-body: 'Manrope', sans-serif;`}
        }
        body, p, span, a, div, li, ul, button, input, textarea, .font-manrope, .font-space {
          font-family: var(--theme-font-body) !important;
        }
        h1, h2, h3, h4, h5, h6, .font-playfair {
          font-family: var(--theme-font-heading) !important;
        }
      `}</style>
      <StickyHeader siteTexts={siteTexts} siteSettings={siteSettings} />
      <div className="pt-20">
        <Routes>
          <Route path="/" element={
            <>
              <HeroSection aboutContent={aboutContent} siteTexts={siteTexts} siteSettings={siteSettings} heroButtons={heroButtons} />
              <FeaturesSection features={features} />
              <CustomSectionsDisplay sections={customSections} />
            </>
          } />
          <Route path="/hizmetler" element={
            <>
              <DynamicServicesSection academicServices={academicServices} studentServices={studentServices} siteTexts={siteTexts} />
              <ContentsSection contents={contents} />
            </>
          } />
          <Route path="/ogretmenler" element={
            <TeachersSection teachers={teachers} siteTexts={siteTexts} />
          } />
          <Route path="/iletisim" element={
            <ContactSection siteSettings={siteSettings} />
          } />
        </Routes>
      </div>
      <Footer siteTexts={siteTexts} siteSettings={siteSettings} />
      <WhatsAppButton siteSettings={siteSettings} />
    </div>
  );
};

// ==================== MAIN APP ====================

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/admin" element={<AdminPage />} />
        <Route path="/*" element={<HomePage />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
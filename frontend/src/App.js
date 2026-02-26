import { useEffect, useState } from "react";
import { BrowserRouter, Routes, Route, useNavigate } from "react-router-dom";
import "@/App.css";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { GraduationCap, Building2, Users, BookOpen, Send, ArrowDown, Menu, X, Calendar, Lock, LogOut, Settings, FileText, Layers, Shield, Plus, Trash2, Edit, Save, Eye, EyeOff } from "lucide-react";

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;
const API = `${BACKEND_URL}/api`;

// WhatsApp URL
const WHATSAPP_URL = "https://api.whatsapp.com/send?phone=905309482654&text=Merhaba,%20FSS%20Akademi%20hakk%C4%B1nda%20bilgi%20almak%20istiyorum.";

// FSS Akademi Logo URL
const LOGO_URL = "https://customer-assets.emergentagent.com/job_0eba98ac-e02f-4df7-af03-a40a9b33d4a9/artifacts/tykox5io_Ekran%20g%C3%B6r%C3%BCnt%C3%BCs%C3%BC%202026-02-23%20042936.png";

// Social Media Links
const SOCIAL_LINKS = {
  youtube: "https://www.youtube.com/@fatihsellumm",
  instagram: "https://www.instagram.com/fatihsellummm?utm_source=ig_web_button_share_sheet&igsh=ZDNlZDc0MzIxNw==",
  twitter: "https://x.com/fatihsellumm",
  linkedin: "https://www.linkedin.com/in/fatih-selim-sell%C3%BCm-9713933b1/",
  tiktok: "https://www.tiktok.com/@fatihsellumm"
};

// Default Services Data (fallback)
const defaultAcademicServices = [
  {
    id: "academic-1",
    title: "Lisans, Lisansüstü ve Akademisyenlere Yönelik",
    icon: <GraduationCap className="w-5 h-5" />,
    items: [
      { name: "MAXQDA ile Nitel Veri Analizi", desc: "Nitel araştırmalarınızda verilerinizi kodlama, temalaştırma ve görselleştirme teknikleriyle derinlemesine analiz etme becerisi kazanın." },
      { name: "TÜBİTAK Projesi Yazma", desc: "2209 ve diğer araştırma projeleri için yenilikçi, literatüre katkı sağlayan ve kabul oranı yüksek proje metni hazırlama stratejileri." },
      { name: "Avrupa Birliği (Erasmus) Projesi Yazma", desc: "Uluslararası fon bulma, mantıksal çerçeve yaklaşımı ve sürdürülebilir, etkili eğitim projeleri tasarlama süreçleri." },
      { name: "Akademik Yazma", desc: "Makale, bildiri ve tez süreçlerinde akademik dilin doğru kullanımı, APA formatı ve yayın standartları üzerine pratik eğitim." },
      { name: "Canva Kullanımı", desc: "Ders planları, sunumlar ve interaktif çalışma yaprakları için profesyonel ve dikkat çekici görsel materyal tasarımı." },
      { name: "Yapay Zekâ Araçlarının Kullanımı", desc: "Eğitimde üretken yapay zekâ ile interaktif hikaye oluşturma, karakter tasarımı ve yenilikçi eğitim materyali üretimi." },
      { name: "Eğitim için Sosyal Medya Kullanımı", desc: "Akademik kimlik inşası ve eğitim içeriklerinizi doğru kitleye ulaştırmak için profesyonel dijital görünürlük stratejileri." }
    ]
  },
  {
    id: "academic-2",
    title: "Kurumlara Yönelik",
    icon: <Building2 className="w-5 h-5" />,
    items: [
      { name: "Özel Okullar için Danışmanlık", desc: "Kurumsal eğitim kalitesini artırma, modern müfredat entegrasyonu ve yenilikçi öğretmen eğitimi rehberliği." },
      { name: "Ters-Yüz Sınıf Modeli", desc: "Öğrenci merkezli, aktif katılımı destekleyen ve sınıf içi etkileşimi en üst düzeye çıkaran modern pedagojik yaklaşımların kuruma entegrasyonu." },
      { name: "Eğitim Danışmanlığı", desc: "Kurumunuzun vizyonuna uygun, yenilikçi ve sürdürülebilir eğitim modelleri geliştirme süreçleri." }
    ]
  }
];

const defaultStudentServices = [
  {
    id: "student-1",
    title: "Velilere Yönelik",
    icon: <Users className="w-5 h-5" />,
    items: [
      { name: "İlkokul Velileri için Matematik Eğitimi", desc: "Çocuğunuza matematiği oyunlaştırma teknikleriyle sevdirmenin ve yeni nesil soru mantığını evde desteklemenin yolları." },
      { name: "Ortaokul Velileri için Matematik Eğitimi", desc: "LGS sürecinde psikolojik destek, analitik düşünme becerilerini geliştirme ve doğru akademik takip stratejileri." }
    ]
  },
  {
    id: "student-2",
    title: "Öğrencilere Yönelik",
    icon: <BookOpen className="w-5 h-5" />,
    items: [
      { name: "İlkokul/Ortaokul Öğrencileri için Problem Çözme Kampı", desc: "Ezberden uzak, eleştirel düşünmeyi ve yaratıcı problem çözme becerilerini geliştiren, interaktif ve yoğunlaştırılmış kamp programı." },
      { name: "İlkokul Öğrencileri için Beceri Geliştirme (İstatistiksel Akıl Yürütme)", desc: "Verileri okuma, tablo/grafik yorumlama ve günlük hayattaki problemleri matematiksel mantıkla çözme becerileri." },
      { name: "Özel Ders - 1.-4. Sınıf", desc: "Öğrencinin bireysel hızına uygun, görsel materyallerle desteklenmiş, tüm derslerde temel becerileri sağlamlaştıran birebir eğitim." },
      { name: "Özel Ders - 5.-11. Sınıf (Matematik)", desc: "Matematiksel kavramları somutlaştıran, analitik düşünmeyi geliştiren ve okul başarısını doğrudan artıran kişiselleştirilmiş dersler." },
      { name: "Özel Ders - LGS, TYT, AYT, DGS, KPSS, ALES Matematik", desc: "Yeni nesil sorulara özel taktikler, zaman yönetimi ve yüksek hedeflere yönelik yoğun, sonuç odaklı sınav hazırlığı." }
    ]
  }
];

// Contact form categories
const CATEGORIES = [
  { value: "", label: "Kategori Seçiniz" },
  { value: "akademik", label: "Akademik Danışmanlık" },
  { value: "kurumsal", label: "Kurumsal Hizmetler" },
  { value: "veli", label: "Veli Programları" },
  { value: "ogrenci", label: "Öğrenci Programları" }
];

// ==================== HEADER COMPONENT ====================
const StickyHeader = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 50);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const navLinks = [
    { href: "#hero", label: "Ana Sayfa" },
    { href: "#services", label: "Hizmetler" },
    { href: "#contact", label: "İletişim" }
  ];

  return (
    <header className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${isScrolled ? "bg-academic-navy/95 backdrop-blur-lg shadow-[0_4px_30px_rgba(0,0,0,0.3)] py-3" : "bg-transparent py-5"}`} data-testid="sticky-header">
      <div className="max-w-7xl mx-auto px-6 md:px-12 flex items-center justify-between">
        <a href="#hero" className="flex items-center gap-3 group">
          <img src={LOGO_URL} alt="FSS Akademi" className="w-10 h-10 rounded-full object-cover border-2 border-academic-gold/30 group-hover:border-academic-gold/60 transition-all" />
          <span className="font-playfair text-lg text-white hidden sm:block">FSS <span className="text-academic-gold">Akademi</span></span>
        </a>
        <nav className="hidden md:flex items-center gap-8">
          {navLinks.map((link) => (
            <a key={link.href} href={link.href} className="font-manrope text-sm text-slate-300 hover:text-academic-gold transition-colors relative after:absolute after:bottom-0 after:left-0 after:w-0 after:h-0.5 after:bg-academic-gold after:transition-all hover:after:w-full">{link.label}</a>
          ))}
          <a href={WHATSAPP_URL} target="_blank" rel="noopener noreferrer" className="btn-premium flex items-center gap-2 bg-academic-gold text-academic-navy hover:bg-academic-gold-dim rounded-full px-5 py-2.5 font-manrope font-semibold text-sm shadow-[0_0_20px_rgba(212,175,55,0.3)] hover:shadow-[0_0_30px_rgba(212,175,55,0.5)] hover:scale-105" data-testid="header-cta-btn">
            <Calendar className="w-4 h-4" />Ücretsiz Randevu
          </a>
        </nav>
        <button onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)} className="md:hidden text-white p-2" aria-label="Menü" data-testid="mobile-menu-btn">
          {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
        </button>
      </div>
      <div className={`md:hidden absolute top-full left-0 right-0 bg-academic-navy/98 backdrop-blur-lg border-t border-academic-gold/10 transition-all duration-300 ${isMobileMenuOpen ? "opacity-100 visible" : "opacity-0 invisible"}`}>
        <nav className="flex flex-col p-6 gap-4">
          {navLinks.map((link) => (
            <a key={link.href} href={link.href} onClick={() => setIsMobileMenuOpen(false)} className="font-manrope text-base text-slate-300 hover:text-academic-gold transition-colors py-2">{link.label}</a>
          ))}
          <a href={WHATSAPP_URL} target="_blank" rel="noopener noreferrer" className="flex items-center justify-center gap-2 bg-academic-gold text-academic-navy rounded-full px-5 py-3 font-manrope font-semibold text-sm mt-2" data-testid="mobile-cta-btn">
            <Calendar className="w-4 h-4" />Ücretsiz Danışmanlık Randevusu Al
          </a>
        </nav>
      </div>
    </header>
  );
};

// ==================== WHATSAPP BUTTON ====================
const WhatsAppButton = () => {
  const [isVisible, setIsVisible] = useState(false);
  const [isPulsing, setIsPulsing] = useState(true);

  useEffect(() => {
    const handleScroll = () => setIsVisible(window.scrollY > 300);
    window.addEventListener("scroll", handleScroll);
    const pulseTimer = setTimeout(() => setIsPulsing(false), 10000);
    return () => { window.removeEventListener("scroll", handleScroll); clearTimeout(pulseTimer); };
  }, []);

  return (
    <a href="https://api.whatsapp.com/send?phone=905309482654&text=Merhaba,%20FSS%20Akademi%20hakk%C4%B1nda%20bilgi%20almak%20istiyorum." target="_blank" rel="noopener noreferrer" className={`fixed bottom-24 right-6 z-40 flex items-center gap-3 bg-green-500 hover:bg-green-600 text-white rounded-full shadow-[0_4px_20px_rgba(34,197,94,0.4)] hover:shadow-[0_4px_30px_rgba(34,197,94,0.6)] transition-all duration-300 hover:scale-105 ${isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10 pointer-events-none"} ${isPulsing ? "animate-pulse" : ""}`} data-testid="whatsapp-btn" aria-label="WhatsApp ile iletişime geçin">
      <div className="p-3">
        <svg className="w-7 h-7" fill="currentColor" viewBox="0 0 24 24"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/></svg>
      </div>
      <span className="pr-5 font-manrope font-medium hidden sm:block">WhatsApp</span>
    </a>
  );
};

// ==================== HERO SECTION ====================
const HeroSection = ({ aboutContent }) => {
  const [scrollY, setScrollY] = useState(0);

  useEffect(() => {
    const handleScroll = () => setScrollY(window.scrollY);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <section id="hero" data-testid="hero-section" className="hero-bg mesh-gradient-dark min-h-[85vh] flex flex-col items-center justify-center relative px-6 md:px-12 pt-24">
      <div className="floating-shape floating-shape-1" style={{ transform: `translateY(${scrollY * 0.1}px)` }} />
      <div className="floating-shape floating-shape-2" style={{ transform: `translateY(${scrollY * -0.15}px)` }} />
      <div className="floating-shape floating-shape-3" style={{ transform: `translateY(${scrollY * 0.08}px)` }} />
      <div className="logo-container mb-8 opacity-0 animate-fade-in-up" style={{ animationDelay: "0.2s", animationFillMode: "forwards" }}>
        <img src={LOGO_URL} alt="FSS Akademi Logo" className="w-32 h-32 md:w-40 md:h-40 rounded-full object-cover border-4 border-academic-gold/30" data-testid="hero-logo" />
      </div>
      <h1 className="font-playfair text-4xl sm:text-5xl lg:text-6xl xl:text-7xl text-white text-center mb-8 opacity-0 animate-fade-in-up" style={{ animationDelay: "0.4s", animationFillMode: "forwards" }} data-testid="hero-title">
        <span className="text-gradient-gold italic">Biz Kimiz?</span>
      </h1>
      <p className="font-manrope text-base md:text-lg lg:text-xl text-slate-300 text-center max-w-4xl leading-relaxed opacity-0 animate-fade-in-up px-4" style={{ animationDelay: "0.6s", animationFillMode: "forwards" }} data-testid="hero-description">
        {aboutContent}
        <span className="text-academic-gold font-medium"> Başarı yolculuğunuzda güvenilir yol arkadaşınız olmaktan gurur duyuyoruz.</span>
      </p>
      <a href={WHATSAPP_URL} target="_blank" rel="noopener noreferrer" className="btn-premium mt-10 flex items-center gap-3 bg-academic-gold text-academic-navy hover:bg-academic-gold-dim rounded-full px-8 py-4 font-manrope font-semibold text-lg shadow-[0_0_30px_rgba(212,175,55,0.4)] hover:shadow-[0_0_50px_rgba(212,175,55,0.6)] hover:scale-105 transition-all opacity-0 animate-fade-in-up" style={{ animationDelay: "0.8s", animationFillMode: "forwards" }} data-testid="hero-cta-btn">
        <Calendar className="w-5 h-5" />Ücretsiz Danışmanlık Randevusu Al
      </a>
      <a href="#services" className="scroll-indicator absolute bottom-8 left-1/2 text-academic-gold opacity-60 hover:opacity-100 transition-opacity" aria-label="Aşağı kaydır" data-testid="scroll-indicator">
        <ArrowDown className="w-8 h-8" />
      </a>
    </section>
  );
};

// ==================== ACADEMIC SECTION ====================
const AcademicSection = () => {
  return (
    <div className="split-left bg-academic-navy relative overflow-hidden py-16 md:py-24 px-6 md:px-12 lg:px-16" data-testid="academic-section">
      <div className="absolute inset-0 opacity-10" style={{ backgroundImage: "url('https://images.pexels.com/photos/256477/pexels-photo-256477.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=650&w=940')", backgroundSize: "cover", backgroundPosition: "center" }} />
      <div className="relative z-10 max-w-xl mx-auto lg:mx-0">
        <span className="font-space text-xs tracking-[0.3em] text-academic-gold uppercase mb-4 block">Profesyonel Eğitim</span>
        <h2 className="font-playfair text-3xl md:text-4xl lg:text-5xl text-white mb-4">Akademik & <span className="text-gradient-gold italic">Kurumsal</span></h2>
        <p className="font-manrope text-slate-400 mb-10 leading-relaxed">Araştırmacılar, akademisyenler ve kurumlar için özel olarak tasarlanmış profesyonel eğitim programları.</p>
        <Accordion type="single" collapsible className="accordion-academic space-y-4">
          {defaultAcademicServices.map((service) => (
            <AccordionItem key={service.id} value={service.id} className="glass-dark rounded-sm border-academic-gold/20 hover:border-academic-gold/40 transition-all duration-500 overflow-hidden" data-testid={`accordion-${service.id}`}>
              <AccordionTrigger className="px-6 py-5 hover:no-underline group">
                <div className="flex items-center gap-4">
                  <span className="text-academic-gold">{service.icon}</span>
                  <span className="accordion-trigger-text font-manrope font-semibold text-white text-left group-hover:text-academic-gold transition-colors">{service.title}</span>
                </div>
              </AccordionTrigger>
              <AccordionContent className="px-6 pb-6">
                <ul className="space-y-4">
                  {service.items.map((item, index) => (
                    <li key={index} className="text-slate-300 font-manrope">
                      <div className="flex items-start gap-3">
                        <span className="w-1.5 h-1.5 bg-academic-gold rounded-full mt-2 flex-shrink-0" />
                        <div>
                          <span className="font-semibold text-white">{item.name}</span>
                          <p className="text-sm text-slate-400 mt-1 leading-relaxed">{item.desc}</p>
                        </div>
                      </div>
                    </li>
                  ))}
                </ul>
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </div>
    </div>
  );
};

// ==================== STUDENT SECTION ====================
const StudentSection = () => {
  return (
    <div className="split-right bg-gradient-to-br from-amber-50 to-orange-100 relative overflow-hidden py-16 md:py-24 px-6 md:px-12 lg:px-16" data-testid="student-section">
      <div className="absolute top-10 right-10 w-40 h-40 bg-amber-200/30 rounded-full blur-3xl" />
      <div className="absolute bottom-20 left-10 w-60 h-60 bg-orange-200/40 rounded-full blur-3xl" />
      <div className="relative z-10 max-w-xl mx-auto lg:mx-0 lg:ml-auto">
        <span className="font-space text-xs tracking-[0.3em] text-student-amber-dark uppercase mb-4 block">Bireysel Gelişim</span>
        <h2 className="font-playfair text-3xl md:text-4xl lg:text-5xl text-slate-800 mb-4">Veliler & <span className="text-student-amber-dark italic">Öğrenciler</span></h2>
        <p className="font-manrope text-slate-600 mb-10 leading-relaxed">Çocuklarınızın matematik becerilerini geliştirmek ve problem çözme yeteneklerini artırmak için kapsamlı programlar.</p>
        <Accordion type="single" collapsible className="accordion-student space-y-4">
          {defaultStudentServices.map((service) => (
            <AccordionItem key={service.id} value={service.id} className="glass-light rounded-2xl border-white/40 hover:shadow-lg transition-all duration-300 overflow-hidden" data-testid={`accordion-${service.id}`}>
              <AccordionTrigger className="px-6 py-5 hover:no-underline group">
                <div className="flex items-center gap-4">
                  <span className="text-student-amber-dark">{service.icon}</span>
                  <span className="accordion-trigger-text font-manrope font-semibold text-slate-800 text-left group-hover:text-student-amber-dark transition-colors">{service.title}</span>
                </div>
              </AccordionTrigger>
              <AccordionContent className="px-6 pb-6">
                <ul className="space-y-4">
                  {service.items.map((item, index) => (
                    <li key={index} className="text-slate-600 font-manrope">
                      <div className="flex items-start gap-3">
                        <span className="w-1.5 h-1.5 bg-student-amber rounded-full mt-2 flex-shrink-0" />
                        <div>
                          <span className="font-semibold text-slate-800">{item.name}</span>
                          <p className="text-sm text-slate-500 mt-1 leading-relaxed">{item.desc}</p>
                        </div>
                      </div>
                    </li>
                  ))}
                </ul>
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </div>
    </div>
  );
};

// ==================== SERVICES SECTION ====================
const ServicesSection = () => {
  return (
    <section id="services" className="split-section flex flex-col lg:flex-row min-h-screen" data-testid="services-section">
      <AcademicSection />
      <StudentSection />
    </section>
  );
};

// ==================== CUSTOM SECTIONS ====================
const CustomSectionsDisplay = ({ sections }) => {
  if (!sections || sections.length === 0) return null;

  return (
    <>
      {sections.map((section) => (
        <section key={section.id} className="mesh-gradient-dark py-20 md:py-28 px-6 md:px-12" data-testid={`custom-section-${section.id}`}>
          <div className="max-w-4xl mx-auto text-center">
            <h2 className="font-playfair text-3xl md:text-4xl lg:text-5xl text-white mb-8">
              <span className="text-gradient-gold italic">{section.title}</span>
            </h2>
            <div className="glass-dark rounded-2xl p-8 md:p-12">
              <p className="font-manrope text-base md:text-lg text-slate-300 leading-relaxed whitespace-pre-wrap">{section.content}</p>
            </div>
          </div>
        </section>
      ))}
    </>
  );
};

// ==================== CONTACT SECTION ====================
const ContactSection = () => {
  const [formData, setFormData] = useState({ name: "", email: "", phone: "", category: "", message: "" });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState(null);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setSubmitStatus(null);
    try {
      const form = e.target;
      const formDataToSend = new FormData(form);
      const response = await fetch("https://api.web3forms.com/submit", { method: "POST", body: formDataToSend });
      const data = await response.json();
      if (data.success) {
        setSubmitStatus("success");
        setFormData({ name: "", email: "", phone: "", category: "", message: "" });
      } else {
        setSubmitStatus("error");
      }
    } catch (error) {
      setSubmitStatus("error");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <section id="contact" className="mesh-gradient-dark py-24 md:py-32 px-6 md:px-12" data-testid="contact-section">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-16">
          <span className="font-space text-xs tracking-[0.3em] text-academic-gold uppercase mb-4 block">İletişim</span>
          <h2 className="font-playfair text-3xl md:text-4xl lg:text-5xl text-white mb-4">Bizimle <span className="text-gradient-gold italic">İletişime Geçin</span></h2>
          <p className="font-manrope text-slate-400 max-w-2xl mx-auto">Sorularınız veya eğitim programlarımız hakkında bilgi almak için formu doldurun.</p>
        </div>
        <div className="glass-dark rounded-2xl p-8 md:p-12 glow-gold">
          <form action="https://api.web3forms.com/submit" method="POST" onSubmit={handleSubmit} className="contact-form space-y-8" data-testid="contact-form">
            <input type="hidden" name="access_key" value="c872519d-1773-45ee-9b8a-e3fce5c1ffcf" />
            <input type="hidden" name="subject" value="FSS Akademi - Yeni İletişim Formu" />
            <input type="hidden" name="from_name" value="FSS Akademi Web Sitesi" />
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div><input type="text" name="name" value={formData.name} onChange={handleChange} placeholder="Adınız Soyadınız" required data-testid="contact-name" className="w-full" /></div>
              <div><input type="email" name="email" value={formData.email} onChange={handleChange} placeholder="E-posta Adresiniz" required data-testid="contact-email" className="w-full" /></div>
              <div><input type="tel" name="phone" value={formData.phone} onChange={handleChange} placeholder="Telefon Numaranız" data-testid="contact-phone" className="w-full" /></div>
              <div>
                <select name="category" value={formData.category} onChange={handleChange} required data-testid="contact-category" className="w-full cursor-pointer">
                  {CATEGORIES.map((cat) => (<option key={cat.value} value={cat.value}>{cat.label}</option>))}
                </select>
              </div>
            </div>
            <div><textarea name="message" value={formData.message} onChange={handleChange} placeholder="Mesajınız" rows="4" required data-testid="contact-message" className="w-full resize-none" /></div>
            <div className="flex flex-col items-center gap-4">
              <button type="submit" disabled={isSubmitting} data-testid="contact-submit" className="btn-premium bg-academic-gold text-academic-navy hover:bg-academic-gold-dim rounded-full px-12 py-4 font-manrope font-semibold text-lg flex items-center gap-3 disabled:opacity-50 disabled:cursor-not-allowed shadow-[0_0_30px_rgba(212,175,55,0.3)] hover:shadow-[0_0_50px_rgba(212,175,55,0.5)] transition-all hover:scale-105">
                {isSubmitting ? "Gönderiliyor..." : "Gönder"}<Send className="w-5 h-5" />
              </button>
              {submitStatus === "success" && <p className="text-green-400 font-manrope" data-testid="form-success">Mesajınız başarıyla gönderildi. En kısa sürede size dönüş yapacağız.</p>}
              {submitStatus === "error" && <p className="text-red-400 font-manrope" data-testid="form-error">Bir hata oluştu. Lütfen tekrar deneyin.</p>}
            </div>
          </form>
        </div>
      </div>
    </section>
  );
};

// ==================== FOOTER ====================
const Footer = () => {
  return (
    <footer className="bg-black py-16 px-6 md:px-12" data-testid="footer">
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col md:flex-row items-center justify-between gap-8 mb-12">
          <div className="flex items-center gap-4">
            <img src={LOGO_URL} alt="FSS Akademi" className="w-12 h-12 rounded-full object-cover border-2 border-academic-gold/30" />
            <span className="font-playfair text-xl text-white">FSS <span className="text-academic-gold">Akademi</span></span>
          </div>
          <div className="flex items-center gap-4" data-testid="social-links">
            <a href={SOCIAL_LINKS.linkedin} target="_blank" rel="noopener noreferrer" className="social-icon" aria-label="LinkedIn" data-testid="social-linkedin">
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/></svg>
            </a>
            <a href={SOCIAL_LINKS.instagram} target="_blank" rel="noopener noreferrer" className="social-icon" aria-label="Instagram" data-testid="social-instagram">
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z"/></svg>
            </a>
            <a href={SOCIAL_LINKS.youtube} target="_blank" rel="noopener noreferrer" className="social-icon" aria-label="YouTube" data-testid="social-youtube">
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/></svg>
            </a>
            <a href={SOCIAL_LINKS.tiktok} target="_blank" rel="noopener noreferrer" className="social-icon" aria-label="TikTok" data-testid="social-tiktok">
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M12.525.02c1.31-.02 2.61-.01 3.91-.02.08 1.53.63 3.09 1.75 4.17 1.12 1.11 2.7 1.62 4.24 1.79v4.03c-1.44-.05-2.89-.35-4.2-.97-.57-.26-1.1-.59-1.62-.93-.01 2.92.01 5.84-.02 8.75-.08 1.4-.54 2.79-1.35 3.94-1.31 1.92-3.58 3.17-5.91 3.21-1.43.08-2.86-.31-4.08-1.03-2.02-1.19-3.44-3.37-3.65-5.71-.02-.5-.03-1-.01-1.49.18-1.9 1.12-3.72 2.58-4.96 1.66-1.44 3.98-2.13 6.15-1.72.02 1.48-.04 2.96-.04 4.44-.99-.32-2.15-.23-3.02.37-.63.41-1.11 1.04-1.36 1.75-.21.51-.15 1.07-.14 1.61.24 1.64 1.82 3.02 3.5 2.87 1.12-.01 2.19-.66 2.77-1.61.19-.33.4-.67.41-1.06.1-1.79.06-3.57.07-5.36.01-4.03-.01-8.05.02-12.07z"/></svg>
            </a>
            <a href={SOCIAL_LINKS.twitter} target="_blank" rel="noopener noreferrer" className="social-icon" aria-label="X (Twitter)" data-testid="social-twitter">
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/></svg>
            </a>
          </div>
        </div>
        <div className="h-px bg-gradient-to-r from-transparent via-academic-gold/30 to-transparent mb-8" />
        <div className="flex flex-col md:flex-row items-center justify-between gap-4 text-center md:text-left">
          <p className="font-manrope text-sm text-slate-500">Copyright © 2026 FSS Akademi. Tüm hakları saklıdır.</p>
          <p className="font-manrope text-sm text-slate-600">Eğitimde mükemmelliğe giden yol</p>
        </div>
      </div>
    </footer>
  );
};

// ==================== ADMIN LOGIN ====================
const AdminLogin = ({ onLogin }) => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    try {
      const res = await fetch(`${API}/admin/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, password })
      });
      const data = await res.json();
      if (res.ok && data.success) {
        onLogin();
      } else {
        setError(data.detail || "Giriş başarısız");
      }
    } catch (err) {
      setError("Bağlantı hatası");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen mesh-gradient-dark flex items-center justify-center px-6">
      <div className="glass-dark rounded-2xl p-8 md:p-12 w-full max-w-md">
        <div className="text-center mb-8">
          <div className="w-16 h-16 bg-academic-gold/20 rounded-full flex items-center justify-center mx-auto mb-4">
            <Lock className="w-8 h-8 text-academic-gold" />
          </div>
          <h1 className="font-playfair text-2xl text-white">Yönetici Girişi</h1>
          <p className="font-manrope text-slate-400 text-sm mt-2">FSS Akademi Yönetim Paneli</p>
        </div>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <input type="text" value={username} onChange={(e) => setUsername(e.target.value)} placeholder="Kullanıcı Adı" className="w-full bg-slate-800/50 border border-slate-700 rounded-lg px-4 py-3 text-white placeholder-slate-500 focus:border-academic-gold focus:outline-none transition-colors" required />
          </div>
          <div>
            <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="Şifre" className="w-full bg-slate-800/50 border border-slate-700 rounded-lg px-4 py-3 text-white placeholder-slate-500 focus:border-academic-gold focus:outline-none transition-colors" required />
          </div>
          {error && <p className="text-red-400 text-sm text-center">{error}</p>}
          <button type="submit" disabled={loading} className="w-full bg-academic-gold text-academic-navy font-manrope font-semibold py-3 rounded-lg hover:bg-academic-gold-dim transition-colors disabled:opacity-50">
            {loading ? "Giriş yapılıyor..." : "Giriş Yap"}
          </button>
        </form>
        <div className="mt-6 text-center">
          <a href="/" className="text-slate-500 hover:text-academic-gold text-sm transition-colors">← Ana Sayfaya Dön</a>
        </div>
      </div>
    </div>
  );
};

// ==================== ADMIN PANEL ====================
const AdminPanel = ({ onLogout }) => {
  const [activeTab, setActiveTab] = useState("about");
  const [aboutContent, setAboutContent] = useState("");
  const [customSections, setCustomSections] = useState([]);
  const [adminUsername, setAdminUsername] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [newUsername, setNewUsername] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState({ type: "", text: "" });

  // New section form
  const [newSection, setNewSection] = useState({ title: "", content: "", isActive: true });

  useEffect(() => {
    fetchAbout();
    fetchCustomSections();
    fetchAdminSettings();
  }, []);

  const fetchAbout = async () => {
    try {
      const res = await fetch(`${API}/about`);
      const data = await res.json();
      setAboutContent(data.content || "");
    } catch (err) { console.error(err); }
  };

  const fetchCustomSections = async () => {
    try {
      const res = await fetch(`${API}/custom-sections`);
      const data = await res.json();
      setCustomSections(data);
    } catch (err) { console.error(err); }
  };

  const fetchAdminSettings = async () => {
    try {
      const res = await fetch(`${API}/admin/settings`);
      const data = await res.json();
      setAdminUsername(data.username || "");
      setNewUsername(data.username || "");
    } catch (err) { console.error(err); }
  };

  const showMessage = (type, text) => {
    setMessage({ type, text });
    setTimeout(() => setMessage({ type: "", text: "" }), 3000);
  };

  const handleUpdateAbout = async () => {
    setLoading(true);
    try {
      const res = await fetch(`${API}/about`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ content: aboutContent })
      });
      if (res.ok) showMessage("success", "Biz Kimiz bölümü güncellendi!");
      else showMessage("error", "Güncelleme başarısız");
    } catch (err) {
      showMessage("error", "Bağlantı hatası");
    } finally {
      setLoading(false);
    }
  };

  const handleAddSection = async () => {
    if (!newSection.title || !newSection.content) {
      showMessage("error", "Başlık ve içerik zorunludur");
      return;
    }
    setLoading(true);
    try {
      const res = await fetch(`${API}/custom-sections`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newSection)
      });
      if (res.ok) {
        showMessage("success", "Yeni bölüm eklendi!");
        setNewSection({ title: "", content: "", isActive: true });
        fetchCustomSections();
      } else {
        showMessage("error", "Ekleme başarısız");
      }
    } catch (err) {
      showMessage("error", "Bağlantı hatası");
    } finally {
      setLoading(false);
    }
  };

  const handleToggleSection = async (id, currentStatus) => {
    try {
      await fetch(`${API}/custom-sections/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ isActive: !currentStatus })
      });
      fetchCustomSections();
    } catch (err) { console.error(err); }
  };

  const handleDeleteSection = async (id) => {
    if (!window.confirm("Bu bölümü silmek istediğinizden emin misiniz?")) return;
    try {
      await fetch(`${API}/custom-sections/${id}`, { method: "DELETE" });
      showMessage("success", "Bölüm silindi");
      fetchCustomSections();
    } catch (err) {
      showMessage("error", "Silme başarısız");
    }
  };

  const handleUpdateAdmin = async () => {
    setLoading(true);
    try {
      const updateData = {};
      if (newUsername && newUsername !== adminUsername) updateData.username = newUsername;
      if (newPassword) updateData.password = newPassword;
      
      if (Object.keys(updateData).length === 0) {
        showMessage("error", "Değişiklik yapılmadı");
        setLoading(false);
        return;
      }

      const res = await fetch(`${API}/admin/settings`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(updateData)
      });
      if (res.ok) {
        showMessage("success", "Ayarlar güncellendi!");
        setNewPassword("");
        fetchAdminSettings();
      } else {
        showMessage("error", "Güncelleme başarısız");
      }
    } catch (err) {
      showMessage("error", "Bağlantı hatası");
    } finally {
      setLoading(false);
    }
  };

  const tabs = [
    { id: "about", label: "Biz Kimiz", icon: <FileText className="w-4 h-4" /> },
    { id: "sections", label: "Özel Bölümler", icon: <Layers className="w-4 h-4" /> },
    { id: "security", label: "Güvenlik", icon: <Shield className="w-4 h-4" /> }
  ];

  return (
    <div className="min-h-screen bg-academic-navy">
      {/* Header */}
      <header className="bg-academic-navy-light border-b border-academic-gold/20 px-6 py-4">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-3">
            <img src={LOGO_URL} alt="FSS Akademi" className="w-10 h-10 rounded-full" />
            <div>
              <h1 className="font-playfair text-xl text-white">FSS <span className="text-academic-gold">Akademi</span></h1>
              <p className="text-xs text-slate-500">Yönetim Paneli</p>
            </div>
          </div>
          <div className="flex items-center gap-4">
            <a href="/" target="_blank" className="text-slate-400 hover:text-white text-sm flex items-center gap-2">
              <Eye className="w-4 h-4" /> Siteyi Görüntüle
            </a>
            <button onClick={onLogout} className="flex items-center gap-2 text-slate-400 hover:text-red-400 transition-colors">
              <LogOut className="w-4 h-4" /> Çıkış
            </button>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-6 py-8">
        {/* Message */}
        {message.text && (
          <div className={`mb-6 p-4 rounded-lg ${message.type === "success" ? "bg-green-500/20 text-green-400 border border-green-500/30" : "bg-red-500/20 text-red-400 border border-red-500/30"}`}>
            {message.text}
          </div>
        )}

        {/* Tabs */}
        <div className="flex gap-2 mb-8 overflow-x-auto pb-2">
          {tabs.map((tab) => (
            <button key={tab.id} onClick={() => setActiveTab(tab.id)} className={`flex items-center gap-2 px-6 py-3 rounded-lg font-manrope text-sm whitespace-nowrap transition-all ${activeTab === tab.id ? "bg-academic-gold text-academic-navy font-semibold" : "bg-slate-800/50 text-slate-400 hover:bg-slate-800"}`}>
              {tab.icon} {tab.label}
            </button>
          ))}
        </div>

        {/* Tab Content */}
        <div className="glass-dark rounded-2xl p-6 md:p-8">
          {/* About Tab */}
          {activeTab === "about" && (
            <div>
              <h2 className="font-playfair text-2xl text-white mb-6">Biz Kimiz Düzenle</h2>
              <p className="text-slate-400 text-sm mb-4">Ana sayfadaki "Biz Kimiz?" bölümünün içeriğini düzenleyin.</p>
              <textarea value={aboutContent} onChange={(e) => setAboutContent(e.target.value)} rows={8} className="w-full bg-slate-800/50 border border-slate-700 rounded-lg px-4 py-3 text-white placeholder-slate-500 focus:border-academic-gold focus:outline-none transition-colors resize-none" placeholder="Biz Kimiz içeriğini yazın..." />
              <button onClick={handleUpdateAbout} disabled={loading} className="mt-4 bg-academic-gold text-academic-navy font-manrope font-semibold px-6 py-3 rounded-lg hover:bg-academic-gold-dim transition-colors disabled:opacity-50 flex items-center gap-2">
                <Save className="w-4 h-4" /> {loading ? "Kaydediliyor..." : "Kaydet"}
              </button>
            </div>
          )}

          {/* Custom Sections Tab */}
          {activeTab === "sections" && (
            <div>
              <h2 className="font-playfair text-2xl text-white mb-6">Özel Bölümler</h2>
              <p className="text-slate-400 text-sm mb-6">Hizmetler ve İletişim bölümleri arasında görünecek özel bölümler ekleyin.</p>
              
              {/* Add New Section */}
              <div className="bg-slate-800/30 rounded-xl p-6 mb-8">
                <h3 className="text-white font-semibold mb-4 flex items-center gap-2"><Plus className="w-4 h-4 text-academic-gold" /> Yeni Bölüm Ekle</h3>
                <div className="space-y-4">
                  <input type="text" value={newSection.title} onChange={(e) => setNewSection({...newSection, title: e.target.value})} placeholder="Bölüm Başlığı (örn: Öğretmenlerimiz)" className="w-full bg-slate-800/50 border border-slate-700 rounded-lg px-4 py-3 text-white placeholder-slate-500 focus:border-academic-gold focus:outline-none transition-colors" />
                  <textarea value={newSection.content} onChange={(e) => setNewSection({...newSection, content: e.target.value})} rows={4} placeholder="Bölüm içeriği..." className="w-full bg-slate-800/50 border border-slate-700 rounded-lg px-4 py-3 text-white placeholder-slate-500 focus:border-academic-gold focus:outline-none transition-colors resize-none" />
                  <div className="flex items-center gap-4">
                    <label className="flex items-center gap-2 text-slate-400 cursor-pointer">
                      <input type="checkbox" checked={newSection.isActive} onChange={(e) => setNewSection({...newSection, isActive: e.target.checked})} className="w-4 h-4 accent-academic-gold" />
                      Aktif olarak yayınla
                    </label>
                    <button onClick={handleAddSection} disabled={loading} className="ml-auto bg-academic-gold text-academic-navy font-manrope font-semibold px-6 py-2 rounded-lg hover:bg-academic-gold-dim transition-colors disabled:opacity-50">
                      {loading ? "Ekleniyor..." : "Ekle"}
                    </button>
                  </div>
                </div>
              </div>

              {/* Existing Sections */}
              <h3 className="text-white font-semibold mb-4">Mevcut Bölümler</h3>
              {customSections.length === 0 ? (
                <p className="text-slate-500 text-center py-8">Henüz özel bölüm eklenmemiş.</p>
              ) : (
                <div className="space-y-4">
                  {customSections.map((section) => (
                    <div key={section.id} className={`bg-slate-800/30 rounded-xl p-4 border ${section.isActive ? "border-green-500/30" : "border-slate-700"}`}>
                      <div className="flex items-start justify-between gap-4">
                        <div className="flex-1">
                          <h4 className="text-white font-semibold">{section.title}</h4>
                          <p className="text-slate-400 text-sm mt-1 line-clamp-2">{section.content}</p>
                        </div>
                        <div className="flex items-center gap-2">
                          <button onClick={() => handleToggleSection(section.id, section.isActive)} className={`p-2 rounded-lg transition-colors ${section.isActive ? "bg-green-500/20 text-green-400" : "bg-slate-700 text-slate-500"}`} title={section.isActive ? "Pasif yap" : "Aktif yap"}>
                            {section.isActive ? <Eye className="w-4 h-4" /> : <EyeOff className="w-4 h-4" />}
                          </button>
                          <button onClick={() => handleDeleteSection(section.id)} className="p-2 rounded-lg bg-red-500/20 text-red-400 hover:bg-red-500/30 transition-colors" title="Sil">
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* Security Tab */}
          {activeTab === "security" && (
            <div>
              <h2 className="font-playfair text-2xl text-white mb-6">Güvenlik Ayarları</h2>
              <p className="text-slate-400 text-sm mb-6">Yönetici hesap bilgilerinizi güncelleyin.</p>
              <div className="max-w-md space-y-4">
                <div>
                  <label className="text-slate-400 text-sm mb-2 block">Kullanıcı Adı</label>
                  <input type="text" value={newUsername} onChange={(e) => setNewUsername(e.target.value)} className="w-full bg-slate-800/50 border border-slate-700 rounded-lg px-4 py-3 text-white placeholder-slate-500 focus:border-academic-gold focus:outline-none transition-colors" />
                </div>
                <div>
                  <label className="text-slate-400 text-sm mb-2 block">Yeni Şifre</label>
                  <input type="password" value={newPassword} onChange={(e) => setNewPassword(e.target.value)} placeholder="Yeni şifre girin (değiştirmek için)" className="w-full bg-slate-800/50 border border-slate-700 rounded-lg px-4 py-3 text-white placeholder-slate-500 focus:border-academic-gold focus:outline-none transition-colors" />
                </div>
                <button onClick={handleUpdateAdmin} disabled={loading} className="bg-academic-gold text-academic-navy font-manrope font-semibold px-6 py-3 rounded-lg hover:bg-academic-gold-dim transition-colors disabled:opacity-50 flex items-center gap-2">
                  <Save className="w-4 h-4" /> {loading ? "Kaydediliyor..." : "Ayarları Kaydet"}
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

// ==================== ADMIN PAGE ====================
const AdminPage = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  return isLoggedIn ? (
    <AdminPanel onLogout={() => setIsLoggedIn(false)} />
  ) : (
    <AdminLogin onLogin={() => setIsLoggedIn(true)} />
  );
};

// ==================== HOME PAGE ====================
const HomePage = () => {
  const [aboutContent, setAboutContent] = useState("");
  const [customSections, setCustomSections] = useState([]);

  useEffect(() => {
    fetchAbout();
    fetchCustomSections();
  }, []);

  const fetchAbout = async () => {
    try {
      const res = await fetch(`${API}/about`);
      const data = await res.json();
      if (data.content) {
        // Remove the ending phrase as it's added in HeroSection
        let content = data.content;
        content = content.replace(/\s*Başarı yolculuğunuzda güvenilir yol arkadaşınız olmaktan gurur duyuyoruz\.?\s*$/, "");
        setAboutContent(content);
      }
    } catch (err) {
      // Use default content on error
      setAboutContent("FSS Akademi, öğrenmenin yaşam boyu süren bir serüven olduğu inancıyla kurulmuş yenilikçi bir eğitim platformudur. Temel amacımız; akademik dünyadaki bilimsel titizliği ve kanıta dayalı pedagojik yaklaşımları her seviyeden öğrenenle buluşturmaktır. Bir yanda lisansüstü araştırmacılara, akademisyenlere ve kurumlara proje üretimi (TÜBİTAK, Erasmus) ve nitel analiz (MAXQDA) gibi alanlarda profesyonel rehberlik sunarken; diğer yanda öğrencilerimizin problem çözme, istatistiksel akıl yürütme becerilerini geliştiriyoruz.");
    }
  };

  const fetchCustomSections = async () => {
    try {
      const res = await fetch(`${API}/custom-sections/active`);
      const data = await res.json();
      setCustomSections(data);
    } catch (err) {
      setCustomSections([]);
    }
  };

  return (
    <div className="App bg-academic-navy min-h-screen">
      <StickyHeader />
      <HeroSection aboutContent={aboutContent} />
      <ServicesSection />
      <CustomSectionsDisplay sections={customSections} />
      <ContactSection />
      <Footer />
      <WhatsAppButton />
    </div>
  );
};

// ==================== MAIN APP ====================
function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/admin" element={<AdminPage />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;

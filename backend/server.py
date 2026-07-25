from fastapi import FastAPI, APIRouter, HTTPException, UploadFile, File as FastAPIFile
api_router = APIRouter()
@api_router.post("/messages/reply")
async def reply_message(reply_data: dict):
    # Kullanıcıdan gelen email ve cevap metnini al
    recipient_email = reply_data.get("email")
    reply_body = reply_data.get("reply")
    
    msg = EmailMessage()
    msg.set_content(reply_body)
    msg['Subject'] = "FSS Akademi - Mesajınıza Yanıt"
    msg['From'] = "FSS Akademi <info@fssakademi.com>"
    msg['To'] = recipient_email

    with smtplib.SMTP_SSL("smtp.gmail.com", 465) as smtp:
        smtp.login(os.getenv("SMTP_EMAIL"), os.getenv("SMTP_PASSWORD"))
        smtp.send_message(msg)
    
    return {"status": "success"}
import smtplib
from email.message import EmailMessage
import os
from fastapi.staticfiles import StaticFiles
from dotenv import load_dotenv
from starlette.middleware.cors import CORSMiddleware
from motor.motor_asyncio import AsyncIOMotorClient
import os
import logging
from pathlib import Path
from pydantic import BaseModel, Field, ConfigDict
from typing import List, Optional
import uuid
from datetime import datetime, timezone
import hashlib
import shutil

ROOT_DIR = Path(__file__).parent
load_dotenv(ROOT_DIR / '.env')

import os

mongo_url = os.getenv("MONGO_URI", os.getenv("MONGO_URL", "mongodb+srv://fssakademi:fssakademi1.@cluster0.ujtlu6o.mongodb.net/?appName=Cluster0"))
client = AsyncIOMotorClient(mongo_url)

db = client[os.getenv("DB_NAME", "fss_akademi_db")]

app = FastAPI()
api_router = APIRouter(prefix="/api")

logging.basicConfig(level=logging.INFO, format='%(asctime)s - %(name)s - %(levelname)s - %(message)s')
logger = logging.getLogger(__name__)

# ==================== MODELS ====================

def hash_password(password: str) -> str:
    return hashlib.sha256(password.encode()).hexdigest()

# Admin Settings
class AdminLogin(BaseModel):
    username: str
    password: str

class AdminUpdate(BaseModel):
    username: Optional[str] = None
    password: Optional[str] = None

# About Section
class AboutSectionUpdate(BaseModel):
    content: str

# Service Item
class ServiceItem(BaseModel):
    name: str
    desc: str

# Services
class ServiceCreate(BaseModel):
    category: str
    title: str
    icon: str
    items: List[ServiceItem] = []
    mediaUrl: Optional[str] = None
    fileUrl: Optional[str] = None
    order: int = 0

class ServiceUpdate(BaseModel):
    category: Optional[str] = None
    title: Optional[str] = None
    icon: Optional[str] = None
    items: Optional[List[ServiceItem]] = None
    mediaUrl: Optional[str] = None
    fileUrl: Optional[str] = None
    order: Optional[int] = None

# Custom Sections
class CustomSectionCreate(BaseModel):
    title: str
    content: str
    mediaUrl: Optional[str] = None
    fileUrl: Optional[str] = None
    isActive: bool = True
    order: int = 0

class CustomSectionUpdate(BaseModel):
    title: Optional[str] = None
    content: Optional[str] = None
    mediaUrl: Optional[str] = None
    fileUrl: Optional[str] = None
    isActive: Optional[bool] = None
    order: Optional[int] = None

# Contents (Education/Blog)
class ContentCreate(BaseModel):
    title: str
    coverImage: Optional[str] = None
    content: str
    status: str = "draft"  # draft, active
    category: str = "education"

class ContentUpdate(BaseModel):
    title: Optional[str] = None
    coverImage: Optional[str] = None
    content: Optional[str] = None
    status: Optional[str] = None
    category: Optional[str] = None

# Messages (Inbox)
class MessageCreate(BaseModel):
    name: str
    email: str
    phone: Optional[str] = None
    subject: str
    message: str

class MessageUpdate(BaseModel):
    isRead: Optional[bool] = None

# Site Settings
class SiteSettingsUpdate(BaseModel):
    phone: Optional[str] = None
    email: Optional[str] = None
    address: Optional[str] = None
    instagram: Optional[str] = None
    linkedin: Optional[str] = None
    youtube: Optional[str] = None
    tiktok: Optional[str] = None
    twitter: Optional[str] = None
    logoUrl: Optional[str] = None
    faviconUrl: Optional[str] = None
    whatsappNumber: Optional[str] = None
    themeBg: Optional[str] = None
    themeBgLight: Optional[str] = None
    themeAccent: Optional[str] = None
    themeAccentHover: Optional[str] = None
    fontFamily: Optional[str] = None
    headingFontFamily: Optional[str] = None
    bodyFontFamily: Optional[str] = None

# Teachers
class TeacherCreate(BaseModel):
    name: str
    title: str
    bio: Optional[str] = None
    photoUrl: Optional[str] = None
    isActive: bool = True
    order: int = 0

class TeacherUpdate(BaseModel):
    name: Optional[str] = None
    title: Optional[str] = None
    bio: Optional[str] = None
    photoUrl: Optional[str] = None
    isActive: Optional[bool] = None
    order: Optional[int] = None

class SiteTextsUpdate(BaseModel):
    heroBadgeText: Optional[str] = None
    heroTitle: Optional[str] = None
    heroSubtitle: Optional[str] = None
    academicLabel: Optional[str] = None
    academicTitle: Optional[str] = None
    academicTitleColor: Optional[str] = None
    academicDesc: Optional[str] = None
    studentLabel: Optional[str] = None
    studentTitle: Optional[str] = None
    studentTitleColor: Optional[str] = None
    studentDesc: Optional[str] = None
    teachersLabel: Optional[str] = None
    teachersTitle: Optional[str] = None
    teachersDesc: Optional[str] = None
    appointmentBtnText: Optional[str] = None
    appointmentBtnIcon: Optional[str] = None
    appointmentBtnIcon: Optional[str] = None

class HeroButtonCreate(BaseModel):
    text: str
    url: str
    icon: Optional[str] = None
    styleType: str = "primary" # primary, secondary, outline
    order: int = 0

class HeroButtonUpdate(BaseModel):
    text: Optional[str] = None
    url: Optional[str] = None
    icon: Optional[str] = None
    styleType: Optional[str] = None
    order: Optional[int] = None

class FeatureCardCreate(BaseModel):
    title: str
    desc: str
    icon: str
    colorTheme: str = "blue" # blue, red, green, purple, etc.
    order: int = 0

class FeatureCardUpdate(BaseModel):
    title: Optional[str] = None
    desc: Optional[str] = None
    icon: Optional[str] = None
    colorTheme: Optional[str] = None
    order: Optional[int] = None

class FAQCreate(BaseModel):
    question: str
    answer: str
    order: int = 0

class FAQUpdate(BaseModel):
    question: Optional[str] = None
    answer: Optional[str] = None
    order: Optional[int] = None

# ==================== DEFAULT DATA ====================

DEFAULT_ACADEMIC_SERVICES = [
    {
        "id": str(uuid.uuid4()),
        "category": "academic",
        "title": "Lisans, Lisansüstü ve Akademisyenlere Yönelik",
        "icon": "graduation",
        "items": [
            {"name": "MAXQDA ile Nitel Veri Analizi", "desc": "Nitel araştırmalarınızda verilerinizi kodlama, temalaştırma ve görselleştirme teknikleriyle derinlemesine analiz etme becerisi kazanın."},
            {"name": "TÜBİTAK Projesi Yazma", "desc": "2209 ve diğer araştırma projeleri için yenilikçi, literatüre katkı sağlayan ve kabul oranı yüksek proje metni hazırlama stratejileri."},
            {"name": "Avrupa Birliği (Erasmus) Projesi Yazma", "desc": "Uluslararası fon bulma, mantıksal çerçeve yaklaşımı ve sürdürülebilir, etkili eğitim projeleri tasarlama süreçleri."},
            {"name": "Akademik Yazma", "desc": "Makale, bildiri ve tez süreçlerinde akademik dilin doğru kullanımı, APA formatı ve yayın standartları üzerine pratik eğitim."},
            {"name": "Canva Kullanımı", "desc": "Ders planları, sunumlar ve interaktif çalışma yaprakları için profesyonel ve dikkat çekici görsel materyal tasarımı."},
            {"name": "Yapay Zekâ Araçlarının Kullanımı", "desc": "Eğitimde üretken yapay zekâ ile interaktif hikaye oluşturma, karakter tasarımı ve yenilikçi eğitim materyali üretimi."},
            {"name": "Eğitim için Sosyal Medya Kullanımı", "desc": "Akademik kimlik inşası ve eğitim içeriklerinizi doğru kitleye ulaştırmak için profesyonel dijital görünürlük stratejileri."}
        ],
        "order": 0
    },
    {
        "id": str(uuid.uuid4()),
        "category": "academic",
        "title": "Kurumlara Yönelik",
        "icon": "building",
        "items": [
            {"name": "Özel Okullar için Danışmanlık", "desc": "Kurumsal eğitim kalitesini artırma, modern müfredat entegrasyonu ve yenilikçi öğretmen eğitimi rehberliği."},
            {"name": "Ters-Yüz Sınıf Modeli", "desc": "Öğrenci merkezli, aktif katılımı destekleyen ve sınıf içi etkileşimi en üst düzeye çıkaran modern pedagojik yaklaşımların kuruma entegrasyonu."},
            {"name": "Eğitim Danışmanlığı", "desc": "Kurumunuzun vizyonuna uygun, yenilikçi ve sürdürülebilir eğitim modelleri geliştirme süreçleri."}
        ],
        "order": 1
    }
]

DEFAULT_STUDENT_SERVICES = [
    {
        "id": str(uuid.uuid4()),
        "category": "student",
        "title": "Velilere Yönelik",
        "icon": "users",
        "items": [
            {"name": "İlkokul Velileri için Matematik Eğitimi", "desc": "Çocuğunuza matematiği oyunlaştırma teknikleriyle sevdirmenin ve yeni nesil soru mantığını evde desteklemenin yolları."},
            {"name": "Ortaokul Velileri için Matematik Eğitimi", "desc": "LGS sürecinde psikolojik destek, analitik düşünme becerilerini geliştirme ve doğru akademik takip stratejileri."}
        ],
        "order": 0
    },
    {
        "id": str(uuid.uuid4()),
        "category": "student",
        "title": "Öğrencilere Yönelik",
        "icon": "book",
        "items": [
            {"name": "İlkokul/Ortaokul Öğrencileri için Problem Çözme Kampı", "desc": "Ezberden uzak, eleştirel düşünmeyi ve yaratıcı problem çözme becerilerini geliştiren, interaktif ve yoğunlaştırılmış kamp programı."},
            {"name": "İlkokul Öğrencileri için Beceri Geliştirme (İstatistiksel Akıl Yürütme)", "desc": "Verileri okuma, tablo/grafik yorumlama ve günlük hayattaki problemleri matematiksel mantıkla çözme becerileri."},
            {"name": "Özel Ders - 1.-4. Sınıf", "desc": "Öğrencinin bireysel hızına uygun, görsel materyallerle desteklenmiş, tüm derslerde temel becerileri sağlamlaştıran birebir eğitim."},
            {"name": "Özel Ders - 5.-11. Sınıf (Matematik)", "desc": "Matematiksel kavramları somutlaştıran, analitik düşünmeyi geliştiren ve okul başarısını doğrudan artıran kişiselleştirilmiş dersler."},
            {"name": "Özel Ders - LGS, TYT, AYT, DGS, KPSS, ALES Matematik", "desc": "Yeni nesil sorulara özel taktikler, zaman yönetimi ve yüksek hedeflere yönelik yoğun, sonuç odaklı sınav hazırlığı."}
        ],
        "order": 1
    }
]

async def init_default_data():
    """Initialize default data"""
    # Admin
    admin = await db.admin_settings.find_one({})
    if not admin:
        await db.admin_settings.insert_one({"id": str(uuid.uuid4()), "username": "admin", "password": hash_password("admin123")})
        logger.info("Default admin created")
    
    # About
    about = await db.about_section.find_one({})
    if not about:
        await db.about_section.insert_one({
            "id": str(uuid.uuid4()),
            "content": "FSS Akademi, öğrenmenin yaşam boyu süren bir serüven olduğu inancıyla kurulmuş yenilikçi bir eğitim platformudur. Temel amacımız; akademik dünyadaki bilimsel titizliği ve kanıta dayalı pedagojik yaklaşımları her seviyeden öğrenenle buluşturmaktır. Bir yanda lisansüstü araştırmacılara, akademisyenlere ve kurumlara proje üretimi (TÜBİTAK, Erasmus) ve nitel analiz (MAXQDA) gibi alanlarda profesyonel rehberlik sunarken; diğer yanda öğrencilerimizin problem çözme, istatistiksel akıl yürütme becerilerini geliştiriyoruz. Başarı yolculuğunuzda güvenilir yol arkadaşınız olmaktan gurur duyuyoruz."
        })
    
    # Services
    services_count = await db.services.count_documents({})
    if services_count == 0:
        for service in DEFAULT_ACADEMIC_SERVICES + DEFAULT_STUDENT_SERVICES:
            await db.services.insert_one(service)
        logger.info("Default services created")
    
    # Site Settings
    settings = await db.site_settings.find_one({})
    if not settings:
        await db.site_settings.insert_one({
            "id": str(uuid.uuid4()),
            "phone": "0543 661 93 40",
            "email": "info@fssakademi.com",
            "address": "Türkiye",
            "instagram": "https://www.instagram.com/fatihsellummm",
            "linkedin": "https://www.linkedin.com/in/fatih-selim-sellüm-9713933b1/",
            "youtube": "https://www.youtube.com/@fatihsellumm",
            "tiktok": "https://www.tiktok.com/@fatihsellumm",
            "twitter": "https://x.com/fatihsellumm",
            "whatsappNumber": "905309482654",
            "logoUrl": "https://customer-assets.emergentagent.com/job_akademi-premium-1/artifacts/gt05fxv8_Ekran%20g%C3%B6r%C3%BCnt%C3%BCs%C3%BC%202026-02-27%20014942.png",
            "faviconUrl": "https://customer-assets.emergentagent.com/job_akademi-premium-1/artifacts/gt05fxv8_Ekran%20g%C3%B6r%C3%BCnt%C3%BCs%C3%BC%202026-02-27%20014942.png"
        })
        logger.info("Default site settings created")
    
    # Sample Contents
    contents_count = await db.contents.count_documents({})
    if contents_count == 0:
        sample_contents = [
            {"id": str(uuid.uuid4()), "title": "TÜBİTAK 2209-A Proje Başvuruları Başladı", "coverImage": "https://images.pexels.com/photos/3184291/pexels-photo-3184291.jpeg?auto=compress&cs=tinysrgb&w=800", "content": "2026 yılı TÜBİTAK 2209-A Üniversite Öğrencileri Araştırma Projeleri başvuruları başlamıştır. Detaylı bilgi ve danışmanlık için bizimle iletişime geçin.", "status": "active", "category": "announcement", "views": 124, "createdAt": datetime.now(timezone.utc).isoformat()},
            {"id": str(uuid.uuid4()), "title": "MAXQDA Eğitimi - Yeni Dönem Kayıtları", "coverImage": "https://images.pexels.com/photos/7103/writing-notes-idea-conference.jpg?auto=compress&cs=tinysrgb&w=800", "content": "Nitel veri analizi için MAXQDA eğitimimize kayıtlar devam ediyor. Sınırlı kontenjan!", "status": "active", "category": "education", "views": 89, "createdAt": datetime.now(timezone.utc).isoformat()},
            {"id": str(uuid.uuid4()), "title": "LGS Matematik Kampı Başlıyor", "coverImage": "https://images.pexels.com/photos/5212345/pexels-photo-5212345.jpeg?auto=compress&cs=tinysrgb&w=800", "content": "Yoğun LGS matematik kampımız Şubat ayında başlıyor. Erken kayıt avantajlarından yararlanın.", "status": "draft", "category": "education", "views": 45, "createdAt": datetime.now(timezone.utc).isoformat()}
        ]
        for content in sample_contents:
            await db.contents.insert_one(content)
        logger.info("Sample contents created")
    
    # Sample Messages
    messages_count = await db.messages.count_documents({})
    if messages_count == 0:
        sample_messages = [
            {"id": str(uuid.uuid4()), "name": "Ahmet Yılmaz", "email": "ahmet@example.com", "phone": "0532 111 2233", "subject": "TÜBİTAK Danışmanlık", "message": "Merhaba, TÜBİTAK 2209-A projesi için danışmanlık almak istiyorum. Müsaitlik durumunuzu öğrenebilir miyim?", "isRead": False, "createdAt": datetime.now(timezone.utc).isoformat()},
            {"id": str(uuid.uuid4()), "name": "Elif Kaya", "email": "elif@example.com", "phone": "0544 222 3344", "subject": "Matematik Özel Ders", "message": "6. sınıf öğrencim için matematik özel ders almak istiyoruz. Fiyat bilgisi alabilir miyim?", "isRead": False, "createdAt": datetime.now(timezone.utc).isoformat()},
            {"id": str(uuid.uuid4()), "name": "Dr. Mehmet Demir", "email": "mehmet.demir@university.edu.tr", "phone": "0555 333 4455", "subject": "MAXQDA Eğitimi", "message": "MAXQDA eğitiminize kurumsal olarak katılmak istiyoruz. 5 kişilik bir ekibiz. Grup indirimi var mı?", "isRead": True, "createdAt": datetime.now(timezone.utc).isoformat()}
        ]
        for msg in sample_messages:
            await db.messages.insert_one(msg)
        logger.info("Sample messages created")

    # Default Teachers
    teachers_count = await db.teachers.count_documents({})
    if teachers_count == 0:
        default_teachers = [
            {"id": str(uuid.uuid4()), "name": "Fatih Selim Sellüm", "title": "Kurucu & Eğitim Danışmanı", "bio": "Matematik eğitimi ve akademik danışmanlık alanında uzman. TÜBİTAK ve Erasmus projeleri konusunda deneyimli.", "photoUrl": "", "isActive": True, "order": 0, "createdAt": datetime.now(timezone.utc).isoformat()},
        ]
        for teacher in default_teachers:
            await db.teachers.insert_one(teacher)
        logger.info("Default teachers created")

    # Default Site Texts
    site_texts = await db.site_texts.find_one({})
    if not site_texts:
        default_texts = {
            "heroTitle": "Biz Kimiz?",
            "heroSubtitle": "Başarı yolculuğunuzda güvenilir yol arkadaşınız olmaktan gurur duyuyoruz.",
            "academicLabel": "Profesyonel Eğitim",
            "academicTitle": "Akademik & Kurumsal",
            "academicDesc": "Araştırmacılar, akademisyenler ve kurumlar için profesyonel eğitim programları.",
            "studentLabel": "Bireysel Gelişim",
            "studentTitle": "Veliler & Öğrenciler",
            "studentDesc": "Çocuklarınızın matematik becerilerini geliştirmek için kapsamlı programlar.",
            "teachersLabel": "Ekibimiz",
            "teachersTitle": "Öğretmenlerimiz",
            "teachersDesc": "Alanında uzman, deneyimli eğitim kadromuzla tanışın."
        }
        await db.site_texts.insert_one(default_texts)
        logger.info("Default site texts created")

    # Default FAQs
    faqs_count = await db.faqs.count_documents({})
    if faqs_count == 0:
        default_faqs = [
            {"id": str(uuid.uuid4()), "question": "Derslere başlamak için ne yapmalıyım?", "answer": "Sitemizden \"Öğretmenlerimiz\" bölümüne girerek size en uygun uzman eğitmeni seçebilirsiniz. Ardından profilin altındaki \"Ders Talep Et\" butonuna tıklayarak doğrudan WhatsApp hattımıza bağlanabilir ve ders planlamanızı dakikalar içinde yapabilirsiniz.", "order": 0},
            {"id": str(uuid.uuid4()), "question": "Eğitimler online mı yoksa yüz yüze mi gerçekleşiyor?", "answer": "FSS Akademi olarak öğrencinin ve velinin tercihine göre esnek bir model sunuyoruz. Eğitmenlerimizin uygunluğuna göre derslerimizi hem interaktif online platformlarda hem de yüz yüze gerçekleştirebiliyoruz. İhtiyacınızı WhatsApp üzerinden bize iletmeniz yeterlidir.", "order": 1},
            {"id": str(uuid.uuid4()), "question": "Ders ücretleri ne kadar ve ödemeyi nasıl yapıyoruz?", "answer": "Ders ücretlerimiz, alınan hizmetin türüne (ilkokul/ortaokul destek, problem çözme kampı veya akademik danışmanlık) göre belirlenmektedir. Fiyatlandırma ve havale/EFT ile ödeme adımları hakkında detaylı bilgiyi WhatsApp kayıt sürecimizde şeffaf bir şekilde paylaşıyoruz.", "order": 2},
            {"id": str(uuid.uuid4()), "question": "Çocuğum öğretmenle uyum sağlayamazsa eğitmen değişikliği yapabiliyor muyuz?", "answer": "Kesinlikle. FSS Akademi'de temel önceliğimiz öğrencinin akademik başarısı ve dersten aldığı verimdir. Herhangi bir uyum sorunu yaşanması durumunda, WhatsApp hattımız üzerinden bize bilgi vermeniz halinde süreci anında farklı bir uzman eğitmenimizle yeniden planlıyoruz.", "order": 3},
            {"id": str(uuid.uuid4()), "question": "Bir özel ders ne kadar sürüyor?", "answer": "Standart bir ders periyodumuz ortalama 60 dakika olarak planlanmaktadır (40-45 dakika aktif ders + dinlenme süresi). Ancak özellikle ilkokul kademesinde, öğrencimizin yaş grubuna ve dikkat süresine göre pedagojik standartlara uygun esneklikler sağlanabilmektedir.", "order": 4},
            {"id": str(uuid.uuid4()), "question": "Sistemdeki öğretmenlerinizi nasıl seçiyorsunuz?", "answer": "Kadromuzdaki tüm eğitmenler; kendi branşında (Sınıf Öğretmenliği, Matematik vb.) uzman, pedagojik formasyona sahip ve akademik geçmişi güçlü profesyonellerden oluşmaktadır. Amacımız ezberden uzak, tamamen öğrenciye özel ve destekleyici bir eğitim sunmaktır.", "order": 5}
        ]
        for faq in default_faqs:
            await db.faqs.insert_one(faq)
        logger.info("Default FAQs created")

# ==================== BASIC ROUTES ====================

@api_router.get("/")
async def root():
    return {"message": "FSS Akademi API"}

# ==================== ADMIN ROUTES ====================

@api_router.post("/admin/login")
async def admin_login(credentials: AdminLogin):
    admin = await db.admin_settings.find_one({}, {"_id": 0})
    if not admin:
        raise HTTPException(status_code=401, detail="Admin hesabı bulunamadı")
    if admin["username"] == credentials.username and admin["password"] == hash_password(credentials.password):
        return {"success": True, "message": "Giriş başarılı"}
    raise HTTPException(status_code=401, detail="Kullanıcı adı veya şifre hatalı")

@api_router.put("/admin/settings")
async def update_admin_settings(update: AdminUpdate):
    admin = await db.admin_settings.find_one({})
    if not admin:
        raise HTTPException(status_code=404, detail="Admin bulunamadı")
    update_data = {}
    if update.username:
        update_data["username"] = update.username
    if update.password:
        update_data["password"] = hash_password(update.password)
    if update_data:
        await db.admin_settings.update_one({"id": admin["id"]}, {"$set": update_data})
    return {"success": True, "message": "Ayarlar güncellendi"}

@api_router.get("/admin/settings")
async def get_admin_settings():
    admin = await db.admin_settings.find_one({}, {"_id": 0, "password": 0})
    if not admin:
        raise HTTPException(status_code=404, detail="Admin bulunamadı")
    return admin

# ==================== DASHBOARD STATS ====================

@api_router.get("/dashboard/stats")
async def get_dashboard_stats():
    total_contents = await db.contents.count_documents({})
    unread_messages = await db.messages.count_documents({"isRead": False})
    total_teachers = await db.teachers.count_documents({})
    
    # Calculate total views
    contents = await db.contents.find({}, {"views": 1, "_id": 0}).to_list(1000)
    total_views = sum(c.get("views", 0) for c in contents)
    
    return {
        "totalContents": total_contents,
        "unreadMessages": unread_messages,
        "totalViews": total_views,
        "totalTeachers": total_teachers
    }

@api_router.get("/dashboard/recent-messages")
async def get_recent_messages():
    messages = await db.messages.find({}, {"_id": 0}).sort("createdAt", -1).to_list(5)
    return messages

@api_router.get("/dashboard/recent-contents")
async def get_recent_contents():
    contents = await db.contents.find({}, {"_id": 0}).sort("createdAt", -1).to_list(5)
    return contents

# ==================== ABOUT SECTION ====================

@api_router.get("/about")
async def get_about_section():
    about = await db.about_section.find_one({}, {"_id": 0})
    if not about:
        return {"id": "", "content": ""}
    return about

@api_router.put("/about")
async def update_about_section(update: AboutSectionUpdate):
    about = await db.about_section.find_one({})
    if about:
        await db.about_section.update_one({"id": about["id"]}, {"$set": {"content": update.content}})
    else:
        await db.about_section.insert_one({"id": str(uuid.uuid4()), "content": update.content})
    return {"success": True, "message": "Biz Kimiz bölümü güncellendi"}

# ==================== SERVICES ====================

@api_router.get("/services")
async def get_services():
    services = await db.services.find({}, {"_id": 0}).to_list(100)
    services.sort(key=lambda x: (x.get("category", ""), x.get("order", 0)))
    return services

@api_router.get("/services/academic")
async def get_academic_services():
    services = await db.services.find({"category": "academic"}, {"_id": 0}).to_list(100)
    services.sort(key=lambda x: x.get("order", 0))
    return services

@api_router.get("/services/student")
async def get_student_services():
    services = await db.services.find({"category": "student"}, {"_id": 0}).to_list(100)
    services.sort(key=lambda x: x.get("order", 0))
    return services

@api_router.post("/services")
async def create_service(service: ServiceCreate):
    service_dict = service.model_dump()
    service_dict["id"] = str(uuid.uuid4())
    await db.services.insert_one(service_dict)
    created = await db.services.find_one({"id": service_dict["id"]}, {"_id": 0})
    return created

@api_router.put("/services/{service_id}")
async def update_service(service_id: str, update: ServiceUpdate):
    service = await db.services.find_one({"id": service_id})
    if not service:
        raise HTTPException(status_code=404, detail="Hizmet bulunamadı")
    update_data = {k: v for k, v in update.model_dump().items() if v is not None}
    if update_data:
        await db.services.update_one({"id": service_id}, {"$set": update_data})
    return {"success": True, "message": "Hizmet güncellendi"}

@api_router.delete("/services/{service_id}")
async def delete_service(service_id: str):
    result = await db.services.delete_one({"id": service_id})
    if result.deleted_count == 0:
        raise HTTPException(status_code=404, detail="Hizmet bulunamadı")
    return {"success": True, "message": "Hizmet silindi"}

# ==================== CUSTOM SECTIONS ====================

@api_router.get("/custom-sections")
async def get_custom_sections():
    sections = await db.custom_sections.find({}, {"_id": 0}).to_list(100)
    sections.sort(key=lambda x: x.get("order", 0))
    return sections

@api_router.get("/custom-sections/active")
async def get_active_custom_sections():
    sections = await db.custom_sections.find({"isActive": True}, {"_id": 0}).to_list(100)
    sections.sort(key=lambda x: x.get("order", 0))
    return sections

@api_router.post("/custom-sections")
async def create_custom_section(section: CustomSectionCreate):
    section_dict = section.model_dump()
    section_dict["id"] = str(uuid.uuid4())
    await db.custom_sections.insert_one(section_dict)
    created = await db.custom_sections.find_one({"id": section_dict["id"]}, {"_id": 0})
    return created

@api_router.put("/custom-sections/{section_id}")
async def update_custom_section(section_id: str, update: CustomSectionUpdate):
    section = await db.custom_sections.find_one({"id": section_id})
    if not section:
        raise HTTPException(status_code=404, detail="Bölüm bulunamadı")
    update_data = {k: v for k, v in update.model_dump().items() if v is not None}
    if update_data:
        await db.custom_sections.update_one({"id": section_id}, {"$set": update_data})
    return {"success": True, "message": "Bölüm güncellendi"}

@api_router.delete("/custom-sections/{section_id}")
async def delete_custom_section(section_id: str):
    result = await db.custom_sections.delete_one({"id": section_id})
    if result.deleted_count == 0:
        raise HTTPException(status_code=404, detail="Bölüm bulunamadı")
    return {"success": True, "message": "Bölüm silindi"}

# ==================== CONTENTS (EDUCATION/BLOG) ====================

@api_router.get("/contents")
async def get_contents():
    contents = await db.contents.find({}, {"_id": 0}).to_list(100)
    contents.sort(key=lambda x: x.get("createdAt", ""), reverse=True)
    return contents

@api_router.get("/contents/active/list")
async def get_active_contents():
    contents = await db.contents.find({"status": "active"}, {"_id": 0}).to_list(100)
    contents.sort(key=lambda x: x.get("createdAt", ""), reverse=True)
    # Increment views for displayed contents
    ids = [c["id"] for c in contents[:6]]
    if ids:
        await db.contents.update_many({"id": {"$in": ids}}, {"$inc": {"views": 1}})
    return contents

@api_router.get("/contents/{content_id}")
async def get_content(content_id: str):
    content = await db.contents.find_one({"id": content_id}, {"_id": 0})
    if not content:
        raise HTTPException(status_code=404, detail="İçerik bulunamadı")
    # Increment views
    await db.contents.update_one({"id": content_id}, {"$inc": {"views": 1}})
    return content

@api_router.post("/contents")
async def create_content(content: ContentCreate):
    content_dict = content.model_dump()
    content_dict["id"] = str(uuid.uuid4())
    content_dict["views"] = 0
    content_dict["createdAt"] = datetime.now(timezone.utc).isoformat()
    await db.contents.insert_one(content_dict)
    created = await db.contents.find_one({"id": content_dict["id"]}, {"_id": 0})
    return created

@api_router.put("/contents/{content_id}")
async def update_content(content_id: str, update: ContentUpdate):
    content = await db.contents.find_one({"id": content_id})
    if not content:
        raise HTTPException(status_code=404, detail="İçerik bulunamadı")
    update_data = {k: v for k, v in update.model_dump().items() if v is not None}
    if update_data:
        await db.contents.update_one({"id": content_id}, {"$set": update_data})
    return {"success": True, "message": "İçerik güncellendi"}

@api_router.delete("/contents/{content_id}")
async def delete_content(content_id: str):
    result = await db.contents.delete_one({"id": content_id})
    if result.deleted_count == 0:
        raise HTTPException(status_code=404, detail="İçerik bulunamadı")
    return {"success": True, "message": "İçerik silindi"}

# ==================== MESSAGES (INBOX) ====================

@api_router.get("/messages")
async def get_messages():
    messages = await db.messages.find({}, {"_id": 0}).to_list(100)
    messages.sort(key=lambda x: x.get("createdAt", ""), reverse=True)
    return messages

@api_router.get("/messages/{message_id}")
async def get_message(message_id: str):
    message = await db.messages.find_one({"id": message_id}, {"_id": 0})
    if not message:
        raise HTTPException(status_code=404, detail="Mesaj bulunamadı")
    return message

@api_router.post("/messages")
async def create_message(message: MessageCreate):
    message_dict = message.model_dump()
    message_dict["id"] = str(uuid.uuid4())
    message_dict["isRead"] = False
    message_dict["createdAt"] = datetime.now(timezone.utc).isoformat()
    await db.messages.insert_one(message_dict)
    try:
        if "email" in message_dict and message_dict["email"]:
            send_confirmation_email(message_dict["email"])
    except Exception as e:
        print(f"E-posta gönderilemedi: {e}")
    # ------------------------------------

    created = await db.messages.find_one({"id": message_dict["id"]}, {"_id": 0})
    return created
    

    # Web3Forms is forwarded from frontend (server-side requires Pro plan)

    created = await db.messages.find_one({"id": message_dict["id"]}, {"_id": 0})
    return created

@api_router.put("/messages/{message_id}")
async def update_message(message_id: str, update: MessageUpdate):
    message = await db.messages.find_one({"id": message_id})
    if not message:
        raise HTTPException(status_code=404, detail="Mesaj bulunamadı")
    update_data = {k: v for k, v in update.model_dump().items() if v is not None}
    if update_data:
        await db.messages.update_one({"id": message_id}, {"$set": update_data})
    return {"success": True, "message": "Mesaj güncellendi"}

@api_router.delete("/messages/{message_id}")
async def delete_message(message_id: str):
    result = await db.messages.delete_one({"id": message_id})
    if result.deleted_count == 0:
        raise HTTPException(status_code=404, detail="Mesaj bulunamadı")
    return {"success": True, "message": "Mesaj silindi"}

# ==================== SITE SETTINGS ====================

@api_router.get("/site-settings")
async def get_site_settings():
    settings = await db.site_settings.find_one({}, {"_id": 0})
    if not settings:
        return {}
    return settings

@api_router.put("/site-settings")
async def update_site_settings(update: SiteSettingsUpdate):
    settings = await db.site_settings.find_one({})
    update_data = {k: v for k, v in update.model_dump().items() if v is not None}
    if settings:
        await db.site_settings.update_one({"id": settings["id"]}, {"$set": update_data})
    else:
        update_data["id"] = str(uuid.uuid4())
        await db.site_settings.insert_one(update_data)
    return {"success": True, "message": "Site ayarları güncellendi"}

# ==================== SITE TEXTS ====================

@api_router.get("/site-texts")
async def get_site_texts():
    texts = await db.site_texts.find_one({}, {"_id": 0})
    if not texts:
        return {}
    return texts

@api_router.put("/site-texts")
async def update_site_texts(update: SiteTextsUpdate):
    update_data = {k: v for k, v in update.model_dump().items() if v is not None}
    if not update_data:
        return {"success": True, "message": "Değişiklik yok"}
    texts = await db.site_texts.find_one({})
    if texts:
        await db.site_texts.update_one({}, {"$set": update_data})
    else:
        await db.site_texts.insert_one(update_data)
    return {"success": True, "message": "Site metinleri güncellendi"}

# ==================== TEACHERS ====================

@api_router.get("/teachers")
async def get_teachers():
    teachers = await db.teachers.find({}, {"_id": 0}).to_list(100)
    teachers.sort(key=lambda x: x.get("order", 0))
    return teachers

@api_router.get("/teachers/active")
async def get_active_teachers():
    teachers = await db.teachers.find({"isActive": True}, {"_id": 0}).to_list(100)
    teachers.sort(key=lambda x: x.get("order", 0))
    return teachers

@api_router.post("/teachers")
async def create_teacher(teacher: TeacherCreate):
    teacher_dict = teacher.model_dump()
    teacher_dict["id"] = str(uuid.uuid4())
    teacher_dict["createdAt"] = datetime.now(timezone.utc).isoformat()
    await db.teachers.insert_one(teacher_dict)
    created = await db.teachers.find_one({"id": teacher_dict["id"]}, {"_id": 0})
    return created

@api_router.put("/teachers/{teacher_id}")
async def update_teacher(teacher_id: str, update: TeacherUpdate):
    teacher = await db.teachers.find_one({"id": teacher_id})
    if not teacher:
        raise HTTPException(status_code=404, detail="Öğretmen bulunamadı")
    update_data = {k: v for k, v in update.model_dump().items() if v is not None}
    if update_data:
        await db.teachers.update_one({"id": teacher_id}, {"$set": update_data})
    return {"success": True, "message": "Öğretmen güncellendi"}

@api_router.delete("/teachers/{teacher_id}")
async def delete_teacher(teacher_id: str):
    result = await db.teachers.delete_one({"id": teacher_id})
    if result.deleted_count == 0:
        raise HTTPException(status_code=404, detail="Öğretmen bulunamadı")
    return {"success": True, "message": "Öğretmen silindi"}

# ==================== FILE UPLOAD ====================

UPLOAD_DIR = ROOT_DIR / "uploads"
UPLOAD_DIR.mkdir(exist_ok=True)

@api_router.post("/upload")
async def upload_file(file: UploadFile = FastAPIFile(...)):
    ext = Path(file.filename).suffix.lower()
    if ext not in [".jpg", ".jpeg", ".png", ".gif", ".webp", ".svg"]:
        raise HTTPException(status_code=400, detail="Desteklenmeyen dosya formatı")
    filename = f"{uuid.uuid4().hex}{ext}"
    filepath = UPLOAD_DIR / filename
    with open(filepath, "wb") as f:
        shutil.copyfileobj(file.file, f)
    return {"url": f"/api/uploads/{filename}", "filename": filename}

# ==================== APP SETUP ====================

# ==================== HERO BUTTONS ====================
@api_router.get("/hero-buttons")
async def get_hero_buttons():
    buttons = await db.hero_buttons.find().sort("order", 1).to_list(100)
    for b in buttons: b["id"] = str(b.pop("_id"))
    return buttons

@api_router.post("/hero-buttons")
async def create_hero_button(button: HeroButtonCreate):
    new_btn = button.model_dump()
    result = await db.hero_buttons.insert_one(new_btn)
    new_btn["id"] = str(result.inserted_id)
    return new_btn

@api_router.put("/hero-buttons/{btn_id}")
async def update_hero_button(btn_id: str, button: HeroButtonUpdate):
    from bson import ObjectId
    update_data = {k: v for k, v in button.model_dump().items() if v is not None}
    if update_data:
        await db.hero_buttons.update_one({"_id": ObjectId(btn_id)}, {"$set": update_data})
    return {"status": "success"}

@api_router.delete("/hero-buttons/{btn_id}")
async def delete_hero_button(btn_id: str):
    from bson import ObjectId
    await db.hero_buttons.delete_one({"_id": ObjectId(btn_id)})
    return {"status": "success"}

# ==================== FEATURES ====================
@api_router.get("/features")
async def get_features():
    features = await db.features.find().sort("order", 1).to_list(100)
    for f in features: f["id"] = str(f.pop("_id"))
    return features

@api_router.post("/features")
async def create_feature(feature: FeatureCardCreate):
    new_feat = feature.model_dump()
    result = await db.features.insert_one(new_feat)
    new_feat["id"] = str(result.inserted_id)
    return new_feat

@api_router.put("/features/{feat_id}")
async def update_feature(feat_id: str, feature: FeatureCardUpdate):
    from bson import ObjectId
    update_data = {k: v for k, v in feature.model_dump().items() if v is not None}
    if update_data:
        await db.features.update_one({"_id": ObjectId(feat_id)}, {"$set": update_data})
    return {"status": "success"}

@api_router.delete("/features/{feat_id}")
async def delete_feature(feat_id: str):
    from bson import ObjectId
    await db.features.delete_one({"_id": ObjectId(feat_id)})
    return {"status": "success"}

app.include_router(api_router)

# Serve uploaded files
app.mount("/api/uploads", StaticFiles(directory=str(UPLOAD_DIR)), name="uploads")

app.add_middleware(
    CORSMiddleware,
    allow_credentials=True,
    allow_origins=os.environ.get('CORS_ORIGINS', '*').split(','),
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.on_event("startup")
async def startup_event():
    await init_default_data()
    logger.info("FSS Akademi API started")

@app.on_event("shutdown")
async def shutdown_db_client():
    client.close()

# ==================== FAQS ====================
@api_router.get("/faqs")
async def get_faqs():
    faqs = await db.faqs.find().sort("order", 1).to_list(100)
    for f in faqs: 
        if "_id" in f:
            f["id"] = str(f.pop("_id"))
    return faqs

@api_router.post("/faqs")
async def create_faq(faq: FAQCreate):
    new_faq = faq.model_dump()
    result = await db.faqs.insert_one(new_faq)
    new_faq["id"] = str(result.inserted_id)
    new_faq.pop("_id", None)
    return new_faq

@api_router.put("/faqs/{faq_id}")
async def update_faq(faq_id: str, faq: FAQUpdate):
    from bson import ObjectId
    update_data = {k: v for k, v in faq.model_dump().items() if v is not None}
    if update_data:
        try:
            await db.faqs.update_one({"_id": ObjectId(faq_id)}, {"$set": update_data})
        except:
            await db.faqs.update_one({"id": faq_id}, {"$set": update_data})
    return {"status": "success"}

@api_router.delete("/faqs/{faq_id}")
async def delete_faq(faq_id: str):
    from bson import ObjectId
    try:
        await db.faqs.delete_one({"_id": ObjectId(faq_id)})
    except:
        await db.faqs.delete_one({"id": faq_id})
    return {"status": "success"}


def send_confirmation_email(user_email):
    msg = EmailMessage()
    msg.set_content(f"""
Sayın İlgili,

FSS Akademi'ye göstermiş olduğunuz ilgi için teşekkür ederiz. 
İletişim formumuz aracılığıyla iletmiş olduğunuz mesajınız ekibimize ulaşmıştır. 
İncelemelerimiz sonucunda size en kısa sürede dönüş sağlayacağız.

İyi çalışmalar dileriz,
FSS Akademi Ekibi
    """) 
    msg['Subject'] = "FSS Akademi - Mesajınız Alındı"
    msg['From'] = "FSS Akademi <fssakademi@gmail.com>"
    msg['To'] = user_email

    with smtplib.SMTP_SSL("smtp.gmail.com", 465) as smtp:
        smtp.login(os.getenv("SMTP_EMAIL"), os.getenv("SMTP_PASSWORD"))
        smtp.send_message(msg)

@app.get("/")
def home():
    return {"mesaj": "Sistem basariyla calisiyor!"}

@app.get("/")
async def health_check():
    return {"status": "ok"}
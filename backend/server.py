from fastapi import FastAPI, APIRouter, HTTPException, UploadFile, File
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
import base64

ROOT_DIR = Path(__file__).parent
load_dotenv(ROOT_DIR / '.env')

# MongoDB connection
mongo_url = os.environ['MONGO_URL']
client = AsyncIOMotorClient(mongo_url)
db = client[os.environ['DB_NAME']]

# Create the main app
app = FastAPI()

# Create a router with the /api prefix
api_router = APIRouter(prefix="/api")

# Configure logging
logging.basicConfig(level=logging.INFO, format='%(asctime)s - %(name)s - %(levelname)s - %(message)s')
logger = logging.getLogger(__name__)

# ==================== MODELS ====================

class StatusCheck(BaseModel):
    model_config = ConfigDict(extra="ignore")
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    client_name: str
    timestamp: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))

class StatusCheckCreate(BaseModel):
    client_name: str

# Admin Settings
class AdminSettings(BaseModel):
    model_config = ConfigDict(extra="ignore")
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    username: str
    password: str

class AdminLogin(BaseModel):
    username: str
    password: str

class AdminUpdate(BaseModel):
    username: Optional[str] = None
    password: Optional[str] = None

# About Section
class AboutSection(BaseModel):
    model_config = ConfigDict(extra="ignore")
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    content: str

class AboutSectionUpdate(BaseModel):
    content: str

# Service Item (sub-items in a service category)
class ServiceItem(BaseModel):
    name: str
    desc: str

# Services (Dynamic service categories)
class Service(BaseModel):
    model_config = ConfigDict(extra="ignore")
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    category: str  # "academic" or "student"
    title: str
    icon: str  # icon name: "graduation", "building", "users", "book"
    items: List[ServiceItem] = []
    mediaUrl: Optional[str] = None
    fileUrl: Optional[str] = None
    order: int = 0

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
class CustomSection(BaseModel):
    model_config = ConfigDict(extra="ignore")
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    title: str
    content: str
    mediaUrl: Optional[str] = None
    fileUrl: Optional[str] = None
    isActive: bool = True
    order: int = 0

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

# ==================== HELPER FUNCTIONS ====================

def hash_password(password: str) -> str:
    return hashlib.sha256(password.encode()).hexdigest()

# Default services data
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
    """Initialize default admin, about section and services if not exists"""
    # Check if admin exists
    admin = await db.admin_settings.find_one({})
    if not admin:
        default_admin = {"id": str(uuid.uuid4()), "username": "admin", "password": hash_password("admin123")}
        await db.admin_settings.insert_one(default_admin)
        logger.info("Default admin created: admin/admin123")
    
    # Check if about section exists
    about = await db.about_section.find_one({})
    if not about:
        default_about = {
            "id": str(uuid.uuid4()),
            "content": "FSS Akademi, öğrenmenin yaşam boyu süren bir serüven olduğu inancıyla kurulmuş yenilikçi bir eğitim platformudur. Temel amacımız; akademik dünyadaki bilimsel titizliği ve kanıta dayalı pedagojik yaklaşımları her seviyeden öğrenenle buluşturmaktır. Bir yanda lisansüstü araştırmacılara, akademisyenlere ve kurumlara proje üretimi (TÜBİTAK, Erasmus) ve nitel analiz (MAXQDA) gibi alanlarda profesyonel rehberlik sunarken; diğer yanda öğrencilerimizin problem çözme, istatistiksel akıl yürütme becerilerini geliştiriyoruz. Başarı yolculuğunuzda güvenilir yol arkadaşınız olmaktan gurur duyuyoruz."
        }
        await db.about_section.insert_one(default_about)
        logger.info("Default about section created")
    
    # Check if services exist
    services_count = await db.services.count_documents({})
    if services_count == 0:
        # Insert default services
        for service in DEFAULT_ACADEMIC_SERVICES + DEFAULT_STUDENT_SERVICES:
            await db.services.insert_one(service)
        logger.info("Default services created")

# ==================== BASIC ROUTES ====================

@api_router.get("/")
async def root():
    return {"message": "FSS Akademi API"}

@api_router.post("/status", response_model=StatusCheck)
async def create_status_check(input: StatusCheckCreate):
    status_dict = input.model_dump()
    status_obj = StatusCheck(**status_dict)
    doc = status_obj.model_dump()
    doc['timestamp'] = doc['timestamp'].isoformat()
    await db.status_checks.insert_one(doc)
    return status_obj

@api_router.get("/status", response_model=List[StatusCheck])
async def get_status_checks():
    status_checks = await db.status_checks.find({}, {"_id": 0}).to_list(1000)
    for check in status_checks:
        if isinstance(check['timestamp'], str):
            check['timestamp'] = datetime.fromisoformat(check['timestamp'])
    return status_checks

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

# ==================== ABOUT SECTION ROUTES ====================

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
        new_about = {"id": str(uuid.uuid4()), "content": update.content}
        await db.about_section.insert_one(new_about)
    return {"success": True, "message": "Biz Kimiz bölümü güncellendi"}

# ==================== SERVICES ROUTES ====================

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
    service_obj = Service(**service.model_dump())
    await db.services.insert_one(service_obj.model_dump())
    return service_obj.model_dump()

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

# ==================== CUSTOM SECTIONS ROUTES ====================

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
    section_obj = CustomSection(**section.model_dump())
    await db.custom_sections.insert_one(section_obj.model_dump())
    return section_obj.model_dump()

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

# ==================== APP SETUP ====================

app.include_router(api_router)

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

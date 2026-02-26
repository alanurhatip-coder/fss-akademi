from fastapi import FastAPI, APIRouter, HTTPException, Depends
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
logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s'
)
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

# Services
class Service(BaseModel):
    model_config = ConfigDict(extra="ignore")
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    category: str
    title: str
    content: str

class ServiceCreate(BaseModel):
    category: str
    title: str
    content: str

class ServiceUpdate(BaseModel):
    category: Optional[str] = None
    title: Optional[str] = None
    content: Optional[str] = None

# Custom Sections
class CustomSection(BaseModel):
    model_config = ConfigDict(extra="ignore")
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    title: str
    content: str
    isActive: bool = True
    order: int = 0

class CustomSectionCreate(BaseModel):
    title: str
    content: str
    isActive: bool = True
    order: int = 0

class CustomSectionUpdate(BaseModel):
    title: Optional[str] = None
    content: Optional[str] = None
    isActive: Optional[bool] = None
    order: Optional[int] = None

# ==================== HELPER FUNCTIONS ====================

def hash_password(password: str) -> str:
    return hashlib.sha256(password.encode()).hexdigest()

async def init_default_data():
    """Initialize default admin and about section if not exists"""
    # Check if admin exists
    admin = await db.admin_settings.find_one({})
    if not admin:
        default_admin = {
            "id": str(uuid.uuid4()),
            "username": "admin",
            "password": hash_password("admin123")
        }
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

@api_router.get("/services", response_model=List[Service])
async def get_services():
    services = await db.services.find({}, {"_id": 0}).to_list(100)
    return services

@api_router.post("/services", response_model=Service)
async def create_service(service: ServiceCreate):
    service_obj = Service(**service.model_dump())
    await db.services.insert_one(service_obj.model_dump())
    return service_obj

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

@api_router.get("/custom-sections", response_model=List[CustomSection])
async def get_custom_sections():
    sections = await db.custom_sections.find({}, {"_id": 0}).to_list(100)
    sections.sort(key=lambda x: x.get("order", 0))
    return sections

@api_router.get("/custom-sections/active", response_model=List[CustomSection])
async def get_active_custom_sections():
    sections = await db.custom_sections.find({"isActive": True}, {"_id": 0}).to_list(100)
    sections.sort(key=lambda x: x.get("order", 0))
    return sections

@api_router.post("/custom-sections", response_model=CustomSection)
async def create_custom_section(section: CustomSectionCreate):
    section_obj = CustomSection(**section.model_dump())
    await db.custom_sections.insert_one(section_obj.model_dump())
    return section_obj

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

import re

app_file = "src/App.js"
with open(app_file, "r", encoding="utf-8") as f:
    content = f.read()

# 1. Add HelpCircle to lucide-react import
if "HelpCircle" not in content:
    content = re.sub(r'from "lucide-react";', r', HelpCircle } from "lucide-react";', content, 1)

# 2. Add AdminFAQ component before AdminPanel
admin_faq_code = """
export const AdminFAQ = () => {
  const [faqs, setFaqs] = useState([]);
  const [loading, setLoading] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [editForm, setEditForm] = useState({ question: "", answer: "", order: 0 });
  const [isAdding, setIsAdding] = useState(false);

  useEffect(() => { fetchFaqs(); }, []);

  const fetchFaqs = async () => {
    try {
      const res = await fetch(`${API}/faqs`);
      setFaqs(await res.json());
    } catch (err) { console.error(err); }
  };

  const handleSave = async () => {
    setLoading(true);
    try {
      const method = editingId ? "PUT" : "POST";
      const url = editingId ? `${API}/faqs/${editingId}` : `${API}/faqs`;
      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(editForm)
      });
      if (res.ok) {
        await fetchFaqs();
        setEditingId(null);
        setIsAdding(false);
        setEditForm({ question: "", answer: "", order: 0 });
      }
    } catch (err) { console.error(err); }
    finally { setLoading(false); }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Bu soruyu silmek istediğinize emin misiniz?")) return;
    try {
      await fetch(`${API}/faqs/${id}`, { method: "DELETE" });
      await fetchFaqs();
    } catch (err) { console.error(err); }
  };

  const startEdit = (faq) => {
    setEditingId(faq.id);
    setEditForm({ question: faq.question, answer: faq.answer, order: faq.order });
    setIsAdding(true);
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-white">Sıkça Sorulan Sorular</h1>
          <p className="text-slate-400 mt-1">Ana sayfada gösterilen soru-cevap bölümünü düzenleyin.</p>
        </div>
        <button onClick={() => { setIsAdding(true); setEditingId(null); setEditForm({ question: "", answer: "", order: 0 }); }} className="px-4 py-2 bg-academic-gold text-slate-900 font-bold rounded-lg hover:bg-yellow-500 transition-colors flex items-center gap-2">
          <Plus className="w-5 h-5" /> Yeni Soru Ekle
        </button>
      </div>

      {isAdding && (
        <div className="bg-slate-800 rounded-2xl p-6 border border-slate-700">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-lg font-bold text-white">{editingId ? "Soruyu Düzenle" : "Yeni Soru Ekle"}</h2>
            <button onClick={() => setIsAdding(false)} className="text-slate-400 hover:text-white"><X className="w-5 h-5" /></button>
          </div>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-slate-400 mb-1">Soru</label>
              <input type="text" value={editForm.question} onChange={e => setEditForm({ ...editForm, question: e.target.value })} className="w-full bg-slate-700 border border-slate-600 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-academic-gold" />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-400 mb-1">Cevap</label>
              <textarea value={editForm.answer} onChange={e => setEditForm({ ...editForm, answer: e.target.value })} rows={4} className="w-full bg-slate-700 border border-slate-600 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-academic-gold" />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-400 mb-1">Sıra</label>
              <input type="number" value={editForm.order} onChange={e => setEditForm({ ...editForm, order: parseInt(e.target.value) })} className="w-32 bg-slate-700 border border-slate-600 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-academic-gold" />
            </div>
            <div className="flex justify-end gap-3 pt-4">
              <button onClick={() => setIsAdding(false)} className="px-4 py-2 text-slate-300 hover:text-white">İptal</button>
              <button onClick={handleSave} disabled={loading} className="px-4 py-2 bg-academic-gold text-slate-900 font-bold rounded-lg hover:bg-yellow-500 disabled:opacity-50">
                {loading ? "Kaydediliyor..." : "Kaydet"}
              </button>
            </div>
          </div>
        </div>
      )}

      <div className="bg-slate-800 rounded-2xl border border-slate-700 overflow-hidden">
        <table className="w-full text-left">
          <thead className="bg-slate-700">
            <tr>
              <th className="p-4 text-slate-300 font-medium">Sıra</th>
              <th className="p-4 text-slate-300 font-medium">Soru</th>
              <th className="p-4 text-slate-300 font-medium w-32">İşlemler</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-700">
            {faqs.map(faq => (
              <tr key={faq.id} className="hover:bg-slate-700/50">
                <td className="p-4 text-slate-400">{faq.order}</td>
                <td className="p-4 text-white">{faq.question}</td>
                <td className="p-4">
                  <div className="flex items-center gap-2">
                    <button onClick={() => startEdit(faq)} className="p-2 text-blue-400 hover:bg-blue-400/10 rounded-lg"><Edit className="w-4 h-4" /></button>
                    <button onClick={() => handleDelete(faq.id)} className="p-2 text-red-400 hover:bg-red-400/10 rounded-lg"><Trash2 className="w-4 h-4" /></button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

const AdminPanel = """
if "AdminFAQ" not in content:
    content = content.replace("const AdminPanel =", admin_faq_code)

# 3. Add FAQSection component before HomePage
faq_section_code = """
const FAQSection = ({ faqs = [] }) => {
  if (!faqs || faqs.length === 0) return null;
  return (
    <section id="faq" className="py-20 px-6 md:px-12 bg-[var(--theme-bg)] relative z-20">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-16">
          <span className="font-space text-sm tracking-widest text-[var(--theme-accent)] uppercase mb-4 block font-bold">Aklınızda Soru Kalmasın</span>
          <h2 className="font-playfair text-3xl md:text-5xl font-bold text-white mb-6">Sıkça Sorulan <span className="text-[var(--theme-accent)] italic">Sorular</span></h2>
        </div>
        <Accordion type="single" collapsible className="space-y-4">
          {faqs.map((faq) => (
            <AccordionItem key={faq.id} value={faq.id} className="bg-[var(--theme-bg-light)] rounded-2xl border border-slate-700 hover:border-[var(--theme-accent)]/50 transition-colors overflow-hidden">
              <AccordionTrigger className="px-6 py-5 hover:no-underline group text-left">
                <span className="text-lg font-bold text-white group-hover:text-[var(--theme-accent)] transition-colors pr-8">{faq.question}</span>
              </AccordionTrigger>
              <AccordionContent className="px-6 pb-6 pt-0 text-slate-300 font-manrope leading-relaxed">
                {faq.answer}
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </div>
    </section>
  );
};

const HomePage = """
if "FAQSection" not in content:
    content = content.replace("const HomePage =", faq_section_code)

# 4. Add "faqs" to AdminPanel menuItems
menu_item_code = """    { id: "teachers", label: "Öğretmenlerimiz", icon: <UserCheck className="w-5 h-5" /> },
    { id: "faqs", label: "Sıkça Sorulan Sorular", icon: <HelpCircle className="w-5 h-5" /> },"""
if "Sıkça Sorulan Sorular" not in content:
    content = content.replace('{ id: "teachers", label: "Öğretmenlerimiz", icon: <UserCheck className="w-5 h-5" /> },', menu_item_code)

# 5. Add AdminFAQ to AdminPanel rendering
render_admin_faq = """          {activeView === "teachers" && <AdminTeachers />}
          {activeView === "faqs" && <AdminFAQ />}"""
if "AdminFAQ" not in content.split("const AdminPanel =")[1]:
    content = content.replace("{activeView === \"teachers\" && <AdminTeachers />}", render_admin_faq)

# 6. HomePage state
hp_state = """  const [heroButtons, setHeroButtons] = useState([]);
  const [features, setFeatures] = useState([]);
  const [faqs, setFaqs] = useState([]);"""
if "faqs, setFaqs" not in content:
    content = content.replace("  const [heroButtons, setHeroButtons] = useState([]);\n  const [features, setFeatures] = useState([]);", hp_state)

# 7. HomePage useEffect fetch
hp_fetch_call = """    fetchHeroButtons();
    fetchFeatures();
    fetchFaqs();"""
if "fetchFaqs();" not in content:
    content = content.replace("    fetchHeroButtons();\n    fetchFeatures();", hp_fetch_call)

hp_fetch_func = """  const fetchFeatures = async () => { try { const res = await fetch(`${API}/features`); setFeatures(await res.json()); } catch (err) { console.error(err); } };
  const fetchFaqs = async () => { try { const res = await fetch(`${API}/faqs`); setFaqs(await res.json()); } catch (err) { console.error(err); } };"""
if "const fetchFaqs = " not in content:
    content = content.replace("  const fetchFeatures = async () => { try { const res = await fetch(`${API}/features`); setFeatures(await res.json()); } catch (err) { console.error(err); } };", hp_fetch_func)

# 8. HomePage render FAQSection
hp_render = """      <DynamicServicesSection academicServices={academicServices} studentServices={studentServices} siteTexts={siteTexts} />
      <FAQSection faqs={faqs} />"""
if "<FAQSection" not in content:
    content = content.replace("<DynamicServicesSection academicServices={academicServices} studentServices={studentServices} siteTexts={siteTexts} />", hp_render)

with open(app_file, "w", encoding="utf-8") as f:
    f.write(content)
print("Patcher executed.")

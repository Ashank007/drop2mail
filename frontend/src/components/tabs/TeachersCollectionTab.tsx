import { useEffect, useState, useMemo } from "react";
import { 
  Search, Plus, FileText, Users, Trash2, Edit, X, Briefcase, ArrowLeft 
} from "lucide-react";
import { useNavigate } from "react-router-dom";

// --- INTERFACES ---
interface Collection {
  _id: string;
  title: string;
  description: string;
  students: any[];
  teachers: any[];
  createdBy?: { name: string; email: string };
  creatorModel?: string;
}

interface Student {
  _id: string;
  name: string;
  email: string;
}

interface Teacher {
  _id: string;
  name: string;
  email: string;
}

export default function TeacherCollectionTab() {
  const navigate = useNavigate();
  const [collections, setCollections] = useState<Collection[]>([]);
  const [allStudents, setAllStudents] = useState<Student[]>([]);
  const [allTeachers, setAllTeachers] = useState<Teacher[]>([]);
  const [loading, setLoading] = useState(true);

  const [searchTerm, setSearchTerm] = useState("");
  const [studentSearch, setStudentSearch] = useState("");
  const [teacherSearch, setTeacherSearch] = useState("");

  const [editModal, setEditModal] = useState(false);
  const [addModal, setAddModal] = useState(false);
  const [currentCollection, setCurrentCollection] = useState<Collection | null>(null);

  const [formData, setFormData] = useState({
    title: "",
    description: "",
    students: [] as string[],
    teachers: [] as string[],
  });

  const token = localStorage.getItem("teacherToken");
  const API_BASE_URL = "http://localhost:5000/api/v1";

  // --- FETCH DATA ---
  useEffect(() => {
    if (!token) {
      navigate("/login");
      return;
    }

    const fetchData = async () => {
      setLoading(true);
      try {
        const [collectionsRes, studentsRes, teachersRes] = await Promise.all([
          fetch(`${API_BASE_URL}/collection/my`, { headers: { Authorization: `Bearer ${token}` } }),
          fetch(`${API_BASE_URL}/student/all`, { headers: { Authorization: `Bearer ${token}` } }),
          fetch(`${API_BASE_URL}/teacher`, { headers: { Authorization: `Bearer ${token}` } }),
        ]);

        const collectionsJson = await collectionsRes.json();
        const studentsJson = await studentsRes.json();
        const teachersJson = await teachersRes.json();

        const collectionsData = collectionsJson.data || collectionsJson || [];
        const studentsData = studentsJson.data || studentsJson || [];
        const teachersData = teachersJson.data || teachersJson || [];

        setCollections(Array.isArray(collectionsData) ? collectionsData : []);
        setAllStudents(Array.isArray(studentsData) ? studentsData : []);
        setAllTeachers(Array.isArray(teachersData) ? teachersData : []);
      } catch (err) {
        console.error("Error fetching data:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [token, navigate]);

  // --- FILTERS ---
  const filteredCollections = useMemo(() =>
    collections.filter(c =>
      c.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      c.description.toLowerCase().includes(searchTerm.toLowerCase())
    ), [collections, searchTerm]);

  const filteredStudents = useMemo(() =>
    allStudents.filter(s =>
      s.name.toLowerCase().includes(studentSearch.toLowerCase()) ||
      s.email.toLowerCase().includes(studentSearch.toLowerCase())
    ), [allStudents, studentSearch]);

  const filteredTeachers = useMemo(() =>
    allTeachers.filter(t =>
      t.name.toLowerCase().includes(teacherSearch.toLowerCase()) ||
      t.email.toLowerCase().includes(teacherSearch.toLowerCase())
    ), [allTeachers, teacherSearch]);

  // --- CRUD HANDLERS ---
  const handleSelectionChange = (id: string, type: "students" | "teachers") => {
    const current = formData[type];
    const updated = current.includes(id) ? current.filter(i => i !== id) : [...current, id];
    setFormData(prev => ({ ...prev, [type]: updated }));
  };

  const openModal = (collection: Collection | null = null) => {
    if (collection) {
      setCurrentCollection(collection);
      setFormData({
        title: collection.title,
        description: collection.description,
        students: collection.students.map(s => typeof s === "string" ? s : s._id),
        teachers: collection.teachers.map(t => typeof t === "string" ? t : t._id),
      });
      setEditModal(true);
    } else {
      setCurrentCollection(null);
      setFormData({ title: "", description: "", students: [], teachers: [] });
      setAddModal(true);
    }
    setStudentSearch("");
    setTeacherSearch("");
  };

  const closeModal = () => {
    setEditModal(false);
    setAddModal(false);
  };

  const handleSubmit = async () => {
    const isEditing = !!currentCollection;
    const url = isEditing ? `${API_BASE_URL}/collection/${currentCollection?._id}` : `${API_BASE_URL}/collection/`;
    const method = isEditing ? "PUT" : "POST";

    try {
      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
        body: JSON.stringify(formData),
      });
      if (!res.ok) throw new Error("API request failed");
      const data = await res.json();
      const collectionData = data.data || data;

      if (isEditing) setCollections(prev => prev.map(c => c._id === collectionData._id ? collectionData : c));
      else setCollections(prev => [...prev, collectionData]);

      closeModal();
    } catch (err) {
      console.error("Error submitting collection:", err);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this collection?")) return;
    setCollections(prev => prev.filter(c => c._id !== id));
    try {
      await fetch(`${API_BASE_URL}/collection/${id}`, { method: "DELETE", headers: { Authorization: `Bearer ${token}` } });
    } catch (err) {
      console.error("Error deleting collection:", err);
    }
  };

  // --- RENDER ---
  return (
    <div className="p-4 sm:p-6 lg:p-8 bg-gray-50 min-h-screen">
      {/* Back Button */}
      <div className="mb-6">
        <button onClick={() => navigate(-1)} className="flex items-center gap-2 px-4 py-2 bg-white border rounded-lg text-gray-700 hover:bg-gray-100 transition shadow-sm">
          <ArrowLeft size={18} /> Back
        </button>
      </div>

      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
        <div>
          <h1 className="text-3xl font-bold text-gray-800">Collections</h1>
          <p className="text-gray-500 mt-1">Manage your student and teacher groups.</p>
        </div>
        <div className="w-full sm:w-auto flex items-center gap-2">
          <div className="relative w-full sm:w-64">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
            <input
              type="search"
              placeholder="Search collections..."
              value={searchTerm}
              onChange={e => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border rounded-lg focus:ring-2 focus:ring-indigo-500 transition"
            />
          </div>
          <button
            onClick={() => openModal()}
            className="flex items-center gap-2 px-4 py-2 bg-indigo-600 text-white rounded-lg shadow hover:bg-indigo-700 transition"
          >
            <Plus size={18} />
            <span className="hidden sm:inline">New Collection</span>
          </button>
        </div>
      </div>

      {/* Main Content */}
      <div className="bg-white rounded-lg shadow overflow-hidden">
        {loading ? (
          <p className="p-10 text-center text-gray-500">Loading data...</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-100 border-b">
                <tr>
                  <th className="p-4 text-left text-sm font-semibold text-gray-600 uppercase">Title</th>
                  <th className="p-4 text-left text-sm font-semibold text-gray-600 uppercase">Description</th>
                  <th className="p-4 text-left text-sm font-semibold text-gray-600 uppercase">Members</th>
                  <th className="p-4 text-right text-sm font-semibold text-gray-600 uppercase">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredCollections.length > 0 ? (
                  filteredCollections.map(c => (
                    <tr key={c._id} className="border-b hover:bg-gray-50 transition">
                      <td className="p-4 font-medium text-gray-800">{c.title}</td>
                      <td className="p-4 text-gray-600 max-w-sm truncate">{c.description}</td>
                      <td className="p-4">
                        <div className="flex flex-col gap-1 text-sm">
                          <span className="flex items-center gap-1.5 text-gray-700"><Users size={15} /> Students: {c.students.length}</span>
                          <span className="flex items-center gap-1.5 text-gray-700"><Briefcase size={15} /> Teachers: {c.teachers.length}</span>
                        </div>
                      </td>
                      <td className="p-4 flex justify-end gap-2">
                        <button onClick={() => openModal(c)} title="Edit" className="p-2 text-gray-500 hover:text-blue-600 hover:bg-blue-100 rounded-full transition"><Edit size={18} /></button>
                        <button onClick={() => handleDelete(c._id)} title="Delete" className="p-2 text-gray-500 hover:text-red-600 hover:bg-red-100 rounded-full transition"><Trash2 size={18} /></button>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={4} className="p-10 text-center text-gray-500">
                      <div className="flex flex-col items-center gap-2">
                        <FileText size={48} className="text-gray-300" />
                        <h3 className="text-lg font-semibold">No Collections Found</h3>
                        <p className="text-sm">{searchTerm ? "Try adjusting your search." : "Create a new collection to get started."}</p>
                      </div>
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Modal for Add/Edit */}
      {(editModal || addModal) && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50 p-4">
          <div className="bg-white p-6 rounded-xl shadow-xl w-full max-w-2xl animate-fadeIn relative">
            <button onClick={closeModal} className="absolute top-4 right-4 p-1 text-gray-500 hover:bg-gray-200 rounded-full"><X size={20} /></button>
            <h2 className="text-2xl font-bold mb-5 text-gray-800">{editModal ? "Edit Collection" : "Create New Collection"}</h2>
            
            <div className="space-y-4">
              <input type="text" value={formData.title} onChange={e => setFormData({ ...formData, title: e.target.value })} className="w-full border p-2 rounded focus:ring-2 focus:ring-indigo-500" placeholder="Collection Title"/>
              <textarea value={formData.description} onChange={e => setFormData({ ...formData, description: e.target.value })} className="w-full border p-2 rounded focus:ring-2 focus:ring-indigo-500" placeholder="Description" rows={3}/>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Students */}
                <div>
                  <h3 className="font-semibold mb-2 text-gray-700">Select Students</h3>
                  <div className="relative mb-2">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                    <input type="search" placeholder="Search students..." value={studentSearch} onChange={e => setStudentSearch(e.target.value)} className="w-full pl-9 pr-3 py-1.5 border rounded-md text-sm"/>
                  </div>
                  <div className="border rounded-lg p-2 max-h-48 overflow-y-auto space-y-1">
                    {filteredStudents.length > 0 ? filteredStudents.map(student => (
                      <label key={student._id} className="flex items-center gap-3 p-2 hover:bg-indigo-50 rounded cursor-pointer">
                        <input type="checkbox" className="h-4 w-4 rounded text-indigo-600 focus:ring-indigo-500" checked={formData.students.includes(student._id)} onChange={() => handleSelectionChange(student._id, "students")} />
                        <span>{student.name} ({student.email})</span>
                      </label>
                    )) : <p className="text-gray-400 text-sm">No students found</p>}
                  </div>
                </div>

                {/* Teachers */}
                <div>
                  <h3 className="font-semibold mb-2 text-gray-700">Select Teachers</h3>
                  <div className="relative mb-2">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                    <input type="search" placeholder="Search teachers..." value={teacherSearch} onChange={e => setTeacherSearch(e.target.value)} className="w-full pl-9 pr-3 py-1.5 border rounded-md text-sm"/>
                  </div>
                  <div className="border rounded-lg p-2 max-h-48 overflow-y-auto space-y-1">
                    {filteredTeachers.length > 0 ? filteredTeachers.map(teacher => (
                      <label key={teacher._id} className="flex items-center gap-3 p-2 hover:bg-indigo-50 rounded cursor-pointer">
                        <input type="checkbox" className="h-4 w-4 rounded text-indigo-600 focus:ring-indigo-500" checked={formData.teachers.includes(teacher._id)} onChange={() => handleSelectionChange(teacher._id, "teachers")} />
                        <span>{teacher.name} ({teacher.email})</span>
                      </label>
                    )) : <p className="text-gray-400 text-sm">No teachers found</p>}
                  </div>
                </div>
              </div>

              <div className="flex justify-end gap-3 mt-4">
                <button onClick={closeModal} className="px-4 py-2 bg-gray-200 rounded hover:bg-gray-300 transition">Cancel</button>
                <button onClick={handleSubmit} className="px-4 py-2 bg-indigo-600 text-white rounded hover:bg-indigo-700 transition">{editModal ? "Update" : "Create"}</button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}



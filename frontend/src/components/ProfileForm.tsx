import { useState } from "react";
import { Profile, Project, WorkExperience, Links } from "../types/profile";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";
import { Edit2, Trash2 } from "lucide-react";

interface Props {
  initialData: Profile | null;
  onCreate: (profile: Profile) => void;
  onUpdate: (profile: Profile) => void;
  onCancel: () => void;
}

export default function ProfileForm({
  initialData,
  onCreate,
  onUpdate,
  onCancel,
}: Props) {
  const [formData, setFormData] = useState<Profile>(
    initialData || {
      id: "", // optional if updating
      name: "",
      email: "",
      education: "",
      skills: [],
      projects: [],
      work: [],
      links: {},
    }
  );
  const navigate = useNavigate();
  const [skillInput, setSkillInput] = useState("");
  const [projectInput, setProjectInput] = useState<Project>({
    title: "",
    description: "",
    link: "",
  });
  const [workInput, setWorkInput] = useState<WorkExperience>({
    company: "",
    role: "",
    duration: "",
    description: "",
  });
  const [linksInput, setLinksInput] = useState<Links>(
    formData.links || { github: "", linkedin: "", portfolio: "" }
  );
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [editingWorkIndex, setEditingWorkIndex] = useState<number | null>(null);

  const handleAddSkill = () => {
    const trimmed = skillInput.trim();

    if (trimmed && !formData.skills.includes(trimmed)) {
      setFormData({ ...formData, skills: [...formData.skills, trimmed] });
      setSkillInput("");
    }
  };

  const [editingProjectIndex, setEditingProjectIndex] = useState<number | null>(
    null
  );

  const handleAddProject = () => {
    if (!projectInput.title.trim()) return;

    if (editingProjectIndex !== null) {
      const updatedProjects = [...formData.projects];
      updatedProjects[editingProjectIndex] = { ...projectInput };
      setFormData({ ...formData, projects: updatedProjects });
      setEditingProjectIndex(null);
    } else {
      setFormData({
        ...formData,
        projects: [...formData.projects, { ...projectInput }],
      });
    }

    setProjectInput({ title: "", description: "", link: "" });
  };

  const handleAddWork = () => {
    if (!workInput.company.trim()) return;

    if (editingWorkIndex !== null) {
      const updatedWork = [...formData.work];
      updatedWork[editingWorkIndex] = { ...workInput };
      setFormData({ ...formData, work: updatedWork });
      setEditingWorkIndex(null);
    } else {
      setFormData({
        ...formData,
        work: [...formData.work, { ...workInput }],
      });
    }

    setWorkInput({ company: "", role: "", duration: "", description: "" });
  };

  const handleLinksChange = (field: keyof Links, value: string) => {
    setLinksInput({ ...linksInput, [field]: value });
    setFormData({ ...formData, links: { ...formData.links, [field]: value } });
  };

  // ✅ Create handler
  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setError(null);

    if (formData.skills.length === 0) {
      toast.error("Please add at least one skill.");
      setSaving(false);
      return;
    }
    if (formData.projects.length === 0) {
      toast.error("Please add at least one project.");
      setSaving(false);
      return;
    }
    if (formData.work.length === 0) {
      toast.error("Please add at least one work experience.");
      setSaving(false);
      return;
    }

    try {
      const payload = { ...formData };
      delete (payload as any).id;
      onCreate(payload);
      setFormData({
        id: "",
        name: "",
        email: "",
        education: "",
        skills: [],
        projects: [],
        work: [],
        links: {},
      });
      toast.success("Profile created successfully!");
      navigate("/");
    } catch (err: any) {
      toast.error("Failed to create profile");
    } finally {
      setSaving(false);
    }
  };

  // ✅ Update handler
  const handleUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setError(null);

    if (!formData.id) {
      setError("No profile selected to update.");
      setSaving(false);
      return;
    }

    try {
      const payload = { ...formData };
      delete (payload as any).id;
      onUpdate({ ...payload, id: formData.id });
    } catch (err: any) {
      setError(err.message || "Failed to update profile");
    } finally {
      setSaving(false);
    }
  };

  return (
    <form className="bg-white shadow-lg p-6 rounded-xl space-y-4">
      {error && <p className="text-red-500">{error}</p>}

      {/* Basic Info */}
      <input
        type="text"
        placeholder="Name"
        value={formData.name}
        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
        className="border p-2 w-full rounded"
        required
      />
      <input
        type="email"
        placeholder="Email"
        value={formData.email}
        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
        className="border p-2 w-full rounded"
        required
      />
      <input
        type="text"
        placeholder="Education"
        value={formData.education}
        onChange={(e) =>
          setFormData({ ...formData, education: e.target.value })
        }
        className="border p-2 w-full rounded"
      />

      {/* Skills */}
      <div>
        <h3 className="font-semibold mb-2">Skills</h3>
        <div className="flex gap-2 mb-2">
          <input
            type="text"
            placeholder="Add skill"
            value={skillInput}
            onChange={(e) => setSkillInput(e.target.value)}
            className="border p-2 flex-1 rounded"
          />
          <button
            type="button"
            onClick={handleAddSkill}
            className="bg-blue-500 text-white px-4 rounded hover:bg-blue-600 transition-colors"
          >
            Add
          </button>
        </div>
        <div className="flex gap-2 mt-2 flex-wrap">
          {formData.skills.map((skill, i) => (
            <div
              key={i}
              className="relative bg-gray-200 px-3 py-1 rounded-lg flex items-center"
            >
              <span>{skill}</span>
              <button
                type="button"
                onClick={() =>
                  setFormData({
                    ...formData,
                    skills: formData.skills.filter((_, idx) => idx !== i),
                  })
                }
                className="absolute -top-1 -right-2 w-4 h-4 flex items-center justify-center bg-red-500 text-white text-xs rounded-full hover:bg-red-600 transition-colors"
              >
                ×
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* Projects */}
      <div className="mt-4">
        <h3 className="font-semibold mb-2">Projects</h3>

        {/* Project Input Form */}
        <div className="space-y-2">
          <input
            type="text"
            placeholder="Project Title"
            value={projectInput.title}
            onChange={(e) =>
              setProjectInput({ ...projectInput, title: e.target.value })
            }
            className="border p-2 w-full rounded"
          />
          <textarea
            placeholder="Project Description"
            value={projectInput.description}
            onChange={(e) =>
              setProjectInput({ ...projectInput, description: e.target.value })
            }
            className="border p-2 w-full rounded resize-none min-h-[6rem] max-h-40 overflow-auto focus:ring-2 focus:ring-purple-400 focus:outline-none transition-all"
          />
          <input
            type="text"
            placeholder="Project Link"
            value={projectInput.link}
            onChange={(e) =>
              setProjectInput({ ...projectInput, link: e.target.value })
            }
            className="border p-2 w-full rounded"
          />

          {/* Project Skills Input */}
          <input
            type="text"
            placeholder="Project Skills (comma separated)"
            value={projectInput.pskills?.join(", ") || ""}
            onChange={(e) =>
              setProjectInput({
                ...projectInput,
                pskills: e.target.value.split(",").map((s) => s.trim()),
              })
            }
            className="border p-2 w-full rounded"
          />

          <button
            type="button"
            onClick={handleAddProject}
            className="bg-purple-500 text-white px-4 py-2 rounded hover:bg-purple-600 transition-colors flex items-center gap-2"
          >
            {editingProjectIndex !== null ? "Update Project" : "Add Project"}
          </button>
        </div>

        {/* Render added projects */}
        {formData.projects.length > 0 && (
          <div className="mt-2 space-y-2">
            {formData.projects.map((proj, i) => (
              <div
                key={i}
                className="relative border p-2 rounded bg-gray-50 flex flex-col"
              >
                <div className="flex justify-between items-start">
                  <div>
                    <p className="font-semibold">{proj.title}</p>
                    {proj.description && <p>{proj.description}</p>}
                    {proj.link && (
                      <p className="text-blue-500 underline">{proj.link}</p>
                    )}
                    {proj.pskills && proj.pskills.length > 0 && (
                      <p className="mt-1">
                        <span className="font-semibold">Skills:</span>{" "}
                        {proj.pskills.join(", ")}
                      </p>
                    )}
                  </div>
                  <div className="flex gap-2">
                    {/* Edit button */}
                    <button
                      type="button"
                      onClick={() => {
                        setProjectInput(proj);
                        setEditingProjectIndex(i);
                      }}
                      className="text-green-500 hover:text-green-700 flex items-center gap-1"
                    >
                      <Edit2 className="w-4 h-4" /> Edit
                    </button>
                    {/* Delete button */}
                    <button
                      type="button"
                      onClick={() =>
                        setFormData({
                          ...formData,
                          projects: formData.projects.filter(
                            (_, idx) => idx !== i
                          ),
                        })
                      }
                      className="text-red-500 hover:text-red-700 flex items-center gap-1"
                    >
                      <Trash2 className="w-4 h-4" /> Delete
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Work Experience */}
      <div className="mt-4">
        <h3 className="font-semibold mb-2">Work Experience</h3>

        {/* Work Input Form */}
        <div className="space-y-2">
          <input
            type="text"
            placeholder="Company"
            value={workInput.company}
            onChange={(e) =>
              setWorkInput({ ...workInput, company: e.target.value })
            }
            className="border p-2 w-full rounded"
          />
          <input
            type="text"
            placeholder="Role"
            value={workInput.role}
            onChange={(e) =>
              setWorkInput({ ...workInput, role: e.target.value })
            }
            className="border p-2 w-full rounded"
          />
          <input
            type="text"
            placeholder="Duration"
            value={workInput.duration}
            onChange={(e) =>
              setWorkInput({ ...workInput, duration: e.target.value })
            }
            className="border p-2 w-full rounded"
          />
          <textarea
            placeholder="Description"
            value={workInput.description}
            onChange={(e) =>
              setWorkInput({ ...workInput, description: e.target.value })
            }
            className="border p-2 w-full rounded resize-none min-h-[6rem] max-h-40 overflow-auto focus:ring-2 focus:ring-yellow-400 focus:outline-none transition-all"
          />
          <button
            type="button"
            onClick={handleAddWork}
            className="bg-yellow-500 text-white px-4 py-2 rounded hover:bg-yellow-600 transition-colors flex items-center gap-2"
          >
            {editingWorkIndex !== null ? "Update Work" : "Add Work"}
          </button>
        </div>

        {/* Render added work items */}
        {formData.work.length > 0 && (
          <div className="mt-2 space-y-2">
            {formData.work.map((w, i) => (
              <div
                key={i}
                className="relative border p-2 rounded bg-gray-50 flex flex-col"
              >
                <div className="flex justify-between items-start">
                  <div>
                    <p className="font-semibold">
                      {w.role} @ {w.company}
                    </p>
                    {w.duration && <p className="italic">{w.duration}</p>}
                    {w.description && <p>{w.description}</p>}
                  </div>
                  <div className="flex gap-2">
                    {/* Edit button */}
                    <button
                      type="button"
                      onClick={() => {
                        setWorkInput(w);
                        setEditingWorkIndex(i);
                      }}
                      className="text-green-500 hover:text-green-700 flex items-center gap-1"
                    >
                      <Edit2 className="w-4 h-4" /> Edit
                    </button>
                    {/* Delete button */}
                    <button
                      type="button"
                      onClick={() =>
                        setFormData({
                          ...formData,
                          work: formData.work.filter((_, idx) => idx !== i),
                        })
                      }
                      className="text-red-500 hover:text-red-700 flex items-center gap-1"
                    >
                      <Trash2 className="w-4 h-4" /> Delete
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Links */}
      <div>
        <h3 className="font-semibold">Links</h3>
        <div className="space-y-2">
          <input
            type="text"
            placeholder="GitHub"
            value={linksInput.github || ""}
            onChange={(e) => handleLinksChange("github", e.target.value)}
            className="border p-2 w-full rounded"
          />
          <input
            type="text"
            placeholder="LinkedIn"
            value={linksInput.linkedin || ""}
            onChange={(e) => handleLinksChange("linkedin", e.target.value)}
            className="border p-2 w-full rounded"
          />
          <input
            type="text"
            placeholder="Portfolio"
            value={linksInput.portfolio || ""}
            onChange={(e) => handleLinksChange("portfolio", e.target.value)}
            className="border p-2 w-full rounded"
          />
        </div>
      </div>

      {/* Buttons */}
      <div className="flex gap-3">
        {!formData.id && (
          <button
            onClick={handleCreate}
            className={`bg-blue-500 text-white px-4 py-2 rounded ${
              saving ? "opacity-50 cursor-not-allowed" : ""
            }`}
            disabled={saving}
          >
            {saving ? "Creating..." : "Create New"}
          </button>
        )}

        {formData.id && (
          <button
            onClick={handleUpdate}
            className={`bg-green-500 text-white px-4 py-2 rounded ${
              saving ? "opacity-50 cursor-not-allowed" : ""
            }`}
            disabled={saving}
          >
            {saving ? "Updating..." : "Update"}
          </button>
        )}

        <button
          type="button"
          onClick={onCancel}
          className="bg-gray-400 text-white px-4 py-2 rounded"
        >
          Cancel
        </button>
      </div>
    </form>
  );
}

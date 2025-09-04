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
      id: "",
      name: "",
      email: "",
      education: "",
      skills: [],
      projects: [],
      work: [],
      links: { github: "", linkedin: "", portfolio: "" }, // ensure keys initialized
    }
  );
  const [skillInput, setSkillInput] = useState("");
  const [projectInput, setProjectInput] = useState<Project>({
    title: "",
    description: "",
    link: "",
    pskills: [],
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
  const [editingProjectIndex, setEditingProjectIndex] = useState<number | null>(null);
  const [editingWorkIndex, setEditingWorkIndex] = useState<number | null>(null);
  const navigate = useNavigate();

  // Handlers...

  const handleAddSkill = () => {
    const trimmed = skillInput.trim();
    if (trimmed && !formData.skills.includes(trimmed)) {
      setFormData({ ...formData, skills: [...formData.skills, trimmed] });
      setSkillInput("");
    }
  };

  const handleAddProject = () => {
    if (!projectInput.title.trim()) {
      toast.error("Project title is required");
      return;
    }

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

    setProjectInput({ title: "", description: "", link: "", pskills: [] });
  };

  const handleAddWork = () => {
    if (!workInput.company.trim()) {
      toast.error("Work company is required");
      return;
    }

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

  const validateForm = () => {
    if (!formData.name.trim()) {
      toast.error("Name is required");
      return false;
    }
    if (!formData.email.trim()) {
      toast.error("Email is required");
      return false;
    }
    if (formData.skills.length === 0) {
      toast.error("Please add at least one skill.");
      return false;
    }
    if (formData.projects.length === 0) {
      toast.error("Please add at least one project.");
      return false;
    }
    if (formData.work.length === 0) {
      toast.error("Please add at least one work experience.");
      return false;
    }
    return true;
  };

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setError(null);

    if (!validateForm()) {
      setSaving(false);
      return;
    }

    try {
      const { id, ...payload } = formData; // remove id for create
      onCreate(payload);
      toast.success("Profile created successfully!");
      navigate("/");
    } catch (err: any) {
      setError("Failed to create profile");
    } finally {
      setSaving(false);
    }
  };

  const handleUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setError(null);

    if (!formData.id) {
      setError("No profile selected to update.");
      setSaving(false);
      return;
    }

    if (!validateForm()) {
      setSaving(false);
      return;
    }

    try {
      onUpdate(formData);
      toast.success("Profile updated successfully!");
    } catch (err: any) {
      setError(err.message || "Failed to update profile");
    } finally {
      setSaving(false);
    }
  };

  return (
    <form
      onSubmit={formData.id ? handleUpdate : handleCreate}
      className="max-w-3xl mx-auto bg-white p-6 rounded-lg shadow-md space-y-6"
      noValidate
    >
      {error && <p className="text-red-600 font-semibold">{error}</p>}

      {/* Basic Info */}
      <div className="space-y-3">
        <input
          type="text"
          placeholder="Name"
          value={formData.name}
          onChange={(e) => setFormData({ ...formData, name: e.target.value })}
          className="border rounded-md p-3 w-full focus:outline-blue-500"
          required
          autoComplete="name"
        />
        <input
          type="email"
          placeholder="Email"
          value={formData.email}
          onChange={(e) => setFormData({ ...formData, email: e.target.value })}
          className="border rounded-md p-3 w-full focus:outline-blue-500"
          required
          autoComplete="email"
        />
        <input
          type="text"
          placeholder="Education"
          value={formData.education}
          onChange={(e) => setFormData({ ...formData, education: e.target.value })}
          className="border rounded-md p-3 w-full focus:outline-blue-500"
          autoComplete="education"
        />
      </div>

      {/* Skills Section */}
      <div>
        <h3 className="text-lg font-semibold mb-2">Skills</h3>
        <div className="flex gap-2 mb-3">
          <input
            type="text"
            value={skillInput}
            onChange={(e) => setSkillInput(e.target.value)}
            placeholder="Add skill"
            className="border rounded-md p-2 flex-grow focus:outline-blue-500"
          />
          <button
            type="button"
            onClick={handleAddSkill}
            className="bg-blue-600 text-white rounded-md px-4 hover:bg-blue-700 transition"
          >
            Add
          </button>
        </div>
        <div className="flex flex-wrap gap-2">
          {formData.skills.map((skill, index) => (
            <div
              key={index}
              className="bg-gray-200 rounded-full px-3 py-1 flex items-center space-x-2"
            >
              <span>{skill}</span>
              <button
                type="button"
                onClick={() =>
                  setFormData({
                    ...formData,
                    skills: formData.skills.filter((_, i) => i !== index),
                  })
                }
                className="text-red-600 hover:text-red-800"
                aria-label={`Remove skill ${skill}`}
              >
                ×
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* Projects Section */}
      <div>
        <h3 className="text-lg font-semibold mb-3">Projects</h3>
        {/* Project Input */}
        <div className="space-y-3 border p-4 rounded-md bg-gray-50">
          <input
            type="text"
            placeholder="Project Title"
            value={projectInput.title}
            onChange={(e) =>
              setProjectInput({ ...projectInput, title: e.target.value })
            }
            className="border rounded-md p-2 w-full focus:outline-blue-500"
            required
          />
          <textarea
            placeholder="Project Description"
            value={projectInput.description}
            onChange={(e) =>
              setProjectInput({ ...projectInput, description: e.target.value })
            }
            className="border rounded-md p-2 w-full min-h-[5rem] resize-none focus:outline-blue-500"
          />
          <input
            type="url"
            placeholder="Project Link"
            value={projectInput.link}
            onChange={(e) =>
              setProjectInput({ ...projectInput, link: e.target.value })
            }
            className="border rounded-md p-2 w-full focus:outline-blue-500"
          />
          <input
            type="text"
            placeholder="Project Skills (comma separated)"
            value={projectInput.pskills?.join(", ") || ""}
            onChange={(e) =>
              setProjectInput({
                ...projectInput,
                pskills: e.target.value
                  .split(",")
                  .map((s) => s.trim())
                  .filter(Boolean),
              })
            }
            className="border rounded-md p-2 w-full focus:outline-blue-500"
          />
          <button
            type="button"
            onClick={handleAddProject}
            className="bg-purple-600 text-white px-4 py-2 rounded hover:bg-purple-700 w-full transition"
          >
            {editingProjectIndex !== null ? "Update Project" : "Add Project"}
          </button>
        </div>
        {/* Projects List */}
        {formData.projects.length > 0 && (
          <div className="mt-4 space-y-2">
            {formData.projects.map((proj, i) => (
              <div
                key={i}
                className="p-4 border rounded-md bg-white shadow-sm flex justify-between items-start"
              >
                <div>
                  <p className="font-semibold">{proj.title}</p>
                  {proj.description && <p>{proj.description}</p>}
                  {proj.link && (
                    <a
                      href={proj.link}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-blue-600 underline"
                    >
                      {proj.link}
                    </a>
                  )}
                  {proj.pskills && proj.pskills.length > 0 && (
                    <p className="mt-1 text-sm text-gray-600">
                      <strong>Skills:</strong> {proj.pskills.join(", ")}
                    </p>
                  )}
                </div>
                <div className="flex space-x-2">
                  <button
                    type="button"
                    onClick={() => {
                      setProjectInput(proj);
                      setEditingProjectIndex(i);
                    }}
                    className="text-green-600 hover:text-green-800"
                    aria-label={`Edit project ${proj.title}`}
                  >
                    <Edit2 className="w-5 h-5" />
                  </button>
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
                    className="text-red-600 hover:text-red-800"
                    aria-label={`Delete project ${proj.title}`}
                  >
                    <Trash2 className="w-5 h-5" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Work Experience Section */}
      <div>
        <h3 className="text-lg font-semibold mb-3">Work Experience</h3>
        {/* Work Input */}
        <div className="space-y-3 border p-4 rounded-md bg-gray-50">
          <input
            type="text"
            placeholder="Company"
            value={workInput.company}
            onChange={(e) =>
              setWorkInput({ ...workInput, company: e.target.value })
            }
            className="border rounded-md p-2 w-full focus:outline-yellow-500"
            required
          />
          <input
            type="text"
            placeholder="Role"
            value={workInput.role}
            onChange={(e) =>
              setWorkInput({ ...workInput, role: e.target.value })
            }
            className="border rounded-md p-2 w-full focus:outline-yellow-500"
          />
          <input
            type="text"
            placeholder="Duration"
            value={workInput.duration}
            onChange={(e) =>
              setWorkInput({ ...workInput, duration: e.target.value })
            }
            className="border rounded-md p-2 w-full focus:outline-yellow-500"
          />
          <textarea
            placeholder="Description"
            value={workInput.description}
            onChange={(e) =>
              setWorkInput({ ...workInput, description: e.target.value })
            }
            className="border rounded-md p-2 w-full min-h-[5rem] resize-none focus:outline-yellow-500"
          />
          <button
            type="button"
            onClick={handleAddWork}
            className="bg-yellow-600 text-white px-4 py-2 rounded hover:bg-yellow-700 w-full transition"
          >
            {editingWorkIndex !== null ? "Update Work" : "Add Work"}
          </button>
        </div>

        {/* Work List */}
        {formData.work.length > 0 && (
          <div className="mt-4 space-y-2">
            {formData.work.map((w, i) => (
              <div
                key={i}
                className="p-4 border rounded-md bg-white shadow-sm flex justify-between items-start"
              >
                <div>
                  <p className="font-semibold">
                    {w.role} @ {w.company}
                  </p>
                  {w.duration && <p className="italic">{w.duration}</p>}
                  {w.description && <p>{w.description}</p>}
                </div>
                <div className="flex space-x-2">
                  <button
                    type="button"
                    onClick={() => {
                      setWorkInput(w);
                      setEditingWorkIndex(i);
                    }}
                    className="text-green-600 hover:text-green-800"
                    aria-label={`Edit work at ${w.company}`}
                  >
                    <Edit2 className="w-5 h-5" />
                  </button>
                  <button
                    type="button"
                    onClick={() =>
                      setFormData({
                        ...formData,
                        work: formData.work.filter((_, idx) => idx !== i),
                      })
                    }
                    className="text-red-600 hover:text-red-800"
                    aria-label={`Delete work at ${w.company}`}
                  >
                    <Trash2 className="w-5 h-5" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Links Section */}
      <div>
        <h3 className="text-lg font-semibold mb-2">Links</h3>
        <input
          type="url"
          placeholder="GitHub"
          value={linksInput.github || ""}
          onChange={(e) => handleLinksChange("github", e.target.value)}
          className="border rounded-md p-2 w-full focus:outline-blue-500 mb-2"
        />
        <input
          type="url"
          placeholder="LinkedIn"
          value={linksInput.linkedin || ""}
          onChange={(e) => handleLinksChange("linkedin", e.target.value)}
          className="border rounded-md p-2 w-full focus:outline-blue-500 mb-2"
        />
        <input
          type="url"
          placeholder="Portfolio"
          value={linksInput.portfolio || ""}
          onChange={(e) => handleLinksChange("portfolio", e.target.value)}
          className="border rounded-md p-2 w-full focus:outline-blue-500 mb-2"
        />
      </div>

      {/* Submit/Cancel Buttons */}
      <div className="flex gap-3 justify-end">
        <button
          type="submit"
          disabled={saving}
          className="bg-blue-600 text-white px-6 py-2 rounded-md hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition"
        >
          {saving ? (formData.id ? "Updating..." : "Creating...") : formData.id ? "Update" : "Create"}
        </button>
        <button
          type="button"
          onClick={onCancel}
          disabled={saving}
          className="bg-gray-400 text-white px-6 py-2 rounded-md hover:bg-gray-500 disabled:opacity-50 disabled:cursor-not-allowed transition"
        >
          Cancel
        </button>
      </div>
    </form>
  );
}

import { useState } from "react";
import { Profile, Project, WorkExperience, Links } from "../types/profile";

interface Props {
  initialData: Profile | null;
  onCreate: (profile: Profile) => void;
  onUpdate: (profile: Profile) => void;
  onCancel: () => void;
}

export default function ProfileForm({ initialData, onCreate, onUpdate, onCancel }: Props) {
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

  const handleAddSkill = () => {
    const trimmed = skillInput.trim();
    if (trimmed && !formData.skills.includes(trimmed)) {
      setFormData({ ...formData, skills: [...formData.skills, trimmed] });
      setSkillInput("");
    }
  };

  const handleAddProject = () => {
    if (!projectInput.title.trim()) return;
    setFormData({
      ...formData,
      projects: [...formData.projects, { ...projectInput }],
    });
    setProjectInput({ title: "", description: "", link: "" });
  };

  const handleAddWork = () => {
    if (!workInput.company.trim()) return;
    setFormData({ ...formData, work: [...formData.work, { ...workInput }] });
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
      setError("Please add at least one skill.");
      setSaving(false);
      return;
    }
    if (formData.projects.length === 0) {
      setError("Please add at least one project.");
      setSaving(false);
      return;
    }
    if (formData.work.length === 0) {
      setError("Please add at least one work experience.");
      setSaving(false);
      return;
    }

    try {
      const payload = { ...formData };
      delete (payload as any).id;
      onCreate(payload);
      // ✅ reset form after creation
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
    } catch (err: any) {
      setError(err.message || "Failed to create profile");
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
        <h3 className="font-semibold">Skills</h3>
        <div className="flex gap-2">
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
            className="bg-blue-500 text-white px-4 rounded"
          >
            Add
          </button>
        </div>
        <div className="flex gap-2 mt-2 flex-wrap">
          {formData.skills.map((skill, i) => (
            <span key={i} className="bg-gray-200 px-2 py-1 rounded-lg">
              {skill}
            </span>
          ))}
        </div>
      </div>

      {/* Projects */}
      <div>
        <h3 className="font-semibold">Projects</h3>
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
          <input
            type="text"
            placeholder="Project Description"
            value={projectInput.description}
            onChange={(e) =>
              setProjectInput({ ...projectInput, description: e.target.value })
            }
            className="border p-2 w-full rounded"
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
          <button
            type="button"
            onClick={handleAddProject}
            className="bg-purple-500 text-white px-4 py-2 rounded"
          >
            Add Project
          </button>
        </div>

        {/* Render added projects */}
        {formData.projects.length > 0 && (
          <div className="mt-2 space-y-2">
            {formData.projects.map((proj, i) => (
              <div key={i} className="border p-2 rounded bg-gray-50">
                <p className="font-semibold">{proj.title}</p>
                {proj.description && <p>{proj.description}</p>}
                {proj.link && <p className="text-blue-500">{proj.link}</p>}
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Work Experience */}
      <div>
        <h3 className="font-semibold">Work Experience</h3>
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
          <input
            type="text"
            placeholder="Description"
            value={workInput.description}
            onChange={(e) =>
              setWorkInput({ ...workInput, description: e.target.value })
            }
            className="border p-2 w-full rounded"
          />
          <button
            type="button"
            onClick={handleAddWork}
            className="bg-yellow-500 text-white px-4 py-2 rounded"
          >
            Add Work
          </button>
        </div>

        {/* Render added work items */}
        {formData.work.length > 0 && (
          <div className="mt-2 space-y-2">
            {formData.work.map((w, i) => (
              <div key={i} className="border p-2 rounded bg-gray-50">
                <p className="font-semibold">
                  {w.role} @ {w.company}
                </p>
                {w.duration && <p className="italic">{w.duration}</p>}
                {w.description && <p>{w.description}</p>}
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

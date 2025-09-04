import { useState, useEffect } from "react";
import { Profile } from "../types/profile";
import ProjectCard from "./ProjectCard";
import ProfileView from "./ProfileView";
import toast from "react-hot-toast";

import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
} from "recharts";

type SearchResults = {
  projects: { title: string; description: string; link: string }[];
  profiles: Profile[];
};

export default function QueryPanel() {
  const [skill, setSkill] = useState("");
  const [query, setQuery] = useState("");
  const [projects, setProjects] = useState<SearchResults["projects"]>([]);
  const [profiles, setProfiles] = useState<SearchResults["profiles"]>([]);
  const [loading, setLoading] = useState(false);

  // Fetch top skills for quick buttons + bar chart
  const [topSkills, setTopSkills] = useState<
    { skill: string; count: number }[]
  >([]);

  // Toggle chart visibility
  const [showChart, setShowChart] = useState(false);

  useEffect(() => {
    fetch("http://localhost:3001/query/skills/top")
      .then((res) => res.json())
      .then(setTopSkills)
      .catch((err) => console.error(err));
  }, []);

  const handleSkillSearch = async (skillName?: string) => {
    const s = skillName || skill;
    if (!s) return toast.error("Enter a skill to search");

    setLoading(true);
    try {
      const res = await fetch(
        `http://localhost:3001/query/projects?skill=${s}`
      );
      const data = await res.json();
      setProjects(data);
      setProfiles([]);
    } catch (err) {
      console.error(err);
      toast.error("Failed to fetch projects");
    } finally {
      setLoading(false);
    }
  };

  const handleQuerySearch = async () => {
  if (!query) {
    return toast.error("Enter a query to search");
  }

  setLoading(true);
  try {
    const res = await fetch(`http://localhost:3001/query/search?q=${encodeURIComponent(query)}`);
    const data: Partial<SearchResults> = await res.json();

    // Safely default to empty arrays or objects
    setProjects(data.projects ?? []);
    setProfiles(data.profiles ?? []); // if your backend no longer returns 'profiles', you can skip this or set an empty array
  } catch (err) {
    console.error(err);
    toast.error("Failed to search");
  } finally {
    setLoading(false);
  }
};


  return (
    <div className="p-6 space-y-6 max-w-4xl mx-auto">
      {/* Skill search */}
      <div>
        <h2 className="font-semibold text-xl mb-2">Search by Skill</h2>
        <div className="flex gap-2 mb-2">
          <input
            type="text"
            value={skill}
            onChange={(e) => setSkill(e.target.value)}
            placeholder="Enter skill"
            className="border p-2 rounded flex-1"
          />
          <button
            onClick={() => handleSkillSearch()}
            className="bg-blue-500 px-4 py-2 text-white rounded hover:bg-blue-600 transition-colors"
          >
            Search
          </button>
        </div>

        {/* Quick top skill buttons */}
        <div className="flex flex-wrap gap-2">
          {topSkills.map((s, i) => (
            <button
              key={i}
              onClick={() => handleSkillSearch(s.skill)}
              className="bg-green-100 px-3 py-1 rounded hover:bg-green-200 transition-colors"
            >
              {s.skill} ({s.count})
            </button>
          ))}
        </div>

        {/* ✅ Button to show bar chart */}
        {topSkills.length > 0 && (
          <div className="mt-4">
            <button
              onClick={() => setShowChart(!showChart)}
              className="bg-purple-500 px-4 py-2 text-white rounded hover:bg-purple-600 transition-colors"
            >
              {showChart ? "Hide Top Skills Chart" : "Show Top Skills Chart"}
            </button>
          </div>
        )}

        {/* ✅ Bar chart of top skills */}
        {showChart && (
          <div className="mt-4 p-4 bg-white rounded-lg shadow">
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={topSkills}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="skill" />
                <YAxis />
                <Tooltip />
                <Bar
                  dataKey="count"
                  fill="#8884d8"
                  radius={[8, 8, 0, 0]}
                  onClick={(data) => {
                    const payload = data.payload as {
                      skill: string;
                      count: number;
                    };
                    if (payload?.skill) {
                      handleSkillSearch(payload.skill);
                    }
                  }}
                />
              </BarChart>
            </ResponsiveContainer>
            <p className="text-center text-sm text-gray-500 mt-2">
              💡 Click a bar to search projects with that skill
            </p>
          </div>
        )}
      </div>

      {/* Text query search */}
      <div>
        <h2 className="font-semibold text-xl mb-2">
          Search Profiles / Projects
        </h2>
        <div className="flex gap-2">
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Enter keyword..."
            className="border p-2 rounded flex-1"
          />
          <button
            onClick={handleQuerySearch}
            className="bg-purple-500 px-4 py-2 text-white rounded hover:bg-purple-600 transition-colors"
          >
            Search
          </button>
        </div>
      </div>

      {/* Loading */}
      {loading && <p className="text-center py-4">Loading...</p>}

      {/* Projects Results */}
      {projects.length > 0 && (
        <div>
          <h3 className="font-semibold text-lg mb-2">Projects</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {projects.map((proj, i) => (
              <ProjectCard key={i} {...proj} />
            ))}
          </div>
        </div>
      )}

      {/* Profile Results */}
      {profiles.length > 0 && (
        <div className="mt-6 space-y-4">
          <h3 className="font-semibold text-lg mb-2">Profiles</h3>
          {profiles.map((p) => (
            <ProfileView key={p.id} profile={p} />
          ))}
        </div>
      )}

      {/* No results */}
      {!loading && projects.length === 0 && profiles.length === 0 && (
        <p className="text-center text-gray-400 py-4">No results found.</p>
      )}
    </div>
  );
}

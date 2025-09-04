import { useState, useEffect, useRef } from "react"; // <-- added useRef
import { Profile } from "../types/profile";
import ProjectCard from "./ProjectCard";
import ProfileView from "./ProfileView";
import toast from "react-hot-toast";
import { AnimatePresence, motion } from "framer-motion";

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

  const [showChart, setShowChart] = useState(false);

  // **Ref to scroll to projects**
  const projectsRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    fetch("https://me-api-playground-2gua.onrender.com/query/skills/top")
      .then((res) => res.json())
      .then(setTopSkills)
      .catch((err) => console.error(err));
  }, []);

  // Scroll helper
  const scrollToProjects = () => {
    setTimeout(() => {
      projectsRef.current?.scrollIntoView({ behavior: "smooth" });
    }, 100); // slight delay to ensure DOM updates
  };

  const handleSkillSearch = async (skillName?: string) => {
    const s = skillName || skill;
    if (!s) return toast.error("Enter a skill to search");

    setLoading(true);
    try {
      const res = await fetch(
        `https://me-api-playground-2gua.onrender.com/query/projects?skill=${s}`
      );
      const data = await res.json();
      setProjects(data);
      setProfiles([]);
      scrollToProjects(); // scroll after results are set
    } catch (err) {
      console.error(err);
      toast.error("Failed to fetch projects");
    } finally {
      setLoading(false);
    }
  };

  const handleQuerySearch = async () => {
    if (!query) return toast.error("Enter a query to search");

    setLoading(true);
    try {
      const res = await fetch(
        `https://me-api-playground-2gua.onrender.com/query/search?q=${encodeURIComponent(query)}`
      );
      const data: Partial<SearchResults> = await res.json();

      setProjects(data.projects ?? []);
      setProfiles(data.profiles ?? []);
      scrollToProjects(); // scroll after results are set
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
              {s.skill}
            </button>
          ))}
        </div>

        {/* Button to show bar chart */}
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

        {/* Bar chart of top skills */}
        <AnimatePresence>
          {showChart && (
            <motion.div
              className="mt-4 p-4 bg-white rounded-lg shadow"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 20 }}
              transition={{ duration: 0.5 }}
            >
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={topSkills}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="skill" />
                  <YAxis />
                  <Tooltip
                    formatter={(value) =>
                      `${value} ${value === 1 ? "project" : "projects"}`
                    }
                  />
                  <Bar
                    dataKey="count"
                    fill="#8884d8"
                    radius={[8, 8, 0, 0]}
                    onClick={(data) => {
                      const payload = data.payload as {
                        skill: string;
                        count: number;
                      };
                      if (payload?.skill) handleSkillSearch(payload.skill);
                    }}
                  />
                </BarChart>
              </ResponsiveContainer>
              <p className="text-center text-sm text-gray-500 mt-2">
                💡 Click a bar to search projects with that skill
              </p>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Query search */}
      <div>
        <h2 className="font-semibold text-xl mb-2">Search Based On Keywords</h2>
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

      {loading && <p className="text-center py-4">Loading...</p>}

      {projects.length > 0 && (
        <div ref={projectsRef}>
          <h3 className="font-semibold text-lg mb-2">Projects</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {projects.map((proj, i) => (
              <ProjectCard key={i} {...proj} />
            ))}
          </div>
        </div>
      )}

      {profiles.length > 0 && (
        <div className="mt-6 space-y-6" ref={projectsRef}>
          <h3 className="font-semibold text-lg mb-2">Search Results</h3>
          {profiles.map((p) => (
            <div
              key={p.id}
              className="border p-4 rounded-lg bg-gray-50 shadow-sm"
            >
              <ProfileView profile={p} />

              {/* Projects within profile */}

              {/* Work experience within profile */}
            </div>
          ))}
        </div>
      )}

      {/* No results */}
      {!loading && profiles.length === 0 && projects.length === 0 && (
        <p className="text-center text-gray-400 py-4">No results found.</p>
      )}
    </div>
  );
}

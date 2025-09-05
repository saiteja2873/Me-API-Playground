import { Profile } from "../types/profile";

interface Props {
  profile: Profile;
}

export default function ProfileView({ profile }: Props) {
  const hasLinks =
    profile.links &&
    (profile.links.github || profile.links.linkedin || profile.links.portfolio);

  return (
    <div className="bg-white shadow-lg pt-4 pl-4 pb-4 sm:p-6 rounded-xl space-y-6">
      <div>
        <h2 className="text-2xl font-bold">{profile.name}</h2>
        <p>{profile.email}</p>
        {profile.education && <p className="italic">{profile.education}</p>}
      </div>

      {profile.skills && profile.skills.length > 0 && (
        <div>
          <h3 className="font-semibold">Skills</h3>
          <div className="flex gap-2 flex-wrap mt-1">
            {profile.skills.map((skill, i) => (
              <span key={i} className="bg-blue-100 px-2 py-1 rounded-lg">
                {skill}
              </span>
            ))}
          </div>
        </div>
      )}

      {profile.projects && profile.projects.length > 0 && (
        <div>
          <h3 className="font-semibold">Projects</h3>
          <div className="mt-1 space-y-2">
            {profile.projects.map((proj, i) => (
              <div key={i} className="border p-3 rounded bg-gray-50">
                <p className="font-semibold">{proj.title}</p>
                {proj.description && <p>{proj.description}</p>}
                {proj.link && (
                  <a
                    href={proj.link}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-500 break-all"
                  >
                    {proj.link}
                  </a>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {profile.work && profile.work.length > 0 && (
        <div>
          <h3 className="font-semibold">Work Experience</h3>
          <div className="mt-1 space-y-2">
            {profile.work.map((w, i) => (
              <div key={i} className="border p-3 rounded bg-gray-50">
                <p className="font-semibold">
                  {w.role} @ {w.company}
                </p>
                {w.duration && <p className="italic">{w.duration}</p>}
                {w.description && <p>{w.description}</p>}
              </div>
            ))}
          </div>
        </div>
      )}

      {hasLinks && (
        <div>
          <h3 className="font-semibold">Links</h3>
          <div className="mt-1 flex flex-col gap-1">
            {profile.links.github && (
              <a
                href={profile.links.github}
                target="_blank"
                rel="noopener noreferrer"
                className="flex flex-wrap items-center gap-1"
              >
                <span className="text-gray-700 font-semibold">GitHub:</span>
                <span className="text-blue-500 break-all">
                  {profile.links.github}
                </span>
              </a>
            )}

            {profile.links.linkedin && (
              <a
                href={profile.links.linkedin}
                target="_blank"
                rel="noopener noreferrer"
                className="flex flex-wrap items-center gap-1"
              >
                <span className="text-gray-700 font-semibold">LinkedIn:</span>
                <span className="text-blue-500 break-all">
                  {profile.links.linkedin}
                </span>
              </a>
            )}

            {profile.links.portfolio && (
              <a
                href={profile.links.portfolio}
                target="_blank"
                rel="noopener noreferrer"
                className="flex flex-wrap items-center gap-1"
              >
                <span className="text-gray-700 font-semibold">Portfolio:</span>
                <span className="text-blue-500 break-all">
                  {profile.links.portfolio}
                </span>
              </a>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

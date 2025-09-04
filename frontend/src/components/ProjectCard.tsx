interface ProjectCardProps {
  title: string;
  description?: string | null;
  link?: string | null;
}

export default function ProjectCard({ title, description, link }: ProjectCardProps) {
  return (
    <div className="border p-4 rounded-lg bg-gray-50 shadow-sm hover:shadow-md transition-shadow">
      <p className="font-semibold text-lg">{title}</p>
      {description && <p className="mt-1">{description}</p>}
      {link && (
        <a
          href={link}
          target="_blank"
          rel="noopener noreferrer"
          className="text-blue-500 mt-1 inline-block break-words max-w-56"
        >
          {link}
        </a>
      )}
    </div>
  );
}

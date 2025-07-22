import { FC } from "react";
import { useNavigate } from "react-router-dom";

const templates = [
  {
    key: "aige",
    title: "AIGE Template",
    description:
      "A seamless, scene-by-scene video journey that guides your audience through a single, compelling narrative.",
    icon: "🎥",
    route: "/create/aige",
  },
  {
    key: "choice-point",
    title: "Choice Point Template",
    description:
      "An interactive video experience where your audience shapes the story by making a pivotal choice.",
    icon: "🧠",
    route: "/create/choice-point",
  },
];

interface TemplateCardProps {
  icon: string;
  title: string;
  description: string;
  onClick: () => void;
}

interface CreateAdEntryProps {
  onSelect?: (templateKey: string) => void;
}

const TemplateCard: FC<TemplateCardProps> = ({ icon, title, description, onClick }) => (
  <div
    onClick={onClick}
    className="cursor-pointer bg-gradient-to-br from-[#1e1e24] to-[#18181b] border border-neutral-800 rounded-2xl p-6 shadow-lg hover:shadow-yellow-400/20 hover:scale-[1.02] transition-transform duration-200 flex flex-col gap-2 min-h-[180px]"
    tabIndex={0}
    role="button"
    aria-label={`Choose ${title}`}
  >
    <h2 className="text-2xl font-semibold mb-2 flex items-center gap-2">
      <span className="text-3xl">{icon}</span> {title}
    </h2>
    <p className="text-base text-gray-400">{description}</p>
  </div>
);

const CreateAdEntry: FC<CreateAdEntryProps> = ({ onSelect }) => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-[#111] px-4 md:px-12 py-10 text-white font-sans">
      <h1 className="text-3xl font-bold mb-8">Choose Your Ad Template</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {templates.map((tpl) => (
          <TemplateCard
            key={tpl.key}
            icon={tpl.icon}
            title={tpl.title}
            description={tpl.description}
            onClick={() => {
              if (onSelect) {
                onSelect(tpl.key);
              } else {
                // Navigate to the correct route for each template
                if (tpl.key === 'choice-point') {
                  navigate('/create/choice-point');
                } else {
                  navigate(tpl.route);
                }
              }
            }}
          />
        ))}
      </div>
    </div>
  );
};

export default CreateAdEntry; 
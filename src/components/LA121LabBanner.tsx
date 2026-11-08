import { ArrowRight } from "lucide-react";

const LAB_URL = "https://lab.la121consultants.co.uk";

const tags = [
  { label: "Administration", className: "bg-emerald-700" },
  { label: "Digital Marketing", className: "bg-blue-600" },
  { label: "AI", className: "bg-purple-600" },
];

const LA121LabBanner = () => {
  return (
    <div className="w-full bg-[#0b1220] text-white">
      <div className="max-w-5xl mx-auto px-4 py-10 sm:py-14">
        <div className="flex items-center justify-between mb-8">
          <p className="text-xl sm:text-2xl font-extrabold text-yellow-400">LA121 Lab</p>
          <span className="bg-yellow-400 text-[#0b1220] text-xs font-extrabold tracking-wide px-4 py-2 rounded-full whitespace-nowrap">
            NOW OPEN
          </span>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 items-center">
          <div>
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-extrabold leading-tight mb-5">
              Virtual work experience in <span className="text-yellow-400">Administration, Digital Marketing or AI</span>
            </h2>
            <p className="text-base sm:text-lg text-white/80 mb-6">
              Work in a real virtual environment, and get a professional reference and certificate on completing the work experience.
            </p>
            <div className="flex flex-wrap gap-3">
              {tags.map((tag) => (
                <span
                  key={tag.label}
                  className={`${tag.className} text-white font-bold text-sm sm:text-base px-4 py-2 rounded-lg`}
                >
                  {tag.label}
                </span>
              ))}
            </div>
          </div>

          <a
            href={LAB_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="block bg-yellow-400 hover:bg-yellow-300 transition-colors text-[#0b1220] rounded-2xl px-6 py-6 sm:px-8 sm:py-7 shadow-xl"
          >
            <div className="flex items-start justify-between gap-4">
              <div>
                <p className="text-xl sm:text-2xl font-extrabold mb-1">Try it out today for free</p>
                <p className="text-sm sm:text-lg font-bold break-words">lab.la121consultants.co.uk</p>
              </div>
              <ArrowRight className="w-7 h-7 flex-shrink-0 mt-1" />
            </div>
            <p className="text-sm font-semibold mt-3 opacity-80">
              First module free, then £5.99/month · Certificate &amp; reference on completion
            </p>
          </a>
        </div>
      </div>
    </div>
  );
};

export default LA121LabBanner;

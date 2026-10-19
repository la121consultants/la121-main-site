import { ArrowRight } from "lucide-react";

const REGISTER_INTEREST_URL = "https://forms.gle/Q5gWd2p5STRHUjyMA";

const tags = [
  { label: "Digital Marketing", className: "bg-blue-600" },
  { label: "Administration", className: "bg-emerald-700" },
  { label: "AI", className: "bg-purple-600" },
];

const LA121LabBanner = () => {
  return (
    <div className="w-full bg-[#0b1220] text-white">
      <div className="max-w-5xl mx-auto px-4 py-10 sm:py-14">
        <div className="flex items-center justify-between mb-8">
          <p className="text-xl sm:text-2xl font-extrabold text-yellow-400">LA121 Lab</p>
          <span className="bg-yellow-400 text-[#0b1220] text-xs font-extrabold tracking-wide px-4 py-2 rounded-full whitespace-nowrap">
            COMING SOON
          </span>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 items-center">
          <div>
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-extrabold leading-tight mb-5">
              Virtual work experience <span className="text-yellow-400">that feels like a real job</span>
            </h2>
            <p className="text-base sm:text-lg text-white/80 mb-6">
              Build CV-ready experience from home. Finish with a certificate and a professional reference.
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
            href={REGISTER_INTEREST_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="block bg-yellow-400 hover:bg-yellow-300 transition-colors text-[#0b1220] rounded-2xl px-6 py-6 sm:px-8 sm:py-7 shadow-xl"
          >
            <div className="flex items-start justify-between gap-4">
              <div>
                <p className="text-xl sm:text-2xl font-extrabold mb-1">Register your interest</p>
                <p className="text-sm sm:text-lg font-bold break-words">forms.gle/Q5gWd2p5STRHUjyMA</p>
              </div>
              <ArrowRight className="w-7 h-7 flex-shrink-0 mt-1" />
            </div>
            <p className="text-sm font-semibold mt-3 opacity-80">
              Launching soon · Places are limited
            </p>
          </a>
        </div>
      </div>
    </div>
  );
};

export default LA121LabBanner;

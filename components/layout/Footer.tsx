import { Zap, ExternalLink } from "lucide-react";

const BASE = process.env.NEXT_PUBLIC_BASE_PATH ?? "/skillforge";

const footerLinks = {
  Platform: [
    { label: "Roadmaps", href: `${BASE}/roadmaps/` },
    { label: "Certifications", href: `${BASE}/certifications/` },
    { label: "Courses", href: `${BASE}/courses/` },
    { label: "About", href: `${BASE}/about/` },
  ],
  Fields: [
    { label: "Cyber Security", href: `${BASE}/roadmaps/cyber-security/` },
    { label: "Artificial Intelligence", href: `${BASE}/roadmaps/artificial-intelligence/` },
    { label: "Data Science", href: `${BASE}/roadmaps/data-science/` },
    { label: "Cloud Computing", href: `${BASE}/roadmaps/cloud-computing/` },
    { label: "DevOps", href: `${BASE}/roadmaps/devops/` },
    { label: "Frontend", href: `${BASE}/roadmaps/frontend/` },
  ],
  Resources: [
    { label: "GitHub Repository", href: "https://github.com/MshariSQ/skillforge", external: true },
    { label: "Open Source (MIT)", href: "https://github.com/MshariSQ/skillforge/blob/main/LICENSE", external: true },
    { label: "Contribute", href: "https://github.com/MshariSQ/skillforge/blob/main/CONTRIBUTING.md", external: true },
    { label: "Report a Bug", href: "https://github.com/MshariSQ/skillforge/issues", external: true },
  ],
  Legal: [
    { label: "Privacy Policy", href: `${BASE}/privacy/` },
    { label: "Terms of Service", href: `${BASE}/terms/` },
    { label: "Cookie Policy", href: `${BASE}/privacy/#cookies` },
  ],
};

export default function Footer() {
  return (
    <footer className="border-t border-[#21262d] bg-[#0D1117] mt-32">
      <div className="max-w-7xl mx-auto px-6 py-16">
        <div className="grid grid-cols-2 md:grid-cols-5 gap-8 mb-12">
          {/* Brand */}
          <div className="col-span-2 md:col-span-1">
            <a href={`${BASE}/`} className="flex items-center gap-2 mb-4">
              <div className="w-8 h-8 rounded-lg bg-emerald-500/20 border border-emerald-500/30 flex items-center justify-center">
                <Zap size={16} className="text-emerald-400" />
              </div>
              <span className="text-lg font-bold">
                Skill<span className="text-emerald-400">Forge</span>
              </span>
            </a>
            <p className="text-gray-500 text-sm leading-relaxed mb-4">
              Free and open-source platform for learning roadmaps, certifications, and career guidance.
            </p>
            <a
              href="https://github.com/MshariSQ/skillforge"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-3 py-1.5 text-sm text-gray-400 hover:text-white border border-[#21262d] hover:border-gray-600 rounded-lg transition-all"
            >
              <ExternalLink size={14} /> View on GitHub
            </a>
          </div>

          {/* Link columns */}
          {Object.entries(footerLinks).map(([section, links]) => (
            <div key={section}>
              <h4 className="text-sm font-semibold text-white mb-3">{section}</h4>
              <ul className="space-y-2">
                {links.map((link) => (
                  <li key={link.label}>
                    {"external" in link && link.external ? (
                      <a
                        href={link.href}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-sm text-gray-500 hover:text-gray-300 transition-colors"
                      >
                        {link.label}
                      </a>
                    ) : (
                      <a href={link.href} className="text-sm text-gray-500 hover:text-gray-300 transition-colors">
                        {link.label}
                      </a>
                    )}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="pt-6 border-t border-[#21262d] flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-sm text-gray-600">
            © {new Date().getFullYear()} SkillForge. Open source under{" "}
            <a
              href="https://github.com/MshariSQ/skillforge/blob/main/LICENSE"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-gray-400 underline underline-offset-2"
            >
              MIT License
            </a>.
          </p>
          <p className="text-sm text-gray-600">Built with ❤️ for learners worldwide</p>
        </div>
      </div>
    </footer>
  );
}

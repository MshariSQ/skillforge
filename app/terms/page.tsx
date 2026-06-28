import { FileText } from "lucide-react";

export const metadata = {
  title: "Terms of Service — SkillForge",
};

export default function TermsPage() {
  const sections = [
    {
      title: "1. Acceptance of Terms",
      body: `By accessing and using SkillForge ("the Platform"), you accept and agree to be bound by these Terms of Service. If you do not agree to these terms, please do not use the Platform.`,
    },
    {
      title: "2. Description of Service",
      body: `SkillForge is a free, open-source educational platform providing learning roadmaps, certification guidance, curated course recommendations, and career path resources. The Platform is provided "as is" at no charge.`,
    },
    {
      title: "3. User Accounts",
      body: `You may sign in using your GitHub account via OAuth. By doing so, you authorize SkillForge to read your public GitHub profile information (username, name, avatar, public email). We do not store your GitHub password. You are responsible for maintaining the security of your GitHub account.`,
    },
    {
      title: "4. User Conduct",
      body: `You agree not to misuse the Platform. Prohibited activities include attempting to access or disrupt the Platform's infrastructure, scraping data at scale without permission, impersonating other users, and using the Platform for any unlawful purpose.`,
    },
    {
      title: "5. Intellectual Property",
      body: `The SkillForge codebase is released under the MIT License. Roadmap content, course curation, and data files are licensed under Creative Commons Attribution 4.0 (CC BY 4.0). Third-party content (certification names, course titles, provider logos) remains the property of their respective owners.`,
    },
    {
      title: "6. Third-Party Links",
      body: `The Platform contains links to third-party websites including certification providers, online course platforms, and educational resources. These links are provided for your convenience. SkillForge is not responsible for the content, accuracy, or practices of any linked third-party site.`,
    },
    {
      title: "7. Disclaimer of Warranties",
      body: `The Platform is provided "as is" without warranty of any kind, express or implied. SkillForge does not warrant that the service will be uninterrupted, error-free, or that course/certification information is always current. Always verify pricing and availability directly with the certification provider.`,
    },
    {
      title: "8. Limitation of Liability",
      body: `To the maximum extent permitted by law, SkillForge and its contributors shall not be liable for any indirect, incidental, special, or consequential damages arising from your use of the Platform.`,
    },
    {
      title: "9. Changes to Terms",
      body: `We reserve the right to update these Terms of Service at any time. Changes will be reflected by updating the "Last Updated" date below. Continued use of the Platform after changes constitutes acceptance of the new terms.`,
    },
    {
      title: "10. Open Source",
      body: `SkillForge is open source. You can view, fork, and contribute to the code at github.com/MshariSQ/skillforge under the MIT License. Community contributions are welcome and encouraged.`,
    },
  ];

  return (
    <main className="max-w-3xl mx-auto px-6 pt-28 pb-24">
      <div className="mb-12">
        <div className="flex items-center gap-2 text-emerald-400 text-sm font-medium mb-3">
          <FileText size={16} /><span>Legal</span>
        </div>
        <h1 className="text-4xl font-black mb-3">Terms of Service</h1>
        <p className="text-gray-500 text-sm">Last updated: June 2025</p>
      </div>

      <div className="space-y-8">
        {sections.map((s) => (
          <div key={s.title} className="bg-[#161B22] border border-[#21262d] rounded-2xl p-6">
            <h2 className="font-bold text-white mb-3">{s.title}</h2>
            <p className="text-gray-400 text-sm leading-relaxed">{s.body}</p>
          </div>
        ))}
      </div>

      <div className="mt-12 bg-[#161B22] border border-[#21262d] rounded-2xl p-6 text-center">
        <p className="text-gray-500 text-sm">
          Questions about these terms?{" "}
          <a href="https://github.com/MshariSQ/skillforge/issues" target="_blank" rel="noopener noreferrer"
            className="text-emerald-400 hover:underline">Open an issue on GitHub</a>.
        </p>
      </div>
    </main>
  );
}

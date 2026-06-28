import { Shield } from "lucide-react";

export const metadata = {
  title: "Privacy Policy — SkillForge",
};

export default function PrivacyPage() {
  const sections = [
    {
      title: "What Data We Collect",
      body: `When you sign in with GitHub, we collect and store: your GitHub user ID, username, display name, avatar URL, public email address (if available), and bio. We also store your learning progress (which roadmap nodes you've marked complete) and bookmarks (certifications and courses you've saved). We do not collect passwords, payment information, or any private GitHub data.`,
    },
    {
      title: "How We Use Your Data",
      body: `Your data is used solely to provide the SkillForge service: displaying your profile, saving your learning progress across sessions, and showing bookmarked resources. We do not sell, share, or monetize your data. We do not use your data for advertising or tracking.`,
    },
    {
      title: "Data Storage",
      body: `User data is stored in a Cloudflare D1 database (SQLite at the edge). Your authentication is managed via JWT tokens stored in your browser's localStorage. We do not use cookies for authentication.`,
    },
    {
      title: "GitHub OAuth",
      body: `SkillForge uses GitHub OAuth for authentication. When you click "Sign in with GitHub," you are redirected to GitHub's authorization page. We only request access to your public profile and email (scopes: user:email, read:user). We never request access to your repositories, code, or private information.`,
    },
    {
      id: "cookies",
      title: "Cookies & Local Storage",
      body: `SkillForge does not use tracking cookies. We store your JWT authentication token in localStorage to keep you signed in. This token expires after 30 days. You can clear it at any time by signing out or clearing your browser's local storage.`,
    },
    {
      title: "Third-Party Services",
      body: `The Platform links to third-party sites (Coursera, Udemy, AWS, etc.) but does not share any of your personal data with them. Visiting linked sites is subject to their own privacy policies. SkillForge uses Cloudflare Workers and Cloudflare D1 for infrastructure — see Cloudflare's privacy policy for their data handling practices.`,
    },
    {
      title: "Your Rights",
      body: `You can request deletion of your account and all associated data at any time by opening an issue on our GitHub repository or by contacting us. We will process data deletion requests within 30 days.`,
    },
    {
      title: "Data Security",
      body: `All data transmission is encrypted via HTTPS/TLS. JWT tokens are signed with a secure secret key. We follow security best practices but cannot guarantee absolute security — no internet transmission is 100% secure.`,
    },
    {
      title: "Changes to This Policy",
      body: `We may update this Privacy Policy from time to time. Changes are reflected by the "Last Updated" date. Significant changes will be communicated via the GitHub repository.`,
    },
  ];

  return (
    <main className="max-w-3xl mx-auto px-6 pt-28 pb-24">
      <div className="mb-12">
        <div className="flex items-center gap-2 text-emerald-400 text-sm font-medium mb-3">
          <Shield size={16} /><span>Legal</span>
        </div>
        <h1 className="text-4xl font-black mb-3">Privacy Policy</h1>
        <p className="text-gray-500 text-sm">Last updated: June 2025</p>
      </div>

      <div className="bg-emerald-500/10 border border-emerald-500/20 rounded-2xl p-5 mb-8">
        <p className="text-sm text-emerald-300 leading-relaxed">
          <strong>Short version:</strong> We collect only what's necessary to run SkillForge. We never sell your data, show ads, or share your information with third parties. You can delete your account anytime.
        </p>
      </div>

      <div className="space-y-6">
        {sections.map((s) => (
          <div key={s.title} id={"id" in s ? s.id : undefined} className="bg-[#161B22] border border-[#21262d] rounded-2xl p-6">
            <h2 className="font-bold text-white mb-3">{s.title}</h2>
            <p className="text-gray-400 text-sm leading-relaxed">{s.body}</p>
          </div>
        ))}
      </div>

      <div className="mt-10 bg-[#161B22] border border-[#21262d] rounded-2xl p-6 text-center">
        <p className="text-gray-500 text-sm">
          Privacy questions or data deletion requests?{" "}
          <a href="https://github.com/MshariSQ/skillforge/issues" target="_blank" rel="noopener noreferrer"
            className="text-emerald-400 hover:underline">Open an issue on GitHub</a>.
        </p>
      </div>
    </main>
  );
}

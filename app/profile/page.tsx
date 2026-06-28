"use client";

import { useEffect, useState } from "react";
import { getUserProfile } from "@/lib/api";
import { getCurrentUser } from "@/lib/auth";
import {
  MapPin,
  Link as LinkIcon,
  Calendar,
  Award,
  BookOpen,
  Shield,
  Zap,
} from "lucide-react";

interface Profile {
  id: number;
  username: string;
  name: string | null;
  avatar_url: string;
  bio: string | null;
  created_at: string;
}

export default function ProfilePage() {
  const [username, setUsername] = useState<string | null>(null);
  const [profile, setProfile] = useState<Profile | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const basePath = process.env.NEXT_PUBLIC_BASE_PATH ?? "/skillforge";

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const u = params.get("u");
    if (!u) {
      const me = getCurrentUser();
      if (me) {
        window.location.replace(`${basePath}/profile/?u=${me.username}`);
      } else {
        setError("No user specified.");
        setLoading(false);
      }
      return;
    }
    setUsername(u);
  }, [basePath]);

  useEffect(() => {
    if (!username) return;
    getUserProfile(username)
      .then((data) => {
        setProfile(data as Profile);
        setLoading(false);
      })
      .catch(() => {
        setError("User not found.");
        setLoading(false);
      });
  }, [username]);

  if (loading) {
    return (
      <div className="min-h-screen bg-[#0D1117] flex items-center justify-center">
        <div className="w-10 h-10 rounded-xl bg-emerald-500/20 border border-emerald-500/30 flex items-center justify-center animate-pulse">
          <Zap size={20} className="text-emerald-400" />
        </div>
      </div>
    );
  }

  if (error || !profile) {
    return (
      <div className="min-h-screen bg-[#0D1117] flex items-center justify-center text-center px-4">
        <div>
          <div className="text-5xl mb-4">👤</div>
          <h1 className="text-xl font-bold text-white mb-2">User not found</h1>
          <p className="text-gray-500 mb-6">{error ?? "This profile doesn't exist."}</p>
          <a
            href={`${basePath}/`}
            className="px-5 py-2.5 bg-emerald-500 hover:bg-emerald-400 text-black text-sm font-medium rounded-lg transition-all"
          >
            Back to Home
          </a>
        </div>
      </div>
    );
  }

  const joinedYear = new Date(profile.created_at).getFullYear();

  const stats = [
    { icon: <BookOpen size={16} />, label: "Roadmaps", value: "—" },
    { icon: <Award size={16} />, label: "Certifications", value: "—" },
    { icon: <Shield size={16} />, label: "Badges", value: "—" },
  ];

  return (
    <div className="min-h-screen bg-[#0D1117] pt-20 pb-16">
      <div className="max-w-4xl mx-auto px-4 sm:px-6">
        {/* Header */}
        <div className="bg-[#161B22] border border-[#21262d] rounded-2xl p-6 mb-6">
          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-5">
            <img
              src={profile.avatar_url}
              alt={profile.username}
              className="w-20 h-20 rounded-full border-2 border-[#30363d]"
            />
            <div className="flex-1 min-w-0">
              <h1 className="text-2xl font-bold text-white">
                {profile.name ?? profile.username}
              </h1>
              <p className="text-gray-500 text-sm">@{profile.username}</p>
              {profile.bio && (
                <p className="text-gray-400 text-sm mt-2 leading-relaxed">{profile.bio}</p>
              )}
              <div className="flex flex-wrap items-center gap-4 mt-3">
                <span className="flex items-center gap-1.5 text-xs text-gray-500">
                  <Calendar size={13} /> Joined {joinedYear}
                </span>
                <a
                  href={`https://github.com/${profile.username}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-1.5 text-xs text-gray-500 hover:text-emerald-400 transition-colors"
                >
                  <LinkIcon size={13} /> GitHub
                </a>
              </div>
            </div>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-3 gap-4 mb-6">
          {stats.map((s) => (
            <div
              key={s.label}
              className="bg-[#161B22] border border-[#21262d] rounded-xl p-4 flex flex-col items-center gap-1"
            >
              <div className="text-emerald-400">{s.icon}</div>
              <div className="text-xl font-bold text-white">{s.value}</div>
              <div className="text-xs text-gray-500">{s.label}</div>
            </div>
          ))}
        </div>

        {/* Activity placeholder */}
        <div className="bg-[#161B22] border border-[#21262d] rounded-2xl p-6">
          <h2 className="font-semibold text-white mb-4">Activity</h2>
          <div className="flex flex-col items-center justify-center py-10 text-center">
            <MapPin size={32} className="text-gray-700 mb-3" />
            <p className="text-gray-500 text-sm">Activity tracking coming soon</p>
          </div>
        </div>
      </div>
    </div>
  );
}

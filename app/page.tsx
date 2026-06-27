import { Search } from "lucide-react";

const categories = [
  "Cyber Security",
  "Artificial Intelligence",
  "Cloud Computing",
  "Software Engineering",
  "Data Science",
  "DevOps",
  "Networking",
  "Marketing",
];

export default function Home() {
  return (
    <main className="min-h-screen bg-[#0D1117] text-white">
      {/* Hero */}
      <section className="max-w-7xl mx-auto px-6 py-24 text-center">

        <h1 className="text-6xl font-black">
          Skill<span className="text-emerald-400">Forge</span>
        </h1>

        <p className="text-gray-400 text-xl mt-6">
          Learn Smarter. Get Certified. Build Your Career.
        </p>

        <div className="mt-10 flex justify-center">
          <div className="flex items-center bg-[#161B22] border border-gray-700 rounded-xl px-5 py-4 w-full max-w-xl">

            <Search size={20} className="text-gray-500" />

            <input
              className="bg-transparent ml-3 outline-none w-full"
              placeholder="Search roadmaps..."
            />

          </div>
        </div>

      </section>

      {/* Categories */}

      <section className="max-w-7xl mx-auto px-6 pb-20">

        <h2 className="text-3xl font-bold mb-8">
          Explore Roadmaps
        </h2>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">

          {categories.map((category) => (
            <div
              key={category}
              className="rounded-2xl bg-[#161B22] border border-gray-800 p-8 hover:border-emerald-400 transition hover:-translate-y-2 cursor-pointer"
            >
              <h3 className="text-xl font-semibold">
                {category}
              </h3>

              <p className="text-gray-400 mt-3">
                Interactive roadmap
              </p>

            </div>
          ))}

        </div>

      </section>

    </main>
  );
}
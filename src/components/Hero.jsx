// components/Hero.jsx
'use client';

export default function Hero() {
  return (
    <section className="hero-bg text-white rounded-b-3xl overflow-hidden relative">
      <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-center gap-8 px-6 md:px-8 py-20">
        <div className="md:w-1/2">
          <h1 className="text-4xl md:text-6xl font-extrabold leading-tight">
            Best HR App <br /> Experience for You
          </h1>
          <p className="mt-6 text-lg text-white/90">
            Matchmaking made easy — onboard, manage, and send notifications to your team.
          </p>
          <button className="mt-8 px-6 py-3 bg-white text-black rounded-md font-medium hover:bg-gray-100 transition">
            Learn More
          </button>
        </div>
        <div className="md:w-1/2 flex justify-center md:justify-end mt-8 md:mt-0">
          <div className="w-64 h-64 md:w-80 md:h-80 bg-white/90 rounded-2xl flex items-center justify-center">
            <img src="/hr-hero-person.png" alt="Person" className="w-52 md:w-64" />
          </div>
        </div>
      </div>
    </section>
  );
}

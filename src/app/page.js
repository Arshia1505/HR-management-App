// import Hero from '@/components/Hero';
// import Header from '@/components/Header';

// export default function Home() {
//   return (
//     <main className="max-w-6xl mx-auto px-8 py-12">
//       <Hero />
//       <section className="grid md:grid-cols-2 gap-8 items-center mt-12">
//         <div>
//           <h3 className="text-sm text-purple-600 uppercase">key functionalities</h3>
//           <h2 className="text-3xl font-bold mt-2">matchmaking made easy</h2>
//           <p className="mt-4 text-gray-600">
//             Get a much larger number of professional employees who have been successful in similar job positions.
//           </p>
//         </div>
//         <div className="bg-white rounded-md p-6 shadow-sm">
//           <img src="https://img.freepik.com/free-vector/half-wave-background_78370-161.jpg" alt="feature" />
//         </div>
//       </section>
//     </main>
//   );
// }

//perfecto till noww
import Hero from '@/components/Hero';
import Header from '@/components/Header';

import Image from "next/image";

import { Winky_Sans } from "next/font/google";

const winky = Winky_Sans({
  subsets: ["latin"],
  weight: ["400", "700"], // choose your weights
});

export default function Page() {
  return (
    <main className="relative min-h-screen flex items-center justify-center bg-white overflow-hidden">
     
      <div className="absolute top-0 left-0 z-0">
        <Image src="/hrBg.svg" alt="Wavy background" width={0} height={0} priority className="w-auto h-auto"/>
      </div>

         <div className="absolute bottom-0 right-0 z-0">
        <Image src="/waveD.svg" alt="Bottom Right Wave" width={0} height={0} priority className="w-auto h-auto" />
      </div>

     
      <div className="relative z-10 text-center">
           <h1 className={`${winky.className} text-xl sm:text-6xl font-bold text-purple-700`}>
                 Welcome to HR Management App
           </h1>
        <p className={`${winky.className} mt-6 text-xl font-semibold italic text-purple-500`}>
          Make Hiring Easier!
        </p>
        <button className="mt-10 px-6 py-4">
        <a href="/dashboard" className="mt-20 px-6 py-4 bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600 text-white font-semibold rounded-xl shadow">
           Get Started
       </a>
       </button>

      </div>
    </main>
  );
}





//only diagonal portion top left corner of wave:-

// export default function Page() {
//   return (
//     <main className="relative min-h-screen bg-white overflow-hidden">
//       {/* Decorative corner wave (top-left, diagonal) */}
//       <div
//         aria-hidden="true"
//         className={`pointer-events-none absolute top-0 left-0
//           w-[60vw] h-[60vw]         /* responsive: uses viewport width for fluid scaling */
//           sm:w-[520px] sm:h-[520px] /* fixed size on small+ screens */
//           -translate-x-1/3 -translate-y-1/4
//           -rotate-20 opacity-95
//           bg-no-repeat bg-cover
//           z-0
//         `}
//         style={{
//           // file must be in /public/wave.svg
//           backgroundImage: "url('/wave.svg')",
//           // If you want to tint or blend the wave, you can add backgroundBlendMode or a CSS filter here
//         }}
//       />

//       {/* Content above the wave */}
//       <div className="relative z-10 max-w-5xl mx-auto px-6 py-20">
//         <header className="max-w-2xl">
//           <h1 className="text-4xl sm:text-5xl font-extrabold leading-tight text-gray-900">
//             Welcome — your page with a diagonal corner wave
//           </h1>
//           <p className="mt-4 text-lg text-gray-600">
//             This layout shows a decorative SVG wave anchored to the top-left corner.
//             The wave is purposely oversized and translated so only a diagonal slice appears.
//           </p>
//         </header>

//         <section className="mt-12 grid gap-6 sm:grid-cols-2">
//           <article className="rounded-2xl p-6 bg-gray-50/80 backdrop-blur-sm shadow">
//             <h3 className="font-semibold text-lg">Feature One</h3>
//             <p className="mt-2 text-sm text-gray-600">Explain a feature or CTA here.</p>
//           </article>

//           <article className="rounded-2xl p-6 bg-gray-50/80 backdrop-blur-sm shadow">
//             <h3 className="font-semibold text-lg">Feature Two</h3>
//             <p className="mt-2 text-sm text-gray-600">Another callout or short description.</p>
//           </article>
//         </section>
//       </div>
//     </main>
//   );
// }


// export default function Home() {
//   return (
//     <main className="max-w-6xl mx-auto px-8 py-12">
//       <Header />
//       <Hero />
//       <section className="grid md:grid-cols-2 gap-8 items-center mt-12">
//         <div>
//           <h3 className="text-sm text-purple-600 uppercase">key functionalities</h3>
//           <h2 className="text-3xl font-bold mt-2">matchmaking made easy</h2>
//           <p className="mt-4 text-gray-600">
//             Get a much larger number of professional employees who have been successful in similar job positions.
//           </p>
//         </div>
//         <div className="bg-white rounded-md p-6 shadow-sm">
//           <img
//             src="https://img.freepik.com/free-vector/half-wave-background_78370-161.jpg"
//             alt="feature"
//           />
//         </div>
//       </section>
//     </main>
//   );
// }

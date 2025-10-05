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
import Hero from '@/components/Hero';
import Header from '@/components/Header';

export default function Home() {
  return (
    <main className="max-w-6xl mx-auto px-8 py-12">
      <Header />
      <Hero />
      <section className="grid md:grid-cols-2 gap-8 items-center mt-12">
        <div>
          <h3 className="text-sm text-purple-600 uppercase">key functionalities</h3>
          <h2 className="text-3xl font-bold mt-2">matchmaking made easy</h2>
          <p className="mt-4 text-gray-600">
            Get a much larger number of professional employees who have been successful in similar job positions.
          </p>
        </div>
        <div className="bg-white rounded-md p-6 shadow-sm">
          <img
            src="https://img.freepik.com/free-vector/half-wave-background_78370-161.jpg"
            alt="feature"
          />
        </div>
      </section>
    </main>
  );
}

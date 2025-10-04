import Image from 'next/image';

export default function Page(){
  return(
    <div className="flex flex-col min-h-screen">
          <main className="flex min-h-screen flex-col items-center p-0 bg-gray-50">
            <div className="flex flex-col justify-center gap-6 rounded-lg px-6 pb-10 md:w-2/5 md:px-20">
              {/* Image Placeholder */}
              <div className="w-full h-auto bg-gray-200 rounded-lg flex items-center justify-center">
                <Image 
                  src="/engagement.jpg"
                  width={3442}
                  height={5163}
                  className=""
                  alt="Taylor and Dylan posed ala American Gothic"
                />
              </div>

              {/* Call to Action with Registry */}
              <section className="text-center">
                <h2 className="text-2xl font-semibold text-gray-700 mb-4 font-serif">
                  Celebrate With Us
                </h2>
                <p className="text-gray-600 mb-4">
                  Your presence is our greatest gift, but if you wish to contribute, please visit our registry.
                </p>
                <a
                  href="#"
                  className="inline-block bg-pink-300 text-white px-6 py-3 rounded-lg hover:bg-pink-400 transition"
                >
                  View Our Registry
                </a>
              </section>

              {/* Gallery Link */}
              <div className="text-center">
                <a
                  href="#"
                  className="inline-block bg-gray-700 text-white px-6 py-3 rounded-lg hover:bg-gray-800 transition"
                >
                  Photo Gallery
                </a>
              </div>

              {/* RSVP Link */}
              <div className="text-center">
                <a
                  href="#"
                  className="inline-block bg-pink-300 text-white px-6 py-3 rounded-lg hover:bg-pink-400 transition"
                >
                  RSVP
                </a>
              </div>

              {/* RSS Feed Placeholder */}
              <div className="text-center text-gray-600">
                <p>RSS Feed Placeholder (Updates Coming Soon)</p>
              </div>
            </div>
          </main>

          
        </div>
  );
}

import Image from "next/image";
import { Inter } from "next/font/google";

const inter = Inter({ subsets: ["latin"] });

export default function Home() {
  return (
    <main
      className={`flex min-h-screen flex-col items-center justify-between p-24 ${inter.className} text-gray-200`}
    >
      <div className='z-10 max-w-5xl w-full items-center justify-between font-mono text-sm lg:flex'></div>

      <div className='text-7xl bg-gradient-to-t from-gray-600 to-white inline-block text-transparent bg-clip-text font-semibold'>
        1177.ai
      </div>
      <img src='/bg.webp' />

      <div className='mb-32 grid text-center lg:max-w-5xl lg:w-full lg:mb-0 lg:grid-cols-4 lg:text-left'></div>
    </main>
  );
}

import localFont from 'next/font/local';

import { Josefin_Sans } from 'next/font/google';
export const josefin_sans = Josefin_Sans({ weight: ["400", "700"], subsets: ['latin'] });

export const Higuen = localFont({
  src: [
    {
      path: '../../public/fonts/HiguenSerif.otf', // Adjust path to your font file
      // weight: '400', // Specify font weight if available
      // style: 'normal', // Specify font style if available
    },
  ],
  display: 'swap', // Recommended for better performance (prevents FOIT)
});
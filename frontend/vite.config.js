// import { defineConfig } from 'vite'
// import react from '@vitejs/plugin-react'
// import svgr from 'vite-plugin-svgr';

// // https://vite.dev/config/
// export default defineConfig({
//   plugins: [react(),
//     svgr(), 

//   ],
// })

// import { defineConfig } from 'vite'
// import react from '@vitejs/plugin-react'
// import svgr from 'vite-plugin-svgr'; // 🛑 Must be imported

// // https://vite.dev/config/
// export default defineConfig({
//   plugins: [
//     react(),
//     svgr(), // 🛑 Must be included in the plugins array
//   ],
// })


import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import svgr from 'vite-plugin-svgr';

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    react(),
    svgr({
      //  OPTION 1: Use the 'ref' and 'title' format (recommended)
      // This setting is sometimes needed to make SVGR work with Vite's default asset loader.
      svgrOptions: {
        ref: true,
        titleProp: true,
      },
      // OPTION 2 (More aggressive, if Option 1 fails): 
      // This tells svgr to explicitly include SVGs imported with '?react'
      // Use this if the next step (step 2) is needed.
      // include: '**/*.svg?react', 
    }),
  ],
});
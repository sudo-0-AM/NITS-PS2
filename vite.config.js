import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default {
  optimizeDeps: {
    include: ["ethers"],
  },
  build: {
    commonjsOptions: {
      transformMixedEsModules: true,
    },
  },
};

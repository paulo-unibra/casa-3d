import {defineConfig} from 'vite';
import {resolve} from 'node:path';
export default defineConfig({base:'./',build:{emptyOutDir:true,rollupOptions:{input:resolve(import.meta.dirname,'source.html')}}});

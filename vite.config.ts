import { defineConfig } from 'vite';
import dts from 'vite-plugin-dts';
import pkg from './package.json' assert { type: 'json' };

export default defineConfig({
    build: {
        lib: {
            entry: 'src/index.ts',
            name: 'MyLib',
            formats: ['es', 'cjs'],
            fileName: (format) => (format === 'es' ? 'index.mjs' : 'index.cjs')
        },
        rollupOptions: {
            external: [
                // Externalize dependencies/peers so they aren't bundled
                // We don't have any external dependencies, only devDependencies
                // so no need to externalise any of them
                // ...Object.keys(pkg.dependencies ?? {}),
                // ...Object.keys(pkg.peerDependencies ?? {}),
                /^node:.*/ // keep Node built-ins external
            ]
        },
        sourcemap: true,
        minify: false
    },
    plugins: [
        dts({
            insertTypesEntry: true,
            outDir: 'dist'
        })
    ]
});

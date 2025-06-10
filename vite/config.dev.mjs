import { defineConfig } from 'vite';
import {viteStaticCopy} from "vite-plugin-static-copy";

export default defineConfig({
    base: './',
    build: {
        rollupOptions: {
            output: {
                manualChunks: {
                    phaser: ['phaser']
                }
            }
        },
    },
    server: {
        port: 8080
    },
    plugins: [
        viteStaticCopy({
            targets: [
                {
                    src: 'weapon-screen',
                    dest: '' // Copies to the root of `dist/`
                }
            ]
        })
    ]
});

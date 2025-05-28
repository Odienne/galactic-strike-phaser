import * as esbuild from 'esbuild'

await esbuild.build({
    entryPoints: ['src/game/main.js'],
    bundle: true,
    outfile: 'game.js',
})
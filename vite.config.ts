import path from 'node:path'
import { defineConfig, mergeConfig } from 'vitest/config'
import dts from 'vite-plugin-dts'

export const commonConfig = defineConfig({
    resolve: {
        alias: {
            '@': path.resolve(__dirname, 'src'),
            'tests': path.resolve(__dirname, 'tests'),
        },
    },
})

export default mergeConfig(commonConfig, defineConfig({
    test: {
        dir: './tests',
        silent: Boolean(process.env.CI),
    },

    build: {
        minify: false,
        sourcemap: true,

        lib: {
            entry: path.resolve(__dirname, './src/index.ts'),
            name: 'MdApi',
            fileName: 'index',
        },
    },

    plugins: [
        dts({
            insertTypesEntry: true,
            tsconfigPath: path.resolve(__dirname, './tsconfig.prod.json'),
        }),
    ],
}))

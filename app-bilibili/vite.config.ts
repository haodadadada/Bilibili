import { defineConfig, loadEnv } from 'vite';
import vue from '@vitejs/plugin-vue';
import electron from 'vite-plugin-electron';
import path from 'path';
import AutoImport from 'unplugin-auto-import/vite';
import Components from 'unplugin-vue-components/vite';
import { ElementPlusResolver } from 'unplugin-vue-components/resolvers';
import eslintPlugin from 'vite-plugin-eslint';
import svgLoader from 'vite-svg-loader';
import tailwindcss from '@tailwindcss/vite'
// https://vitejs.dev/config/
export default defineConfig(({ mode }) => {
  // 使用 loadEnv 加载环境变量，明确 process.cwd() 类型为 string
  const env = loadEnv(mode, process.cwd());

  return {
    base: './',
    plugins: [
      vue(),
      electron({
        entry: './src-system/main.js',
      }),
      AutoImport({
        resolvers: [ElementPlusResolver()],
      }),
      Components({
        resolvers: [ElementPlusResolver()],
      }),
      eslintPlugin({
        include: ['src/**/*.{js,ts,vue}', 'src/*.{js,ts,vue}'],
        exclude: ['node_modules', 'dist', 'dist-electron', 'release'],
      }),
      svgLoader(),
      tailwindcss(),
    ],
    optimizeDeps: {
      include: ['vue', 'vue-router', 'axios', 'vuex', 'vue-electron'],
      exclude: ['@ffmpeg/ffmpeg', '@ffmpeg/util'],
    },
    resolve: {
      alias: {
        '@': path.resolve(__dirname, 'src'),  // __dirname 需要确保 Node.js 类型定义
      },
    },
    server: {
      port: 8080,
      proxy: {
        '/webapi': {
          target: env.VITE_API_BASE_URL,
          changeOrigin: true,
        }
      },
      headers: {
        'Cross-Origin-Opener-Policy': 'same-origin',
        'Cross-Origin-Embedder-Policy': 'require-corp',
      }
    },
    build: {
      sourcemap: mode === 'development',  // 仅在开发模式下生成 sourcemaps
      minify: mode === 'production' ? 'terser' : false,  // 仅在生产模式下进行压缩
      outDir: 'dist',
      rollupOptions: {
        // 配置窗口html打包后的位置
        input: {
          index: './index.html', // 确保 Vite 以 index.html 作为入口
          login: './src/windows/login.html',
          player: './src/windows/player.html'
        }
      },
    }
  };
});


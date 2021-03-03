import {defineConfig, Plugin} from 'vite';
import reactRefresh from '@vitejs/plugin-react-refresh';
import reactJSXSelfSourcePlugin from 'vite-plugin-react-jsx';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [reactRefresh(), reactJSXSelfSourcePlugin()]
});

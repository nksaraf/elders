import {defineConfig, Plugin} from 'vite';
import reactRefresh from '@vitejs/plugin-react-refresh';
import reactJSXSelfSourcePlugin from 'vite-plugin-react-jsx';
import elders from 'vite-plugin-elders';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    {
      name: 'vscode',
      configureServer: (server) => {
        server.middlewares.use((request, response, next) => {
          if (request.url === '/open-file-in-vscode') {
            console.log(request);
          }

          next();
        });
      }
    },
    reactRefresh(),
    reactJSXSelfSourcePlugin(),
    elders()
  ]
});

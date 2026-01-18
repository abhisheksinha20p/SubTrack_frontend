import fs from "node:fs";
import path from "node:path";
import { fileURLToPath, pathToFileURL } from "node:url";
import express from "express";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const isProd = process.env.NODE_ENV === "production";
const resolve = (p) => path.resolve(__dirname, p);

async function createServer() {
  const app = express();

  let vite;
  let template;

  if (!isProd) {
    // Dev: create Vite server in SSR middleware mode
    const { createServer: createViteServer } = await import("vite");
    vite = await createViteServer({
      root: __dirname,
      server: { middlewareMode: true },
      appType: "custom",
    });
    app.use(vite.middlewares);
    template = fs.readFileSync(resolve("index.html"), "utf-8");
  } else {
    // Prod: serve pre-built assets
    const compression = (await import("compression")).default;
    const sirv = (await import("sirv")).default;
    app.use(compression());
    app.use("/", sirv(resolve("dist/client"), { extensions: [] }));
    template = fs.readFileSync(resolve("dist/client/index.html"), "utf-8");
  }

  app.use("*", async (req, res, next) => {
    try {
      const url = req.originalUrl;

      let tpl = template;
      let render;

      if (!isProd) {
        tpl = await vite.transformIndexHtml(url, tpl);
        // Load the server entry (transpiled on the fly)
        const mod = await vite.ssrLoadModule("/src/entry-server.tsx");
        render = mod.render;
      } else {
        // Load SSR bundle from build output
        const mod = await import(pathToFileURL(resolve("dist/server/entry-server.js")).href);
        render = mod.render;
      }

      const { html: appHtml, headTags = "" } = await render(url);

      const html = tpl
        .replace("<!--ssr-outlet-->", appHtml)
        .replace("</head>", `${headTags}</head>`);

      res.status(200).set({ "Content-Type": "text/html" }).end(html);
    } catch (e) {
      if (vite) vite.ssrFixStacktrace(e);
      console.error(e.stack);
      next(e);
    }
  });

  const port = process.env.PORT || 5173;
  return new Promise((resolveStart) => {
    const server = app.listen(port, () => {
      console.log(`SSR server listening on http://localhost:${port}`);
      resolveStart(server);
    });
  });
}

createServer();

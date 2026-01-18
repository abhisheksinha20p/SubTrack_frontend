import React from "react";
import ReactDOMServer from "react-dom/server";
import { StaticRouter } from "react-router-dom/server";
import AppProviders from "./App";
import { AppRoutes } from "./routes";

export function render(url: string) {
  const app = (
    <AppProviders>
      <StaticRouter location={url}>
        <AppRoutes />
      </StaticRouter>
    </AppProviders>
  );

  const html = ReactDOMServer.renderToString(app);
  return { html, headTags: "" };
}

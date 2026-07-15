import { createRoot } from "react-dom/client";
import { setBaseUrl } from "@workspace/api-client-react";
import App from "./App";
import { apiBaseUrl } from "./lib/api-url";
import "./index.css";

const base = apiBaseUrl();
if (base) {
  setBaseUrl(`${base}/api`);
}

createRoot(document.getElementById("root")!).render(<App />);

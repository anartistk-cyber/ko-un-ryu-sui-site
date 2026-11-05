import { createRoot } from "react-dom/client";
import App from "./App";
import "./index.css";
import { rememberCampaign } from "./lib/track";

rememberCampaign();

createRoot(document.getElementById("root")!).render(<App />);

import { createRoot } from "react-dom/client";
import App from "./App";
import "./styles/index.scss";
import "./fonts/inter.css";

const app = document.getElementById("app");

const root = createRoot(app!);

root.render(<App />);

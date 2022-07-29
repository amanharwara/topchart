import { nanoid } from "nanoid";
import { createLocalStore } from "./utils";

export type Chart = { id: string; name: string };

const [charts, setCharts] = createLocalStore<Chart[]>("charts", [
  { id: nanoid(), name: "Untitled" },
]);

export { charts, setCharts };

import { createLocalStore } from "./utils";

export type Chart = { id: string; name: string };

const [charts, setCharts] = createLocalStore<Chart[]>("charts", [
  { id: "test", name: "test" },
]);

export { charts, setCharts };

import { TooltipProvider } from "@radix-ui/react-tooltip";
import Header from "./components/Header";

function App() {
  return (
    <TooltipProvider>
      <Header />
    </TooltipProvider>
  );
}

export default App;

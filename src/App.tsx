import Header from "./components/Header";
import * as Tooltip from "@radix-ui/react-tooltip";

function App() {
  return (
    <Tooltip.Provider>
      <Header />
    </Tooltip.Provider>
  );
}

export default App;

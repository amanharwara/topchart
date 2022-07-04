import Header from "./components/Header";
import * as Tooltip from "@radix-ui/react-tooltip";

function App() {
  return (
    <Tooltip.Provider>
      <Header />
      Test
    </Tooltip.Provider>
  );
}

export default App;

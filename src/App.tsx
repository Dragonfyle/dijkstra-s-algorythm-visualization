import { useEffect, useState } from "react";
import Board from "./components/Board";
import Controls from "./components/Controls/Controls";
import MobileScreen from "./components/MobileScreen/MobileScreen";
import { CONFIGURATION } from "./config/initialConfig";
import "./App.css";

function App() {
  const [isMobile, setIsMobile] = useState(false);

  function getWindowSize() {
    setIsMobile(window.innerWidth < CONFIGURATION.MOBILE_WIDTH);
  }

  useEffect(() => {
    const resizeObserver = new ResizeObserver(getWindowSize);

    resizeObserver.observe(document.body);

    setIsMobile(window.innerWidth < CONFIGURATION.MOBILE_WIDTH);
  }, []);

  return (
    <>
      {!isMobile && (
        <>
          <Board />
          <Controls />
        </>
      )}
      {isMobile && <MobileScreen />}
    </>
  );
}

export default App;

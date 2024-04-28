import * as P from "./Controls.parts";

export default function Controls() {
  return (
    <P.ControlsWrapper>
      <p>LMB to set start node</p>
      <p>RMB to set end node</p>
      <p>CTRL + LMB to deactivate nodes</p>
      <p>SHIFT + LMB to activate nodes</p>
      <p>SPACE to run visualization</p>
    </P.ControlsWrapper>
  );
}

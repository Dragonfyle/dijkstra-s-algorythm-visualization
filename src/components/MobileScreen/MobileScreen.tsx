import * as P from "./MobileScreen.parts";

export default function MobileScreen() {
  const infoText = "Unfortunately the app only works on desktop :(";

  return (
    <P.MobileScreen>
      <h1>{infoText}</h1>
    </P.MobileScreen>
  );
}

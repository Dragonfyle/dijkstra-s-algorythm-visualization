import * as P from "./MobileScreen.parts";

export default function MobileScreen() {
  const infoText = "Unfortunately the app only works on desktop :(";

  return (
    <P.MobileScreen>
      <p>{infoText}</p>
    </P.MobileScreen>
  );
}

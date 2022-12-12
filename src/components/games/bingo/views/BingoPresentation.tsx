import BingoProvider from "../contexts/BingoContext";
import Presentation from "./presentation/Presentation";

export default function BingoPresentation() {
  return (
    <BingoProvider>
      <Presentation />
    </BingoProvider>
  )
}

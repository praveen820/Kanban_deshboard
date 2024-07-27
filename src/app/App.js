import Header from "../components/header/Header";
import Board from "../components/board/Board";
import EmptyBoard from "../components/board/EmptyBoard";
import { useSelector } from "react-redux";

function App() {
  const boards = useSelector((state) => state?.boards?.boards);
  const theme = useSelector((state) => state?.theme);

  return (
    <div className="app" data-theme={theme.theme}>
      <Header />
      {boards?.length > 0 ? <Board /> : <EmptyBoard />}
    </div>
  );
}

export default App;

import Header from "./components/Header"
import Main from "./components/Main";
import { QuizProvider } from "./contexts/QuizContext";


export default function App() {
  return (
    <div className="app">
      <QuizProvider>
        <Header />
        <Main />
      </QuizProvider>
    </div>
  );
}

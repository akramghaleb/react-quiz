import { useEffect, useReducer } from "react";
import Header from "./Header"
import Loader from "./Loader"
import Error from "./Error"
import Main from "./Main";
import StartScreen from "./StartScreen";
const initialState = {
  questions: [],
  // 'loading' , 'error' , 'ready' , 'active' , 'finished'
  status: 'loading',
}
function reducer(state, action) {
  switch (action.type) {
    case 'dataReceived':
      return {
        ...state,
        questions: action.payload,
        status: 'ready',
      };
    case 'dataFailed':
      return {
        ...state,
        status: 'error',
      };
    default:
      throw new Error(`Invalid action`);
  }
}
export default function App() {
  const [state, dispatch] = useReducer(reducer, initialState)
  const { questions, status } = state

  const numQuestions = questions.length

  useEffect(function () {
    fetch("http://localhost:9000/questions")
      .then((response) => response.json())
      .then((data) => dispatch({ type: 'dataReceived', payload: data }))
      .catch((error) => dispatch({ type: 'dataFailed' }))
  }, [])
  return (
    <div className="app">
      <Header />
      <Main>
        {status === 'loading' && <Loader />}
        {status === 'error' && <Error />}
        {status === 'ready' && <StartScreen numQuestions={numQuestions} />}
      </Main>
    </div>
  );
}

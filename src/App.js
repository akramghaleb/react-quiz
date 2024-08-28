import { useEffect, useReducer } from "react";
import Header from "./Header"
import Loader from "./Loader"
import Error from "./Error"
import Main from "./Main";
import StartScreen from "./StartScreen";
import Question from "./Question";
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
    case 'start':
      return {
        ...state,
        status: 'active',
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
        {status === 'ready' && <StartScreen numQuestions={numQuestions}
          dispatch={dispatch} />}
        {status === 'active' && <Question />}
      </Main>
    </div>
  );
}

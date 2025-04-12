import { Provider } from "react-redux"
import MainRoutes from "./routes/MainRoutes"
import { store } from "./store"
import "./App.css"
import { ToastContainer } from 'react-toastify';

const App = () => {
  return (
    <>
      <Provider store={store}>
        <MainRoutes />
      </Provider>
      <ToastContainer />
    </>

  )
}

export default App

import { Provider } from "react-redux"
import MainRoutes from "./routes/MainRoutes"
import { store } from "./store"
import "./App.css"
import { ToastContainer, Slide } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const App = () => {
  return (
    <>
      <Provider store={store}>
        <MainRoutes />
      </Provider>
      <ToastContainer
        position="top-center"
        autoClose={5000}
        hideProgressBar
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="light"
        limit={1}
        transition={Slide}
        className="toast-container"
        toastClassName="toast-centered" />
    </>

  )
}

export default App

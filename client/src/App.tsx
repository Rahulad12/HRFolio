import { Provider } from "react-redux"
import MainRoutes from "./routes/MainRoutes"
import { store } from "./store"
import "./App.css"
import 'react-toastify/dist/ReactToastify.css';
import AntdProvider from "./providers/AntdProvider"
import { ThemeProvider } from "./context/ThemeContext";



const App = () => {
  return (
    <>
      <Provider store={store}>
        <ThemeProvider>
          <AntdProvider>
            <MainRoutes />
          </AntdProvider>
        </ThemeProvider>

      </Provider>
    </>

  )
}

export default App

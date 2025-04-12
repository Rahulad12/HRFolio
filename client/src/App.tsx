import { Provider } from "react-redux"
import MainRoutes from "./routes/MainRoutes"
import { store } from "./store"
import "./App.css"
const App = () => {
  return (
    <Provider store={store}>
      <MainRoutes />
    </Provider>
  )
}

export default App

import { BrowserRouter, Routes, Route } from "react-router-dom";
import Protected from "./Protected.tsx";
import Public from "./Public.tsx";
import Layout from "../component/layout/Layout.tsx";
import Error from "../pages/Error.tsx";
const MainRoutes = () => {

    return (
        <BrowserRouter>
            <Routes>

                <Route path="/*" element={<Public />} />
                <Route element={<Layout />}>
                    <Route path="/dashboard/*" element={<Protected />} />
                </Route>
                <Route path="/error/*" element={<Error />} />
            </Routes>
        </BrowserRouter>
    )

}

export default MainRoutes;
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Protected from "./Protected.tsx";
import Public from "./Public.tsx";
import Layout from "../component/layout/Layout.tsx";

import ScrollToTop from "../component/common/ScrollToTop.tsx";
const MainRoutes = () => {
    return (
        <BrowserRouter>
            <ScrollToTop />
            <Routes>
                <Route path="/*" element={<Public />} />
                <Route element={<Layout />}>
                    <Route path="/dashboard/*" element={<Protected />} />
                </Route>
            </Routes>
        </BrowserRouter>
    )

}

export default MainRoutes;
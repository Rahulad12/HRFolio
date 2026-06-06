import { redirect } from "react-router";

export function ProtectedRoutesLoader() {
    const token = localStorage.getItem('token')
    const role = localStorage.getItem('role')
    if (!token || !role) {
        throw redirect('/login')
    }
    return null
}
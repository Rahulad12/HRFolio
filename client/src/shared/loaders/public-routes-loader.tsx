import { redirect } from 'react-router'

export function PublicRoutesLoader() {
    const token = localStorage.getItem('token')
    const role = localStorage.getItem('role')
    if (token && role) {
        throw redirect('/dashboard')
    }
    return null
}

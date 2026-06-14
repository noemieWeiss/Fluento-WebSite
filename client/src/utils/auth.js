export const getToken = () => {
  try {
    return JSON.parse(localStorage.getItem('authUser'))?.token
  } catch {
    return null
  }
}
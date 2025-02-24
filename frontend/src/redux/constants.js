// export const BASE_URL = "https://alumni-backend-8eqk.onrender.com"
export const BASE_URL = import.meta.env.VITE_BACKEND_URL
export const USERS_URL = `${BASE_URL}/api/users`
export const ACADMIC_URL = `${BASE_URL}/api/academics`
export const JOBDETAIL_URL = `${BASE_URL}/api/jobDetail`
export const DONATION_URL = `${BASE_URL}/api/donation`

import axios from "axios"

async function RefreshHook(): Promise<boolean> {
    const access = localStorage.getItem("access")
    const refresh = localStorage.getItem("refresh")

    async function refreshToken(): Promise<boolean> {
        if (!refresh) {
            console.error("No refresh token found")
            return false
        }

        try {
            /**by refreshing the refresh token, we are actually testing wether it's still valid or not */
                const res = await axios.post("http://localhost:8000/user/token/refresh/", { refresh })
                localStorage.setItem("access", res.data.access)
                
                if (res.data.refresh) {
                    localStorage.setItem("refresh", res.data.refresh)
                }
                
                return true
                
        } catch (err: any) {
                
                console.error("Error refreshing:", err.response?.data)
                alert("Session expired. You must log in again!")
                return false

        }
    }

    if (access) {
        console.log(access)
        try {
            await axios.post("http://localhost:8000/user/token/verify/", { token: access })
            console.log("valid access token")
            return true
        } catch (err:any) {
            console.warn("Invalid  access token ", err.response?.data)
            const refreshed = await refreshToken()
            return refreshed
        }
    } else {
        console.warn("No access token found")
        const refreshed = await refreshToken()
        return refreshed
    }
}

export default RefreshHook;

/**
 * If the user is logged, and takes the profitiency test
 * the result of this test, must be stored in the corresponding table
 * of the API
 */
import RefreshHook from "../Hooks/RefreshHook"

export async function storeProfitiency(){
    const niveu = localStorage.getItem("niveu")
    const token = localStorage.getItem("access")

    const validRefresh = await RefreshHook()
    
    if(validRefresh){
        let idUser = localStorage.getItem("userId")
        const res = await fetch(`http://localhost:8000/course/create-profitiency/${idUser}/${niveu}/`,{
            headers: {
                "Content-Type": "application/json",
                "Accept": "application/json, text-plain, */*",
                "Authorization": `Bearer ${token}`
            },
            method:'post',
            credentials:"same-origin",

            body: JSON.stringify({
                fk_id_participant:idUser,
                level:niveu
            })
        })
        if(res.ok){
            const data = await res.json()
            console.log(data)
        }else{
            console.error(res.status)
            alert("Error at saving your result.")
        }
    }else(
        alert("Session expired, log in again please.")
    )
}
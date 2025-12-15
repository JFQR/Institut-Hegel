//this component was made to select the options
//required in the Travel component

//REACT
import { useState } from "react";
//PRIMEREACT
import { Dropdown } from "primereact/dropdown";
import { Button } from "primereact/button";
import { Dialog } from 'primereact/dialog';
        
//JSON
import ReisenOptionen from "../../JSON/ReisenOptionen.json"

import { useTranslation } from "react-i18next"

function ApplicationForm(){
    const { t } = useTranslation()

    const userData = new FormData()

    const [ fields, setFields ] = useState({
        language_knowledge:'',
        country:'',
        start_date:'',
        duration:'',
    })
    const [visible, setVisible] = useState<boolean>(false);

    function handleSendInfo(){
        for( const[ key, value ] of Object.entries(fields)){
            if(value === ''){
                alert("Fill all the fields")
                break
            }

            userData.append(`${key}`,value)

        }
        apiCall()
    }

    async function apiCall(){
        
        const userId = localStorage.getItem("userId")
        const token = localStorage.getItem("access")
        userId ? userData.append("fk_id_student",userId) : null

        const res = await fetch(`http://localhost:8000/course/create-profitiency/${userId}/`,{
            headers: {
                "Accept": "application/json, text-plain, */*",
                "Authorization": `Bearer ${token}`
            },
            method:'post',
            credentials:"same-origin",

            body: userData
        })
        if(res.ok){
            const data = await res.json()
            console.log(data)
            setVisible(true)
        }else{
            console.error(res.status)
            alert("Error at saving your petition.")
        }
    }

    return(<div className="flex flex-col gap-2">
        <Dropdown value={fields.language_knowledge} 
            onChange={(e) => setFields(prev=>({...prev, language_knowledge:e.value}))} 
            options={ReisenOptionen.vorkenntniss} 
            optionLabel="name" 
            placeholder={t("appform.languageknw")}
        />
        <Dropdown value={fields.country} 
            onChange={(e) => setFields(prev=>({...prev, country:e.value}))} 
            options={ReisenOptionen.land} 
            optionLabel="name" 
            placeholder={t("appform.country")}
        />
        <Dropdown value={fields.start_date} 
            onChange={(e) => setFields(prev=>({...prev, start_date:e.value}))} 
            options={ReisenOptionen.startdatum} 
            optionLabel="name" 
            placeholder={t("appform.start")}
        />
        <Dropdown value={fields.duration} 
            onChange={(e) => setFields(prev=>({...prev, duration:e.value}))} 
            disabled={fields.start_date ? false : true}
            options={fields.start_date === "Festgelegt" ? ReisenOptionen.KursdauerFest : ReisenOptionen.kursdauerFlexibel} 
            optionLabel="name" 
            placeholder={t("appform.duration")} 
        />

        <Dialog header="Header" visible={visible} style={{ width: '50vw' }} onHide={() => {if (!visible) return; setVisible(false); }}>
            <p className="m-0">
                {t("appform.info")}
            </p>
        </Dialog>
        
        <div>
            <Button label="Info senden" onClick={handleSendInfo}/>
        </div>
    </div>)
}export default ApplicationForm
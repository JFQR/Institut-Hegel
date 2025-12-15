//react
import { useState } from "react";
//images
import banner from "../assets/reisen banner.png"
//components
import Navbar from "./Navbar"
import Footer from "./Footer"
import ApplicationForm from "./ComplementComponents/ApplicationForm";
//primereact
import { Accordion, AccordionTab } from 'primereact/accordion';
import { Button } from "primereact/button";
import { Dialog } from 'primereact/dialog';
//test pdf
import pdfTest from "../docs/local_test.pdf"
//others
import RefreshHook from "./Hooks/RefreshHook";

import { useTranslation } from "react-i18next"
        
        
function Travel(){
    
    const { t } = useTranslation()

    const [ seeLoggin, setSeeLoggin ] = useState(false)
    const [ seeApplyForm, setSeeApplyForm ] = useState(false)
    
    async function handleApply(){
        const user = await RefreshHook()
        if(user){
            setSeeApplyForm(true)
        }else{
            alert("You're not logged or the session is expired.")
            setSeeLoggin(true)
        }
    }
    return(<>
        <Navbar/>
        <main>
            <img className="w-screen" src={banner}></img>
            <div className="grid gap-4 text-center items-center bg-white p-40">
                <h1 className="p-4 text-5xl">{t("travel.title")}</h1>
                <Accordion>
                    <AccordionTab header="🇨🇭 In die Schweiz 🇨🇭">
                        <p className="m-0 text-left">
                            {t("travel.sw")}
                        </p>
                        <div className="flex p-4 gap-4 text-amber-600 content-center-safe">
                            <a download href={pdfTest}>{t("travel.learn")}</a>
                            <a onClick={handleApply} >{t("travel.")}</a>
                        </div>
                    </AccordionTab>
                    <AccordionTab header="🇦🇹 Nach Österreich 🇦🇹">
                        <p className="m-0 text-left">
                            {t("travel.austria")}
                        </p>
                        <div className="flex p-4 gap-4 text-amber-600 content-center-safe">
                            <a download href={pdfTest}>{t("travel.learn")}</a>
                            <a onClick={handleApply} >{t("travel.")}</a>
                        </div>
                    </AccordionTab>
                    <AccordionTab header="🇩🇪 Nach Deutschland 🇩🇪" >
                        <p className="m-0 text-left">
                            {t("travel.germany")}
                        </p>
                        <div className="flex p-4 gap-4 text-amber-600 content-center-safe">
                            <a download href={pdfTest}>{t("travel.learn")}</a>
                            <a onClick={handleApply} >{t("travel.")}</a>
                        </div>
                    </AccordionTab>
                </Accordion>
            </div>

        </main>
        <Dialog header="Anmelden" visible={seeLoggin} style={{ width: '50vw' }} onHide={() => {if (!seeLoggin) return; setSeeLoggin(false); }}>
            <Button label="Sie müssen anmelden"/>
        </Dialog>
        <Dialog 
            className="flex justify-center"
            header="Info senden" 
            visible={seeApplyForm} 
            style={{ width: '50vw' }} 
            onHide={() => {if (!seeApplyForm) return; setSeeApplyForm(false); }}>
            <ApplicationForm/>
        </Dialog>
        <Footer/>
        </>)
}export default Travel
      
//components
import Navbar from "./Navbar"
import Footer from "./Footer"
//react
import { useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
//hooks
import EvaluationHook from "./Hooks/EvaluationHook";
//primereact
import { Button } from 'primereact/button';
import { GlobalInfoContext } from "./Context";
import { RadioButton } from "primereact/radiobutton";
import { Dialog } from 'primereact/dialog';
//types
type AnswerData = {
  value: string
  correct: boolean
  points:number | undefined
};
import { useTranslation } from "react-i18next"
export type Answers = {
  [key: string]: AnswerData;
};
// others
import fragebogen from "../JSON/fragebogen.json"
import { storeProfitiency } from "./utils/ProfitiencyManagement";

export default function Fragebogen() {

    const nav = useNavigate()

    const { niveu, preEvaluation } = EvaluationHook()

    const [ visible, setVisible ] = useState<boolean>(false)

    const context = useContext(GlobalInfoContext)

    const [answers, setAnswers] = useState<Answers>({});

    const handleChange = (sectionId: string, value: string, correct: boolean, points:number|undefined) => {
        setAnswers((prev) => ({
            ...prev,
            [sectionId]: { value, correct, points },
        }));
    };
const { t } = useTranslation()
    function handleResults(){
        preEvaluation(answers)
        setVisible(true)
    }

    async function alreadyLogged(){
        localStorage.setItem("niveu",niveu)
        await storeProfitiency()
        nav("/")
    }

    function notLogged(){
        localStorage.setItem("niveu",niveu)
        nav("/login")
    }

    return (<>
        <Navbar/>
        <div className="w-full grid p-4 gap-2 h-[110vh]]">
        {fragebogen.map((section) => (
            <div className="p-2" key={section.id}>
                <h3 className="font-extrabold">{section.id.toUpperCase()}</h3>
            
                {section.fragen.map((frage, index) => (
                    <div key={index} className="p-field-radiobutton">
                        <RadioButton
                            inputId={`${section.id}-${index}`}
                            name={section.id}
                            value={frage.text}
                            onChange={() =>
                                handleChange(section.id, frage.text, frage.correct, frage.points)
                            }
                            checked={answers[section.id]?.value === frage.text}
                        />
                        <label htmlFor={`${section.id}-${index}`}>{frage.text}</label>
                    </div>
                ))}
                </div>
            ))}
            <Button label="Submit" onClick={()=>handleResults()} />
            
            <Dialog header={`Ihres Niveu: ${niveu}`} visible={visible} style={{ width: '50vw' }} onHide={() => {if (!visible) return; setVisible(false); }}>
                {context?.existingUser ? 
                    (<div className="grid place-content-center gap-2">
                        <p className="m-0">{t("eval.success")}
                        </p>
                        <Button onClick={alreadyLogged} label="Fortfahrent"/>
                    </div>):
                    <div className="grid place-content-center gap-2">
                        <p>{t("eval.continue")}</p>
                        <Button onClick={notLogged} label={t("navbar.Anmelden")}/>
                    </div>}
            </Dialog>
        </div>
        <Footer/>
    </>);
}

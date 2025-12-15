import {Link} from 'react-router'

import { useState, useEffect } from 'react'

import { Avatar } from 'primereact/avatar';
import { Badge } from 'primereact/badge';

import { useTranslation } from "react-i18next"

function Navbar(){

    const { t, i18n } = useTranslation()

    const [ isTeacher, setIstTeacher ] = useState<boolean>(false)
    const [ isLogged, setIsLogged ] = useState<boolean>(false)
    const [ showContent, setShowContent ] = useState<boolean>(false)
    const [ showPpicture, setShowPpicture] = useState<boolean>(false)
    const [ pPicture, setPpicture] = useState<string>('')

    useEffect(()=>{
        const existsPpicture:string|null = localStorage.getItem("userProfileImage")
        if(existsPpicture){
            setShowPpicture(true) 
            setPpicture(existsPpicture)
        }

        const itsTeacher = localStorage.getItem("is_teacher")
        if(itsTeacher){
            setIstTeacher(true)
        }

        const logged = localStorage.getItem("userId")
        if(logged){
            setIsLogged(true)
        }

    },[])

    const toggleLanguage = () => {
        const newLang = i18n.language === "de" ? "en" : "de";
        i18n.changeLanguage(newLang);
    }

    return(<nav className='bg-gray-900 sticky top-0 z-50 flex justify-center text-[white] lg:text-2xl p-3'>
        
        {showPpicture && (
            <Link to="/infomanagement">
                <Avatar label="U" size="xlarge" image={pPicture} className="p-overlay-badge">
                    <Badge value="4" />
                </Avatar>
            </Link>
        )}

        <button onClick={()=>setShowContent(!showContent)} 
            className='bg-gray-900 w-1/3 text-3xl'>
                ≡
        </button>

        <div className="flex items-center justify-between w-full">
            <h2 className="text-right text-lg font-semibold">
                <Link to="/">Institut Hegel</Link>
            </h2>
            <button
                className="text-xs text-gray-300 hover:text-white transition"
                onClick={toggleLanguage}
            >
                {t("navbar.change_language")}
            </button>
        </div>     
        

        {showContent && (
            <div className="fixed top-0 left-0 w-64 h-screen bg-gray-900 z-50 p-6 shadow-lg flex flex-col gap-4">
                <button onClick={()=>setShowContent(false)} 
                    className='bg-gray-900 w-1/3'>
                        X
                </button>
                <ul className='gap-14 text-[18px]'>
                    <li><Link to="/">{t("navbar.home")}</Link></li>
                    {!isTeacher &&(<li><Link to="/coursesmanagement">{t("navbar.Meine_Aufgaben")}</Link></li>)}
                    {isLogged && (<li><Link to="/infomanagement">{t("navbar.Persönliche_Info")}</Link></li>)}
                    {isTeacher && (<li><Link to="/coursesmanagement">{t("navbar.Kurse_Verwalten")}</Link></li>)}
                    <li><Link to="/login">{t("navbar.Anmelden")}</Link></li>
                </ul>   
            </div>
        )}
    </nav>)
}export default Navbar
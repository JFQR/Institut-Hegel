import mobile from '../assets/mobile.png'
import computer from '../assets/computer.png'

//REACT
import {Link} from 'react-router'

//prime react:
import { Card } from 'primereact/card';

//Components:
import Footer  from './Footer'
import Navbar from './Navbar'

import { useTranslation } from "react-i18next"
        
function MainPage(){

    const { t } = useTranslation()
    
    return(<main className="flex flex-col justify-center w-dvw content-center text-center">
                <Navbar/>
                <img className="block lg:hidden" src={mobile} />
                <img className="hidden lg:block" src={computer} />

                <Card title={t("mainpage.title")} className="flex justify-center">
                    <p className="m-0 lg:w-6xl lg:text-2xl">
                        {t("mainpage.presentation")}
                    </p>
                </Card>

                <div className="sm:w-full lg:w-[960px] flex flex-wrap justify-center p-8 gap-4 mx-auto">
                    <Link to="/login">
                        <div 
                            className="grid bg-gray-900 text-2xl text-white content-center cursor-pointer shadow-lg  rounded-xl w-80 h-60">
                                {t("mainpage.login")}
                        </div>
                    </Link>

                    <Link to="/evaluation">
                        <div 
                            className="grid bg-amber-600 text-2xl text-gray-900 content-center cursor-pointer shadow-lg  rounded-xl w-80 h-60">
                                {t("mainpage.level")}
                        </div>
                    </Link>

                    <Link to="travel">
                        <div 
                            className="grid bg-amber-600 text-2xl text-gray-900  content-center cursor-pointer shadow-lg  rounded-xl w-80 h-60">
                                {t("mainpage.travel")}
                        </div>
                    </Link>

                    <Link to="educationoffer">
                        <div 
                            className="grid bg-gray-900 text-2xl text-white content-center cursor-pointer shadow-lg  rounded-xl w-80 h-60">
                                {t("mainpage.ed_offer")}
                        </div>
                    </Link>
                </div>
                <Footer/>
            </main>)
}export default MainPage




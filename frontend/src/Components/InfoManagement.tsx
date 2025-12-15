/**
 * this component will allow the user to update their info
 */

//primereact:
import { InputText } from 'primereact/inputtext'
import { FloatLabel } from "primereact/floatlabel"
import { InputNumber } from 'primereact/inputnumber'
import { Dropdown } from 'primereact/dropdown'
import { Button } from 'primereact/button'
import { Tooltip } from 'primereact/tooltip'

//hook
import RefreshHook from './Hooks/RefreshHook'

//utils
import { placeImg } from './utils/blobManager'

//axios
import axios from "axios"

//react
import { useRef, useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'

//json
import countries from "../JSON/jsonCountries.json"

//components
import Navbar from './Navbar';
import Footer from './Footer';

import { useTranslation } from "react-i18next"

//types:
type filesType = {
    identification: FileList | null
    profilePicture: FileList | null
    cv: FileList | null
    german_certificate: FileList | null
} 

type FieldsStateType = {
    name:string|null
    password:string|null
    sex:string|null
    country:string|null
    email:string|null
    age:number|null
}

function InfoManagement(){

    useEffect(()=>{

        const idUser = localStorage.getItem("userId")

        axios.get(`http://localhost:8000/user/detail/${idUser}/`).then(res =>{
            console.log("recieved data: ",res.data)
            fillFields(res.data)
        }).catch(err => {
            console.error(err)
            alert("An error occured at retrieving your data.")
        })

        const userExists = localStorage.getItem("is_teacher")
        userExists === "true" ? setShowTeacherForm(true) : null
    },[])

    const nav = useNavigate()

    //const [ showStudentForm, setShowStudentForm ] = useState<boolean>(false)
    const [ showTeacherForm, setShowTeacherForm ] = useState<boolean>(false)
    const [ fields, setFields ] = useState<FieldsStateType>({
        name:null,
        password:null,
        sex:null,
        country:null,
        email:null,
        age:null,
    })
    //bank is not part of fields because 
    // it could or couldn't be filled
    const [ bank, setBank ] = useState<number|null>(null)
    const [ isTeacher, setIsTeacher ] = useState<boolean>(false)
    

    const [ files, setFiles ] = useState<filesType>({
        identification:null,
        profilePicture:null,
        cv:null,
        german_certificate:null
    })

    const refs = {
        name: useRef<HTMLInputElement | null>(null),
        email: useRef<HTMLInputElement | null>(null),
        papers: useRef<HTMLInputElement | null>(null),
        photo: useRef<HTMLInputElement | null>(null)
    }
    const teacherRefs = {
        cv: useRef<HTMLInputElement | null>(null),
        certificate: useRef<HTMLInputElement | null>(null)
    }
    
    const sex = [
        { name: 'Maskulin'},
        { name: 'Femenin'},
        { name: 'Divers' }
    ];

    function manageFiles(event: React.ChangeEvent<HTMLInputElement>) {
        let key:string|null = localStorage.getItem("key")

        if(event.target.files){
            const file = event.target.files

            switch(key){
                case 'identification':
                    setFiles(prev=>({...prev,identification:file}))
                    break
                case 'profilePicture':
                    setFiles(prev=>({...prev,profilePicture:file}))
                    break
                case 'cv':
                    setFiles(prev=>({...prev,cv:file}))
                    break
                case 'certificate':
                    setFiles(prev=>({...prev,german_certificate:file}))
                    break
            }
        }
    }

    function fillFields(data:any){
        
        setFields(prev => ({...prev, age:data.age}))
        setFields(prev => ({...prev, name:data.name}))
        setFields(prev => ({...prev, country:data.country}))
        setFields(prev => ({...prev, sex:data.sex}))
        setFields(prev => ({...prev, email:data.email}))
        setFiles(prev => ({...prev, identification:data.id}))
        setFiles(prev => ({...prev, profilePicture:data.photo}))

        let isTeacher:string|null = localStorage.getItem("is_teacher")
        if(isTeacher==="true"){
            setIsTeacher(true)
            setBank(data.bank_account)
            setFiles(prev => ({...prev,cv:data.cv}))
            setFiles(prev => ({...prev,german_certificate:data.german_certificate}))
        }

    }

    async function handleSubmit(e: React.FormEvent){
        e.preventDefault()
        await updateAccount()
    } 

    async function updateAccount(){

        localStorage.removeItem("key")

        const papersAreValid = await checkPapers()
        
        files.profilePicture ? userData.append("photo",files.profilePicture[0]) : null
        
        if(!papersAreValid || !files.profilePicture){
            alert("Fill the form completely")
            return 
        }
        
        console.log(userData)
        //we ensure the current token is valid
        await RefreshHook()
        //and set it 
        const access = localStorage.getItem("access")

        axios.put("http://localhost:8000/user/update/",userData,{
            headers: {
                'Content-Type': 'multipart/form-data',
                'Authorization':`Bearer ${access}`
            }
        }).then(res => {
            alert("Account updated")
            console.log(res)
            files.profilePicture ? placeImg(files.profilePicture[0]): null
        }).catch(err=>{
            console.error(err)
            alert("An error occurred")
            
        })

    }

    const userData = new FormData()

    async function checkPapers():Promise<boolean>{
        
        if(showTeacherForm){
            userData.append("is_teacher","1")
            
            if(files.cv && files.german_certificate){
                //const cvBlob = await fileToBlob(files.cv[0])
                userData.append("teacher_profile.cv",files.cv[0])

                //const certificateBlob = await fileToBlob(files.german_certificate[0])
                userData.append("teacher_profile.german_certificate",files.german_certificate[0])
            }else{
                return false
            }
            bank ? userData.append("teacher_profile.bank_account",bank.toString()) : null
        }
        
        for(const[ key, value ] of Object.entries(fields)){

            value ? userData.append(key, value.toString()) : null

        }

        return true

    }

    async function deleteAccount(){
        const validToken = await RefreshHook()
        const currentToken = localStorage.getItem("access")
        if(validToken){
            axios.delete("http://localstorage:8000/user/delete/",{
                headers: {
                    'Authorization':`Bearer ${currentToken}`
                }
            }).then(res =>{
                console.log(res.data)
                alert("Account deleted")
            }).catch(err =>{
                console.error(err)
                alert("Error deleting your account")
            })
        }
    }
    
    function logOut(){
        localStorage.clear()    
        nav("/")
    }
const { t } = useTranslation()
    return (<>    
        <Navbar />
        <main className="min-h-screen flex flex-col items-center justify-center p-8">
            <h1 className='text-3xl'>{t("infmg.title")}</h1>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-9 p-8">
                <div>
                    <form className="text-start gap-7 grid content-center" onSubmit={handleSubmit}>
                        <FloatLabel>
                            <InputText 
                                required 
                                id="nameField"  
                                value = {fields.name ?? ""} 
                                onChange={(e) => setFields(prev => ({...prev, name:e.target.value}))} 
                            />
                            <label htmlFor="nameField">{t("infmg.name")}</label>
                        </FloatLabel>

                        <FloatLabel>
                            <InputText 
                                value={fields.email ?? ""}
                                required 
                                id="emailField" 
                                onChange={(e) => setFields(prev => ({...prev, email:e.target.value}))} />
                            <label htmlFor="emailField">{t("infmg.email")}</label>
                        </FloatLabel>

                        <Dropdown
                            value={fields.country ?? ""}
                            onChange={(e) => setFields(prev => ({...prev, country:e.value.name}))}
                            options={countries}
                            optionLabel="name"
                            placeholder="Land"
                            className="w-full md:w-14rem"
                        />

                        <FloatLabel>
                            <InputNumber 
                                inputId="integeronly" 
                                id="ageField" 
                                value={fields.age} 
                                onValueChange={(e: any) => setFields(prev => ({...prev, age:e.value ?? 0}))}
                            />
                            <label htmlFor="ageField">{t("infmg.age")}</label>
                        </FloatLabel>

                        <Dropdown
                            value={fields.sex}
                            onChange={(e) => setFields(prev => ({...prev, sex:e.value}))}
                            options={sex.map((s) => s.name)}
                            optionLabel="name"
                            placeholder="Geschlecht"
                            className="w-full md:w-14rem"
                        />

                        {showTeacherForm && (
                        <FloatLabel>
                            <InputNumber required value={bank} onValueChange={(e: any) => setBank(e.value ?? 0)} id="bankField" />
                            <label htmlFor="bankField">{t("infmg.bank")}</label>
                        </FloatLabel>
                        )}
                        <Button type="submit" label="Konto aktualisieren"/>
                    </form>
                </div>

                <div className="lg:place-content-around sm:content-center flex flex-col gap-2">
                    {/* Ausweis */}
                    <input
                        type="file"
                        accept=".pdf"
                        id="generalPapers"
                        ref={refs.papers}
                        style={{ display: "none" }}
                        onChange={manageFiles}
                        onClick={()=>localStorage.setItem("key","identification")}
                    />
                    <Tooltip target=".ausweis" />
                    <Button
                        type="button"
                        data-pr-tooltip="Geburtskunde, Reisenpass, Nationalpersonalausweis..."
                        data-pr-position="right"
                        data-pr-at="right+5 top"
                        data-pr-my="left center-2"
                        className="ausweis"
                        severity="secondary"
                        label={files.identification?.toString() ?? "Ausweis"}
                        onClick={() => {
                                if(refs.papers.current){
                                    refs.papers.current.click()
                                }
                            }
                        }
                    />

                    {/* Profilbild */}
                    <input
                        type="file"
                        accept=".jpg,.png,.jpeg"
                        id="generalPhoto"
                        ref={refs.photo}
                        style={{ display: "none" }}
                        onChange={manageFiles}
                        onClick={()=>localStorage.setItem("key","profilePicture")}
                    />
                    <Tooltip target=".Profilbild" />
                    <Button
                        data-pr-tooltip=".jpg oder .png erlaubt"
                        data-pr-position="right"
                        type="button"
                        severity="secondary"
                        label={files.profilePicture?.toString() ?? "Profilbild"}
                        onClick={() => {
                                if(refs.photo.current){
                                    refs.photo.current.click()
                                }
                            }
                        }
                    />

                    {showTeacherForm && (
                        <>
                        {/* Lebenslauf */}
                        <input
                            type="file"
                            accept=".pdf"
                            id="CV"
                            ref={teacherRefs.cv}
                            style={{ display: "none" }}
                            onChange={manageFiles}
                            onClick={()=>localStorage.setItem("key","cv")}
                        />
                        <Tooltip target=".Lebenslauf" />
                        <Button
                            data-pr-tooltip="nur .pdf erlaubt"
                            data-pr-position="right"
                            severity="secondary"
                            label={files.cv?.toString() ?? "Lebenslauf"}
                            onClick={() => {
                                    if(teacherRefs.cv.current){
                                        teacherRefs.cv.current.click()
                                    }
                                }
                            }
                        />

                        {/* Deutschzertifikat */}
                        <input
                            type="file"
                            accept=".pdf"
                            id="germanCertificate"
                            ref={teacherRefs.certificate}
                            style={{ display: "none" }}
                            onChange={manageFiles}
                            onClick={()=>localStorage.setItem("key","certificate")}
                        />
                        <Tooltip target=".Deutschzertifikat" />
                        <Button
                            data-pr-tooltip="nur .pdf erlaubt"
                            data-pr-position="right"
                            type="button"
                            severity="secondary"
                            label={files.german_certificate?.toString() ?? "Deutschzertifikat"}                            
                            onClick={() => {
                                    if(teacherRefs.certificate.current){
                                        teacherRefs.certificate.current.click()
                                    }
                                }
                            }
                        />
                        </>
                    )}
                </div>
            </div>
            <Button type="button" severity="danger" onClick={deleteAccount} label={t("infmg.delete")}/>
            <Button type="button" onClick={logOut} label={t("infmg.logout")}/>
        </main>
    <Footer/></>);
}export default InfoManagement
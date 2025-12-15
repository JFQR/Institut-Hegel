//primereact:
import { Password } from 'primereact/password';
import { InputText } from 'primereact/inputtext';
import { FloatLabel } from "primereact/floatlabel";
import { TabMenu } from 'primereact/tabmenu';
import { InputNumber } from 'primereact/inputnumber';
import { Dropdown } from 'primereact/dropdown';
import { Button } from 'primereact/button';
import { Tooltip } from 'primereact/tooltip';

//react
import { useRef, useState } from 'react'

//axios
import axios from 'axios'

//utils
import { placeImg } from "../utils/blobManager"

//json
import countries from "../../JSON/jsonCountries.json"

//types:
type filesType = {
    identification: FileList | null
    profilePicture: FileList | null
    cv: FileList | null
    german_certificate: FileList | null
} 

import { useTranslation } from "react-i18next"

function EnrollmentForm(){

    const [ showStudentForm, setShowStudentForm ] = useState<boolean>(false)
    const [ showTeacherForm, setShowTeacherForm ] = useState<boolean>(false)
    const [ password, setPassword ] = useState('');
    const [ age, setAge ] = useState<number|null>(null)
    const [ bank, setBank ] = useState<number|null>(null)
    const [ selectedGenre, setSelectedGenre] = useState<string|null>(null)
    const [ selectedCountry, setSelectedCountry ] = useState<string>('')
    const [ files, setFiles ] = useState<filesType>({
        identification:null,
        profilePicture:null,
        cv:null,
        german_certificate:null
    })
    
    const refs = {
        name: useRef<HTMLInputElement | null>(null),
        email: useRef<HTMLInputElement | null>(null),
        id_papers: useRef<HTMLInputElement | null>(null),
        photo: useRef<HTMLInputElement | null>(null)
    }

    const teacherRefs = {
        cv: useRef<HTMLInputElement | null>(null),
        certificate: useRef<HTMLInputElement | null>(null)
    }

    function handleShow(roll:string){
        if(roll === "student"){
            setShowStudentForm(true)
            setShowTeacherForm(false)
        }
        if(roll === "lehrer"){
            setShowStudentForm(false)
            setShowTeacherForm(true)
        }
    }
    const items = [
        { label: 'Ich will studieren', command:()=>{handleShow("student")}},
        { label: 'Ich will Lehren', command:()=>{handleShow("lehrer")}}
    ];
    const sex = [
        { name: 'Maskulin'},
        { name: 'Femenin'},
        { name: 'Divers' }
    ];

    function manageFiles(event: React.ChangeEvent<HTMLInputElement>) {
        let key:string|null = localStorage.getItem("key")
        const file = event.target.files
        if (file) {

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


    const userData = new FormData()

    async function handleSubmit(e: React.FormEvent){
        e.preventDefault()
        await createAccount()
    } 

    async function createAccount(){
        
        localStorage.removeItem("key")

        const papersAreValid = await checkPapers()
        
        files.profilePicture ? userData.append("photo",files.profilePicture[0]) : null
        
        if(!papersAreValid || !files.profilePicture){
            alert("Fill the form completely")
            return 
        }
        
        console.log(userData)

        axios.post("http://localhost:8000/user/register/",userData,{
            headers: {
                'Content-Type': 'multipart/form-data'
            }
        }).then(res => {
            alert("Account created")
            localStorage.setItem("refresh",res.data.refresh)
            localStorage.setItem("access",res.data.acess)
            localStorage.setItem("userId",res.data.user.id)
            files.profilePicture ? placeImg(files.profilePicture[0]): null
            showTeacherForm ? localStorage.setItem("is_teacher","true") : null
        }).catch(err=>{
            alert("An error occurred")
            console.error(err)
        })

    }

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

        for(const[ key, value ] of Object.entries(refs)){

            const currentValue = value.current?.value
            currentValue ? userData.append(key, currentValue) : null
        }

        selectedCountry ? userData.append("country",selectedCountry) : null
        selectedGenre ? userData.append("sex",selectedGenre) : null
        password ? userData.append("password",password) : null
        age ? userData.append("age",age.toString()) : null

        if(files.identification){
            userData.append("id_papers",files.identification[0])
        }else{
            console.log("line 173")
            return false
        }

        return true
    }

    const { t } = useTranslation()

    return (<>
        <TabMenu model={items} />

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-9 p-8">

            <div>
                <form className="text-start gap-7 grid content-center" onSubmit={handleSubmit}>
                    <FloatLabel>
                        <InputText required id="nameField" ref={refs.name} />
                        <label htmlFor="nameField">{t("edoffer.name")}</label>
                    </FloatLabel>

                    <FloatLabel>
                        <InputText required id="emailField" ref={refs.email} />
                        <label htmlFor="emailField">Email</label>
                    </FloatLabel>

                    <Dropdown
                        value={selectedCountry}
                        onChange={(e) => setSelectedCountry(e.value.name)}
                        options={countries}
                        optionLabel="name"
                        placeholder={t("infmg.country")}
                        className="w-full md:w-14rem"
                    />

                    <FloatLabel>
                        <Password inputId="passwordField" onChange={(e) => setPassword(e.target.value)} />
                        <label htmlFor="passwordField">{t("edoffer.password")}</label>
                    </FloatLabel>

                    <FloatLabel>
                        <InputNumber inputId="integeronly" id="ageField" value={age} onValueChange={(e: any) => setAge(e.value ?? 0)} />
                        <label htmlFor="ageField">{t("edoffer.age")}</label>
                    </FloatLabel>

                    <Dropdown
                        value={selectedGenre}
                        onChange={(e) => setSelectedGenre(e.value)}
                        options={sex.map((s) => s.name)}
                        optionLabel="name"
                        placeholder={t("edoffer.sex")}
                        className="w-full md:w-14rem"
                    />

                    {showTeacherForm && (
                    <FloatLabel>
                        <InputNumber required value={bank} onValueChange={(e: any) => setBank(e.value ?? 0)} id="bankField" />
                        <label htmlFor="bankField">{t("edoffer.bank")}</label>
                    </FloatLabel>
                    )}
                    <Button type="submit" label={t("edoffer.account")}/>
                </form>
            </div>

            <div className="lg:place-content-around sm:content-center flex flex-col gap-2">
                {/* Ausweis */}
                <input
                    type="file"
                    accept=".pdf"
                    multiple
                    id="generalPapers"
                    ref={refs.id_papers}
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
                    label={
                            refs.id_papers.current?.value ? 
                            refs.id_papers.current?.value.slice(12) : "Ausweis" 
                        }
                    onClick={() => {
                            if(refs.id_papers.current){
                                refs.id_papers.current.click()
                            }
                        }
                    }
                />

                {/* Profilbild */}
                <input
                    type="file"
                    accept=".jpg,.png,.jpeg"
                    multiple
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
                    
                    label={
                        refs.photo.current?.value ? 
                        refs.photo.current?.value.slice(12) : 
                        "Profilbild" 
                    }
                    
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
                        multiple
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

                        label={teacherRefs.cv.current?.value ? 
                                teacherRefs.cv.current?.value.slice(12) : 
                                "Lebenslauf" 
                        }

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
                        multiple
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
                        
                        label={teacherRefs.certificate.current?.value ? 
                                teacherRefs.certificate.current?.value.slice(12) : 
                                "Deutschzertifikat" }
                        
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
        
    </>);

}export default EnrollmentForm
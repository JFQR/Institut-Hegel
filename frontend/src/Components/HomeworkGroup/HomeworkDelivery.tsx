/**
 * this component will allow students see the media assigned for homework,
 * upload media 
 * as well as their score and feedback from teachers.
 * teachers will be able to score and give feedback to the students here 
 * and see the media the students uploaded
 */
//COMPONENTS
import Navbar from "../Navbar"
import Footer from "../Footer"
import { Button } from "primereact/button"
//REACT
import { useState, useEffect, useRef } from 'react'
import { useParams } from "react-router-dom"
//PRIMEREACT
import { FileUpload } from 'primereact/fileupload';
import { InputTextarea } from "primereact/inputtextarea";
import { InputNumber } from 'primereact/inputnumber';
import { Tooltip } from 'primereact/tooltip';

//axios
import axios from "axios"

//types
type hw = {
    idhomework:number
    fkcourse:number
    title:string
}
type hwstudent = {
    idhwstudent:number
    fkstudent:number
    fkhw:number
    score:number|null
    feedback:string|null
    start:string
    deadline:string
}
type media = {
    idhwmedia:number
    fkhw:number
    media:string
}

type submitions = {
    idsubmition:number
    fkhomework:number
    media:string
    fkstudent:number
}
type studentsumitions = {
    homework_student:hwstudent
    submitions:submitions[]
}
import { useTranslation } from "react-i18next"

function HomeworkDelivery(){
    const [ score , setScore] = useState<number>(0);
    const [ feedback, setFeedback ] = useState<string>('')

    const { idhwstudent, idhw } = useParams();

    const fileUploaderRef = useRef<FileUpload>(null)

    const [ hwStudentInfo, setHwStudentInfo ] = useState<hwstudent>()
    const [ isTeacher, setIsTeacher] = useState<string>("")
    const [ hwInfo, setHwInfo ] = useState<hw>()
    const [ hwMedia, setHwMedia ] = useState<media[]>()
    const [ studentSubmitions, setStudentSubmitions ] = useState<studentsumitions>()

    useEffect(() =>{
        const isTeacher = localStorage.getItem("is_teacher")
        console.log("is Teacher",isTeacher)
        isTeacher ? setIsTeacher(isTeacher): null
        if(isTeacher == "false"){
            Promise.all([
                axios.get(`http://localhost:8000/hw/detail/hwstudent/${idhwstudent}/`),
                axios.get(`http://localhost:8000/hw/detail/homework/${idhw}/`),
                axios.get(`http://localhost:8000/hw/detail/hwmedia-by-hw/${idhw}/`)
            ]).then(([hwStudent,hw,hwmedia])=>{
                setHwStudentInfo(hwStudent.data)
                setHwInfo(hw.data)
                setHwMedia(hwmedia.data)
            })
        }else{
            axios.get(`http://localhost:8000/hw/student-media-to-score/${idhwstudent}/${idhw}/`).then(res =>{
                console.log(res.data)
                setStudentSubmitions(res.data)
            })
        }
    },[])
    
    const userData = new FormData()
    
    function uploadSubmition(event:any){
        
        hwStudentInfo ? userData.append("fkhomework",hwStudentInfo?.fkhw.toString()):null
        userData.append("media",event.files[0])
        hwStudentInfo ? userData.append("fkstudent",hwStudentInfo?.fkstudent.toString()):null
        
        axios.post("http://localhost:8000/hw/create/submition/",userData,{
          headers:{
              'Content-Type': 'multipart/form-data'
        }}).then(res =>{
            console.log(res.data)
            alert("File uploaded, delete it and choose another one if necessary")
        }).catch(err =>{
            console.error(err)
        })

    }
const { t } = useTranslation()
    function sendFeedback(){
        userData.append("score",score.toString())
        userData.append("feedback",feedback)
        score > 69 ? userData.append("passed","true") : userData.append("passed","false")

        axios.patch(`http://localhost:8000/hw/update/hwstudent/${studentSubmitions?.homework_student.idhwstudent}/`,userData).then(res =>{
            console.log(res.data)
            alert("Erfolgereich aktualisiert!")
        }).catch(err =>{
            console.error(err)
            alert("Fehler bei Aktualisierung.")
        })
    }

    return(<>
        <Navbar/>
        <main className="w-screen min-h-screen grid gap-4 md:p-4 place-items-center text-center">
            {(isTeacher == "false" && <><h1 className="text-gray-900 text-2xl col-span-full">{hwInfo?.title}</h1>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 w-full max-w-6xl">

                <div className="flex flex-col gap-4 items-center md:items-start text-center md:text-left">
                    <h2 className="text-gray-900 text-2xl">{t("hwdelivery.score")}: {hwStudentInfo?.score ? hwStudentInfo.score:"Noch nicht bewertet"}</h2>
                    <h2 className="text-gray-900 text-2xl">{t("hwdelivery.feedback")}: {hwStudentInfo?.feedback ? hwStudentInfo.feedback:"Es gibt keine Rückmeldung"}</h2>
                    </div>

                    <div className="flex flex-col gap-4 items-center w-full">
                    <div className="bg-gray-900 grid gap-4 p-4 place-items-center text-center rounded-2xl w-8/12 md:w-full">
                        <h2 className="text-amber-50">{t("hwdelivery.media")}</h2>
                        {hwMedia && hwMedia.map(media => (
                            <a 
                                download 
                                href={media.media}
                                className="text-amber-500"
                            >
                                    {media.media ? media.media.split("/")[5]:undefined}
                            </a>
                        ))}

                    </div>
                    <Tooltip target=".upload" />
                    <FileUpload
                        data-pr-tooltip="Wähl die Dateien einer nach dem anderen."
                        data-pr-position="right"
                        data-pr-at="right+5 top"
                        data-pr-my="left center-2"
                        name="demo[]"
                        customUpload
                        uploadHandler={uploadSubmition}
                        accept="application/pdf,video/mp4,audio/mpeg"
                        maxFileSize={100000000}
                        emptyTemplate={<p className="m-0">{t("hwdelivery.formats")}</p>}
                        className="w-full upload"
                        ref={fileUploaderRef}
                    />
                </div>
            </div></>)}



            {/*all of the above will only be seen by the student, content below will only be see by the teachers */}
            {isTeacher == "true" && (<>
                <div className="bg-gray-900 grid gap-4 p-4 place-items-center text-center rounded-2xl w-11/12 md:w-3/4 lg:w-1/2">
                    <h2 className="text-amber-50">Der Student hat diese Medien hochgeladen:</h2>
                    
                    {studentSubmitions && studentSubmitions.submitions.map(submition => (
                        <a className="text-amber-500" download href={submition.media}>{submition.media.split("/")[3]}</a>
                    ))}
                    {!studentSubmitions && <h1 className="text-white">Keine Medien wurden hochgeladen.</h1>}

                </div>
                <div>
                    <h2 className="text-gray-900">Bewertung der Aufgabe</h2>
                    <InputNumber 
                        inputId="minmax-buttons" 
                        value={score} 
                        onValueChange={(e) => {
                            if (e.value !== null && e.value !== undefined) {
                                setScore(e.value);
                            }
                        }}
                        mode="decimal" 
                        showButtons 
                        min={0} max={100} 
                    />
                </div>
                <div>
                    <h2 className="text-gray-900">Rückmeldung für die Aufgabe</h2>
                    <InputTextarea value={feedback} onChange={(e) => setFeedback(e.target.value)} rows={5} cols={30} />
                </div>
                <Button onClick={sendFeedback} label="Ok"/>
            </>)}
        </main>
        <Footer/>
    </>)
}export default HomeworkDelivery
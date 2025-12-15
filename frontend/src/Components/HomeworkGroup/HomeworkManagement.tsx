/**
 * here teachers will be able to manage each homework of the course,
 * being able to assign each homework to students enrolled in the course
 * as well as stablishing the time students are allowed to fullfill 
 * the task.
 */
//types
type Homework = {
    idhomework:number
    fkcourse:number
    title:string
}
type Students = {
    id:number
    name:null|string
    email:string
}
type Course = {
    course:string
    students:Students[]
}
import { useTranslation } from "react-i18next"
//REACT 
import {useState,useEffect} from 'react'
import { Link, useParams, useNavigate } from 'react-router-dom'
//axios
import axios from 'axios'
//COMPONENTS
import Navbar from "../Navbar"
import Footer from "../Footer"
//PRIMEREACT
import { Accordion, AccordionTab } from "primereact/accordion"
import { Calendar } from "primereact/calendar"
import { Button } from 'primereact/button'
function HomeworkManagement(){
const { t } = useTranslation()
    const { idHw, idCourse } = useParams();
    const [ startDate, setStartDate ] = useState<any>(null)
    const [ finishDate, setFinishDate ] = useState<any>(null)
    
    const nav = useNavigate()

    const [ hw, setHw ] = useState<Homework>()
    const [ course, setCourse ] = useState<Course>()

    useEffect(()=>{
        Promise.all([
           axios.get(`http://localhost:8000/user/get-students-of-course/${idCourse}/`),
           axios.get(`http://localhost:8000/hw/detail/homework/${idHw}/`) 
        ]).then(([courseInfo, hwInfo])=>{
            courseInfo ? setCourse(courseInfo.data) : null
            hwInfo ? setHw(hwInfo.data) : null
        }).catch(err =>{
            console.error(err)
            alert("Error retrieving data.")
        })
    },[])

    async function assignHomework(idStudent:number){
        if(startDate || finishDate){
            
            const res = await fetch("http://localhost:8000/hw/create/hwstudent/",{
                headers: {
                    "Content-Type": "application/json",
                    "Accept": "application/json, text-plain, */*",
                },
                method:'post',
                credentials:"same-origin",

                body: JSON.stringify({
                    fkhw:idHw,
                    fkstudent:idStudent,
                    score:null,
                    feedback:null,
                    start: startDate ? startDate.toISOString().split("T")[0] : null,
                    deadline: finishDate ? finishDate.toISOString().split("T")[0] : null,
                })
            })
            if(res.ok){
                const data = await res.json()
                console.log(data)
            }else{
                console.error(res.status)
                alert("Fehler beim Zuweisung.")
            }
        }else{
            alert("Sie müssen die Daten füllen bevor Sie eine Aufgabe zuweisen.")
        }
    }
    return(<>
        <Navbar/>
        <main className="text-center w-full min-h-[800px] grid place-items-center">
            
            <div className="w-full md:w-3/4 lg:w-1/2 min-h-[300px] p-2 bg-gray-900 rounded-2xl">
                {hw && (<h2 className="text-2xl mb-4 text-amber-50">{hw.title}</h2>)}
                
                <Accordion>
                    <AccordionTab header="Studenten dieses Kurses">
                        <ul>
                            <div className="flex gap-2">
                                {course && course.students.map(student =>(<>
                                    <li><Link to={`/homeworkdelivery/${student.id}/${idHw}`}>{student.email}</Link> | Aufgabe zuweisen:</li>
                                    <input type="checkbox" onClick={()=>assignHomework(student.id)}/>
                                </>))}
                            </div>
                        </ul>
                    </AccordionTab>
                </Accordion>
                
                <div className="w-full min-h-[100px] wrap mt-4">
                    <Calendar
                        placeholder={t("appform.start")}
                        dateFormat="yy/mm/dd"
                        value={startDate}
                        onChange={(e) => {setStartDate(e.value)}}
                    />
                    <Calendar
                        placeholder="Deadline"
                        dateFormat="yy/mm/dd"
                        value={finishDate}
                        onChange={(e) => {setFinishDate(e.value)}}
                    />
                </div>
                
                <Button severity="secondary" onClick={()=>nav("/coursesmanagement")} label="Zurück"/>
            </div>
        </main>
        <Footer/>
    </>)
}export default HomeworkManagement
//This component will work for students and teachers, to see which 
//courses they are involved in and the homework they are assigned to
//(in case of being students) and all the homeworks of the course
//(in case of being teachers)
// REACT
import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
//types
type Homework = {//these are the homeworks by default from the institution
    id:number
    title:string
}
type CourseType = {
    course_id:number
    course_title:string
    level:string
    homeworks:Homework[]
}
type HwInfo = {
    fkhw__idhomework:number
    fkhw__title:string
    idhwstudent:number
}
type HwStudent = {//these are the homewors that were actually assigned to the student
    fkstudent:number
    hw:HwInfo[]
}
//COMPONENTS
import Navbar from "../Navbar"
import Footer from "../Footer"
//PRIMEREACT
import { Accordion, AccordionTab } from "primereact/accordion"
//axios
import axios from 'axios'

function CoursesManagement(){

    const [ courseInfo, setCourseInfo ] = useState<CourseType[]>()
    const [ isTeacher, setIsTeacher  ] = useState<boolean>(false)
    const [hwInfo,setHwInfo] = useState<HwStudent>()

    useEffect(() =>{

        const isTeacher = localStorage.getItem("is_teacher")
        const id = localStorage.getItem("userId")

        if(isTeacher == "true"){
            setIsTeacher(true)
            axios.get(`http://localhost:8000/course/get-courses-of-teacher/${id}/`).then(res =>{
                setCourseInfo(res.data)
            }).catch(err => {
                console.error(err)
                alert("Error retrieving courses.")
            })
        }else{
            axios.get(`http://localhost:8000/hw/student-lsit-homework/${id}/`).then(res =>{
                setHwInfo(res.data)
            }).catch(err =>{
                alert("Error at retrieving your homeworks")
                console.error(err)
            })
        }
    },[])
    
    return(<>
        <Navbar/>
        <main className="h-screen w-full grid place-items-center">
            <div className="bg-gray-900 grid gap-4 p-4 place-items-center text-center rounded-xl w-11/12 md:w-3/4 lg:w-1/2 min-h-[400px]">
            
                <h1 className="text-3xl text-amber-50 font-black">{isTeacher == true ? "Meine Kurse" : "Meine Aufgaben"}</h1>
                {courseInfo && courseInfo.map(course => (
                    <Accordion multiple className="w-full text-6xl md:w-6/12">
                        <AccordionTab header={course.course_title}>
                            <ul>
                                {course.homeworks.map(homework => (
                                    <li>
                                        <Link to = {`/homeworkmanagement/${homework.id}/${course.course_id}`}>
                                            {homework.title}
                                        </Link>
                                    </li>
                                ))}
                            </ul>
                        </AccordionTab>
                    </Accordion>
                ))}


            {/**rendered if is student: */}
                <ul>
                    {hwInfo && hwInfo.hw.map(
                        currenthw =>(
                        <Link to={`/homeworkdelivery/${currenthw.idhwstudent}/${currenthw.fkhw__idhomework}`}><li className='text-amber-50'>
                            {currenthw.fkhw__title}
                        </li></Link>)
                    )}
                </ul>
            </div>

        </main>
        <Footer/>
    </>)
}export default CoursesManagement
/**
 * this component shows the courses 
 * the school offers
 */

//IMAGES
import boy from "../assets/boy-computer.png"
import girl from "../assets/movile-girl.png"
//COMPONENTS
import Navbar from "./Navbar"
import Footer from "./Footer"
//PRIMEREACT
import { Accordion, AccordionTab } from 'primereact/accordion';
import { InputText } from "primereact/inputtext"
//react
import { useEffect, useState } from "react"
//axios
import axios from "axios"
//types
type courses = {
    idcourse:number
    title:string
    level:string
    description:string
    instructions:string
}
type topics = {
    id_topic:number
    name:string
    fk_course:number
}
//others
import { useDebounce } from "./Hooks/DebounceHook";

function EducationOffer(){

    useEffect(()=>{
        Promise.all([
           axios.get("http://localhost:8000/course/get-courses/"),
           axios.get("http://localhost:8000/course/get-topics/") 
        ]).then(([currentCourses, currentTopics])=>{
            currentCourses ? setCourses(currentCourses.data) : null
            currentTopics ? setTopics(currentTopics.data) : null
        }).catch(err =>{
            console.error(err)
            alert("Error retrieving courses.")
        })
    },[])

    const [courses, setCourses] = useState<courses[]>()
    const [topics, setTopics] = useState<topics[]>()
    const [searchTerm, setSearchTerm] = useState<string>('')
    const [filteredCourses, setFilteredCourses] = useState<courses[]|null>(null)

    const debouncedSearch = useDebounce(searchTerm, 400)


    useEffect(() => {
        if (debouncedSearch.trim() === "") {
            courses ? setFilteredCourses(courses) : null
        } else {
            const results = courses?.filter(course =>
                course.title.toLowerCase().includes(debouncedSearch.toLowerCase())
            )
            results ? setFilteredCourses(results): null
        }
    }, [debouncedSearch])

    return(<>
        <Navbar/>
        <main className="grid place-items-center gap-2.5 min-w-screen">
            <div className="block md:hidden">
                <img className="object-cover w-full h-full" src={girl} />
            </div>
            <div className="hidden md:block w-full h-[500px]">
                <img className="object-cover w-full h-full" src={boy} />
            </div>
            
            <InputText 
                className="w-9/12" 
                placeholder="Suchen"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
            />
            
            <div className="flex flex-col w-6/12 sm:9/12">

                {filteredCourses && (
                    filteredCourses.map(course => (<div className="border-amber-100 border-6 m-2">
                        <div className="bg-gray-900  text-white text-center w-full p-4 text-3xl ">
                            {course.title}
                        </div>
                        <Accordion>
                            <AccordionTab header="Ziel">
                                <p className="m-0">
                                    {course.description}
                                </p>
                            </AccordionTab>
                            <AccordionTab header="Themen">
                                <ul>
                                    {topics && topics.map((topic)=>{
                                        if(topic.fk_course == course.idcourse){
                                            return(<li>{topic.name}</li>)
                                        }
                                    })}
                                    
                                </ul>
                            </AccordionTab>
                        </Accordion>
                        <h1 className="p-2 mb-5 text-amber-700">Niveau: {course.level}</h1>
                    </div>))
                )}

                {courses && courses.map((course)=>{return(<>
                    <div className="bg-gray-900 text-white text-center w-full p-4 text-3xl ">
                        {course.title}
                    </div>
                    <Accordion>
                        <AccordionTab header="Ziel">
                            <p className="m-0">
                                {course.description}
                            </p>
                        </AccordionTab>
                        <AccordionTab header="Themen">
                            <ul>
                                {topics && topics.map((topic)=>{
                                    if(topic.fk_course == course.idcourse){
                                        return(<li>{topic.name}</li>)
                                    }
                                })}
                                
                            </ul>
                        </AccordionTab>
                    </Accordion>
                    <h1 className="p-2 mb-5 text-amber-700">Niveau: {course.level}</h1>
                </>)})}

            </div>
        </main>
        <Footer/>
    </>)
}export default EducationOffer
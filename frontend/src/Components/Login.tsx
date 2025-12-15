/**
 * this component allows to:
 * get logged
 * has a child that allows to create an account
 * (enrollment form)
 */
//primereact:
import { Password } from 'primereact/password';
import { InputText } from 'primereact/inputtext';
import { FloatLabel } from "primereact/floatlabel";
import { Button } from 'primereact/button';

//react
import { useRef, useId, useState } from 'react'
import { useNavigate } from 'react-router-dom';

//components
import EnrollmentForm from './ComplementComponents/EnrollmentForm';
import Navbar from './Navbar';
import Footer from './Footer';

//axios
import axios from 'axios'

import { useTranslation } from "react-i18next"
//types
type localstorageType={
  access:string
  refresh:string
  photo:string
  id:number
  is_teacher:boolean
}

function Login(){
    const idEmail = useId()
    const idPassword = useId()

    const navigate = useNavigate()
    
    const [ showLoginForm, setShowLoginForm ] = useState<boolean>(true)
    const [ password, setPassword ] = useState('');
    const loginEmail = useRef<HTMLInputElement>(null)


    function handleSubmit(e:React.FormEvent){
      e.preventDefault()
      apiCall()

    }

    function apiCall(){
      
      const credentials = {
        email:loginEmail.current?.value,
        password:password
      }
      
      axios.post ("http://localhost:8000/user/token/",credentials,{
          headers:{
              'Content-Type': 'multipart/form-data'
          }
      }).then(async response=>{

          const myData:localstorageType = response.data 
          await infoIntoLocalStorage(myData)
          
          alert("Sie sind angemeldet")
          navigate("/")

      }).catch(error=>{
          alert("Ein Fehler ist aufgetreten")
          console.log(error)
      })
    }

    async function infoIntoLocalStorage(data:localstorageType){
      localStorage.setItem("access",data.access)
      localStorage.setItem("refresh",data.refresh)
      localStorage.setItem("userProfileImage",data.photo)
      localStorage.setItem("userId",data.id.toString())
      localStorage.setItem("is_teacher",data.is_teacher.toString())
    }
    const { t } = useTranslation()

return (
  <>
    <Navbar />
    <main className="min-h-screen flex flex-col items-center justify-center p-8">
      {showLoginForm && (
        <div className="flex flex-col items-center gap-4 w-full max-w-sm">
            <h1 className="text-2xl font-bold">{t("login.title")}</h1>

            <form onSubmit={handleSubmit}>
                <FloatLabel  >
                    <InputText required id={idEmail} ref={loginEmail} />
                    <label  htmlFor={idEmail}>E-mail</label>
                </FloatLabel>

                <FloatLabel className='mt-7 mb-7' >
                    <Password required inputId={idPassword} onChange={(e) => setPassword(e.target.value)}/>
                    <label  htmlFor={idPassword}>{t("login.password")}</label>
                </FloatLabel>

                <Button type="submit" className='mt-7' label="Anmelden" onClick={handleSubmit}/>
            </form>

          <Button
            label="Ich habe kein Konto"
            severity="secondary"
            onClick={() => setShowLoginForm(false)}
          />
        </div>
      )}

      {!showLoginForm && (
        <div className="flex flex-col items-center gap-4">
          <EnrollmentForm />
          <Button
            className="ml-6"
            label="Zurück"
            severity="secondary"
            onClick={() => setShowLoginForm(true)}
          />
        </div>
      )}
    </main>
    <Footer />
  </>
);


}export default Login
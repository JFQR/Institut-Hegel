import { createContext, useState, useEffect  } from 'react';

//types
type User = {
    access:string
}

type ContextType={
    existingUser:User | undefined
    logOut:()=>void
    logIn:(token:string)=>void
    getRefresh:()=>void
}

export const GlobalInfoContext = createContext<ContextType | undefined>(undefined);

function ContextProvider({ children }: { children: any }){

    const [ existingUser, setUser ] = useState<User>()

    useEffect(()=>{
        const token:string | null = localStorage.getItem("access")

        if(token){
            setUser({access:token})
            console.log(existingUser)
        }
    },[])
    
    function logOut(){
        localStorage.clear()
    }

    function logIn(token:string){
        localStorage.setItem("access",token)
    }

    function getRefresh(){
        const refresh = localStorage.getItem("refresh")
        return refresh
    }

    return (
        <GlobalInfoContext.Provider value={{ existingUser, logOut, logIn, getRefresh}}>
            {children}
        </GlobalInfoContext.Provider>
    );
}export default ContextProvider
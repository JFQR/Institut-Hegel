//react
import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import './index.css'

//prime react
import { PrimeReactProvider } from 'primereact/api';
import "primereact/resources/themes/saga-orange/theme.css"

//components
import MainPage from './Components/MainPage'
import Login from './Components/Login'
import Evaluation from './Components/Evaluation';
import Travel from './Components/Travel';
import EducationOffer from './Components/EducationalOffer';
import CoursesManagement from './Components/HomeworkGroup/CoursesManagement';
import HomeworkDelivery from './Components/HomeworkGroup/HomeworkDelivery';
import HomeworkManagement from './Components/HomeworkGroup/HomeworkManagement';
import InfoManagement from './Components/InfoManagement';
//context
import GlobalInfoContext from './Components/Context';

import "./i18n.js";

const router = createBrowserRouter([
  {
    path:"/",
    element:<MainPage/>
  },
  {
    path:"/login",
    element:<Login/>
  },
  {
    path:"/evaluation",
    element:<Evaluation/>
  },
  {
    path:"/travel",
    element:<Travel/>
  },
  {
    path:"/educationoffer",
    element:<EducationOffer/>
  },
  {
    path:"/coursesmanagement",
    element:<CoursesManagement/>
  },
  {
    path:"/homeworkdelivery/:idhwstudent/:idhw",
    element:<HomeworkDelivery/>
  },
  {
    path:"/homeworkmanagement/:idHw/:idCourse",
    element:<HomeworkManagement/>
  },
  {
    path:"/infomanagement",
    element:<InfoManagement/>
  },
])


createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <GlobalInfoContext >
      <PrimeReactProvider value={{ ripple: true }}>
          <RouterProvider router={router}/>
      </PrimeReactProvider>
    </GlobalInfoContext>
  </StrictMode>,
)

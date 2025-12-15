> --------------------------Spanish
# Institut Hegel

## Un proyecto de práctica, un sitio web para una escuela online.

Institut Hegel es un sitio para una escuela de alemán online, donde la dinámica es que, ya hay material de estudio y los maestros deberán 
asignar a los alumnos cursos con tareas cada uno (cada tarea deberá tener material de estudio) y podrán calificarlos, así como darles 
retroalimentación.

Como se mencionó, es un proyecto para practicar hecho para implementar nuevas cosas para el desarrollador, como por ejemplo:

* Traducción de un sitio web 
* creación de hooks personalizados
* Uso de Tailwind por primera vez
* Creación de un debaounce Hook

# Cómo empezar a usarlo.
El primer paso sería clonar el proyecto desde github y seguir:
* Instalar Node js: https://nodejs.org/es
* Instalar Python: https://www.python.org/downloads/
* Instalar y configurar appServ y con phpmyadmin crear una base de datos llamada ihegel
* Crear un entorno virtual de python dentro de la carpeta backend
* Ir a la carpeta Scripts del entorno virtual y ejecutar activate
* Regresar a la carpeta backend y ejecutar pip install -r requirements.txt, después ejecutar python manage.py makemigrations y python manage.py migrate
* después, ejecutar python manage.py createsuperuser e ingresar los datos que se demanden

Se recomienda llenar ciertas tablas de la base de datos:
* Crear maestros y enlazarlos con la tabla Course (crear cursos para ésta primero)
* Crear estudiantes y enlazarlos con cursos.
* Añadir archivos a la tabla Hwmedia, pero primero, llenar la tabla Homework.

* Ejecutar python manage.py runserver
* Ir a frontend>clothing y ejecutar npm install y luego npm run dev
* Ir a http://localhost:5173 en un navegador

## Para tener en cuenta:
El director tiene que crear cursos, asignar maestros a éstos, subir archivos 
para los cursos (en lo personal, 
subí archivos pdf cualquiera, solo para provar que se podían descargar) 
y aceptar o rechazar gente (CustomUser tiene un campo llamado is_accepted).

El director de la escuela es el superuser, cree uno antes de hacer lo anterior
mencionado.

> --------------------------English
# Institut Hegel
## A practice project — an online school website

Institut Hegel is a website for an online German school.
The concept is that study material is already available, and teachers can assign students to specific courses that include various homeworks (each homeworks must have its own study material).
Teachers can grade the homeworks and provide feedback to students.

As mentioned, this is a practice project created to implement and test new features and technologies, such as:

* Website translation
* Creation of custom hooks
* First-time use of Tailwind CSS
* Creation of a debaounce Hook
# How to Get Started

* The first step is to clone the project from GitHub and then follow these steps:
* Install Node.js: https://nodejs.org/en
* Install Python: https://www.python.org/downloads/
* Install and configure AppServ, and using phpMyAdmin, create a database named ihegel.
* Create a Python virtual environment inside the backend folder.
* Go to the Scripts folder inside the virtual environment and run activate.

Return to the backend folder and run:
* pip install -r requirements.txt
* python manage.py makemigrations
* python manage.py migrate
* Then create a superuser:
* python manage.py createsuperuser
* 
* and enter the required information.
It's recommended to fill certain fields in the database:
* Create teachers and link them with courses (create courses for this first)
* Create students and link them to courses
* Add files to hwmedia table, first, fill Homework table.
 Start the backend server:
* python manage.py runserver

 Go to frontend folder and run:
* 
* npm install
* npm run dev
* 
 Finally, open your browser and go to:
* http://localhost:5173

## To have in mind:
The headteacher must create the courses, assign teachers to them, upload the media for those courses
(I personally uploaded simple pdf files, just to confim the page worked),
and accept or reject people (CutsomUser has an is_accepted field).

The head teacher is the superuser, once again, make sure to have one before doing the avobe.
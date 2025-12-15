//this hook will take all the punctuation and decide a level for the participant
//react importations
import { useState } from "react"
//types
type AnswerData = {
  value: string
  correct: boolean
  points:number | undefined
};

export type Answers = {
  [key: string]: AnswerData;
};
function EvaluationHook(){
    
    const [ niveu, setNiveu ] = useState<string>('')

    function preEvaluation(answers:Answers){

        let noLevel = ""

        if(answers.a2?.correct && answers.b1?.correct){
            setNiveu("B2")
            noLevel = "level decided"
        }
        if(answers.a2?.correct && answers.b1?.correct && answers.b2?.correct){
            setNiveu("C1")
            noLevel = "level decided"
        }
        if(answers.b1?.correct && answers.b2?.correct && answers.c1?.correct){
            setNiveu("C2")
            noLevel = "level decided"
        }

        if (noLevel !== "") {
            return;
        }

        handlePoints(answers);
    }

    function handlePoints(answers:Answers){
        let myPoints: number = 0
        Object.entries(answers).forEach(([key,value])=>{
            if(value.points){
                myPoints += value.points
            }  
        })

        let level = "";
        if (myPoints === 1 || myPoints < 1) level = "A1";
        else if (myPoints === 2) level = "A2";
        else if (myPoints >= 3 && myPoints <= 7) level = "B1";
        else if (myPoints >= 8 && myPoints <= 15) level = "B2";
        else if (myPoints >= 16 && myPoints <= 31) level = "C1";
        else if (myPoints > 32) level = "C2";

        if (level) setNiveu(level);
    }

    return{niveu, preEvaluation}

}export default EvaluationHook
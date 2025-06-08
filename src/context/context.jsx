import { createContext, useState } from 'react';
import Chat from '../config/gemini';

export const Context = createContext();

const ContextProvider = (props) => {

    const [input, setInput] = useState("");
    const [recentprompts, setRecentPrompts] = useState("");
    const [previousprompts, setPreviousPrompts] = useState([]);
    const [showResult, setShowResult] = useState(false);
    const [loading, setLoading] = useState(false);
    const [resultData, setResultData] = useState("");

    const delayPara = (index, nextWord) => {
        setTimeout(function(){
            setResultData(prev=>prev+nextWord);
        }, 75*index)
    }

    const newChat = ()=>{
        setLoading(false)
        setShowResult(false)
    }

    const onSent = async (prompt) => {

        setResultData("")
        setLoading(true);
        setShowResult(true);
        let response;
        if(prompt !== undefined){
            response = await Chat(prompt);
            setRecentPrompts(prompt)
        }
        else{
            setPreviousPrompts(prev=>[...prev, input]);
            setRecentPrompts(input);
            response = await Chat(input)
        }
        
        console.log(response);
        
        let newResponseArray = response.split(" ");
        for(let i=0; i<newResponseArray.length; i++){
            const nextWord=newResponseArray[i];
            delayPara(i, nextWord+" ");
        }

        setLoading(false);
        setInput("");
    }
    
    const contextValue = {
        previousprompts,
        setPreviousPrompts,
        onSent,
        setRecentPrompts,
        recentprompts,
        showResult,
        loading,
        resultData,
        input,
        setInput,
        newChat
    }; 

    return (
        <Context.Provider value={contextValue}>
            {props.children}
        </Context.Provider>
    );

}

export default ContextProvider;

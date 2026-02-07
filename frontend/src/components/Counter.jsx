import {useState} from 'react'

const Counter = () =>{
    const[counter, setCounter] = useState(0);
    const increaseByOne = () => setCounter(counter+1);
    const setToZero = () => setCounter(0);

    return(
        <div>
            <button onClick={increaseByOne}>
                +
            </button>
            <button onClick={setToZero}>
                reset
            </button>

        </div>
    )
}
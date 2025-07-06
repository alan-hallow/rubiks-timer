import { useState, useRef } from "react";

function Timer() {
  const startTimeRef = useRef(0)
  const intervalRef = useRef(0)
  const [isRunning, setIsRunning] = useState(false)
  const [finalTime, setFinalTime] = useState(0);
  const [startInspectionTime, setStartInspectionTime] = useState(0);
  const [endInspectionTime, setEndInspectionTime] = useState(0);

  const inspectionStart = () => {
    setStartInspectionTime(Date.now());
  };

  const inspectionEnd = () => {
    setEndInspectionTime(Date.now() - startInspectionTime);
  };

  const startTimer = () => {
    startTimeRef.current = Date.now();
    intervalRef.current = setInterval(()=>{
      setFinalTime(Date.now() - startTimeRef.current)
    })
    setIsRunning(true)
    inspectionEnd();
  };

  const endTimer = () => {
    if (isRunning === true){
      clearInterval(intervalRef.current)
      setIsRunning(false)
    }
  };
  let seconds = Math.floor(finalTime / 1000);
  let milliseconds = finalTime % 1000;
  return (
    <>
      <h1 className="timer">
        00:{seconds.toString().padStart(2,'0')}:{milliseconds.toString().padStart(3,'0')}
      </h1>
      {/* <p>endInspection: {endInspectionTime}</p> */}
      <button onClick={inspectionStart}>Start Inspection</button>
      <button onClick={startTimer}>Start Timer</button>
      <button onClick={endTimer}>Stop Timer</button>
    </>
  );
}
export default Timer;

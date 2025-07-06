import { useState, useRef, useEffect } from "react";

function Timer() {
  const startTimeRef = useRef(0);
  const intervalRef = useRef(null);

  const [mode, setMode] = useState("idle");
  const modeRef = useRef("idle");

  // const [isRunning, setIsRunning] = useState(false);
  const [finalTime, setFinalTime] = useState(0);
  const [startInspectionTime, setStartInspectionTime] = useState(0);
  const [endInspectionTime, setEndInspectionTime] = useState(0);

  const inspectionStart = () => {
    setStartInspectionTime(Date.now());
    console.log("Inspection Started");
  };

  const inspectionEnd = () => {
    const time = Date.now() - startInspectionTime;
    setEndInspectionTime(time);
    console.log("Inspection Ended", time);
  };

  const startTimer = () => {
    if (intervalRef.current) return;
    startTimeRef.current = Date.now();
    intervalRef.current = setInterval(() => {
      setFinalTime(Date.now() - startTimeRef.current);
    }, 100);
    // setIsRunning(true);
    inspectionEnd();
    console.log("Timer started");
  };

  const endTimer = () => {
    if (!intervalRef.current) return;

    clearInterval(intervalRef.current);
    intervalRef.current = null;
    console.log("Timer stopped");
    // setIsRunning(false);
    modeRef.current = "idle";
    setMode("idle");
  };

  const keyDown = (event: KeyboardEvent) => {
    if (event.code !== "Space") return;
    if (modeRef.current === "idle") {
      inspectionStart();
      modeRef.current = "inspection";
      setMode("inspection");
    } else if (modeRef.current === "inspection") {
      startTimer();
      modeRef.current = "run";
      setMode("run");
    } else if (modeRef.current === "run") {
      endTimer();
    }
  };

  useEffect(() => {
    window.addEventListener("keydown", keyDown);
    return () => {
      window.removeEventListener("keydown", keyDown);
    };
  }, []);

  let seconds = Math.floor(finalTime / 1000);
  let milliseconds = finalTime % 1000;

  return (
    <>
      <h1 className="timer">
        00:{seconds.toString().padStart(2, "0")}:
        {milliseconds.toString().padStart(3, "0")}
      </h1>
      <p>endInspection: {endInspectionTime}</p>
      <button onClick={inspectionStart}>Start Inspection</button>
      <button onClick={startTimer}>Start Timer</button>
      <button onClick={endTimer}>Stop Timer</button>
    </>
  );
}
export default Timer;

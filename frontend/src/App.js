import React, { useState, useRef, useEffect } from 'react';

function App () {
  const [timeElapsed, setTimeElapsed] = useState(0);
  const [phase, setPhase] = useState('idle');
  const [inspectionTimeLeft, setInspectionTimeLeft] = useState(15);
  const intervalRef = useRef(null);
  const startRef = useRef(null);
  const inspectionStartRef = useRef(null);
  const inspectionIntervalRef = useRef(null);
  

  const handleStartTimer = () => {
    clearInterval(inspectionIntervalRef.current);
    startRef.current = Date.now();
    intervalRef.current = setInterval(() => {
      setTimeElapsed(Date.now() - startRef.current);
    }, 1);
    setPhase('timing');
  };
  

  const handleStopTimer = () => {
    clearInterval(intervalRef.current);
    setPhase('done');
  }


  const reset = () => {
    setTimeElapsed(0);
    setInspectionTimeLeft(15);
    setPhase('idle');
  }

  const handleKeyUp = (event) => {
    if (event.code !== 'Space') return;

    if (phase === 'idle') {
      inspectionStartRef.current = Date.now();
      setPhase('inspecting');
      setInspectionTimeLeft(15)

      inspectionIntervalRef.current = setInterval(() => {
        const elapsed = Math.floor((Date.now() - inspectionStartRef.current) / 1000 );
        const remaining = 15 - elapsed;
        setInspectionTimeLeft(remaining);
        if (remaining <= 0 ) {
          clearInterval(inspectionIntervalRef.current);
          setPhase('idle');
        }
      }, 1000);
    } else if (phase === 'inspecting') {
      const inspectionDuration = (Date.now() - inspectionStartRef.current) / 1000;
      if (inspectionDuration < 15) {
        handleStartTimer();
      } else{
        setPhase('idle');
      }
    } 
  };

  const handleKeyDown = (event) => {
    if (event.code !== 'Space') return;

    if (phase === 'timing') {
      handleStopTimer();
    } else if (phase === 'done') {
      reset();
    }
  }


  useEffect (() => {
    window.addEventListener('keyup', handleKeyUp);
    window.addEventListener('keydown', handleKeyDown);
    return () => {
      window.removeEventListener('keyup', handleKeyUp);
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [phase])

  const seconds = Math.floor(timeElapsed / 1000);
  const milliseconds = timeElapsed % 1000;


	return(
		<div className = "wholeBody">
      {phase=== 'idle' && (
        <p>0:000</p>)}
      {phase === 'timing' && (
      <p>{seconds}</p>)}
      {phase === 'done' && (
      <p>{seconds}:{milliseconds.toString().padStart(3, '0')}</p>)}
      {phase === 'inspecting' && (
      <p>{inspectionTimeLeft}</p>)}
		</div>
	)
}


export default App;

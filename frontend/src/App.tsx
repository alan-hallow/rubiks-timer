import { useState, useRef, useEffect } from "react";
import Scramble from "./components/scramble";

function App() {
  const [timeElapsed, setTimeElapsed] = useState(0);
  const [phase, setPhase] = useState<"idle" | "inspecting" | "timing" | "done">(
    "idle"
  );
  const [inspectionTimeLeft, setInspectionTimeLeft] = useState(15);

  const intervalRef = useRef<number | null>(null);
  const startRef = useRef<number | null>(null);
  const inspectionStartRef = useRef<number | null>(null);
  const inspectionIntervalRef = useRef<number | null>(null);

  async function saveTime(time: number) {
    console.log("Sending time:", time);

    try {
      const res = await fetch("http://localhost:5000/api/times", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ time }),
      });

      const data = await res.json();
      console.log("Time saved:", data);
    } catch (err) {
      console.error("Failed to save time:", err);
    }
  }

  const handleStartTimer = () => {
    if (inspectionIntervalRef.current)
      clearInterval(inspectionIntervalRef.current);

    startRef.current = Date.now();
    intervalRef.current = setInterval(() => {
      if (startRef.current) {
        setTimeElapsed(Date.now() - startRef.current);
      }
    }, 10); // 1ms is too granular
    setPhase("timing");
  };

  const handleStopTimer = () => {
    if (intervalRef.current) clearInterval(intervalRef.current);
    setPhase("done");
    if (startRef.current) {
      const finalTime = Date.now() - startRef.current;
      setTimeElapsed(finalTime); // for display
      saveTime(finalTime); // for backend
    }
  };

  const reset = () => {
    setTimeElapsed(0);
    setInspectionTimeLeft(15);
    setPhase("idle");
  };

  const handleKeyUp = (event: KeyboardEvent) => {
    if (event.code !== "Space") return;

    if (phase === "idle") {
      inspectionStartRef.current = Date.now();
      setPhase("inspecting");
      setInspectionTimeLeft(15);

      inspectionIntervalRef.current = setInterval(() => {
        if (!inspectionStartRef.current) return;
        const elapsed = Math.floor(
          (Date.now() - inspectionStartRef.current) / 1000
        );
        const remaining = 15 - elapsed;
        setInspectionTimeLeft(remaining);
        if (remaining <= 0) {
          clearInterval(inspectionIntervalRef.current!);
          setPhase("idle");
        }
      }, 1000);
    } else if (phase === "inspecting") {
      const inspectionDuration =
        (Date.now() - (inspectionStartRef.current ?? 0)) / 1000;
      if (inspectionDuration < 15) {
        handleStartTimer();
      } else {
        setPhase("idle"); // Optional: mark as DNF instead
      }
    }
  };

  const handleKeyDown = (event: KeyboardEvent) => {
    if (event.code !== "Space") return;

    if (phase === "timing") {
      handleStopTimer();
    } else if (phase === "done") {
      reset();
    }
  };

  useEffect(() => {
    window.addEventListener("keyup", handleKeyUp);
    window.addEventListener("keydown", handleKeyDown);
    return () => {
      window.removeEventListener("keyup", handleKeyUp);
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [phase]);

  const seconds = Math.floor(timeElapsed / 1000);
  const milliseconds = timeElapsed % 1000;

  return (
    <div className="wholeBody">
      {phase === "done" && <Scramble />}
      {phase === "idle" && <p>0:000</p>}
      {phase === "timing" && <p>{seconds}</p>}
      {phase === "done" && (
        <p>
          {seconds}:{milliseconds.toString().padStart(3, "0")}
        </p>
      )}
      {phase === "inspecting" && <p>{inspectionTimeLeft}</p>}
    </div>
  );
}

export default App;

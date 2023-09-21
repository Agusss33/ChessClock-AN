import React, { useState, useEffect } from "react";
import Swal from "sweetalert2";

export const ChessClock = ({ min1 = 0, sec1 = 20, min2 = 0, sec2 = 20 }) => {
  const [running1, setRunning1] = useState(false);
  const [running2, setRunning2] = useState(false);
  const [gameOver, setGameOver] = useState(false);
  const [[m1, s1], setTime1] = useState([min1, sec1]);
  const [[m2, s2], setTime2] = useState([min2, sec2]);
  const [newMin1, setNewMin1] = useState(min1);
  const [newSec1, setNewSec1] = useState(sec1);
  const [newMin2, setNewMin2] = useState(min2);
  const [newSec2, setNewSec2] = useState(sec2);
  const [increment1, setIncrement1] = useState(0);
  const [increment2, setIncrement2] = useState(0);
  const [paused, setPaused] = useState(false);
  const [showSettingsModal, setShowSettingsModal] = useState(false);

  const Clock1 = () => {
    if ((paused && !gameOver) || (!running1 && !gameOver)) return;
    if (!running1 || gameOver) return;
    if (m1 === 0 && s1 === 0) {
      setGameOver(true);
    } else if (s1 === 0) {
      setTime1([m1 - 1, 59]);
    } else {
      setTime1([m1, s1 - 1]);
    }
    
    const isCountdown = m1 === 0 && s1 === 15;
    if (isCountdown) {
      setTimeout(() => {
        Swal.fire({
          text: "15 seconds left!",
          timer: 1000,
          showConfirmButton : false,
          closeOnClickOutside: false
          })
      });
    }
  };
  
  const Clock2 = () => {
    if ((paused && !gameOver) || (!running2 && !gameOver)) return;
    if (!running2 || gameOver) return;
    if (m2 === 0 && s2 === 0) {
      setGameOver(true);
    } else if (s2 === 0) {
      setTime2([m2 - 1, 59]);
    } else {
      setTime2([m2, s2 - 1]);
    }

    const isCountdown = m2 === 0 && s2 === 15;
    if (isCountdown) {
      setTimeout(() => {
        Swal.fire({
          text: "15 seconds left!",
          timer: 1000,
          showConfirmButton : false,
          closeOnClickOutside: false
          })
      });
    }  
  };

  const reset = () => {
    setTime1([parseInt(min1), parseInt(sec1)]);
    setTime2([parseInt(min2), parseInt(sec2)]);
    setRunning1(false);
    setRunning2(false);
    setGameOver(false);
  };

  const handleSettingsSubmit = () => {
    setTime1([parseInt(newMin1), parseInt(newSec1)]);
    setTime2([parseInt(newMin2), parseInt(newSec2)]);
    setIncrement1(parseInt(increment1));
    setIncrement2(parseInt(increment2));
    setShowSettingsModal(false);
  };

  useEffect(() => {
    const timerID = setInterval(() => Clock1(), 1000);
    return () => clearInterval(timerID);
  });

  useEffect(() => {
    const timerID = setInterval(() => Clock2(), 1000);
    return () => clearInterval(timerID);
  });

  return (
    <div className="chessClock">
      <div className="split left">
        <div className="centered">
          <p>{`${m1.toString().padStart(2, "0")}:${s1.toString().padStart(2, "0")}`}</p>
        </div>
      </div>
      <div className="split right">
        <div className="centered">
          <p>{`${m2.toString().padStart(2, "0")}:${s2.toString().padStart(2, "0")}`}</p>
        </div>
      </div>

      <div className="split2">
        <div className="buttons">
        <button className="btn" onClick={() => {
            if (!running1 && !running2) {
              setRunning1(true);
              setRunning2(false);
              setTime1([m1, s1 + increment1]);
              setGameOver(false);
            } else if (running1 && !running2) {
              setRunning1(false);
              setRunning2(true);
              setTime2([m2, s2 + increment2]);
              setGameOver(false);
            } else if (!running1 && running2) {
              setRunning1(true);
              setRunning2(false);
              setTime1([m1, s1 + increment1]);
              setGameOver(false);
            }
          }}>
            {!running1 && !running2 ? "Start" : running1 && !running2 ? "Black" : !running1 && running2 ? "White" : undefined}
          </button>
          <button className="btn" onClick={() => reset()}>Restart</button>
          <button className="btn" onClick={() => setPaused(!paused)}>
             {paused ? 'Resume ' : 'Pause '}
          </button>

          <button
            className="btn"
            onClick={() => setShowSettingsModal(true)}
          >
            Settings
          </button>
        </div>
      </div>

      {showSettingsModal && ( 
        <div className="settings-modal">
          <form onSubmit={handleSettingsSubmit}>
            <label>
              White Clock:
              <h6>Minutes</h6>
              <input
                type="text"
                maxLength={2}
                value={newMin1}
                onChange={(e) => setNewMin1(e.target.value)}
              />
              <h6>Seconds</h6>
              <input
                type="text"
                maxLength={2}
                value={newSec1}
                onChange={(e) => setNewSec1(e.target.value)}
              />
            </label>
            <label>
              Black Clock:
              <h6>Minutes</h6>
              <input
                type="text"
                maxLength={2}
                value={newMin2}
                onChange={(e) => setNewMin2(e.target.value)}
              />
              <h6>Seconds</h6>
              <input
                type="text"
                maxLength={2}
                value={newSec2}
                onChange={(e) => setNewSec2(e.target.value)}
              />
            </label>
            <label>
               Increment Clock1:
              <h6>Seconds</h6>
              <input
                 type="text"
                  maxLength={2}
                  value={increment1}
                  onChange={(e) => setIncrement1(e.target.value)}
              />
            </label>
            <label>
               Increment Clock2:
              <h6>Seconds</h6>
              <input
                type="text"
                maxLength={2}
                value={increment2}
                onChange={(e) => setIncrement2(e.target.value)}
              />
            </label>
            <button type="submit">Save</button>
          </form>
        </div>
      )}

      <div className="hidden">
        {gameOver && m1 === 0 && s1 === 0 && (Swal.fire("Black Wins!")) && reset()}
        {gameOver && m2 === 0 && s2 === 0 && (Swal.fire("White Wins!")) && reset()}
      </div>
    </div>
  );
};

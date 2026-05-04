import './SuperToaster.scss';
import {Supertoaster as ToasterModel} from '../../models/toaster';
import { useEffect, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { TOAST_COLORS as toastsStatus } from '../../config/colors.js';
import { AVAILABLE_COLORS as colors } from '../../config/colors';

const MIN_TIME = 0;
const MAX_TIME = 60;
const MIN_TEMPERATURE = 200;
const MAX_TEMPERATURE = 500;

const SuperToaster = ({shown}) => {
  const {t} = useTranslation();

  const [superToaster] = useState(new ToasterModel())
  const [isShown, setIsShown] = useState(false);
  const [temperature, setTemperature] =  useState(superToaster.temperature);
  const [time, setTime] = useState(superToaster.time);
  const [isReady, setIsReady] = useState(false);
  const [isToasting, setIsToasting] = useState(false);
  const [currentStatus, setCurrentStatus] = useState("untoasted");
  const [color, setColor] = useState("silver");
  const toastTimeoutRef = useRef(null);
  const adjustDelayRef = useRef(null);
  const adjustIntervalRef = useRef(null);

  const increaseTemp = () => {
    if(superToaster.temperature >= MAX_TEMPERATURE) return;

    superToaster.temperature += 10;
    setTemperature(superToaster.temperature);
  }

  const decreaseTemp = () => {
    if(superToaster.temperature <= MIN_TEMPERATURE) return;

    superToaster.temperature -= 10;
    setTemperature(superToaster.temperature);
  }

  const increaseTime = () => {
    if(superToaster.time >= MAX_TIME) return;

    superToaster.time += 1;
    setTime(superToaster.time);
  }

  const decreaseTime = () => {
    if(superToaster.time <= MIN_TIME) return;

    superToaster.time -= 1;
    setTime(superToaster.time);
  }

    const handleStart = (time) => {
      if(isToasting){
        console.error("Toaster is already toasting");
        return;
      }

      if(time < MIN_TIME || time > MAX_TIME){
        console.error("Time must be between 0 and 60 minutes");
        return;
      }

      setIsToasting(true);
      setIsReady(false);
      superToaster.toast();

      const toastDuration = Math.max(time, 0) * 1000;
      toastTimeoutRef.current = setTimeout(() => {
        setIsToasting(false);

        superToaster.putOut();
        const finalResult = superToaster.stop();
        const toastPayLoad = {
          status: superToaster.toastsStatus,
          time_minutes: superToaster.current_time,
          toasts_amount: superToaster.toastsAmount,
          temperature: superToaster.temperature
        }
        saveToastData(toastPayLoad);
        setCurrentStatus(finalResult);
        setIsReady(true);
      }, toastDuration)
  }

    const saveToastData = async (data) => { //Speichert die Daten vom letzten Toastversuch und schickt in Datenbank
      try {
      const response = await fetch("/api/toasts", {
        method: "POST",
        headers: { "Content-Type": "application/json"},
        body: JSON.stringify({
          status: data.status,
          time_minutes: data.time_minutes,
          toasts_amount: data.toasts_amount,
          temperature: data.temperature
        })
      })
      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error || `Request failed with status ${response.status}`);
      }

      console.log(result)
      console.log("Data saved to DB");
    } catch (e) {
      console.error("Save failed", e);
    }
  }

  const handleStop = () => {
    if(!isToasting) return;


    clearTimeout(toastTimeoutRef.current);
    superToaster.putOut();
    const finalResult = superToaster.stop();
    setCurrentStatus(finalResult);
    const toastPayLoad = {
      status: superToaster.toastsStatus,
      time_minutes: superToaster.current_time,
      toasts_amount: superToaster.toastsAmount,
      temperature: superToaster.temperature
    }
    saveToastData(toastPayLoad);
    setIsToasting(false);
    setIsReady(true);
  }

  const startAdjusting = (action) => { //ermöglicht das kontinuierliche Erhöhen/Verringern der Werte durch Gedrückhalten der Maustaste (Long Press)
    if(isToasting) return;

    action();

    adjustDelayRef.current = setTimeout(() => {
      adjustIntervalRef.current = setInterval(() => {
        action()
      }, 100)
    }, 500)
  }

  const stopAdjusting = () => {
    clearTimeout(adjustDelayRef.current);
    clearInterval(adjustIntervalRef.current);

  }

  const changeColor = (color) => {
    if(isToasting) return;

    superToaster.color = color.name;
    setColor(color.hex);
  }



  useEffect(() => {
    if(shown){
      const timer = setTimeout(() => {
        setIsShown(true);
      }, 10)
      return () => clearTimeout(timer);
    } else {
      setIsShown(false);
    }
  }, [shown])

  useEffect(() => {
    const handleGlobalMouseUp = () => {
      clearTimeout(adjustDelayRef.current);
      clearInterval(adjustIntervalRef.current);
    };

    window.addEventListener("mouseup", handleGlobalMouseUp);

    return () => window.removeEventListener('mouseup', handleGlobalMouseUp);
  }, [])



  return (
    <>
    <div className="colorpicker">
      {colors.map(color => (
        <div 
          key={color.name} 
          className={`color ${isToasting ? 'disabled' : ''}`}
          style={{ backgroundColor: color.hex }} 
          onClick={() => changeColor(color)}
        />
      ))}
    </div>
      <div className={`super-toaster ${isShown ? 'shown' : ''}`} style={{backgroundColor: `${color}`}}> 
        <div className="silvertop"></div>
        <h1 className="brand-name">Johnny Silvertoast</h1>
        <div className="controls">
          <div className="temp-display">
            {

              temperature === 200 
              ? <p className="display-text">SYSTEM_READY</p>
              : temperature >= 500
              ? <p className='display-text danger-glitch' data-text="WAKE_UP_SAMURAI">CRIT_OVERHEAT_ERR</p>
              : <p className='display-text digit'>{temperature}°</p> 
            }
            <div className="display-controls">
              <button className="display-btn" disabled={isToasting || temperature >= MAX_TEMPERATURE} onMouseDown={() => startAdjusting(increaseTemp)} onMouseUp={stopAdjusting}>+</button>
              <button className="display-btn" disabled={isToasting || temperature <= MIN_TEMPERATURE} onMouseDown={() => startAdjusting(decreaseTemp)} onMouseUp={stopAdjusting}>-</button>
            </div>
          </div>

          <div className="time-display">
            {
              time === 0 
              ? <p className="display-text">SET_TIME</p>
              : time >= 60
              ? <p className="display-text danger-glitch" data-text="EAT_RECYCLED">OVERHEAT_RISK</p>
              : <p className='display-text digit'>{time} min</p>
            }
            <div className="display-controls">
              <button className="display-btn" disabled={isToasting || time >= MAX_TIME} onMouseDown={() => startAdjusting(increaseTime)} onMouseUp={stopAdjusting} onMouseLeave={stopAdjusting}>+</button>
              <button className="display-btn" disabled={isToasting || time <= MIN_TIME} onMouseDown={() => startAdjusting(decreaseTime)} onMouseUp={stopAdjusting} onMouseLeave={stopAdjusting}>-</button>
            </div>
          </div>
          <button className="btn" disabled={isToasting} onClick={() => handleStart(superToaster.time)}>{t('start_btn')}</button>
          <button className="btn stop" disabled={!isToasting} onClick={handleStop}>{t('stop_btn')}</button>
        </div>
        <div className={`toast ${isReady ? 'ready' : ''}`} style={{backgroundColor: `${toastsStatus[currentStatus]}`}}></div>
      </div>
    </>
  )
}

export default SuperToaster

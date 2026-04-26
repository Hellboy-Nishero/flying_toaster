import './SuperToaster.scss';
import {Supertoaster as ToasterModel} from '../../models/toaster';
import { useEffect, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { TOAST_COLORS as toastsStatus } from '../../config/colors.js';

const SuperToaster = ({shown}) => {
  const {t} = useTranslation();

  const [superToaster] = useState(new ToasterModel())
  const [isShown, setIsShown] = useState(false);
  const [temperature, setTemperature] =  useState(superToaster.temperature);
  const [time, setTime] = useState(superToaster.time);
  const [isReady, setIsReady] = useState(false);
  const [isToasting, setIsToasting] = useState(false);
  const [isVisible, setIsVisible] = useState(false);
  const [currentStatus, setCurrentStatus] = useState("untoasted");
  const timerRef = useRef(null);
  const delayRef = useRef (null);

  const increaseTemp = () => {
    superToaster.temperature += 10;
    setTemperature(superToaster.temperature);
  }

  const decreaseTemp = () => {
    superToaster.temperature -= 10;
    setTemperature(superToaster.temperature);
  }

  const increaseTime = () => {
    superToaster.time += 1;
    setTime(superToaster.time);
  }

  const decreaseTime = () => {
    superToaster.time -= 1;
    setTime(superToaster.time);
  }

    const handleStart = (time) => {
      if(isToasting){
        console.error("Toaster is already toasting");
        return;
      }

      setIsToasting(true);
      setIsReady(false);
      delayRef.current = time * 1000;
      superToaster.toast();

      setTimeout(() => {
        setIsToasting(false);

        superToaster.putOut();
        const finalResult = superToaster.stop();
        setCurrentStatus(finalResult);
        setIsReady(true);
      }, delayRef.current)
  }

  const handleStop = () => {
    if(!isToasting) return;
    clearTimeout(delayRef.current);
    const finalResult = superToaster.stop();
    setCurrentStatus(finalResult);
    setIsToasting(false);
    setIsReady(true);
  }

  const startAdjusting = (action) => { //ermöglicht das kontinuierliche Erhöhen/Verringern der Werte durch Gedrückhalten der Maustaste (Long Press)
    action();

    delayRef.current = setTimeout(() => {
      timerRef.current = setInterval(() => {
        action()
      }, 100)
    }, 500)
  }

  const stopAdjusting = () => {
    clearTimeout(delayRef.current);
    clearInterval(timerRef.current);

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

  useEffect(() => {}, [superToaster])


  useEffect(() => {
    const handleGlobalMouseUp = () => stopAdjusting();

    window.addEventListener("mouseup", handleGlobalMouseUp);

    return () => window.removeEventListener('mouseup', handleGlobalMouseUp);
  }, [])


  return (
    <div className={`super-toaster ${isShown ? 'shown' : ''}`} style={{backgroundColor: `${superToaster.color}`}}> 
      <div className="silvertop"></div>
      <h1 className="brand-name">Johnny Silvertoast</h1>
      <div className="controls">
        <div className="temp-display">
          {

            superToaster.temperature === 200 
            ? <p className="display-text">SYSTEM_READY</p>
            : superToaster.temperature >= 500
            ? <p className='display-text danger-glitch' data-text="WAKE_UP_SAMURAI">CRIT_OVERHEAT_ERR</p>
            : <p className='display-text digit'>{superToaster.temperature}°</p> 
          }
          <div className="display-controls">
            <button className="display-btn" onMouseDown={() => startAdjusting(increaseTemp)} onMouseUp={stopAdjusting}>+</button>
            <button className="display-btn" onMouseDown={() => startAdjusting(decreaseTemp)} onMouseUp={stopAdjusting}>-</button>
          </div>
        </div>

        <div className="time-display">
          {
            superToaster.time === 0 
            ? <p className="display-text">SET_TIME</p>
            : superToaster.time >= 60
            ? <p className="display-text danger-glitch" data-text="EAT_RECYCLED">OVERHEAT_RISK</p>
            : <p className='display-text digit'>{superToaster.time} min</p>
          }
          <div className="display-controls">
            <button className="display-btn" onMouseDown={() => startAdjusting(increaseTime)} onMouseUp={stopAdjusting} onMouseLeave={stopAdjusting}>+</button>
            <button className="display-btn" onMouseDown={() => startAdjusting(decreaseTime)} onMouseUp={stopAdjusting} onMouseLeave={stopAdjusting}>-</button>
          </div>
        </div>
        <button className="btn" onClick={() => handleStart(superToaster.time)}>{t('start_btn')}</button>
        <button className="btn stop" onClick={handleStop}>{t('stop_btn')}</button>
      </div>
      <div className={`toast ${isReady ? 'ready' : ''}`} style={{backgroundColor: `${toastsStatus[currentStatus]}`}}></div>
    </div>
  )
}

export default SuperToaster
import './Toaster.scss';
import { useTranslation } from 'react-i18next';
import { useState, useEffect } from 'react';
import { Toaster as ToasterModel} from '../../models/toaster.js';
import { TOAST_COLORS as toastsStatus } from '../../config/colors.js';

const Toaster = () => {
  const { t } = useTranslation();
  const [value, setValue] = useState(0);
  const [angle, setAngle] = useState(0);
  const [toaster] = useState(new ToasterModel());
  const [isReady, setIsReady] = useState(false);
  const [isToasting, setIsToasting] = useState(false);


  const handleKnobChange = (e) => { // Funktion, die aufgerufen wird, wenn sich der Wert des Knobs ändert. Sie aktualisiert den Wert und den Winkel des Knobs basierend auf der neuen Position.
    const val = e.target.value;
    setValue(val);
    setAngle((val / 60) * 270);
  }

  const handleStart = (time) => {
    
    if(isToasting){
      console.error("Toaster is already toasting");
      return;
    }

    setIsToasting(true);
    setIsReady(false);
    const delay = time * 1000;

    setTimeout(() => {
      setIsToasting(false);
      toaster.toast();
      toaster.putOut();
      setIsReady(true);
    }, delay)
  }


  useEffect(() => {
    const handler = setTimeout(() => {
      toaster.time = value; // Setzt die Zeit im Toaster-Modell auf den aktuellen Wert des Knobs mit einer Verzögerung von 1 Sekunde, um die Aktualisierung zu simulieren.
    }, 1000)

    return () => clearTimeout(handler);
  }, [value]);


  return (
    <div className="toaster" style={{backgroundColor: toaster.color}}>
      {/* <p>{t('welcome')}</p> */}
      <div className={`handle ${isToasting? 'down' : ''}`}></div>
      <div className="controls">
        <div className="knobContainer">
            
            <div className="marks">
                <span className="mark mark-0">0</span>
                <span className="mark mark-15">15</span>
                <span className="mark mark-30">30</span>
                <span className="mark mark-45">45</span>
                <span className="mark mark-60">60</span>
            </div>


            <div className="knob" style={{transform: `rotate(${angle}deg)`}}>
                <div className="pointer"></div>
            </div>

            <input 
                type="range"
                min="0"
                max="60"
                value={value}
                className='hiddenRange'
                onChange={handleKnobChange}
                disabled={isToasting}
            />
        </div>

        <div className={`button-socket ${isToasting ? 'disabled' : ''}`} onClick={() => handleStart(value)}>
            <button className="start-btn">
                {t('start_btn')}
            </button>
        </div>
      </div>

      <div className={`toast ${isReady ? 'ready' : ''}`} style={{backgroundColor: `${toastsStatus[toaster.toastsStatus]}`}}></div>
    </div>
  )
}

export default Toaster
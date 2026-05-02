import './Toaster.scss';
import { useTranslation } from 'react-i18next';
import { useState, useEffect } from 'react';
import { Toaster as ToasterModel} from '../../models/toaster.js';
import { TOAST_COLORS as toastsStatus } from '../../config/colors.js';
import { AVAILABLE_COLORS as colors } from '../../config/colors';

const Toaster = ({shown}) => {
  const { t } = useTranslation();
  const [value, setValue] = useState(0);
  const [angle, setAngle] = useState(0);
  const [toaster] = useState(new ToasterModel());
  const [isReady, setIsReady] = useState(false);
  const [isToasting, setIsToasting] = useState(false);
  const [isVisible, setIsVisible] = useState(false);
  const [currentStatus, setCurrentStatus] = useState("untoasted");
  const [color, setColor] = useState("silver");


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

    toaster.toast();

    setTimeout(() => {
      setIsToasting(false);

      toaster.putOut();
      const finalResult = toaster.stop();
      
      const toastPayLoad = {
        status: toaster.toastsStatus,
        time_minutes: Number(time),
        toasts_amount: toaster.toastsAmount,
        temperature: 200
      }

      saveToastData(toastPayLoad);

      setCurrentStatus(finalResult);
      setIsReady(true);

    }, delay)
  }

  const saveToastData = async (data) => { //Speichert die Daten vom letzten Toastversuch und schickt in Datenbank
    try {
      const res = await fetch("/api/toasts", {
        method: "POST",
        headers: { "Content-Type": "application/json"},
        body: JSON.stringify({
          status: data.status,
          time_minutes: data.time_minutes,
          toasts_amount: data.toasts_amount,
          temperature: data.temperature
        })
      })
      .then(res => res.json())
      .then(data => console.log(data))
      console.log("Data saved to DB");
    } catch (e) {
      console.error("Save failed", e);
    }
  }

  const changeColor = (color) => {
    toaster.color = color.name;
    setColor(color.hex);
  }


  useEffect(() => {
    const handler = setTimeout(() => {
      toaster.time = value; // Setzt die Zeit im Toaster-Modell auf den aktuellen Wert des Knobs mit einer Verzögerung von 1 Sekunde, um die Aktualisierung zu simulieren.
    }, 1000)

    return () => clearTimeout(handler);
  }, [value]);

  useEffect(() => {
      if (shown) {
        const timer = setTimeout(() => setIsVisible(true), 10);
        return () => clearTimeout(timer);
    } else {
      setIsVisible(false);
    }
  }, [shown])


  return (
    <>
      <div className="colorpicker">
        {colors.map(color => (
          <div 
            key={color.name} 
            className="color" 
            style={{ backgroundColor: color.hex }} 
            onClick={() => changeColor(color)}
          />
        ))}
      </div>
      <div className={`toaster ${isVisible ? 'shown' : ''}`} style={{backgroundColor: color}}>

        <div className={`handle ${isToasting? 'down' : ''} ${isVisible ? 'visible' : ''}`}></div>

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

        <div className={`toast ${isReady ? 'ready' : ''}`} style={{backgroundColor: `${toastsStatus[currentStatus]}`}}></div>
      </div>
    </>
  )
}

export default Toaster
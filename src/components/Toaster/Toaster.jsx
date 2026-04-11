import './Toaster.scss';
import { useTranslation } from 'react-i18next';
import { useState } from 'react';

const Toaster = () => {
  const { t } = useTranslation();
  const [value, setValue] = useState(0);
  const [angle, setAngle] = useState(0);


  const handleKnobChange = (e) => {
    const val = e.target.value;
    setValue(val);
    setAngle((val / 60) * 270);
    //toaster.time = val; // Set the toaster time based on the knob value
  }

  return (
    <div className="toaster">
      {/* <p>{t('welcome')}</p> */}
      <div className="handle"></div>
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
            />
        </div>

        <div className="button-socket">
            <button className="start-btn">{t('start_btn')}
            </button>
        </div>
      </div>
    </div>
  )
}

export default Toaster
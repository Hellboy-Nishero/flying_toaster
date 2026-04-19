import './SuperToaster.scss';
import {Supertoaster as ToasterModel} from '../../models/toaster';
import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';

const SuperToaster = ({shown}) => {
  const {t} = useTranslation();

  const [superToaster] = useState(new ToasterModel())
  const [isShown, setIsShown] = useState(false);

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

  return (
    <div className={`super-toaster ${isShown ? 'shown' : ''}`} style={{backgroundColor: `${superToaster.color}`}}> 
      <div className="silvertop"></div>
      <h1 className="brand-name">Johnny Silvertoast</h1>
      <div className="controls">
        <button className="btn">{t('start_btn')}</button>
        <button className="btn stop">{t('stop_btn')}</button>
      </div>
    </div>
  )
}

export default SuperToaster
import { useEffect, useState } from "react";
import "./History.scss";
import { useTranslation } from "react-i18next";

const History = ({modalActive, setModalActive}) => {

    const { t } = useTranslation();
    const [toastsList, setToastsList] = useState([]);

    useEffect(() => {
        const fetchToasts = async () => {
            try{
                const res = await fetch("/api/toasts");
                if (!res.ok){
                    throw new Error(`HTTP error! Status: ${res.status}`)
                }
                const data = await res.json();
                setToastsList(data);
            } catch (e) {
                console.error(`Error loading history: ${e}`)
            }
        }

        fetchToasts();

    }, [modalActive])
    

    return (
        <div className={`modalWindow ${modalActive ? "shown" : ""}`}>
            <div className="history">
                <div className="history-header">
                    <p className="close-btn" onClick={() => setModalActive(false)}>X</p>
                </div>
                <div className="history-content">
                    <div className="content-header">
                        <p className="header-item">{t("status")}</p>
                        <p className="header-item">{t("time")}</p>
                        <p className="header-item">{t("toasts")}</p>
                        <p className="header-item">{t("temperature")}</p>
                    </div>

                    <div className="content-list">
                        {toastsList && toastsList.map(item => (
                        <div className="content-item" key={item.id}>
                            <p className="content-text">{t(`${item.status}`)}</p>
                            <p className="content-text">{item.time_minutes}</p>
                            <p className="content-text">{item.toasts_amount}</p>
                            <p className="content-text">{item.temperature}°</p>
                        </div>
                        ))}

                    </div>
                    
                </div>
            </div>
        </div>
        
    )
}

export default History;
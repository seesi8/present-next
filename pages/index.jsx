import Head from "next/head";
import Image from "next/image";
import { useEffect, useState } from "react";
import styles from "../styles/Home.module.css";
import "bootstrap/dist/css/bootstrap.min.css";

function getDifferenceInMinutes(date1, date2) {
    const diffInMs = Math.abs(date2 - date1);

    return Math.ceil(diffInMs / (1000 * 60));
}

function getDifDate(date) {
    const year = date.substring(0, 4);
    const month = date.substring(4, 6);
    const day = date.substring(6, 8);
    const time = date.substring(9, 14);
    const format = `${month}/${day}/${year} ${time}`;

    const jsDate = new Date(format);
    const Dif = getDifferenceInMinutes(jsDate, new Date());

    return Dif;
}
export default function Home(props) {
    const [popup, setPopup] = useState(false);
    const [config, setConfig] = useState("");
    const [ready, setReady] = useState();
    const [data, setData] = useState([]);

    const getDataFromConfig = async () => {
        if (ready) {
            let dataCopy = await fetch("/api/config", {
                method: "POST",
                body: JSON.stringify({ v1: JSON.parse(config) }),
            });

            const jsonData = await dataCopy.json();

            if (jsonData[0]) {
                setData(jsonData);
            }
        }
    };

    useEffect(() => {
        const interval = setInterval(function () {
            getDataFromConfig();
        }, 30000);
    }, []);

    return (
        <div className={styles.container}>
            {popup && (
                <textarea
                    value={config}
                    onChange={(e) => setConfig(e.target.value)}
                    name=""
                    id=""
                    cols="300"
                    rows="70"
                ></textarea>
            )}
            {data.map((bus, i) => {
                return (
                    <div className="bus" key={i}>
                        <h3 className="info">
                            {bus.stop} Coming in:{" "}
                            <h4 className="time">{getDifDate(bus.prd)} min </h4>
                        </h3>
                    </div>
                );
            })}

            <button
                onClick={() => {
                    setPopup(!popup);
                }}
            >
                OpenConfig Edit
            </button>
            <button
                onClick={() => {
                    setReady(true);
                    getDataFromConfig();
                }}
            >
                go
            </button>
        </div>
    );
}

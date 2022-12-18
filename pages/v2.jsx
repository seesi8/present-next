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
    const [data, setData] = useState([]);
    const [set, setSet] = useState(false);
    const [schema, setSchema] = useState({});

    const getDataFromConfig = async (theConfig) => {
        if (theConfig) {
            let dataCopy = await fetch("/api/config", {
                method: "POST",
                body: JSON.stringify({ v2: JSON.parse(theConfig) }),
            });

            const jsonData = await dataCopy.json();

            if (jsonData[0]) {
                jsonData.forEach((element) => {
                    let schemaCopy = schema;
                    schemaCopy[element.stop] = [];
                    setSchema(schemaCopy);
                });
                jsonData.forEach((element) => {
                    let schemaCopy = schema;
                    console.log(schemaCopy[element.stop]);
                    schemaCopy[element.stop].push(element.prd);
                    console.log(schemaCopy);
                    setSchema(schemaCopy);
                });
                setSet(true);

                setData(jsonData);
            }
        }
    };

    useEffect(() => {
        const interval = setInterval(function () {
            getDataFromConfig(config);
        }, 30000);
    }, []);

    return (
        <div className={styles.container}>
            {popup && (
                <textarea
                    value={config}
                    onChange={(e) => {
                        setConfig(e.target.value);

                        // const configJson = JSON.parse(e.target.value);

                        // let schema = {};

                        // Object.keys(configJson).forEach((key) => {
                        //     schema[configJson[key].stop] = configJson[key].stop;
                        // });

                        // setSchema(schema);
                    }}
                    name=""
                    id=""
                    cols="300"
                    rows="70"
                ></textarea>
            )}
            {Object.keys(schema).map((bus, i) => {
                console.log(schema[bus]);
                return (
                    <div className="bus" key={i}>
                        <h3 className="info">
                            {bus} Coming in:{" "}
                            <h4 className="time">
                                {schema[bus].map((index) => {
                                    return <>{getDifDate(index) + ", "}</>;
                                })}
                                min{" "}
                            </h4>
                        </h3>
                    </div>
                );
            })}
            {!set && (
                <>
                    <button
                        class="btn btn-secondary mx-5"
                        onClick={() => {
                            setPopup(!popup);
                        }}
                    >
                        OpenConfig Edit
                    </button>
                    <button
                        class="btn btn-primary mx-5"
                        onClick={() => {
                            getDataFromConfig(config);
                        }}
                    >
                        go
                    </button>
                </>
            )}
        </div>
    );
}

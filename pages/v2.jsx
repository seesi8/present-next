import Head from "next/head";
import Image from "next/image";
import { useEffect, useState } from "react";
import styles from "../styles/Home.module.css";
import "bootstrap/dist/css/bootstrap.min.css";
import { doc, getDoc } from "firebase/firestore";
import { firestore } from "../lib/firebase";

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
                let schemaCopy = schema;

                Object.keys(schemaCopy).forEach((element) => {
                    schemaCopy[element] = [];
                });

                setSchema(schemaCopy);

                jsonData.forEach((element) => {
                    if (schemaCopy[element.stop] == undefined) {
                        schemaCopy[element.stop] = [];
                    }
                    schemaCopy[element.stop].push(element.prd);
                });
                setSchema(schemaCopy);

                setSet(true);

                setData(jsonData);
            }
        }
    };

    useEffect(() => {
        const interval = setInterval(function () {
            getDataFromConfig(config);
        }, 30000);
    }, [config]);

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
                    cols="100"
                    rows="10"
                ></textarea>
            )}
            {Object.keys(schema).map((bus, i) => {
                return (
                    <div className="bus" key={bus}>
                        <h3 className="info">
                            {bus}
                            {": ​"}
                            <div className="time">
                                {schema[bus].map((arg, index) => {
                                    return (
                                        <div key={index}>
                                            {`${getDifDate(arg)}${
                                                schema[bus].length - 1 != index
                                                    ? ", ​"
                                                    : " ​"
                                            }`}
                                        </div>
                                    );
                                })}{" "}
                                min{" "}
                            </div>
                        </h3>
                    </div>
                );
            })}
            {!set && (
                <>
                    <button
                        className="btn btn-secondary mx-5"
                        onClick={() => {
                            setPopup(!popup);
                        }}
                    >
                        OpenConfig Edit
                    </button>
                    <button
                        className="btn btn-warning mx-5"
                        onClick={async () => {
                            const _stops = await getDoc(
                                doc(firestore, "suggested", "suggested")
                            );
                            setConfig(_stops.data().suggested);
                        }}
                    >
                        Use Suggested
                    </button>
                    <button
                        className="btn btn-primary mx-5"
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

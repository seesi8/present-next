import { collection, doc, getDocs, getDoc, setDoc } from "firebase/firestore";
import { useEffect, useState } from "react";
import Train from "../components/train";
import { firestore } from "../lib/firebase";

export default function Page({}) {
    const [numBuss, setNumBuss] = useState(0);
    const [numTrain, setNumTrain] = useState(1);
    const [result, setResult] = useState({});
    const [buss, setBuss] = useState({});

    const submit = (e) => {
        e.preventDefault();
        setResult(buss);
    };

    useEffect(() => {
        let bussCopy = Object.assign({}, buss);

        bussCopy[numBuss] = {
            options: [],
            stops: [],
            bussNumber: 152,
            buss: true,
            direction: "",
        };

        setBuss(bussCopy);
    }, [numBuss]);

    useEffect(() => {
        let bussCopy = Object.assign({}, buss);

        bussCopy[numTrain * -1] = {
            options: [],
            stops: [],
            bussNumber: 152,
            buss: false,
            direction: "",
        };

        setBuss(bussCopy);
    }, [numTrain]);

    const getOptions = async (index) => {
        const _stops = await getDocs(
            collection(
                firestore,
                "stops",
                buss[index].bussNumber.toString(),
                "dir"
            )
        );
        let optionsCopy = Object.assign({}, buss);
        optionsCopy[index].options = [];

        _stops.docs.forEach((doc) => {
            optionsCopy[index].options.push(doc.id);
        });
        setBuss(optionsCopy);
    };

    const getOptionsTrain = async (index) => {
        const _stops = await (await fetch("/api/options")).json();
        let optionsCopy = Object.assign({}, buss);
        optionsCopy[index].options = [];

        _stops.forEach((doc) => {
            if (doc[buss[index].direction] == true) {
                optionsCopy[index].options.push(doc);
            }
        });

        setBuss(optionsCopy);
    };

    const getStops = async (index) => {
        const theStops = await getDoc(
            doc(
                firestore,
                "stops",
                buss[index].bussNumber.toString(),
                "dir",
                buss[index].direction
            )
        );

        let stopsCopy = Object.assign({}, buss);

        theStops.data().stops.forEach((doc) => {
            stopsCopy[index].stops.push(doc);
        });

        setBuss(stopsCopy);
    };

    return (
        <main>
            <h1>Config</h1>
            <form>
                {Object.keys(buss).map((key) => {
                    if (buss[key].buss) {
                        return (
                            <div className={key} key={key}>
                                <h2>{key} Buss</h2>
                                <input
                                    value={buss[key].bussNumber}
                                    onChange={(e) => {
                                        let copy = Object.assign({}, buss);
                                        copy[key].bussNumber = e.target.value;

                                        setBuss(copy);

                                        if (copy[key].bussNumber) {
                                            getOptions(key);
                                        }
                                    }}
                                    placeholder="buss number"
                                />
                                <br />
                                <label htmlFor="cars">
                                    Choose a direction:
                                </label>
                                <select
                                    id="cars"
                                    name="cars"
                                    value={buss[key].direction}
                                    onChange={(e) => {
                                        let copy = Object.assign({}, buss);
                                        copy[key].direction = e.target.value;

                                        setBuss(copy);
                                        getStops(key);
                                    }}
                                >
                                    {buss[key].options.map((doc, i) => {
                                        return (
                                            <option value={doc} key={i}>
                                                {doc}
                                            </option>
                                        );
                                    })}
                                </select>
                                <br />
                                <label htmlFor="cars">Choose a stop:</label>
                                <select
                                    id="cars"
                                    name="cars"
                                    value={buss[key].stop}
                                    onChange={(e) => {
                                        let copy = Object.assign({}, buss);
                                        copy[key].stop = e.target.value;

                                        setBuss(copy);
                                        getStops(key);
                                    }}
                                >
                                    {buss[key].stops.map((doc, i) => {
                                        return (
                                            <option value={doc.stpid} key={i}>
                                                {doc.stpnm}
                                            </option>
                                        );
                                    })}
                                </select>
                            </div>
                        );
                    }
                })}

                <hr />

                {Object.keys(buss).map((key) => {
                    console.log(key);
                    const theKey = key;
                    return (
                        <Train
                            buss={buss}
                            setBuss={setBuss}
                            key={key}
                            theKey={theKey}
                            getOptionsTrain={getOptionsTrain}
                            getStops={getStops}
                        />
                    );
                })}

                <button onClick={(e) => submit(e)}>Submit</button>
                <button
                    onClick={async (e) => {
                        e.preventDefault();
                        const _stops = await setDoc(
                            doc(firestore, "suggested", "suggested"),
                            { suggested: JSON.stringify(buss) }
                        );
                    }}
                >
                    Set Suggested
                </button>
            </form>

            <p className="small">{JSON.stringify(result)}</p>
            <button
                onClick={() => {
                    setNumTrain(numTrain + 1);
                }}
            >
                + : train
            </button>
            <br />
            <button
                onClick={() => {
                    setNumBuss(numBuss + 1);
                }}
            >
                + : bus
            </button>
        </main>
    );
}

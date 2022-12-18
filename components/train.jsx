import { useEffect } from "react";

export default function Train({
    buss,
    setBuss,
    theKey,
    getOptionsTrain,
    getStops,
}) {
    useEffect(() => {
        getOptionsTrain(theKey);
    }, []);
    if (!buss[theKey].buss) {
        return (
            <div>
                <h2>{theKey * -1} Train</h2>
                <label htmlFor="cars">Choose a Line:</label>
                <select
                    id="cars"
                    name="cars"
                    value={buss[theKey].direction}
                    onChange={(e) => {
                        let copy = Object.assign({}, buss);
                        copy[theKey].direction = e.target.value;

                        setBuss(copy);
                        getOptionsTrain(theKey);
                    }}
                >
                    <option value={"red"}>Red</option>
                    <option value={"blue"}>Blue</option>
                    <option value={"g"}>Green</option>
                    <option value={"brn"}>Brown</option>
                    <option value={"p"}>Purple</option>
                    <option value={"pexp"}>Purple Express</option>
                    <option value={"y"}>Yellow</option>
                    <option value={"pnk"}>Pink</option>
                    <option value={"o"}>Orange</option>
                </select>
                <br />
                <label htmlFor="cars">Choose a Stop:</label>
                <select
                    id="cars"
                    name="cars"
                    value={buss[theKey].stop}
                    onChange={(e) => {
                        let copy = Object.assign({}, buss);
                        copy[theKey].stop = e.target.value;

                        setBuss(copy);
                    }}
                >
                    {buss[theKey].options.map((doc, i) => {
                        return (
                            <option value={doc.stop_id} key={i}>
                                {doc.stop_name}
                            </option>
                        );
                    })}
                </select>
            </div>
        );
    } else {
        return (
            <>
                <h1>HJi</h1>
            </>
        );
    }
}

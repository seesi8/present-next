export default async function handler(req, res) {
    if (req.method != "POST") {
        res.status(200).json({ error: "no POST" });
    }

    let body = JSON.parse(req.body);

    let keys = Object.keys(body);
    if (keys[0] == "v1") {
        body = JSON.parse(req.body).v1;

        keys = Object.keys(body);

        let first = [];
        const result = await Promise.all(
            keys.map(async (key) => {
                if (body[key].buss == true) {
                    const stops = body[key].stops;
                    let stop = "";
                    for (let x in stops) {
                        if (stops[x].stpid == body[key].stop) {
                            stop = stops[x].stpnm;
                        }
                    }

                    let subresult;
                    if (key == 1) {
                        const prd = await fetch(
                            `http://ctabustracker.com/bustime/api/v2/getpredictions?key=fy3txRGPR437MrCVLZtpxuFCw&rt=${body[key].bussNumber}&stpid=${body[key].stop}&format=json&top=3`
                        );

                        let prediction = (await prd.json())["bustime-response"]
                            .prd;

                        if (prediction) {
                            prediction = prediction.map((item) => {
                                return {
                                    stop: `${body[key].bussNumber} ${stop}`,
                                    prd: item.prdtm,
                                };
                            });
                        } else {
                            prediction = [null];
                            return null;
                        }
                        first = prediction;
                    } else {
                        const prd = await fetch(
                            `http://ctabustracker.com/bustime/api/v2/getpredictions?key=fy3txRGPR437MrCVLZtpxuFCw&rt=${body[key].bussNumber}&stpid=${body[key].stop}&format=json&top=1`
                        );
                        let prediction = (await prd.json())["bustime-response"]
                            .prd;

                        if (prediction) {
                            prediction.map((item) => {
                                prediction = {
                                    stop: `${body[key].bussNumber} ${stop}`,
                                    prd: item.prdtm,
                                };
                            });
                        } else {
                            prediction = null;
                        }

                        subresult = prediction;
                    }
                    return subresult ? subresult[0] : subresult;
                } else {
                    const prd = await fetch(
                        `https://lapi.transitchicago.com/api/1.0/ttarrivals.aspx?key=edeb89ebcf494eac889214bc29bd68f4&max=1&stpid=${body[key].stop}&rt=${body[key].direction}&outputType=JSON`
                    );

                    const date = (await prd.json()).ctatt.eta[0].prdt;
                    const year = date.substring(0, 4);
                    const month = date.substring(5, 7);
                    const day = date.substring(8, 10);
                    const time = date.substring(11, 19);
                    const seconds = date.substring(11, 16);

                    const stops = body[key].options;
                    let stop = "";

                    const getColorFromInitial = (initial) => {
                        const dict = {
                            red: "Red",
                            blue: "Blue",
                            g: "Green",
                            brn: "Brown",
                            p: "Purple",
                            pexp: "Purple Express",
                            y: "Yellow",
                            pnk: "Pink",
                            o: "Orange",
                        };

                        return dict[initial];
                    };

                    for (let x in stops) {
                        if (stops[x].stop_id == body[key].stop) {
                            stop = `${getColorFromInitial(
                                body[key].direction
                            )} line at ${stops[x].station_name}`;
                        }
                    }

                    return { prd: `${year}${month}${day} ${time}`, stop: stop };
                }
            })
        );

        let resultCopy = result;

        if (resultCopy[0] == undefined) {
            resultCopy.shift();
        }

        let finalResult = first.concat(resultCopy);

        for (let x in finalResult) {
            if (!finalResult[x]) {
                finalResult.splice(x, 1);
            }
        }

        res.status(200).json(finalResult);
    } else {
        body = JSON.parse(req.body).v2;

        keys = Object.keys(body);

        let result = [];
        await Promise.all(
            keys.map(async (key) => {
                if (body[key].buss == true) {
                    //buss

                    const stops = body[key].stops;
                    let stop = "";

                    for (let x in stops) {
                        if (stops[x].stpid == body[key].stop) {
                            stop = stops[x].stpnm;
                        }
                    }

                    const prd = await fetch(
                        `http://ctabustracker.com/bustime/api/v2/getpredictions?key=fy3txRGPR437MrCVLZtpxuFCw&rt=${body[key].bussNumber}&stpid=${body[key].stop}&format=json`
                    );

                    let prediction = (await prd.json())["bustime-response"].prd;

                    if (prediction) {
                        prediction.map((item) => {
                            result.push({
                                stop: `${body[key].bussNumber} ${stop}`,
                                prd: item.prdtm,
                            });
                        });
                    } else {
                        prediction = null;
                    }
                } else {
                    //train

                    const prd = await fetch(
                        `https://lapi.transitchicago.com/api/1.0/ttarrivals.aspx?key=edeb89ebcf494eac889214bc29bd68f4&stpid=${body[key].stop}&rt=${body[key].direction}&outputType=JSON`
                    );

                    const prdJson = await prd.json();

                    console.log(prdJson.ctatt.eta);

                    prdJson.ctatt.eta.forEach((element) => {
                        const date = element.prdt;
                        console.log(date);
                        const year = date.substring(0, 4);
                        const month = date.substring(5, 7);
                        const day = date.substring(8, 10);
                        const time = date.substring(11, 19);
                        const seconds = date.substring(11, 16);

                        const stops = body[key].options;
                        let stop = "";

                        const getColorFromInitial = (initial) => {
                            const dict = {
                                red: "Red",
                                blue: "Blue",
                                g: "Green",
                                brn: "Brown",
                                p: "Purple",
                                pexp: "Purple Express",
                                y: "Yellow",
                                pnk: "Pink",
                                o: "Orange",
                            };

                            return dict[initial];
                        };

                        for (let x in stops) {
                            if (stops[x].stop_id == body[key].stop) {
                                stop = `${getColorFromInitial(
                                    body[key].direction
                                )} line at ${stops[x].station_name}`;
                            }
                        }

                        result.push({
                            prd: `${year}${month}${day} ${time}`,
                            stop: stop,
                        });
                    });
                }
            })
        );

        let resultCopy = result;

        if (resultCopy[0] == undefined) {
            resultCopy.shift();
        }

        for (let x in resultCopy) {
            if (!resultCopy[x]) {
                resultCopy.splice(x, 1);
            }
        }

        res.status(200).json(resultCopy);
    }
}

const example = {
    1: {
        options: ["Northbound", "Southbound"],
        stops: [
            {
                stpnm: "100th Street & Clyde",
                stpid: "5241",
                lon: -87.571375000001,
                lat: 41.713377999999,
            },
            {
                lon: -87.566574999999,
                lat: 41.713466999999,
                stpid: "5245",
                stpnm: "100th Street & Crandon",
            },
        ],
        bussNumber: "15",
        direction: "Southbound",
        stop: "1628",
    },
};

// Next.js API route support: https://nextjs.org/docs/api-routes/introduction

export default async function handler(req, res) {
    let e = await fetch(
        `http://ctabustracker.com/bustime/api/v2/getstops?key=fy3txRGPR437MrCVLZtpxuFCw&rt=152&dir=Eastbound&format=json`
    );
    res.status(200).json(await e.json());
}

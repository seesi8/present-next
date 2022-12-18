// Next.js API route support: https://nextjs.org/docs/api-routes/introduction

export default async function handler(req, res) {
    let e = await fetch(
        `https://data.cityofchicago.org/resource/8pix-ypme.json`
    );
    res.status(200).json(await e.json());
}

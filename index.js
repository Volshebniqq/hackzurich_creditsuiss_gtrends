const express = require('express');
const app = express();
const port = 3000;
const googleTrends = require('google-trends-api');
const bodyParser = require('body-parser');
const cors = require('cors');

app.use(cors());

app.use(bodyParser.urlencoded({
    extended: true
}));

app.use(bodyParser.json());

app.listen(port, () => console.log(`App listening on port ${port}!`));

app.post('/trends', async (req, res) => {
    const companies = req.body.companies;
    let result = {};
    await Promise.all(companies.map(async company => {
        let gtData = JSON.parse(await googleTrends.interestOverTime({ keyword: company}));
        gtData = gtData.default.timelineData;
        gtData = gtData.slice(gtData.length - 13, gtData.length - 1);
        if (gtData[11].value[0] - gtData[8].value[0] >= 20) {
            result[company] = gtData;
        }
    }));
    return res.status(200).send(result);
});
const express = require('express');
const { AthenaClient, StartQueryExecutionCommand, GetQueryExecutionCommand, GetQueryResultsCommand } = require('@aws-sdk/client-athena');

// [10] Amazon Web Services, "Running SQL queries using Amazon Athena," Amazon Athena User Guide.
const athena = new AthenaClient({ region: process.env.AWS_REGION });
const router = express.Router();

const QUERY = `
  SELECT t.trend.gamename AS gamename, t.trend.listingcount AS listingcount, t.trend.averageprice AS averageprice
  FROM trends
  CROSS JOIN UNNEST(trends) AS t(trend)
  ORDER BY t.trend.listingcount DESC;
`;

function sleep(ms) {
    return new Promise((resolve) => setTimeout(resolve, ms));
}

router.get('/', async (req, res) => {
    try {
        // Send query
        const startResult = await athena.send(new StartQueryExecutionCommand({
            QueryString: QUERY,
            QueryExecutionContext: { Database: 'boardgametrade_db' },
            ResultConfiguration: {
                OutputLocation: 's3://boardgametrade-images-s3924585/athena-results/',
            },
        }));

        const queryExecutionId = startResult.QueryExecutionId;

        // Poll the status until completion (Athena runs asynchronously).
        let state = 'RUNNING';
        let attempts = 0;
        while ((state === 'RUNNING' || state === 'QUEUED') && attempts < 20) {
            await sleep(500);
            const statusResult = await athena.send(new GetQueryExecutionCommand({ QueryExecutionId: queryExecutionId }));
            state = statusResult.QueryExecution.Status.State;
            attempts++;
        }

        if (state !== 'SUCCEEDED') {
            return res.status(500).json({ error: `Query did not succeed: ${state}` });
        }

        // Get result
        const resultsResult = await athena.send(new GetQueryResultsCommand({ QueryExecutionId: queryExecutionId }));

        const rows = resultsResult.ResultSet.Rows;
        // The first row is header so we skip
        const dataRows = rows.slice(1);

        const trends = dataRows.map((row) => {
            const [gamename, listingcount, averageprice] = row.Data.map((d) => d.VarCharValue);
            return {
                gameName: gamename,
                listingCount: parseInt(listingcount, 10),
                averagePrice: parseFloat(averageprice),
            };
        });

        res.json({ trends });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Failed to fetch trends' });
    }
});

module.exports = router;
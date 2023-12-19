const express = require("express");
const router = express.Router();
const fs = require("fs");
const { generateRandomLogs, predictMLScore } = require("../utils");
const { addFilestoIPFS } = require("../ipfs");
const { addBlock } = require("../web3-methods");

router.post("/addLog", async (req, res) => {
  const { logData } = req.body;
  const ml_risk_score = predictMLScore(logData);
  fs.appendFile(
    `./${process.env.LOCAL_LOG_FOLDER}/${logData.campLocation}.txt`,
    `${logData.campLocation},${logData.timestamp},${logData.source},${logData.destination},${logData.user},${logData.device},${logData.eventType},${logData.eventDescription},${logData.eventSeverity},${ml_risk_score}\n`,
    function (err) {
      if (err) throw err;
    }
  );
  fs.appendFile(
    `./${process.env.LOCAL_LOG_FOLDER}/All.txt`,
    `${logData.campLocation},${logData.timestamp},${logData.source},${logData.destination},${logData.user},${logData.device},${logData.eventType},${logData.eventDescription},${logData.eventSeverity},${ml_risk_score}\n`,
    function (err) {
      if (err) throw err;
    }
  );

  res.json({ message: "Success" });
});
router.post("/addLogs", (req, res) => {
  const { numberoflogs, campLocation } = req.body;
  let content = "";
  const logs = generateRandomLogs(numberoflogs, campLocation);
  logs.forEach(
    (logData) =>
      (content += `${campLocation},${logData.timestamp},${logData.source},${logData.destination},${logData.user},${logData.device},${logData.eventType},${logData.eventDescription},${logData.eventSeverity},${logData.mlRiskScore}\n`)
  );
  fs.appendFile(
    `./${process.env.LOCAL_LOG_FOLDER}/${campLocation}.txt`,
    content,
    function (err) {
      if (err) throw err;
    }
  );
  fs.appendFile(
    `./${process.env.LOCAL_LOG_FOLDER}/All.txt`,
    content,
    function (err) {
      if (err) throw err;
    }
  );
  res.json({ message: "Success" });
});
router.post("/triggerIPFSBlockChain", async (req, res) => {
  const response = await addFilestoIPFS([
    {
      path: "Delhi.txt",
      content: fs.readFileSync(`./${process.env.LOCAL_LOG_FOLDER}/Delhi.txt`, {
        encoding: "base64",
      }),
    },
    {
      path: "Mumbai.txt",
      content: fs.readFileSync(`./${process.env.LOCAL_LOG_FOLDER}/Mumbai.txt`, {
        encoding: "base64",
      }),
    },
    {
      path: "Bangalore.txt",
      content: fs.readFileSync(
        `./${process.env.LOCAL_LOG_FOLDER}/Bangalore.txt`,
        {
          encoding: "base64",
        }
      ),
    },
  ]);
  addBlock(response[0].path, "Delhi");
  addBlock(response[1].path, "Mumbai");
  addBlock(response[2].path, "Bangalore");
  const bngContent = fs.readFileSync(
    `./${process.env.LOCAL_LOG_FOLDER}/Bangalore.txt`
  );
  const mumContent = fs.readFileSync(
    `./${process.env.LOCAL_LOG_FOLDER}/Mumbai.txt`
  );
  const delContent = fs.readFileSync(
    `./${process.env.LOCAL_LOG_FOLDER}/Delhi.txt`
  );
  fs.appendFileSync(
    `./${process.env.CENTRAL_LOG_FOLDER}/Delhi.txt`,
    delContent,
    function () {
      console.log("done");
    }
  );
  fs.appendFileSync(
    `./${process.env.CENTRAL_LOG_FOLDER}/Mumbai.txt`,
    mumContent,
    function () {
      console.log("done");
    }
  );
  fs.appendFileSync(
    `./${process.env.CENTRAL_LOG_FOLDER}/Bangalore.txt`,
    bngContent,
    function () {
      console.log("done");
    }
  );
  fs.appendFileSync(
    `./${process.env.CENTRAL_LOG_FOLDER}/All.txt`,
    bngContent + mumContent + delContent,
    function () {
      console.log("done");
    }
  );
  fs.writeFileSync(
    `./${process.env.LOCAL_LOG_FOLDER}/Bangalore.txt`,
    "",
    function () {
      console.log("done");
    }
  );
  fs.writeFileSync(
    `./${process.env.LOCAL_LOG_FOLDER}/Delhi.txt`,
    "",
    function () {
      console.log("done");
    }
  );
  fs.writeFileSync(
    `./${process.env.LOCAL_LOG_FOLDER}/Mumbai.txt`,
    "",
    function () {
      console.log("done");
    }
  );
  fs.writeFileSync(
    `./${process.env.LOCAL_LOG_FOLDER}/All.txt`,
    "",
    function () {
      console.log("done");
    }
  );

  res.json({ message: "Success" });
});
module.exports = router;

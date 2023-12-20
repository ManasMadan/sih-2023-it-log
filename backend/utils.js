const { DateTime } = require("luxon");
const data = require("./data");
const emailjs = require("@emailjs/nodejs");
const fs = require("fs");

const processJSONforBigInt = (obj) => {
  return JSON.parse(
    JSON.stringify(obj, (key, value) =>
      typeof value === "bigint" ? value.toString() : value
    )
  );
};
const randomElementFromArray = (arr) => {
  return arr[Math.floor(Math.random() * arr.length)];
};
const randomInteger = (min, max) =>
  Math.floor(Math.random() * (max - min + 1)) + min;
const replaceVariable = (str, logData) => {
  let str2 = str;
  if (!str2) return "";
  str2 = str2.replaceAll("{username}", logData.user);
  str2 = str2.replaceAll("{source_ip}", logData.source);
  str2 = str2.replaceAll("{device}", logData.device);
  str2 = str2.replaceAll("{port}", randomInteger(1, 65535));
  str2 = str2.replaceAll("{domain}", `example${randomInteger(1, 1000)}.com`);
  str2 = str2.replaceAll("{filename}", `file${randomInteger(1, 1000)}.txt`);
  str2 = str2.replaceAll("{reason}", `Reason${randomInteger(1, 10)}`);
  str2 = str2.replaceAll(
    "{error_message}",
    `Error message: ${randomInteger(1, 100)}`
  );
  str2 = str2.replaceAll("{app_name}", `App${randomInteger(1, 10)}`);
  str2 = str2.replaceAll("{api_name}", `API${randomInteger(1, 5)}`);
  str2 = str2.replaceAll(
    "{access_type}",
    randomElementFromArray(["Read", "Write", "Delete"])
  );
  str2 = str2.replaceAll(
    "{file_path}",
    `/path/to/file${randomInteger(1, 1000)}.txt`
  );
  str2 = str2.replaceAll("{software_name}", `Software${randomInteger(1, 10)}`);
  str2 = str2.replaceAll("{version}", `v${randomInteger(1, 5)}`);
  str2 = str2.replaceAll(
    "{malware}",
    `v${randomElementFromArray([
      "Agent Tesla",
      "AZORult",
      "FormBook",
      "Ursnif",
      "LokiBot",
      "MOUSEISLAND",
    ])}`
  );

  return str2;
};
const randomIP = () => {
  return `${randomInteger(1, 255)}.${randomInteger(1, 255)}.${randomInteger(
    1,
    255
  )}.${randomInteger(1, 255)}`;
};
const predictMLScore = (logData) => {
  let source_ip_class = data.safe_ips.includes(logData.source)
    ? "safe"
    : "malicious";
  let dest_ip_class = data.safe_destination_ips.includes(logData.destination)
    ? "safe"
    : "malicious";
  let event_type_threat_score =
    data.event_type_threat[logData.eventType] || 0.5;
  let source_ip_threat_score = data.ip_threat[source_ip_class] || 0.5;
  let dest_ip_threat_score = data.ip_threat[dest_ip_class] || 0.5;
  let ml_risk_score = (
    (event_type_threat_score + source_ip_threat_score + dest_ip_threat_score) /
    3
  ).toFixed(2);
  return ml_risk_score;
};
const sendEmail = (logsForMail, logsForBlockedAccess, template) => {
  emailjs
    .send(
      "service_ybnmn0v",
      template,
      {
        number: logsForMail.length,
        number2: logsForBlockedAccess.length,
        htmlContent: htmlString2(logsForMail),
        htmlContent2: htmlString2(logsForBlockedAccess),
      },
      {
        publicKey: "jfboO5uLvrXJSVWvS",
        privateKey: "MUK0ghcaE9u4pOeLd76nJ",
      }
    )
    .then(
      function (response) {
        console.log("SUCCESS!", response.status, response.text);
      },
      function (err) {
        console.log("FAILED...", err);
      }
    );
};
const generateRandomLogs = (number, campLocation) => {
  const logs = [];
  const logsForMail = [];
  const logsForBlockedAccess = [];

  let content = "";
  let content2 = "";
  for (let i = 0; i < number; i++) {
    let rnd = randomElementFromArray([1, 1, 1, 1, 1, 1, 1, 1, 1, 0]);
    let logData = {
      timestamp: DateTime.now()
        .minus({
          day: randomInteger(0, 5),
          hours: randomInteger(0, 24),
          minutes: randomInteger(0, 60),
          seconds: randomInteger(0, 60),
        })
        .setZone("system")
        .toISO()
        .substring(0, 16),
      source: rnd ? randomElementFromArray(data.safe_ips) : randomIP(),
      destination: rnd
        ? randomElementFromArray(data.safe_destination_ips)
        : randomIP(),
      user: randomElementFromArray(data.users),
      device: randomElementFromArray(data.device),
      eventType: randomElementFromArray(data.event_types),
      eventDescription: "",
      eventSeverity: randomElementFromArray(data.event_severity),
    };

    const ml_risk_score = predictMLScore(logData);

    logData = {
      ...logData,
      eventDescription: replaceVariable(
        data.event_description_templates[logData.eventType],
        logData
      ),
      mlRiskScore: ml_risk_score,
    };
    logs.push(logData);
    if (ml_risk_score >= 0.85 && logsForMail.length <= 50) {
      content += logData.source + "\n";
      logsForMail.push({ ...logData, campLocation: campLocation });
    }
    if (
      data.action.indexOf(logData.eventType) != -1 &&
      logsForBlockedAccess.length <= 50
    ) {
      content2 += logData.eventDescription + "\n";
      logsForBlockedAccess.push({ ...logData, campLocation: campLocation });
    }
  }
  fs.appendFile(
    `./${process.env.CENTRAL_LOG_FOLDER}/Blocked_IPS.txt`,
    content,
    function (err) {
      if (err) throw err;
    }
  );
  fs.appendFile(
    `./${process.env.CENTRAL_LOG_FOLDER}/REVOKED_ACCESS.txt`,
    content2,
    function (err) {
      if (err) throw err;
    }
  );

  sendEmail(logsForMail, logsForBlockedAccess, "template_htwcber");

  return logs;
};

const htmlString = (logs) => {
  const htmlString = `<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <meta http-equiv="X-UA-Compatible" content="ie=edge" />
    <title>LogsLens</title>
  </head>
  <style>
    body {
      min-height: 100vh;
      background: #020818;
      display: flex;
      justify-content: center;
      align-items: center;
      margin: 0;
      padding: 0;
      box-sizing: border-box;
      font-family: sans-serif;
      color: white;
    }
    main {
      width: 82vw;
      height: 90vh;
      background-color: #37373f;
      backdrop-filter: blur(7px);
      box-shadow: 0 0.4rem 0.8rem #0005;
      border-radius: 0.8rem;
      overflow: hidden;
    }
    #section1 {
      width: 100%;
      height: 10%;
      background-color: #37373f;

      padding: 0.8rem 1rem;
      display: flex;
      justify-content: center;
      align-items: center;
    }

    #section2 {
      width: 95%;
      max-height: calc(89% - 1.6rem);
      background-color: #27262b;

      margin: 0.8rem auto;
      border-radius: 0.6rem;
      overflow: auto;
      overflow: overlay;
    }
    table {
      width: 100%;
      border-collapse: collapse;
      padding: 1rem;
      text-align: left;
    }
    th {
      border-collapse: collapse;
      padding: 1rem;
      text-align: left;
      position: sticky;
      top: 0;
      left: 0;
      background-color: #a6abff;
      cursor: pointer;
      text-transform: capitalize;
    }
    td {
      border-collapse: collapse;
      padding: 1rem;
      text-align: left;
    }
    tbody tr:nth-child(even) {
      background-color: #454545;
    }
    tbody tr {
      transition: 0.5s ease-in-out 0.1s, background-color 0s;
    }
    tbody tr:hover {
      background-color: #020818;
    }
  </style>
  <body>
    <main>
      <section id="section1">
        <h1>Log Lens</h1>
      </section>
      <section id="section2">
        <table>
          <thead>
            <tr>
              <th>Camp Location</th>
              <th>Timestamp</th>
              <th>Source</th>
              <th>Destination</th>
              <th>User</th>
              <th>Device</th>
              <th>Event Type</th>
              <th>Event Description</th>
              <th>Event Severity</th>
              <th>ML Risk Score</th>
            </tr>
          </thead>
          <tbody>
            ${logs.map(
              (log) => `<tr>
              <td>${log.campLocation}</td>
              <td>${log.timestamp}</td>
              <td>${log.source}</td>
              <td>${log.destination}</td>
              <td>${log.user}</td>
              <td>${log.device}</td>
              <td>${log.eventType}</td>
              <td>${log.eventDescription}</td>
              <td>${log.eventSeverity}</td>
              <td>${log.mlRiskScore}</td>
            </tr>`
            )}
          </tbody>
        </table>
      </section>
    </main>
  </body>
</html>
`;
  return htmlString;
};
const htmlString2 = (logs) => {
  const htmlString = `<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <meta http-equiv="X-UA-Compatible" content="ie=edge" />
    <title>LogsLens</title>
  </head>
  <style>
    .main2 {
      background: #ffffff;
    }
    main {
      width: 82vw;
      height: 90vh;
      background-color: #37373f;
      backdrop-filter: blur(7px);
      box-shadow: 0 0.4rem 0.8rem #0005;
      border-radius: 0.8rem;
      overflow: hidden;
    }
    #section1 {
      width: 100%;
      height: 10%;
      background-color: #37373f;

      padding: 0.8rem 1rem;
      display: flex;
      justify-content: center;
      align-items: center;
    }

    #section2 {
      width: 95%;
      max-height: calc(89% - 1.6rem);
      background-color: #27262b;

      margin: 0.8rem auto;
      border-radius: 0.6rem;
      overflow: auto;
      overflow: overlay;
    }
    table {
      width: 100%;
      border-collapse: collapse;
      padding: 1rem;
      text-align: left;
    }
    th {
      border-collapse: collapse;
      padding: 1rem;
      text-align: left;
      position: sticky;
      top: 0;
      left: 0;
      background-color: #a6abff;
      cursor: pointer;
      text-transform: capitalize;
    }
    td {
      border-collapse: collapse;
      padding: 1rem;
      text-align: left;
            color:#000;

    }
    tbody tr:nth-child(even) {
      background-color: #454545;
    }
    tbody tr {
      transition: 0.5s ease-in-out 0.1s, background-color 0s;
    }
    
  </style>
  <div class="main2">
    <main>
      <section id="section1">
        <h1>Log Lens</h1>
      </section>
      <section id="section2">
        <table>
          <thead>
            <tr>
              <th>Camp Location</th>
              <th>Timestamp</th>
              <th>Source</th>
              <th>Destination</th>
              <th>User</th>
              <th>Device</th>
              <th>Event Type</th>
              <th>Event Description</th>
              <th>Event Severity</th>
              <th>ML Risk Score</th>
            </tr>
          </thead>
          <tbody>
            ${logs.map(
              (log) => `<tr>
              <td>${log.campLocation}</td>
              <td>${log.timestamp}</td>
              <td>${log.source}</td>
              <td>${log.destination}</td>
              <td>${log.user}</td>
              <td>${log.device}</td>
              <td>${log.eventType}</td>
              <td>${log.eventDescription}</td>
              <td>${log.eventSeverity}</td>
              <td>${log.mlRiskScore}</td>
            </tr>`
            )}
          </tbody>
        </table>
      </section>
    </main>
  </div>
</html>
`;
  return htmlString;
};
module.exports = {
  processJSONforBigInt,
  generateRandomLogs,
  predictMLScore,
  htmlString,
};

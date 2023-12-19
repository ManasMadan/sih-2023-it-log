const express = require("express");
const router = express.Router();
const fs = require("fs");
const { htmlString } = require("../utils");
const csv = require("csv-parser");
const { DateTime } = require("luxon");
const path = require("path");
const fillColors = ["#0088FE", "#00C49F", "#FFBB28", "#FF8042"];
router.get("/dashboard", async (req, res) => {
  let { threshold } = req.query;
  if (threshold) threshold = parseFloat(threshold);
  else threshold = 0.7;
  const sourceIP = new Set();
  const destIP = new Set();
  let logcount = 0;
  let eventSeverityDaily = {
    informational: [
      { count: 0, day: 0 },
      { count: 0, day: 0 },
      { count: 0, day: 0 },
      { count: 0, day: 0 },
      { count: 0, day: 0 },
      { count: 0, day: 0 },
      { count: 0, day: 0 },
    ],
    warning: [
      { count: 0, day: 0 },
      { count: 0, day: 0 },
      { count: 0, day: 0 },
      { count: 0, day: 0 },
      { count: 0, day: 0 },
      { count: 0, day: 0 },
      { count: 0, day: 0 },
    ],
    error: [
      { count: 0, day: 0 },
      { count: 0, day: 0 },
      { count: 0, day: 0 },
      { count: 0, day: 0 },
      { count: 0, day: 0 },
      { count: 0, day: 0 },
      { count: 0, day: 0 },
    ],
    critical: [
      { count: 0, day: 0 },
      { count: 0, day: 0 },
      { count: 0, day: 0 },
      { count: 0, day: 0 },
      { count: 0, day: 0 },
      { count: 0, day: 0 },
      { count: 0, day: 0 },
    ],
  };
  let eventSeverityVTime = {
    informational: 0,
    warning: 0,
    error: 0,
    critical: 0,
  };
  let logVTime = [
    { count: 0, day: 0 },
    { count: 0, day: 0 },
    { count: 0, day: 0 },
    { count: 0, day: 0 },
    { count: 0, day: 0 },
    { count: 0, day: 0 },
    { count: 0, day: 0 },
  ];
  let eventTypeVTime = {
    "auth-failed": 0,
    "auth-success": 0,
    "auth-lockout": 0,
    "network-connected": 0,
    "network-disconnected": 0,
    "firewall-change": 0,
    "dns-queries": 0,
    "malware-detection": 0,
    "system-shutdown": 0,
    "system-restart": 0,
    "system-failure": 0,
    "application-errors": 0,
    "application-usage": 0,
    "api-called": 0,
    "file-access": 0,
    "permission-changes": 0,
    "software-update": 0,
  };
  let criticalAlertsVTime = [
    { count: 0, day: 0 },
    { count: 0, day: 0 },
    { count: 0, day: 0 },
    { count: 0, day: 0 },
    { count: 0, day: 0 },
    { count: 0, day: 0 },
    { count: 0, day: 0 },
  ];
  let criticalAlertGroupByEventType = {
    informational: 0,
    warning: 0,
    error: 0,
    critical: 0,
  };
  const fsStream = fs.createReadStream(
    `./${process.env.CENTRAL_LOG_FOLDER}/All.txt`
  );
  const csvStream = csv();
  fsStream
    .pipe(csvStream)
    .on("data", (data) => {
      const today = DateTime.now();
      const weekbefore = DateTime.now().minus({ days: 7 });
      const dayBefore = DateTime.now().minus({ days: 1 });
      const dt = DateTime.fromFormat(data.timestamp, "yyyy-MM-dd'T'HH:mm");
      if (dt < today && dt > dayBefore) {
        logcount++;
      }
      if (dt < today && dt > weekbefore) {
        const indexToUpdate = 7 - today.day + dt.day - 1;

        if (indexToUpdate >= 0 && indexToUpdate <= 6) {
          logVTime[indexToUpdate].count++;
          eventSeverityDaily[data.eventSeverity][indexToUpdate].count++;
        }
        eventSeverityVTime[data.eventSeverity]++;
        eventTypeVTime[data.eventType]++;
        sourceIP.add(data["source"]);
        destIP.add(data["destination"]);
        if (data.mlRiskScore >= threshold) {
          if (indexToUpdate >= 0 && indexToUpdate <= 6) {
            criticalAlertsVTime[indexToUpdate].count++;
          }
          criticalAlertGroupByEventType[data.eventSeverity]++;
        }
      }
    })
    .on("end", () => {
      const today = DateTime.now();
      Object.keys(eventSeverityDaily).forEach(function (key, i) {
        eventSeverityDaily[key].forEach((r, i) => {
          eventSeverityDaily[key][7 - i - 1].day = today.day - i;
        });
      });
      const resultArray = [];

      for (let day = 13; day <= 19; day++) {
        const dayObject = { day };
        for (const key in eventSeverityDaily) {
          dayObject[key + "_count"] = eventSeverityDaily[key].find(
            (item) => item.day === day
          )?.count;
        }
        resultArray.push(dayObject);
      }
      const arr = [];
      for (var key in eventTypeVTime) {
        if (eventTypeVTime.hasOwnProperty(key)) {
          arr.push({ name: key, count: eventTypeVTime[key] });
        }
      }
      const arr2 = [];
      let i = 0;
      for (var key in criticalAlertGroupByEventType) {
        if (criticalAlertGroupByEventType.hasOwnProperty(key)) {
          arr2.push({
            name: key,
            count: criticalAlertGroupByEventType[key],
            fill: fillColors[i],
          });
          i++;
        }
      }
      const arr3 = [];
      for (var key in eventSeverityVTime) {
        if (eventSeverityVTime.hasOwnProperty(key)) {
          arr3.push({ name: key, count: eventSeverityVTime[key] });
        }
      }
      criticalAlertsVTime.forEach((r, i) => {
        criticalAlertsVTime[7 - i - 1].day = today.day - i;
      });
      logVTime.forEach((r, i) => {
        logVTime[7 - i - 1].day = today.day - i;
      });
      res.json({
        logVTime: logVTime,
        eventTypeVTime: arr,
        criticalAlertsVTime: criticalAlertsVTime,
        criticalAlertGroupByEventType: arr2,
        sourceIP: sourceIP.size,
        destIP: destIP.size,
        logcount: logcount,
        eventSeverityVTime: arr3,
        eventSeverityDaily: resultArray,
      });
    });
});
router.get("/blocked_ips", async (req, res) => {
  const fsStream = fs.createReadStream(
    `./${process.env.CENTRAL_LOG_FOLDER}/Blocked_IPS.txt`
  );
  const csvStream = csv();
  const arr = [];

  fsStream
    .pipe(csvStream)
    .on("data", (data) => {
      arr.push(data);
    })
    .on("end", () => res.json({ blocked_ips: arr }));
});
router.get("/revoked_access", async (req, res) => {
  const fsStream = fs.createReadStream(
    `./${process.env.CENTRAL_LOG_FOLDER}/REVOKED_ACCESS.txt`
  );
  const csvStream = csv();
  const arr = [];

  fsStream
    .pipe(csvStream)
    .on("data", (data) => {
      arr.push(data);
    })
    .on("end", () => res.json({ revoked_access: arr }));
});
router.post("/unblock_ip", async (req, res) => {
  const { ip } = req.body;
  const fsStream = fs.createReadStream(
    `./${process.env.CENTRAL_LOG_FOLDER}/Blocked_IPS.txt`
  );
  const csvStream = csv();
  let content = "ip_address\n";
  fsStream
    .pipe(csvStream)
    .on("data", (data) => {
      if (data.ip_address != ip) content += data.ip_address + "\n";
    })
    .on("end", () => {
      fs.writeFile(
        `./${process.env.CENTRAL_LOG_FOLDER}/Blocked_IPS.txt`,
        content,
        function (err) {
          if (err) throw err;
        }
      );
      res.send("Success");
    });
});
router.post("/allow_access", async (req, res) => {
  const { ip } = req.body;
  const fsStream = fs.createReadStream(
    `./${process.env.CENTRAL_LOG_FOLDER}/REVOKED_ACCESS.txt`
  );
  const csvStream = csv();
  let content = "log_description\n";
  fsStream
    .pipe(csvStream)
    .on("data", (data) => {
      if (data.log_description != ip) content += data.log_description + "\n";
    })
    .on("end", () => {
      fs.writeFile(
        `./${process.env.CENTRAL_LOG_FOLDER}/REVOKED_ACCESS.txt`,
        content,
        function (err) {
          if (err) throw err;
        }
      );
      res.send("Success");
    });
});

router.get("/ml", async (req, res) => {
  let threshold = 0.7;
  let riskVDay = [
    { count: 0, day: 0 },
    { count: 0, day: 0 },
    { count: 0, day: 0 },
    { count: 0, day: 0 },
    { count: 0, day: 0 },
    { count: 0, day: 0 },
    { count: 0, day: 0 },
  ];
  let riskVUser = {
    user123: 0,
    anonymous: 0,
    admin: 0,
    guest: 0,
  };
  let riskEventType = {
    "auth-failed": 0,
    "auth-success": 0,
    "auth-lockout": 0,
    "network-connected": 0,
    "network-disconnected": 0,
    "firewall-change": 0,
    "dns-queries": 0,
    "malware-detection": 0,
    "system-shutdown": 0,
    "system-restart": 0,
    "system-failure": 0,
    "application-errors": 0,
    "application-usage": 0,
    "api-called": 0,
    "file-access": 0,
    "permission-changes": 0,
    "software-update": 0,
  };
  const fsStream = fs.createReadStream(
    `./${process.env.CENTRAL_LOG_FOLDER}/All.txt`
  );
  const csvStream = csv();
  fsStream
    .pipe(csvStream)
    .on("data", (data) => {
      const today = DateTime.now();
      const weekbefore = DateTime.now().minus({ days: 7 });
      const dt = DateTime.fromFormat(data.timestamp, "yyyy-MM-dd'T'HH:mm");
      if (dt < today && dt > weekbefore && data.mlRiskScore >= threshold) {
        const indexToUpdate = 7 - today.day + dt.day - 1;
        if (indexToUpdate >= 0 && indexToUpdate <= 6) {
          riskVDay[indexToUpdate].count++;
          riskEventType[data.eventType]++;
          riskVUser[data.user]++;
        }
      }
    })
    .on("end", () => {
      const today = DateTime.now();
      const arr3 = [];
      for (var key in riskEventType) {
        if (riskEventType.hasOwnProperty(key)) {
          arr3.push({ name: key, count: riskEventType[key] });
        }
      }
      const arr2 = [];
      let i = 0;
      for (var key in riskVUser) {
        if (riskVUser.hasOwnProperty(key)) {
          arr2.push({
            name: key,
            count: riskVUser[key],
            fill: fillColors[i],
          });
          i++;
        }
      }

      riskVDay.forEach((r, i) => {
        riskVDay[7 - i - 1].day = today.day - i;
      });
      res.json({
        riskVDay: riskVDay,
        riskEventType: arr3,
        riskVUser: arr2,
      });
    });
});
router.get("/exportLogsAsCSV", async (req, res) => {
  const excelFilePath = path.join(
    __dirname,
    `../${process.env.CENTRAL_LOG_FOLDER}/All.txt`
  );
  res.sendFile(excelFilePath);
});
router.get("/exportLogsAsHTML", async (req, res) => {
  let results = [];
  const fsStream = fs.createReadStream(
    `./${process.env.CENTRAL_LOG_FOLDER}/All.txt`
  );
  const csvStream = csv();
  fsStream
    .pipe(csvStream)
    .on("data", (data) => {
      results.push(data);
    })
    .on("end", () => {
      res.send(htmlString(results));
    });
});
router.get("/getLogs", async (req, res) => {
  let { camp, sortBy, page, len } = req.query;
  if (!camp) camp = "All";
  if (!sortBy) sortBy = "timestamp";
  if (!page) page = 1;
  len = parseInt(len) || 10;
  const {
    timestamp,
    source,
    destination,
    user,
    device,
    eventType,
    eventDescription,
    eventSeverity,
    mlRiskScore,
    sortOrder,
  } = req.query;

  let results = [];
  const fsStream = fs.createReadStream(
    `./${process.env.CENTRAL_LOG_FOLDER}/${camp}.txt`
  );
  const csvStream = csv();
  fsStream
    .pipe(csvStream)
    .on("data", (data) => {
      // Filter Here
      if (
        (data.timestamp == timestamp || !timestamp) &&
        (data.source == source || !source) &&
        (data.destination == destination || !destination) &&
        (data.user == user || !user) &&
        (data.device == device || !device) &&
        (data.eventType == eventType || !eventType) &&
        (data.eventDescription == eventDescription || !eventDescription) &&
        (data.eventSeverity == eventSeverity || !eventSeverity) &&
        (data.mlRiskScore * 100 >= mlRiskScore || !mlRiskScore)
      ) {
        const cpy = { ...data, mlRiskScore: data.mlRiskScore * 100 };
        results.push(cpy);
      }
    })
    .on("end", () => {
      if (sortBy) {
        results = results.sort((a, b) => {
          if (typeof a[sortBy] == "string") {
            return (
              a[sortBy].localeCompare(b[sortBy]) *
              (sortOrder == "desc" ? -1 : 1)
            );
          } else {
            if (a[sortBy] == b[sortBy]) return 0;
            return (
              (a[sortBy] < b[sortBy] ? -1 : 1) * (sortOrder == "desc" ? -1 : 1)
            );
          }
        });
      }
      if (results.length > len) {
        res.json({
          message: "Success",
          logs: results.slice(
            page * len,
            Math.min(page * len + len, results.length - 1)
          ),
          count: results.length,
        });
      } else {
        res.json({
          message: "Success",
          logs: results,
          count: results.length,
        });
      }
    });
});
router.get("/logvstime", async (req, res) => {
  let results = [
    { count: 0, day: 0 },
    { count: 0, day: 0 },
    { count: 0, day: 0 },
    { count: 0, day: 0 },
    { count: 0, day: 0 },
    { count: 0, day: 0 },
    { count: 0, day: 0 },
  ];
  const fsStream = fs.createReadStream(
    `./${process.env.CENTRAL_LOG_FOLDER}/All.txt`
  );
  const csvStream = csv();
  fsStream
    .pipe(csvStream)
    .on("data", (data) => {
      const today = DateTime.now();
      const weekbefore = DateTime.now().minus({ days: 7 });
      const dt = DateTime.fromFormat(data.timestamp, "yyyy-MM-dd'T'HH:mm");
      if (dt < today && dt > weekbefore) {
        const indexToUpdate = 7 - today.day + dt.day - 1;
        if (indexToUpdate >= 0 && indexToUpdate <= 6) {
          results[indexToUpdate].count++;
        }
      }
    })
    .on("end", () => {
      const today = DateTime.now();

      results.forEach((r, i) => {
        results[7 - i - 1].day = today.day - i;
      });
      res.json(results);
    });
});
router.get("/eventtypevstime", async (req, res) => {
  let results = {
    "auth-failed": 0,
    "auth-success": 0,
    "auth-lockout": 0,
    "network-connected": 0,
    "network-disconnected": 0,
    "firewall-change": 0,
    "dns-queries": 0,
    "malware-detection": 0,
    "system-shutdown": 0,
    "system-restart": 0,
    "system-failure": 0,
    "application-errors": 0,
    "application-usage": 0,
    "api-called": 0,
    "file-access": 0,
    "permission-changes": 0,
    "software-update": 0,
  };
  const fsStream = fs.createReadStream(
    `./${process.env.CENTRAL_LOG_FOLDER}/All.txt`
  );
  const csvStream = csv();
  fsStream
    .pipe(csvStream)
    .on("data", (data) => {
      const today = DateTime.now();
      const weekbefore = DateTime.now().minus({ days: 7 });
      const dt = DateTime.fromFormat(data.timestamp, "yyyy-MM-dd'T'HH:mm");
      if (dt < today && dt > weekbefore) {
        results[data.eventType]++;
      }
    })
    .on("end", () => {
      const arr = [];
      for (var key in results) {
        if (results.hasOwnProperty(key)) {
          arr.push({ name: key, count: results[key] });
        }
      }
      res.json(arr);
    });
});
router.get("/criticalAlerts/:threshold", async (req, res) => {
  let { threshold } = req.params;
  threshold = parseFloat(threshold);
  let results = [
    { count: 0, day: 0 },
    { count: 0, day: 0 },
    { count: 0, day: 0 },
    { count: 0, day: 0 },
    { count: 0, day: 0 },
    { count: 0, day: 0 },
    { count: 0, day: 0 },
  ];
  const fsStream = fs.createReadStream(
    `./${process.env.CENTRAL_LOG_FOLDER}/All.txt`
  );
  const csvStream = csv();
  fsStream
    .pipe(csvStream)
    .on("data", (data) => {
      const today = DateTime.now();
      const weekbefore = DateTime.now().minus({ days: 7 });
      const dt = DateTime.fromFormat(data.timestamp, "yyyy-MM-dd'T'HH:mm");
      if (dt < today && dt > weekbefore && data.mlRiskScore >= threshold) {
        const indexToUpdate = 7 - today.day + dt.day - 1;
        results[indexToUpdate].count++;
      }
    })
    .on("end", () => {
      const today = DateTime.now();

      results.forEach((r, i) => {
        results[7 - i - 1].day = today.day - i;
      });
      res.json(results);
    });
});
router.get("/eventseverity", async (req, res) => {
  let results = {
    informational: 0,
    warning: 0,
    error: 0,
    critical: 0,
  };
  const fsStream = fs.createReadStream(
    `./${process.env.CENTRAL_LOG_FOLDER}/All.txt`
  );
  const csvStream = csv();
  fsStream
    .pipe(csvStream)
    .on("data", (data) => {
      const today = DateTime.now();
      const weekbefore = DateTime.now().minus({ days: 7 });
      const dt = DateTime.fromFormat(data.timestamp, "yyyy-MM-dd'T'HH:mm");
      if (dt < today && dt > weekbefore) {
        results[data.eventSeverity]++;
      }
    })
    .on("end", () => {
      const arr = [];
      for (var key in results) {
        if (results.hasOwnProperty(key)) {
          arr.push({ name: key, count: results[key] });
        }
      }
      res.json(arr);
    });
});
router.get("/eventseverity/:threshold", async (req, res) => {
  let { threshold } = req.params;
  threshold = parseFloat(threshold);
  let results = {
    informational: 0,
    warning: 0,
    error: 0,
    critical: 0,
  };
  const fsStream = fs.createReadStream(
    `./${process.env.CENTRAL_LOG_FOLDER}/All.txt`
  );
  const csvStream = csv();
  fsStream
    .pipe(csvStream)
    .on("data", (data) => {
      const today = DateTime.now();
      const weekbefore = DateTime.now().minus({ days: 7 });
      const dt = DateTime.fromFormat(data.timestamp, "yyyy-MM-dd'T'HH:mm");
      if (dt < today && dt > weekbefore && data.mlRiskScore >= threshold) {
        results[data.eventSeverity]++;
      }
    })
    .on("end", () => {
      const arr = [];
      for (var key in results) {
        if (results.hasOwnProperty(key)) {
          arr.push({ name: key, count: results[key] });
        }
      }
      res.json(arr);
    });
});
router.get("/eventseverityday", async (req, res) => {
  let results = {
    informational: [
      { count: 0, day: 0 },
      { count: 0, day: 0 },
      { count: 0, day: 0 },
      { count: 0, day: 0 },
      { count: 0, day: 0 },
      { count: 0, day: 0 },
      { count: 0, day: 0 },
    ],
    warning: [
      { count: 0, day: 0 },
      { count: 0, day: 0 },
      { count: 0, day: 0 },
      { count: 0, day: 0 },
      { count: 0, day: 0 },
      { count: 0, day: 0 },
      { count: 0, day: 0 },
    ],
    error: [
      { count: 0, day: 0 },
      { count: 0, day: 0 },
      { count: 0, day: 0 },
      { count: 0, day: 0 },
      { count: 0, day: 0 },
      { count: 0, day: 0 },
      { count: 0, day: 0 },
    ],
    critical: [
      { count: 0, day: 0 },
      { count: 0, day: 0 },
      { count: 0, day: 0 },
      { count: 0, day: 0 },
      { count: 0, day: 0 },
      { count: 0, day: 0 },
      { count: 0, day: 0 },
    ],
  };
  const fsStream = fs.createReadStream(
    `./${process.env.CENTRAL_LOG_FOLDER}/All.txt`
  );
  const csvStream = csv();
  fsStream
    .pipe(csvStream)
    .on("data", (data) => {
      const today = DateTime.now();
      const weekbefore = DateTime.now().minus({ days: 7 });
      const dt = DateTime.fromFormat(data.timestamp, "yyyy-MM-dd'T'HH:mm");
      if (dt < today && dt > weekbefore) {
        const indexToUpdate = 7 - today.day + dt.day - 1;
        if (indexToUpdate >= 0 && indexToUpdate <= 6) {
          results[data.eventSeverity][indexToUpdate].count++;
        }
      }
    })
    .on("end", () => {
      const today = DateTime.now();

      Object.keys(results).forEach(function (key, i) {
        results[key].forEach((r, i) => {
          results[key][7 - i - 1].day = today.day - i;
        });
      });
      const resultArray = [];

      for (let day = 13; day <= 19; day++) {
        const dayObject = { day };
        for (const key in results) {
          dayObject[key + "_count"] = results[key].find(
            (item) => item.day === day
          ).count;
        }
        resultArray.push(dayObject);
      }

      console.log(resultArray);
      res.json(results);
    });
});
router.get("/past24hourslogcount", async (req, res) => {
  let count = 0;
  const fsStream = fs.createReadStream(
    `./${process.env.CENTRAL_LOG_FOLDER}/All.txt`
  );
  const csvStream = csv();
  fsStream
    .pipe(csvStream)
    .on("data", (data) => {
      const today = DateTime.now();
      const dayBefore = DateTime.now().minus({ days: 1 });
      const dt = DateTime.fromFormat(data.timestamp, "yyyy-MM-dd'T'HH:mm");
      if (dt < today && dt > dayBefore) {
        count++;
      }
    })
    .on("end", () => {
      res.json(count);
    });
});
router.get("/unique/:parameter", async (req, res) => {
  const { parameter } = req.params;
  const result = new Set();
  const fsStream = fs.createReadStream(
    `./${process.env.CENTRAL_LOG_FOLDER}/All.txt`
  );
  const csvStream = csv();
  fsStream
    .pipe(csvStream)
    .on("data", (data) => {
      const today = DateTime.now();
      const weekBefore = DateTime.now().minus({ days: 7 });
      const dt = DateTime.fromFormat(data.timestamp, "yyyy-MM-dd'T'HH:mm");
      if (dt < today && dt > weekBefore) {
        result.add(data[parameter]);
      }
    })
    .on("end", () => {
      res.json(result.size);
    });
});
router.get("/mlriskday/:threshold", async (req, res) => {
  let { threshold } = req.params;
  threshold = parseFloat(threshold);
  let results = [
    { count: 0, day: 0 },
    { count: 0, day: 0 },
    { count: 0, day: 0 },
    { count: 0, day: 0 },
    { count: 0, day: 0 },
    { count: 0, day: 0 },
    { count: 0, day: 0 },
  ];
  const fsStream = fs.createReadStream(
    `./${process.env.CENTRAL_LOG_FOLDER}/All.txt`
  );
  const csvStream = csv();
  fsStream
    .pipe(csvStream)
    .on("data", (data) => {
      const today = DateTime.now();
      const weekbefore = DateTime.now().minus({ days: 7 });
      const dt = DateTime.fromFormat(data.timestamp, "yyyy-MM-dd'T'HH:mm");
      if (dt < today && dt > weekbefore && data.mlRiskScore >= threshold) {
        const indexToUpdate = 7 - today.day + dt.day - 1;
        if (indexToUpdate >= 0 && indexToUpdate <= 6) {
          results[indexToUpdate].count++;
        }
      }
    })
    .on("end", () => {
      const today = DateTime.now();

      results.forEach((r, i) => {
        results[7 - i - 1].day = today.day - i;
      });
      res.json(results);
    });
});
router.get("/mlriskeventtype/:threshold", async (req, res) => {
  let { threshold } = req.params;
  threshold = parseFloat(threshold);
  let results = {
    "auth-failed": 0,
    "auth-success": 0,
    "auth-lockout": 0,
    "network-connected": 0,
    "network-disconnected": 0,
    "firewall-change": 0,
    "dns-queries": 0,
    "malware-detection": 0,
    "system-shutdown": 0,
    "system-restart": 0,
    "system-failure": 0,
    "application-errors": 0,
    "application-usage": 0,
    "api-called": 0,
    "file-access": 0,
    "permission-changes": 0,
    "software-update": 0,
  };
  const fsStream = fs.createReadStream(
    `./${process.env.CENTRAL_LOG_FOLDER}/All.txt`
  );
  const csvStream = csv();
  fsStream
    .pipe(csvStream)
    .on("data", (data) => {
      const today = DateTime.now();
      const weekbefore = DateTime.now().minus({ days: 7 });
      const dt = DateTime.fromFormat(data.timestamp, "yyyy-MM-dd'T'HH:mm");
      if (dt < today && dt > weekbefore && data.mlRiskScore >= threshold) {
        results[data.eventType]++;
      }
    })
    .on("end", () => {
      res.json(results);
    });
});
router.get("/mlriskuser/:threshold", async (req, res) => {
  let { threshold } = req.params;
  threshold = parseFloat(threshold);
  let results = {
    user123: 0,
    anonymous: 0,
    admin: 0,
    guest: 0,
  };
  const fsStream = fs.createReadStream(
    `./${process.env.CENTRAL_LOG_FOLDER}/All.txt`
  );
  const csvStream = csv();
  fsStream
    .pipe(csvStream)
    .on("data", (data) => {
      const today = DateTime.now();
      const weekbefore = DateTime.now().minus({ days: 7 });
      const dt = DateTime.fromFormat(data.timestamp, "yyyy-MM-dd'T'HH:mm");
      if (dt < today && dt > weekbefore && data.mlRiskScore >= threshold) {
        results[data.user]++;
      }
    })
    .on("end", () => {
      res.json(results);
    });
});
module.exports = router;

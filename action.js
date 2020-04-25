const path = require("path");
const update = require("./update");

const WORKSPACE = process.env.GITHUB_WORKSPACE;
const DATA_REPO = "data"; // from main.yml checkout action path
const MAIN_REPO = "main"; // from main.yml checkout action path

const dataPath = path.join(
  WORKSPACE,
  DATA_REPO,
  "csse_covid_19_data",
  "csse_covid_19_time_series"
);
const outputDir = path.join(WORKSPACE, MAIN_REPO, "docs", "output");
const inputDir = path.join(WORKSPACE, MAIN_REPO, "data", "input");

update(dataPath, inputDir, outputDir);

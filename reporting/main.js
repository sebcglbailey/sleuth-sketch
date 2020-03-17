require("dotenv").config();

let rootProjectDirectory = process.argv[2];
if (
    !rootProjectDirectory ||
    rootProjectDirectory === "--help" ||
    rootProjectDirectory === "-h"
) {
    console.log(
        "usage: npm run report -- [ root_project_directory | abstract ]"
    );
    process.exit();
} else if (rootProjectDirectory === "abstract") {
    rootProjectDirectory = "__TEMP";
}

const fs = require("fs");
const Abstract = require("abstract-sdk");
const del = require("del");
const path = require("path");
const analyzeSketch = require("./analyze-sketch");
const { lstatSync, readdirSync } = fs;
const { join } = path;

const startTime = Date.now();

function cleanFilePaths(string) {
    return string.replace(/\//g, "-");
}

async function run() {
    // If we're using a temporary directory (for abstract), clear our project directory
    if (rootProjectDirectory === "__TEMP") {
        var fileCount = 0;
        if (!fs.existsSync(rootProjectDirectory)) {
            fs.mkdirSync(rootProjectDirectory);
        }
        del.sync([rootProjectDirectory + "/**", "!" + rootProjectDirectory], {
            //force: true,
        });

        // Download sketch files
        const apiClient = new Abstract.Client({
            accessToken: process.env.ABSTRACT_TOKEN
        });
        const cliClient = new Abstract.Client({
            accessToken: process.env.ABSTRACT_TOKEN,
            transportMode: "cli"
        });
        const organizationId = process.env.ABSTRACT_ORG_ID;
        // Get projects
        var projects = await apiClient.projects.list(
            {
                organizationId: organizationId
            },
            { filter: "active" }
        );

        // FILTER THE PROJECTS HERE MAYBE?
        console.log("PROJECTS: ----------------------------");
        const projectFilter = [
            "Android App",
            "iOS App",
            "Web App (Global)",
            "Web App (UK)",
            "OneScore",
            "Web App (Australia)",
            "Web App (India)",
            "Web App (South Africa)",
            "Android App (Templates)",
            "DS Hub",
            "iOS App (Templates)",
            "UI Kits",
            "Web App (Templates)",
            "Career",
            "Connect Website & Portal",
            "Design Portal",
            "Learn",
            "Website",
            "Admin Tool 2.0"
        ];
        projects = projects.filter(project => {
            return projectFilter.includes(project.name);
        });
        console.log(projects);

        const projectKeys = Object.keys(projects);
        let counter = 0;
        for (let pKey in projectKeys) {
            // Each project get master branch files
            counter++;
            const projectName = projects[projectKeys[pKey]].name;

            console.log(
                "Getting project " +
                    counter +
                    " of " +
                    projectKeys.length +
                    " : " +
                    projectName
            );
            const filesIdentifier = {
                projectId: projects[projectKeys[pKey]].id,
                branchId: "master",
                sha: "latest"
            };

            const files = await cliClient.files.list(filesIdentifier);

            fs.mkdirSync(
                rootProjectDirectory +
                    "/" +
                    cleanFilePaths(projects[projectKeys[pKey]].name)
            );
            const fileKeys = Object.keys(files);
            for (let fKey in fileKeys) {
                fileCount += 1;
                // each file download it
                const fileIdentifier = {
                    projectId: projects[projectKeys[pKey]].id,
                    branchId: "master",
                    fileId: files[fileKeys[fKey]].id,
                    sha: "latest"
                };
                const fileProps = {
                    filename:
                        rootProjectDirectory +
                        "/" +
                        cleanFilePaths(projects[projectKeys[pKey]].name) +
                        "/" +
                        cleanFilePaths(files[fileKeys[fKey]].name + ".sketch")
                };

                await cliClient.files.raw(fileIdentifier, fileProps);
            }
        }
        const downloadDoneTime = Date.now();
        const downloadTime = downloadDoneTime - startTime;
        console.log(
            `It took ${downloadTime / 1000} seconds to download all the files`
        );
        console.log(
            `That's ${downloadTime /
                1000 /
                fileCount} seconds per file on average`
        );
    }
}

function report() {
    // Start iterating through files
    const getDirectories = path => {
        return readdirSync(path).filter(filename =>
            lstatSync(join(path, filename)).isDirectory()
        );
    };

    const TARGET_FILE_EXTENSION = ".sketch";
    const RESULT_SAVE_DIRECTORY = join(__dirname, "../src/reports");
    if (!fs.existsSync(RESULT_SAVE_DIRECTORY)) {
        fs.mkdirSync(RESULT_SAVE_DIRECTORY);
    }

    const projectNames = getDirectories(rootProjectDirectory);
    const promises = [];
    const result = {
        timestamp: startTime,
        projects: {}
    };
    projectNames.forEach(projectName => {
        const projectPath = join(rootProjectDirectory, projectName);
        const targetFiles = readdirSync(projectPath).filter(
            filename =>
                path.extname(filename).toLowerCase() === TARGET_FILE_EXTENSION
        );
        const projectResult = (result.projects[projectName] = {});

        targetFiles.forEach(filename => {
            const filePath = join(projectPath, filename);
            const tidyFileName = filename.replace(/\s*\(.*\)\s*|\.sketch/g, "");

            promises.push(
                analyzeSketch(filePath)
                    .then(counts => {
                        projectResult[tidyFileName] = counts;
                        console.log(counts, tidyFileName);
                    })
                    .catch(error => {
                        console.log("error", error);
                    })
            );
        });
    });

    Promise.all(promises)
        .then(() => {
            const endTime = Date.now();
            const elapsed = endTime - startTime;

            fs.writeFileSync(
                `${RESULT_SAVE_DIRECTORY}/${endTime}.json`,
                JSON.stringify(result, null, 4)
            );

            console.log(`It took ${elapsed / 1000} seconds to finish.`);
            console.log(
                `You should run "yarn dev" or "yarn build" to see your report.`
            );
        })
        .catch(error => {
            console.log("Error writing report to file", error);
        });
}

run()
    .then(function() {
        report();
    })
    .then(function() {
        if (rootProjectDirectory === "__TEMP") {
            del.sync([rootProjectDirectory + "/**"]);
        }
    })
    .catch(function(e) {
        console.log(e);
    });

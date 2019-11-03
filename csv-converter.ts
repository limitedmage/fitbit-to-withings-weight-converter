import { promises } from "fs";
import moment from "moment";

interface InputDataFormat {
    logId: string;
    weight: number;
    bmi: number;
    date: string;
    time: string;
    fat: number;
    source: "API" | "Aria"
}

interface DataFormat {
    date: string;
    weight: number;
    fatMass: number;
}

const data: DataFormat[] = [];

async function processFiles() {
    const dir = await promises.opendir("weight");
    for await (const dirent of dir) {
        if (dirent.isFile && dirent.name.startsWith("weight-")) {
            await processInputFile(dirent.name);
        }
    }

    await createOutputFiles();
}

async function processInputFile(fileName: string) {
    const fileContent = await promises.readFile(`weight/${fileName}`, "utf-8");
    const parsedContent = JSON.parse(fileContent) as InputDataFormat[];

    parsedContent.forEach(item => {
        const date = moment(`${item.date} ${item.time}`, "MM/DD/YY hh:mm:ss")
            .format("YYYY-MM-DD hh:mm:ss");
        const weight = item.weight;
        const fatMass = item.fat * item.weight / 100;

        data.push({ date, weight, fatMass });
    });
}

async function createOutputFiles() {
    let fileNumber = 0;
    let lineCount = 0;
    const headers = `Date,"Weight (lb)","Fat mass (lb)"\n`;

    await promises.unlink(`output-${fileNumber}.csv`);
    await promises.appendFile(`output-${fileNumber}.csv`, headers, { encoding: "utf-8" });

    for (let i = 0; i < data.length; i++) {
        const item = data[i];

        const line = `${item.date},${item.weight},${isNaN(item.fatMass) ? "" : item.fatMass}\n`;

        await promises.appendFile(`output-${fileNumber}.csv`, line, { encoding: "utf-8" });

        lineCount += 1;

        if (lineCount > 250) {
            fileNumber += 1;
            lineCount = 0;
            await promises.unlink(`output-${fileNumber}.csv`);
            await promises.appendFile(`output-${fileNumber}.csv`, headers, { encoding: "utf-8" });
        }
    }
}

processFiles().catch(console.error);
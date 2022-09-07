import {writeFileSync, readFileSync} from "fs";
import {join} from "path";

const BASE_PATH = "./" + join("src", "data")

const metro = readFileSync(join(BASE_PATH, "metro.txt"), 'utf8')

metro.split("\n").forEach((line) => {
    console.log(line);
})

import { readFileSync, writeFileSync} from "fs";
import { join } from "path";
const filePath = join( "Convert1.js");
const content = readFileSync(filePath, "utf-8");
const categories = {
    DISTANCE: [],
    WEIGHT: [],
    TEMPERATURE: [],
    VOLUME: [],
    TIME: [],
    ENERGY: [],
    SPEED: [],
    PRESSURE: [],
    AREA: [],
    CHEMICAL: [],
    HEAT: [],
    MASSFLOWRATE: [],
    AEROSPACE: [],
    ANGLE: [],
    DATA: []
};
let currentCategory = "";
const lines = content.split("\n");
console.log(lines);

const accumulator = {
    currentFunction: '',
    isCollecting: false
};

lines.forEach(line => {
    // Start collecting if we find a function declaration
    if (line.includes('function')) {
        accumulator.isCollecting = true;
        accumulator.currentFunction = line;
    }
    // Keep collecting lines until we find a closing brace
    else if (accumulator.isCollecting && !line.includes('}')) {
        accumulator.currentFunction += line;
    }
    // When we find the closing brace, process the complete function
    else if (accumulator.isCollecting && line.includes('}')) {
        accumulator.currentFunction += line;
        const functionMatch = accumulator.currentFunction
            .replace(/\r/g, '')
            .match(/function\s+(\w+)\((\w+)\)\s*{\s*return\s*\((.*?)\);\s*}/);
        
        console.log("Matched function:", functionMatch);
        
        if (functionMatch && currentCategory) {
            const [_, funcName, param, formula] = functionMatch;
            const nameMatch = funcName.match(/([a-zA-Z]+?)[Tt]o([a-zA-Z]+)/i);
            if (nameMatch) {
                const [_, from, to] = nameMatch;
                console.log("Pushing from", from, "to", to);
                if (!categories[currentCategory]) {
                    console.warn(`Category ${currentCategory} not found.`);
                    categories[currentCategory] = [];
                }
                categories[currentCategory].push({
                    name: `${from} to ${to}`,
                    fromUnit: from.toLowerCase(),
                    toUnit: to.toLowerCase(),
                    formula: formula.trim(),
                    parameter: param
                });
            }
        }
        // Reset accumulator
        accumulator.isCollecting = false;
        accumulator.currentFunction = '';
    }
    
    if (line.includes("//")) {
        const category = line.replace("//", "").trim();
        currentCategory = category.replace("CONVERSIONS", "").trim();
        console.log("Parsed category:", currentCategory);
    }
});

const flatData = [];
for(const category in categories) {
    categories[category].forEach(conversion =>
    {
        flatData.push({
            category, 
            ...conversion
        });
    }
    )
}
writeFileSync("convertedForMongoDB.json",
    JSON.stringify(flatData, null, 2)
);
console.log("MongoDB friendly conversions saved");
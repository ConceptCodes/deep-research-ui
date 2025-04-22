import { graph } from "@/lib/deep-research-v2/agent/graph";
import * as fs from "fs";

const test = await graph.getGraphAsync();
const image = await test.drawMermaidPng();
const arrayBuffer = await image.arrayBuffer();

fs.writeFileSync("graph_v2.png", Buffer.from(arrayBuffer));

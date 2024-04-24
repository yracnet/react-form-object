import fs from "fs";
import path from "path";

const distPath = path.resolve("./dist");
const packageJsonPath = path.resolve("./package.json");
const singletonPath = path.resolve("./singleton");
try {
  const exist = fs.existsSync(singletonPath);
  if (exist) {
    fs.rmSync(singletonPath, { recursive: true });
  }
  fs.mkdirSync(singletonPath);
  fs.cpSync(packageJsonPath, path.join(singletonPath, "package.json"));
  fs.cpSync(distPath, path.join(singletonPath, "dist"), { recursive: true });
  console.error("Create singleton directory");
} catch (err) {
  console.error("Error:", err);
}

import fs from "fs";
import path from "path";

const moveDir = (src: string, dest: string) => {
  if (!fs.existsSync(dest)) {
    fs.mkdirSync(dest, { recursive: true });
  }
  const files = fs.readdirSync(src);
  for (const file of files) {
    const srcPath = path.join(src, file);
    const destPath = path.join(dest, file);
    if (fs.statSync(srcPath).isDirectory()) {
      moveDir(srcPath, destPath);
    } else {
      fs.renameSync(srcPath, destPath);
    }
  }
};

moveDir("./components", "./src/components");
moveDir("./lib", "./src/lib");
fs.rmSync("./components", { recursive: true, force: true });
fs.rmSync("./lib", { recursive: true, force: true });
console.log("Moved shadcn files");

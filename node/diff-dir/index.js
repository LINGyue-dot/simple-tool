const fs = require("fs");
const path = require("path");

const originDir = path.resolve(__dirname, "./origin");
const newDir = path.resolve(__dirname, "./new");

// 递归读取文件夹中的所有文件
function readFilesRecursively(directory) {
  let files = [];
  const read = (dir, _relativePath = "") => {
    const items = fs.readdirSync(dir);
    items.forEach((item) => {
      const absolutePath = path.join(dir, item);
      const relativePath = path.join(_relativePath, item);
      const isDirectory = fs.statSync(absolutePath).isDirectory();

      if (isDirectory) {
        read(absolutePath, relativePath); // 递归处理子文件夹
      } else {
        files.push(relativePath);
      }
    });
  };
  read(directory);
  return files;
}

// 比较两个文件夹中文件的内容
function compareDirectories(dir1, dir2) {
  // relative path array
  const originPaths = readFilesRecursively(dir1).sort();
  const newPaths = readFilesRecursively(dir2).sort();

  displayFileArrayDiff(originPaths, newPaths);

  Array.from({ length: originPaths.length }, (_, index) => {
    const originAbsolutePath = path.resolve(originDir, originPaths[index]);
    const newAbsolutePath = path.resolve(newDir, newPaths[index]);

    compareFileContent(originAbsolutePath, newAbsolutePath);
  });
}

const result = compareDirectories(originDir, newDir);

function displayFileArrayDiff(arr1, arr2) {
  const maxLength = Math.max(arr1.length, arr2.length);
  const differences = [];

  for (let i = 0; i < maxLength; i++) {
    if (arr1[i] !== arr2[i]) {
      differences.push({
        index: i,
        value1: arr1[i],
        value2: arr2[i],
      });
    }
  }

  if (differences.length !== 0) {
    console.log("files are different:");
    differences.forEach((difference) => {
      console.log(
        `Index ${difference.index}: origin Files : ${difference.value1} !==  new Files : ${difference.value2}`
      );
    });
    return false;
  }
  return true;
}

function compareFileContent(file1, file2) {
  const content1 = fs.readFileSync(file1, "utf8");
  const content2 = fs.readFileSync(file2, "utf8");

  const lines1 = content1.split("\n");
  const lines2 = content2.split("\n");

  const maxLength = Math.max(lines1.length, lines2.length);
  const differences = [];

  for (let i = 0; i < maxLength; i++) {
    if (lines1[i] !== lines2[i]) {
      differences.push({
        lineNumber: i + 1,
        content1: lines1[i],
        content2: lines2[i],
      });
    }
  }

  if (differences.length === 0) {
    console.log("Files are equal.");
  } else {
    console.log("Files have differences:");
    differences.forEach((difference) => {
      console.log(`Line ${difference.lineNumber}`);
      console.log(
        `  ${file1}:${difference.lineNumber} ->  ${difference.content1}`
      );
      console.log(
        `  ${file2}:${difference.lineNumber} -> ${difference.content2}`
      );
    });
  }
}

const fs = require("fs");
const SourceMap = require("source-map");

// 错误信息，包含行和列信息
const errorInfo = {
  line: 1, // 请根据实际错误信息提供的行数和列数
  column: 1075, // 请根据实际错误信息提供的行数和列数
};

// 读取源代码文件
const sourceCode = fs.readFileSync("./source.js", "utf8");

// 读取 Map 文件
const sourceMap = fs.readFileSync("./source.js.map", "utf8");

// 使用 SourceMapConsumer 加载 Map 文件
SourceMap.SourceMapConsumer.with(sourceMap, null, (consumer) => {
  // 使用 Map 文件将错误信息中的行和列映射到源代码位置
  const originalPosition = consumer.originalPositionFor({
    line: errorInfo.line,
    column: errorInfo.column,
  });

  // 输出源代码位置信息
  console.log("Error occurred in:");
  console.log("File:", originalPosition.source);
  console.log("Line:", originalPosition.line);
  console.log("Column:", originalPosition.column);

  // 输出源代码行
  console.log("\nSource code:");
  console.log(sourceCode.split("\n")[originalPosition.line - 1]);
});

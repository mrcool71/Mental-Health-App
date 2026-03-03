const { withProjectBuildGradle } = require('@expo/config-plugins');

const NOTIFEE_MAVEN_REPO = "maven { url \"$rootDir/../node_modules/@notifee/react-native/android/libs\" }";

function addNotifeeRepoToAllProjectsRepositories(buildGradle) {
  if (buildGradle.includes(NOTIFEE_MAVEN_REPO)) return buildGradle;

  const repositoriesMatch = buildGradle.match(/(^[ \t]*)repositories\s*\{/m);
  if (!repositoriesMatch) return buildGradle;

  const repositoriesIndent = repositoriesMatch[1] ?? "";
  const insertIndent = `${repositoriesIndent}  `;
  const repositoriesStart = repositoriesMatch.index;
  const openBraceIndex = buildGradle.indexOf("{", repositoriesStart);
  if (openBraceIndex === -1) return buildGradle;

  // Find the matching closing brace for the repositories { ... } block.
  let depth = 0;
  let closeBraceIndex = -1;
  for (let i = openBraceIndex; i < buildGradle.length; i += 1) {
    const ch = buildGradle[i];
    if (ch === "{") depth += 1;
    if (ch === "}") {
      depth -= 1;
      if (depth === 0) {
        closeBraceIndex = i;
        break;
      }
    }
  }

  if (closeBraceIndex === -1) return buildGradle;

  const insertion = `\n${insertIndent}${NOTIFEE_MAVEN_REPO}`;
  return `${buildGradle.slice(0, closeBraceIndex)}${insertion}\n${buildGradle.slice(closeBraceIndex)}`;
}

module.exports = function withNotifeeMavenRepo(config) {
  return withProjectBuildGradle(config, (config) => {
    config.modResults.contents = addNotifeeRepoToAllProjectsRepositories(config.modResults.contents);
    return config;
  });
};

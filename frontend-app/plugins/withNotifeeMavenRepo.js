const { withProjectBuildGradle } = require('@expo/config-plugins');

const NOTIFEE_MAVEN_LINE = 'maven { url "$rootDir/../node_modules/@notifee/react-native/android/libs" }';

function addNotifeeRepo(buildGradle) {
  if (buildGradle.includes(NOTIFEE_MAVEN_LINE)) return buildGradle;

  // Target the allprojects { repositories { ... } } block specifically.
  const allProjectsMatch = buildGradle.match(/allprojects\s*\{/);
  if (!allProjectsMatch) return buildGradle;

  const searchStart = allProjectsMatch.index + allProjectsMatch[0].length;
  const reposMatch = buildGradle.substring(searchStart).match(/([ \t]*)repositories\s*\{/);
  if (!reposMatch) return buildGradle;

  const reposOpenIndex = searchStart + reposMatch.index + reposMatch[0].length;
  const indent = (reposMatch[1] ?? '') + '    ';

  // Find matching closing brace
  let depth = 1;
  let closeIndex = -1;
  for (let i = reposOpenIndex; i < buildGradle.length; i++) {
    if (buildGradle[i] === '{') depth++;
    if (buildGradle[i] === '}') { depth--; if (depth === 0) { closeIndex = i; break; } }
  }
  if (closeIndex === -1) return buildGradle;

  const insertion = `\n${indent}${NOTIFEE_MAVEN_LINE}`;
  return buildGradle.slice(0, closeIndex) + insertion + '\n' + buildGradle.slice(closeIndex);
}

module.exports = function withNotifeeMavenRepo(config) {
  return withProjectBuildGradle(config, (cfg) => {
    cfg.modResults.contents = addNotifeeRepo(cfg.modResults.contents);
    return cfg;
  });
};

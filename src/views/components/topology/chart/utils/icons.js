const requireComponent = require.context('../../assets', false, /\.png$/);

const result = {};
function capitalizeFirstLetter(str) {
  return str.toUpperCase();
}
function validateFileName(str) {
  return /^\S+\.png$/.test(str) && str.replace(/^\S+\/(\w+)\.png$/, (rs, $1) => capitalizeFirstLetter($1));
}
requireComponent.keys().forEach((filePath) => {
  const componentConfig = requireComponent(filePath);
  const fileName = validateFileName(filePath);
  result[fileName] = componentConfig;
});
export default result;

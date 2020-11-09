'use strict';

function fillCodeTemplate(templateString, substitutions) {
  return templateString.replace(
    /~"(\w+)"/g,
    (_, fieldName) => substitutions[fieldName]
  );
}

module.exports = fillCodeTemplate;

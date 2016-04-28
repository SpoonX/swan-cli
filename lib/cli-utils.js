const config = require('./config');
const path   = require('path');

module.exports.questions = function(questionsObject) {
  var questions = [];

  Object.getOwnPropertyNames(questionsObject).forEach(function(questionKey) {
    var question = questionsObject[questionKey];

    if (typeof question === 'string') {
      question = {
        message: question,
        type   : question.trim().slice(-1) === '?' ? 'confirm' : 'input'
      };
    }

    question.name = questionKey;

    questions.push(question);
  });

  return questions;
};

module.exports.path = function(side, dir) {
  return path.join(process.cwd(), config.project[side].directory, dir || '');
};

module.exports.bin = function (side) {
  return module.exports.path(side, config.runners[side].bin);
};

module.exports.config = config;

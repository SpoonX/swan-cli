module.exports.questions = function(questionsObject) {
  var questions = [];

  Object.getOwnPropertyNames(questionsObject).forEach(function(questionKey) {
    var question = questionsObject[questionKey];

    if (typeof question === 'string') {
      question = {
        message: question,
        type: question.trim().slice(-1) === '?' ? 'confirm' : 'input'
      };
    }

    question.name = questionKey;

    questions.push(question);
  });

  return questions;
};

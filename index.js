var inquirer  = require("inquirer");
var validator = require('validator');
var questions = [
  {
    name: 'firstName',
    message: 'What is your first name?',
    validate: function (input) {
      return validator.isAlpha(input);
    }
  },
  {
    name:'kak',
    message :'dit dan maar doen?',
    type: 'confirm'
  },
  {
    name: 'pets',
    message: 'Which of these pets do you own?',
    type: 'checkbox',
    choices: ['Cat', 'Dog', 'Alligator', 'Swan', 'Donkey']
  }
];

inquirer.prompt(questions, function(answers) {
  console.log('Got these answers!', answers);
});

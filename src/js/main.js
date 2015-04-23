//Use CommonJS style via browserify to load other modules
require("./lib/social");
require("./lib/ads");

//Use CommonJS style via browserify to load other modules

var $ = require("jquery");
var ich = require("icanhaz");
var questionTemplate = require("./_questionTemplate.html");
var resultTemplate = require("./_resultTemplate.html");
var overviewTemplate = require("./_overviewTemplate.html");

var score = 0;
var id = 1;

// Set up templates
ich.addTemplate("questionTemplate", questionTemplate);
ich.addTemplate("resultTemplate", resultTemplate);
ich.addTemplate("overviewTemplate", overviewTemplate);

var Share = require("share");
new Share(".share-button", {
  ui: {
    flyout: "bottom left"
  }
});

var showQuestion = function(questionId) {
  $(".question-box").html(ich.questionTemplate(quizData[id]));
  $(".index").html(id + " of " + Object.keys(quizData).length);
};

var watchInput = function() {
// show submit button when answer is selected
  $(".quiz-box").on("click", "input", (function(){
    $(".submit").addClass("active");
    $(".submit").attr("disabled", false);
  }));
};

$(".quiz-container").on("click", ".submit", function() {
      // score answer
      var answerData = {};
      answerData.place = quizData[id].place;
      var correct = $("input:checked").val();
      if (correct) { 
        score += 1;
        answerData.hooray = true;
      }
      // keep track of selected answer
      quizData[id].answers.forEach(function(a) {
        if (a.correct) {
          answerData.correct = a.answer;
          answerData.audio = a.audio;
          answerData.image = quizData[id].image;
          answerData.description = quizData[id].desc;
        }
      });

      $(".question-box").html(ich.resultTemplate(answerData));
      $(".index").html(id + " of " + Object.keys(quizData).length);

      // Change button text on last question
      if (id == Object.keys(quizData).length) {
        $(".next").html("FINISH");
      }
      watchNext();
  });


var watchNext = function() {
  $(".next").click(function() {
    if (id < Object.keys(quizData).length) {
      // move on to next question
      id += 1;
      showQuestion(id);
      $(".next").removeClass("active");
      $(".next").attr("disabled", true);
    } else {
      calculateResult();
    }
  });
};

var calculateResult = function() {
  for (var index in resultsData) {
    var result = resultsData[index];
    if (score >= result.min && score <= result.max) {
      // display result
      result.score = score;
      var answerKey = [];
      for (var question in quizData) { answerKey.push(quizData[question]) }
      result.answerKey = answerKey;
      $(".question-box").html(ich.overviewTemplate(result));
    }
  }
};

$(".quiz-button").click(function(){
  showQuestion(id);
  watchInput();

  var box = $(".question-box")[0];
  box.style.height = "auto";
  var bounds = box.getBoundingClientRect();
  box.style.height = "0";
  setTimeout(function() {
    box.style.height = bounds.height + "px";
  });
  setTimeout(function(){
    box.style.height = "auto";
  }, 500);

  $(".button-wrapper").addClass("transition-out");
});

$(".quiz-container").on("click", ".listen", function(e){
  $(e.target).next("audio")[0].play();
});
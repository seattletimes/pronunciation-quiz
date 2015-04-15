//Use CommonJS style via browserify to load other modules
require("./lib/social");
require("./lib/ads");

//Use CommonJS style via browserify to load other modules

var $ = require("jquery");
var ich = require("icanhaz");
var questionTemplate = require("./_questionTemplate.html");
var resultTemplate = require("./_resultTemplate.html");

var score = 0;
var id = 1;

// Set up templates
ich.addTemplate("questionTemplate", questionTemplate);
ich.addTemplate("resultTemplate", resultTemplate);

var Share = require("share");
new Share(".share-button", {
  ui: {
    flyout: "bottom left"
  }
});

var showQuestion = function(questionId) {
  $(".question-box").html(ich.questionTemplate(quizData[id]));
  $(".index").html("( " + id + " of " + Object.keys(quizData).length + " )");
};

var watchInput = function() {
// show next button when answer is selected
  $(".quiz-box").on("click", "input", (function(){
    $(".next").addClass("active");
    $(".next").attr("disabled", false);
    watchNext();
  }));
};

var watchNext = function() {
  $(".next").click(function() {
    // score answer
    var correct = $("input:checked").val();
    if (correct) { score += 1 }
    // keep track of selected answer
    quizData[id].answers.forEach(function(answer) {
      if (answer.id == $("input:checked").attr("id")) {
        answer.selected = "x";
      }
    });

    $(".question-box").html(ich.resultTemplate(quizData[id]));

    // move on to next question
    // if (id < Object.keys(quizData).length) {
    // if (id < 1) {
    //   id += 1;
    //   showQuestion(id);
    //   $(".next").removeClass("active");
    //   $(".next").attr("disabled", true);
    //   // Change button text on last question
    //   if (id == Object.keys(quizData).length) {
    //     $(".next").html("FINISH");
    //   }
    // } else {
    //   calculateResult();
    // }
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
      $(".question-box").html(ich.resultTemplate(result));
    }
  }

  $(".retake").removeClass("hidden");
  $(".quiz-container").addClass("results");
  $(".share-button").addClass("share-results");
};

$(".quiz-button").click(function(){
  showQuestion(id);
  watchInput();

  var box = $(".question-box")[0];
  box.style.height = "auto";
  var bounds = box.getBoundingClientRect();
  box.style.height = "0";
  $(".question-box").addClass("transition-in");
  setTimeout(function() {
    box.style.height = bounds.height + "px";
  });
  setTimeout(function(){
    $(".question-box").removeClass("transition-in");
    box.style.height = "auto";
  }, 500);

  $(".quiz-button").addClass("transition-out");
});

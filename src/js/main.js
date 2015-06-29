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
    flyout: "top center"
  }
});

var showQuestion = function(questionId) {
  var qBox = $(".question-box");
  //remove old event listeners for memory obsessiveness
  qBox.find("audio").off("loadstart canplay");
  //create new question from template
  qBox.html(ich.questionTemplate(quizData[id]));
  $(".index").html(id + " of " + Object.keys(quizData).length);
  //get audio tags, add load indicators
  var audio = qBox.find("audio");
  audio.on("loadstart", function(e) {
    $(this).siblings("i.fa").addClass("fa-spinner fa-spin");
  });
  audio.on("canplay", function(e) {
    $(this).siblings("i.fa").removeClass("fa-spinner fa-spin");
  });
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
        $(".next").html("See results");
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

showQuestion(id);
watchInput();

$(".quiz-container").on("click", ".listen", function(e){
  $(e.target).next("audio")[0].play();
});
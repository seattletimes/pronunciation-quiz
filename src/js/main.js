//Use CommonJS style via browserify to load other modules
require("./lib/social");
require("./lib/ads");

//Use CommonJS style via browserify to load other modules

var $ = require("jquery");
var ich = require("icanhaz");
var Share = require("share");
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
  description: "Think you can pronounce the names of Washington places? Test your local knowledge with our quiz.",
  image: "http://apps-stage.seattletimesdata.com/extensive-voodoo/assets/fb_pysht.JPG",
  ui: {
    flyout: "top center"
  },
  networks: {
    email: {
      description: "Think you can pronounce the names of Washington places? Test your local knowledge with our quiz. http://apps-stage.seattletimesdata.com/extensive-voodoo/"
    }
  }
});

var audioCleanup = function() {
  $(".question-box audio").off("loadstart canplay");
};

var audioListeners = function() {
  var audio = $(".question-box audio");
  audio.on("loadstart play", function(e) {
    $(this).siblings("i.fa").addClass("fa-spinner fa-spin");
  });
  audio.on("canplaythrough suspend ended timeupdate", function(e) {
    $(this).siblings("i.fa").removeClass("fa-spinner fa-spin");
  });
};

var showQuestion = function(questionId) {
  audioCleanup();
  //create new question from template
  $(".question-box").html(ich.questionTemplate(quizData[id]));
  $(".index").html(id + " of " + Object.keys(quizData).length);
  audioListeners();
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

  audioCleanup();
  $(".question-box").html(ich.resultTemplate(answerData));
  audioListeners();
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
      if (result.score > 5) { 
        result.color = "#589040"
      } else if (result.score > 2) { 
        result.color = "#F5AE3F"
      } else {
        result.color = "#DE5636"
      }
      new Share(".share-results", {
        description: "I scored " + result.score + "/12! Think you can pronounce the names of these Washington places?",
        image: "http://apps-stage.seattletimesdata.com/extensive-voodoo/assets/fb_pysht.JPG",
        ui: {
          flyout: "bottom right"
        },
        networks: {
          email: {
            description: "I scored " + result.score + "/12! Think you can pronounce the names of these Washington places? http://apps-stage.seattletimesdata.com/extensive-voodoo/"
          }
        }
      });
      $(".question-box").html(ich.overviewTemplate(result));
    }
  }
};

showQuestion(id);
watchInput();

$(".quiz-container").on("click", ".listen", function(e){
  $(e.target).next("audio")[0].play();
});
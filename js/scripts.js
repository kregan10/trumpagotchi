var Tamagotchi = {

  initialize: function (name, imageNumber, birthdate) {
    this.name = name;
    this.image = imageNumber;
    this.birthdate = birthdate;
    this.isGolfing = false;
    this.egoLevel = 10;
    this.fakeNewsLevel = 10;
    this.restedLevel = 10;
    this.twitterLevel = 10;
    this.healthLevel = 10;
  },

  calcHealthLevel: function () {
    var tempHealthLevel = (this.egoLevel + this.fakeNewsLevel + this.restedLevel + this.twitterLevel) / 4;
    if ((this.healthLevel >= 15) && (tempHealthLevel >= 15)) {
      return 15;
    } else {
      return ((tempHealthLevel + this.healthLevel)/2);
    };
  },

// Action functions - need buttons

  strokeEgo: function () {
    if (this.egoLevel < 15) {
      this.egoLevel++;
    };
  },

  denounceNews: function () {
    if (this.fakeNewsLevel < 15) {
      this.fakeNewsLevel++;
    };
  },

  deleteTweet: function () {
    if (this.fakeNewsLevel < 15) {
      this.fakeNewsLevel++;
    };
  },

  medicine: function () {
    if (this.healthLevel < 15) {
      this.healthLevel++;
    };
  },

  goGolfing: function () {
    if (!this.isGolfing) {
      this.isGolfing = true;
    };
  },

// State variable readers

  isAlive: function () {
    if ((this.healthLevel < 2) || (this.egoLevel === 0)) {
      return false;
    } else {
      return true;
    };
  },

// Warning functions

  restedLevelWarning: function () {
    var restedWarning = false;
      if (this.restedLevel < 4) {
        restedWarning = true;
      };
    return restedWarning;
  },

  egoLevelWarning: function () {
    var foodWarning = false;
      if (this.egoLevel < 4) {
        foodWarning = true;
      };
    return foodWarning;
  },

  fakeNewsLevelWarning: function () {
    var happinessWarning = false;
      if (this.fakeNewsLevel < 4) {
        happinessWarning = true;
      };
    return happinessWarning;
  },

  healthLevelWarning: function () {
    var healthWarning = false;
      if (this.healthLevel < 4) {
        healthWarning = true;
      };
    return healthWarning;
  },

// Time passes

  timePasses: function (intervalID) {
    if (this.isGolfing) {
      if (this.restedLevel < 15) {
        this.restedLevel++;
      };
      if (this.fakeNewsLevel > 0) {
        this.fakeNewsLevel--;
      };
    } else { // is awake
      if (this.egoLevel > 0) {
        this.egoLevel--;
      };
      if (this.restedLevel > 0) {
        this.restedLevel--;
      };
      if (this.fakeNewsLevel > 0) {
        this.fakeNewsLevel--;
      };
      if (this.twitterLevel > 0) {
        this.fakeNewsLevel--;
      };
    };
    this.healthLevel = this.calcHealthLevel();
    this.setTamagotchiMeters(intervalID);
  },

  setTamagotchiMeters: function (intervalID) {

    if (this.isGolfing) {
      $(".asleep-or-awake").html("<img src='./img/bird-asleep.png' class='tiny-photo-width'>")
    } else {
      $(".asleep-or-awake").html("<img src='./img/bird-awake.png' class='tiny-photo-width'>")
    };

    $(".food-meter").html("<meter value=" + this.egoLevel + " min='-1' low='3' high='8' optimum='10' max='15'></meter>");
    $(".happiness-meter").html("<meter value=" + this.fakeNewsLevel + " min='-1' low='4' high='8' optimum='10' max='15'></meter>");
    $(".twitter-meter").html("<meter value=" + this.twitterLevel + " min='-1' low='3' high='8' optimum='10' max='15'></meter>");
    $(".rested-meter").html("<meter value=" + this.restedLevel + " min='-1' low='3' high='8' optimum='10' max='15'></meter>");
    this.healthLevel = this.calcHealthLevel();
    $(".health-meter").html("<meter value=" + this.healthLevel + " min='-1' low='4' high='8' optimum='10' max='15'></meter>");

    $(".alert").removeClass("alert-warning");
    $(".alert-msg").text("");

    if (!this.isAlive()) {
      $("#form-to-disappear").show();
      $(".alert").addClass("alert-danger");
      $(".alert-msg").text("Too late! Trump is IMPEACHED!");
      $(".show-message").html("<h6>&nbsp</h6><img class='flip-vertical photo-width' src='./img/char" + this.image + ".png' alt='Picture of character'>");
      $(".asleep-or-awake").html("<img src='./img/bird-asleep.png' class='tiny-photo-width'>");
      $("button#strokeEgo img").addClass("opaque")
      $("button#strokeEgo").off("click");
      $("button#denounceNews img").addClass("opaque")
      $("button#denounceNews").off("click");
      $("button#deleteTweet img").addClass("opaque")
      $("button#deleteTweet").off("click");
      clearInterval(intervalID);
    } else if (this.healthLevelWarning()) {
      $(".alert").addClass("alert-warning");
      $(".alert-msg").text("Trump is getting impeached! Stroke ego, denounceNews, or delete Tweets!")
    } else if (this.egoLevelWarning()) {
      $(".alert").addClass("alert-warning");
      $(".alert-msg").text("Trump is upset, stroke his ego!");
    } else if (this.fakeNewsLevelWarning()) {
      $(".alert").addClass("alert-warning");
      $(".alert-msg").text("Your Tamagotchi is sad: denounceNews with it!");
    } else if (this.restedLevelWarning()) {
      $(".alert").addClass("alert-warning");
      $(".alert-msg").text("Your Tamagotchi is tired: Put it to bed!")
    };
  }
}; // end Tamagotchi

var printValue = function (control1, control2) {
  var difficulty
  if (!$("input#" + control1).disabled) {
    difficulty = $("input#" + control1).val();
    $("input#" + control2).val(difficulty);
  };
}

$(document).ready (function () {

  var numberImage = -1;

  for (var index = 0; index < 9; index++) { // create click handlers for images
    $("img#button" + index).click (function (lockedInIndex) {
      return function (event) {
        event.preventDefault();
        $(".show-message").html("<h6>&nbsp</h6><img class='photo-width' src='./img/char" + lockedInIndex + ".png' alt='Picture of character'>");
        numberImage = lockedInIndex;
      };
    } (index)); // immediately invoked function expression
  };

  $("form#form-to-disappear").submit(function(event){

    event.preventDefault();

    var inputtedName = "Trump";
    var inputtedBirthday = "Trump";

    $(".tamagotchi-name").text(inputtedName);

    $("input#tamagotchi-name").val("");
    $("input#tamagotchi-birthday").val("");

    $("#form-to-disappear").hide();
    $("#show-name-birthday").show();

    var difficulty = $("input#difficulty-range").val();
    $("input#difficulty-text").val(difficulty);
    // I could not seem to disable the slider so I wrote over the html instead
    $(".disable-slider").html('<input id="difficulty-range" type ="range" min ="100" max="1000" step ="100" value=' + difficulty + ' disabled="disabled">');

    var myTamagotchi = Object.create(Tamagotchi);
    myTamagotchi.initialize(inputtedName, numberImage);

    myTamagotchi.setTamagotchiMeters(0);
    $("#meter-area").show();

    var intervalID;

    intervalID = setInterval(function() {
      myTamagotchi.timePasses();
      if (!myTamagotchi.isAlive()) {
        clearInterval(intervalID);
      };
    }, difficulty);

    $("button#strokeEgo").click (function () {
      clearInterval(intervalID);
      myTamagotchi.setTamagotchiMeters();
      if (myTamagotchi.isGolfing) {
        myTamagotchi.isGolfing = false;
      };
      myTamagotchi.strokeEgo();
      myTamagotchi.setTamagotchiMeters();
      if (myTamagotchi.isAlive) {
        intervalID = setInterval(function() {
          myTamagotchi.timePasses();
          if (!myTamagotchi.isAlive()) {
            clearInterval(intervalID);
          };
        }, difficulty);
      };
    });

    $("button#denounceNews").click (function () {
      clearInterval(intervalID);
      myTamagotchi.setTamagotchiMeters();
      if (myTamagotchi.isGolfing) {
        myTamagotchi.isGolfing = false;
      };
      myTamagotchi.denounceNews();
      myTamagotchi.setTamagotchiMeters();
      if (myTamagotchi.isAlive) {
        intervalID = setInterval(function() {
          myTamagotchi.timePasses();
          if (!myTamagotchi.isAlive()) {
            clearInterval(intervalID);
          };
        }, difficulty);
      };
    });

    $("button#goGolfing").click (function () {
      clearInterval(intervalID);
      myTamagotchi.setTamagotchiMeters();
      myTamagotchi.goGolfing();
      myTamagotchi.setTamagotchiMeters();
      if (myTamagotchi.isAlive) {
        intervalID = setInterval(function() {
          myTamagotchi.timePasses();
          if (!myTamagotchi.isAlive()) {
            clearInterval(intervalID);
          };
        }, difficulty);
      };
    });

    $("button#deleteTweet").click (function () {
      clearInterval(intervalID);
      if (myTamagotchi.isGolfing) {
        myTamagotchi.isGolfing = false;
      };
      myTamagotchi.setTamagotchiMeters();
      myTamagotchi.deleteTweet();
      myTamagotchi.setTamagotchiMeters();
      if (myTamagotchi.isAlive) {
        intervalID = setInterval(function() {
          myTamagotchi.timePasses();
          if (!myTamagotchi.isAlive()) {
            clearInterval(intervalID);
          };
        }, difficulty);
      };
    });
  }); // end form submit

});

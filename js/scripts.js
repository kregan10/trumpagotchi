difficulty = 450;
var Tamagotchi = {

  initialize: function () {
    var d = new Date();
    this.isGolfing = false;
    this.egoLevel = 10;
    this.fakeNewsLevel = 10;
    this.restedLevel = 10;
    this.twitterLevel = 10;
    this.healthLevel = 10;
    startTime = d.getTime();
  },

  calcHealthLevel: function () {
    var tempHealthLevel = (this.egoLevel + this.fakeNewsLevel + this.restedLevel + this.twitterLevel) / 4;
    if ((this.healthLevel >= 15) && (tempHealthLevel >= 15)) {
      return 15;
    } else {
      return Math.floor((tempHealthLevel + this.healthLevel)/2);
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
    if (this.twitterLevel < 15) {
      this.twitterLevel++;
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
    if (this.healthLevel < 1) {
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
        console.log("fakeNews", this.fakeNewsLevel);
        this.fakeNewsLevel--;
      };
      if(this.restedLevel > 14) {
        this.isGolfing = false;
      }
    } else { // is awake
      if (this.egoLevel > 0) {
        this.egoLevel--;
      };
      if (this.restedLevel > 0) {
        this.restedLevel--;
      };
      if (this.fakeNewsLevel > 0) {
        console.log("fakeNews", this.fakeNewsLevel);
        this.fakeNewsLevel--;
      };
      if (this.twitterLevel > 0) {
        this.twitterLevel--;
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

    $(".ego-meter").html("<meter value=" + this.egoLevel + " min='-1' low='3' high='8' optimum='10' max='15'></meter>");
    $(".happiness-meter").html("<meter value=" + this.fakeNewsLevel + " min='-1' low='4' high='8' optimum='10' max='15'></meter>");
    $(".twitter-meter").html("<meter value=" + this.twitterLevel + " min='-1' low='3' high='8' optimum='10' max='15'></meter>");
    $(".rested-meter").html("<meter value=" + this.restedLevel + " min='-1' low='3' high='8' optimum='10' max='15'></meter>");
    this.healthLevel = this.calcHealthLevel();
    $(".health-meter").html("<meter value=" + this.healthLevel + " min='-1' low='4' high='8' optimum='10' max='15'></meter>");

    $(".alert").removeClass("alert-warning");
      $(".alert").hide();

    if (!this.isAlive()) {
      $("#form-to-disappear").show();
      $(".alert").show();

      $(".alert").addClass("alert-danger");
      let endTime = new Date();
      $(".alert-msg").text("Too late! Trump is IMPEACHED! You lasted " + (Math.floor(((endTime.getTime() - startTime) /1000) /2)) + " Months in office");
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
      $(".alert-msg").text("Trump is getting impeached! Stroke ego, denounceNews, go golfing, or delete Tweets!")
    } else if (this.egoLevelWarning()) {
      $(".alert").addClass("alert-warning");
      $(".alert-msg").text("Trump is upset, stroke his ego!");
    } else if (this.fakeNewsLevelWarning()) {
      $(".alert").addClass("alert-warning");
      $(".alert-msg").text("FAKE NEWS! Denounce fake news!");
    } else if (this.restedLevelWarning()) {
      $(".alert").addClass("alert-warning");
      $(".alert-msg").text("Trump is tired, go golfing!")
    };
  }
}; // end Tamagotchi

$(document).ready (function () {

  var numberImage = -1;

  $("form#form-to-disappear").submit(function(event){

    event.preventDefault();

    $("#form-to-disappear").hide();

    
    var myTamagotchi = Object.create(Tamagotchi);
    myTamagotchi.initialize();

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

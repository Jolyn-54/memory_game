var matchingGame = {};
matchingGame.deck = [
  'cardAK', 'cardAK',
  'cardAQ', 'cardAQ',
  'cardAJ', 'cardAJ',
  'cardBK', 'cardBK',
  'cardBQ', 'cardBQ',
  'cardBJ', 'cardBJ',
];

function shuffle() {
  return 0.5 - Math.random();
}

function selectCard() {
  if (document.querySelectorAll(".card-flipped").length > 1) {
    return;
  }
  this.classList.add("card-flipped");

  if (document.querySelectorAll(".card-flipped").length === 2) {
    setTimeout(checkPattern, 700);
  }
}

function checkPattern() {
  if (isMatchPattern()) {
    document.querySelectorAll(".card-flipped").forEach(function(card) {
      card.classList.remove("card-flipped");
      card.classList.add("card-removed");
      card.addEventListener("transitionend", removeTookCards);
    });
  } else {
    document.querySelectorAll(".card-flipped").forEach(function(card) {
      card.classList.remove("card-flipped");
    });
  }
}

function isMatchPattern() {
  var cards = document.querySelectorAll(".card-flipped");
  var pattern = cards[0].getAttribute("data-pattern");
  var anotherPattern = cards[1].getAttribute("data-pattern");
  return pattern === anotherPattern;
}

function removeTookCards(event) {
  event.target.remove();
}

document.addEventListener("DOMContentLoaded", function() {
  matchingGame.deck.sort(shuffle);

  for (var i = 0; i < 11; i++) {
    var card = document.querySelector(".card").cloneNode(true);
    document.querySelector("#cards").appendChild(card);
  }

  document.querySelectorAll("#cards .card").forEach(function(card, index) {
    var x = (card.offsetWidth + 20) * (index % 4);
    var y = (card.offsetHeight + 20) * Math.floor(index / 4);
    card.style.transform = "translateX(" + x + "px) translateY(" + y + "px)";

    var pattern = matchingGame.deck.pop();
    card.querySelector(".back").classList.add(pattern);
    card.setAttribute("data-pattern", pattern);

    card.addEventListener("click", selectCard);
  });
});
import "@/main.scss";
import Game from "@/game";
import Hand from "@/hand";

const rock = new Hand("rock");
const paper = new Hand("paper");
const scissors = new Hand("scissors");

rock.winsAgainst(scissors);
paper.winsAgainst(rock);
scissors.winsAgainst(paper);

const game = new Game(document.querySelector("#game"));
game.setHands([rock, paper, scissors]);

var 상대 = {
  영웅: document.getElementById("rival-hero"),
  덱: document.getElementById("rival-deck"),
  필드: document.getElementById("rival-cards"),
  코스트: document.getElementById("rival-cost"),
  덱data: [],
  영웅data: [],
  필드data: [],
  선택카드: null,
  선택카드data: null,
};

var 나 = {
  영웅: document.getElementById("my-hero"),
  덱: document.getElementById("my-deck"),
  필드: document.getElementById("my-cards"),
  코스트: document.getElementById("my-cost"),
  덱data: [],
  영웅data: [],
  필드data: [],
  선택카드: null,
  선택카드data: null,
};

var 턴버튼 = document.getElementById("turn-btn");
var 턴 = true; // true면 내턴,false면 상대턴

function 덱에서필드로(데이터, 내턴) {
  var 객체 = 내턴 ? 나 : 상대; // 삼항연산자 if문 대체 가능 내턴일때 true면 나 false면 상대 // 조건? 참 : 거짓
  var 현재코스트 = Number(객체.코스트.textContent);
  if (현재코스트 < 데이터.cost) {
    return "end"; // 현재 코스트보다 뽑으려는 카드 코스트가 높으면 못뽑음
  }
  var idx = 객체.덱data.indexOf(데이터);
  객체.덱data.splice(idx, 1);
  객체.필드data.push(데이터);
  객체.덱.innerHTML = "";
  객체.필드.innerHTML = "";
  객체.필드data.forEach(function (data) {
    카드돔연결(data, 객체.필드);
  });
  객체.덱data.forEach(function (data) {
    카드돔연결(data, 객체.덱);
  });
  데이터.field = true;
  객체.코스트.textContent = 현재코스트 - 데이터.cost;
}

function 화면다시그리기(내화면) {
  var 객체 = 내화면 ? 나 : 상대;
  객체.덱.innerHTML = "";
  객체.필드.innerHTML = "";
  객체.영웅.innerHTML = "";
  객체.필드data.forEach(function (data) {
    카드돔연결(data, 객체.필드);
  });
  객체.덱data.forEach(function (data) {
    카드돔연결(data, 객체.덱);
  });
  카드돔연결(객체.영웅data, 객체.영웅, true);
}

function 카드돔연결(데이터, 돔, 영웅) {
  var 카드 = document.querySelector(".card-hidden .card").cloneNode(true); // cloneNode로 기존 태그를 그대로 복사할수 있다 인자에 true값을 넣으면 내부까지 복사
  카드.querySelector(".card-cost").textContent = 데이터.cost;
  카드.querySelector(".card-att").textContent = 데이터.att;
  카드.querySelector(".card-hp").textContent = 데이터.hp;
  if (영웅) {
    카드.querySelector(".card-cost").style.display = "none";
    var 이름 = document.createElement("div");
    이름.textContent = "영웅";
    카드.appendChild(이름);
  }
  카드.addEventListener("click", function () {
    if (턴) {
      if (!카드.classList.contains("card-turnover")) {
        return;
      }
      if (!데이터.mine && 나.선택카드) {
        // 상대 카드고 내카드가 선택되어 있고 또 턴이 끝난 카드가 아니면

        데이터.hp = 데이터.hp - 나.선택카드.att; // 체력을 상대카드 체력과 내 카드 공격력에서 뺀만큼
        화면다시그리기(false);
        나.선택카드.classList.remove("card-selected");
        나.선택카드.classList.add("card-turnover");
        나.선택카드 = null; // 그 후 내 선택카드를 헤제
        나.선택카드data = null;
        return;
      } else if (!데이터.mine) {
        // 상대 카드라면
        return; // 바로 종료
      }
      if (데이터.field) {
        카드.parentNode.querySelectorAll(".card").forEach(function (card) {
          card.classList.remove("card-selected");
        });
        카드.classList.add("card-selected");
        나.선택카드 = 카드; // 내가 선택한 카드를 변수에 저장
        나.선택카드data = 데이터;
      } else {
        // 덱이 있으면
        if (덱에서필드로(데이터, true) !== "end") {
          내덱생성(1);
        }
      }
    } else {
      //
      if (데이터.mine || 데이터.field) {
        return;
      }
      if (덱에서필드로(데이터, false) !== "end") {
        상대덱생성(1);
      }
    }
  });
  돔.appendChild(카드);
}

function 상대덱생성(개수) {
  for (var i = 0; i < 개수; i++) {
    상대.덱data.push(카드공장());
  }
  상대.덱.innerHTML = "";
  상대.덱data.forEach(function (data) {
    카드돔연결(data, 상대.덱);
  });
}
function 내덱생성(개수) {
  for (var i = 0; i < 개수; i++) {
    나.덱data.push(카드공장(false, true));
  }
  나.덱.innerHTML = "";
  나.덱data.forEach(function (data) {
    카드돔연결(data, 나.덱);
  });
}
function 내영웅생성() {
  나.영웅data = 카드공장(true, true);
  카드돔연결(나.영웅data, 나.영웅, true);
}
function 상대영웅생성() {
  상대.영웅data = 카드공장(true);
  카드돔연결(상대.영웅data, 상대.영웅, true);
}

function Card(영웅, 내카드) {
  if (영웅) {
    this.att = Math.ceil(Math.random() * 2);
    this.hp = Math.ceil(Math.random() * 5) + 25;
    this.hero = true;
  } else {
    this.att = Math.ceil(Math.random() * 5);
    this.hp = Math.ceil(Math.random() * 5);
    this.cost = Math.floor((this.att + this.hp) / 2);
  }
  if (내카드) {
    this.mine = true;
  }
}
function 카드공장(영웅, 내카드) {
  return new Card(영웅, 내카드);
}
function 초기세팅() {
  상대덱생성(5);
  내덱생성(5);
  내영웅생성();
  상대영웅생성();
}

턴버튼.addEventListener("click", function () {
  턴 = !턴; // true->false , false -> true
  if (턴) {
    나.코스트.textContent = 10;
  } else {
    상대.코스트.textContent = 10;
  }
  document.getElementById("rival").classList.toggle("turn");
  document.getElementById("my").classList.toggle("turn"); // 턴 확인
});

초기세팅(); // 만들자마자 바로 실행

// 2020 04 26

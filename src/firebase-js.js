var islands = ['하모니 섬', '볼라르 섬', '고요한 안식의 섬', '죽음의 협곡', '포르페', '블루홀 섬', '기회의 섬', '몬테섬', '수라도', '메데이아', '우거진 갈대의 섬'];
var awards = [
    '골드',
    '실링',
    '대양의 주화 상자',
    '카드 팩',
    '영혼의 잎사귀',
    '섬의 마음',
    '인연의 돌',
    '해적 주화',
    '크림스네일의 동전',
    '선혈의 조각',
    '조사용 토끼발 망치',
    '천상의 하모니',
    '황혼의 레퀴엠',
    '비밀지도',
    '희귀 수호 룬',
    '영웅 수호 룬',
    '영웅 풍요 룬',
    '모험물 : 환영나비',
    '모험물 : 죽은 자의 눈',
    '모험물 : 의문의 상자',
    '아드린느 카드',
    '수신 아포라스 카드',
    '탈 것 : 붉은 갈기 늑대'
];
var dungeons = [
    '마수의 골짜기',
    '사령술사의 근원',
    '비틀린 군주의 회랑',
    '몽환궁전 힐데브리뉴',
    '탄식의 길',
    '추락한 긍지의 용광로'
];

// eslint-disable-next-line no-undef
var database = firebase.database();

var islandImgs = document.querySelectorAll('.block-island .island-img');
var islandNames = document.querySelectorAll('.island-content .island-name');
var islandAwards = [];
islandAwards.push(document.querySelectorAll('.isa1 .award'));
islandAwards.push(document.querySelectorAll('.isa2 .award'));
islandAwards.push(document.querySelectorAll('.isa3 .award'));

var islandRef = database.ref('island');
islandRef.on('value', (snapshot) => {
    var index = 0;
    snapshot.forEach((dinoSnapshot) => {
        dinoSnapshot.forEach((semiSnapshot) => {
            if (semiSnapshot.key === 'image') {
                islandImgs[index].src = 'images/island/'+semiSnapshot.val()+'.png';
            } else if (semiSnapshot.key === 'name') {
                islandNames[index].textContent = semiSnapshot.val();
            } else if (semiSnapshot.key === 'award') {
                var now_awards = semiSnapshot.val().split('|');
                var now_index = 0;
                for (var award of now_awards) {
                    islandAwards[index][now_index].src = 'images/island-awards/ii'+(awards.indexOf(award)+1)+'.png';
                    now_index++;
                }
                for (let i = now_index; i < islandAwards[index].length; i++) {
                    islandAwards[index][i].style.display = 'none';
                }
            }
        });
        index++;
    });
});

var bossImgs = document.querySelectorAll('.boss-img');
var bossNames = document.querySelectorAll('.boss-name');
var bossDates = document.querySelectorAll('.boss-date');

var bossRef = database.ref('boss');
bossRef.on('value', (snapshot) => {
    var index = 0;
    snapshot.forEach((dinoSnapshot) => {
        var startdate = '', enddate = '';
        dinoSnapshot.forEach((semiSnapshot) => {
            if (semiSnapshot.key === 'image') {
                bossImgs[index].src = 'images/bosses/'+semiSnapshot.val()+'.png';
            } else if (semiSnapshot.key === 'name') {
                bossNames[index].textContent = semiSnapshot.val();
            } else if (semiSnapshot.key === 'startdate') {
                startdate = semiSnapshot.val();
            } else if (semiSnapshot.key === 'enddate') {
                enddate = semiSnapshot.val();
            }
        });
        bossDates[index].textContent = startdate+' ~ '+enddate;
        index++;
    });
});


var alarmMessage = document.querySelector('.alarm');
var andRef = database.ref('Andsoon');
andRef.on('value', (snapshot) => {
    snapshot.forEach((dinoSnapshot) => {
        if (dinoSnapshot.key === 'alarm') {
            alarmMessage.textContent = dinoSnapshot.val();
        }
    });
});

var dungeonImg = document.querySelector('.dg-img');
var dungeonTxts = document.querySelectorAll('.dungeon-content p');
var dungeonRef = database.ref('dungeon');
dungeonRef.on('value', (snapshot) => {
    var dungeon_date = '';
    snapshot.forEach((dinoSnapshot) => {
        if (dinoSnapshot.key === 'date') {
            dungeon_date = dinoSnapshot.val();
        } else if (dinoSnapshot.key === 'recycle') {
            dungeonImg.src = 'images/dungeons/dg'+dinoSnapshot.val()+'.png';
            dungeonTxts[0].textContent = dungeons[2*(dinoSnapshot.val()-1)+1]+', '+dungeons[2*(dinoSnapshot.val())];
        }
    });
    var date = new Date(dungeon_date);
    var str = date.getFullYear()+"년 "+(date.getMonth()+1)+"월 "+date.getDate()+"일 ~ ";
    date.setDate(date.getDate()+14);
    str += date.getFullYear()+"년 "+(date.getMonth()+1)+"월 "+date.getDate()+"일";
    dungeonTxts[1].textContent = str;
});
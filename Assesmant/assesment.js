'use strict'
const userNameInput = document.getElementById('user-name');
const assessmentButton = document.getElementById('assesment');
const resultDivided = document.getElementById('result-area');
const tweetDivided = document.getElementById('tweet-area');
function removeAllChildren(element){
    while(element.firstChild){// 子どもの要素があるかぎり削除
        element.removeChild(element.firstChild);
    }
}
userNameInput.onkeydown = (event) => {
    if (event.key === 'Enter') {
    // TODO ボタンのonclick() 処理を呼び出す
        assessmentButton.onclick();
    }
};

assessmentButton.onclick = () => {
    const userName = userNameInput.value;
    if(userName.length === 0){//the case for noninput
        return;
    }
    // 診断結果表示エリアの作成
    removeAllChildren(resultDivided);
    const header = document.createElement('h3');
    header.innerText = '診断結果';
    resultDivided.appendChild(header);

    const judge = document.createElement('p');
    const result = assessment(userName);
    judge.innerText = result;
    resultDivided.appendChild(judge);
    //tweet Area
    removeAllChildren(tweetDivided);
    const anchor = document.createElement('a');
    const hrefValue = 'https://twitter.com/intent/tweet?button_hashtag=' 
        + encodeURIComponent('京大飯') + '&ref_src=twsrc%5Etfw';
    anchor.setAttribute('href', hrefValue);
    anchor.className = 'twitter-hashtag-button';
    anchor.setAttribute('data-text', result);
    anchor.innerText = 'Tweet #京大飯';
    tweetDivided.appendChild(anchor);
    //setting widgets.js
    const script = document.createElement('script');
    script.setAttribute('src', 'https://platform.twitter.com/widgets.js');
    tweetDivided.appendChild(script);
}

const answers = [
    '{userName}はハイライトに行きなさい。{userName}の腹は豪快な揚げ物で満たされることでしょう。',
    '{userName}はカフェコレクションに行きなさい。{userName}はオシャレかどうかよくわからん感じを楽しめるでしょう。',
    '{userName}は夢を語れに行きなさい。{userName}の情熱を完全燃焼してきてください。店主はだいたい何も聞いていません。',
    '{userName}は池田屋に行きなさい。{userName}の胃袋をつかめるかどうかは運ゲーです。ムラがすごい。',
    '{userName}は煮干しそば　藍に行きなさい。洒落た内装といい感じの店主が{userName}を癒してくれることでしょう。',
    '{userName}はらんたんラーメンに行きなさい。{userName}をあっさりと包み込んでくれるでしょう。ずっと昔からやってる感がすごい。',
    '{userName}はふろうえんに行きなさい。{userName}はおばちゃんと仲良くなれるかもしれません。おいしい。',
    '{userName}は天天有に行きなさい。{userName}はその甘くこってりした味から抜け出せなくなるでしょう。',
    '{userName}はラジュに行きなさい。{userName}は何枚ナンを食べられるでしょうか。どれだけインド映画を楽しめるでしょうか。',
    '{userName}はサイゼリヤに行きなさい。安い。',
    '{userName}は鷭（バン）に行きなさい。大盛り天津飯、{userName}は食べられるでしょうか。時間に余裕をもっていきましょう。',
    '{userName}はあくた川に行きなさい。週に５回くらい行けば{userName}も店長さんと仲良くなれるかもしれません。',
    '{userName}はヤンパオに行きなさい。{userName}をあったかい店が受け入れてくれます。甘辛系でおいしい。',
    '{userName}はおくだに行きなさい。{userName}はもう北部食堂のカツ丼が食べられなくなるかもしれません。',
    '{userName}はあかつきに行きなさい。ほんといつでも開いてるのでどこの店も閉まってるときはあかつきを思い出してください。',
    '{userName}はひらがな館にいきなさい。うまいしオシャレやし{userName}は女の子連れてもいけます。量もしっかりあって良い。',
    '{userName}は楽楽楽（さんらく）に行きなさい。{userName}のつけ麺欲を満たしてもらいましょう。',
    '{userName}はマクドに行きなさい。試験勉強できます。',
    '{userName}は亀八に行きなさい。夜はもつ鍋だけどランチはもつラーメンでこれがまたうまい。しかも昼ビールめちゃ安い。',
    '{userName}はきむらに行きなさい。{userName}はこじんまりした串カツ居酒屋で心行くまで食えます。コスパと雰囲気よすぎる。',
    '{userName}は棒野に行きなさい。{userName}をがっつりとやさしくなでてくれる感じ。ちょい飲みにもオススメ。',
    '{userName}は凜やに行きなさい。ちゃんと値段するけどちゃんとおいしい。特に抹茶チーズケーキは課金の価値有。',
    '{userName}はGOYAに行きなさい。{userName}は一瞬で沖縄につきます。量もあってコスパよし。',
    '{userName}はみずほに行きなさい。うまくて安くて{userName}は絶対満足する。',
    '{userName}は山元麺蔵に行きなさい。だしがきいとる。整理券もらいに行って指定された時間に再度来店する感じになる。',
    '{userName}は地球規模で考えろに行きなさい。地球規模で考えたら百万遍と丹波橋はゼロ距離や。',
    '{userName}はふくせんろうに行きなさい。ちょっと辛いから辛いのまったく無理な人は辛いってなる。',
    '{userName}はにぼ次郎に行きなさい。近い。',
    '{userName}は鳥貴族に行きなさい。{userName}はコスパよくうまいもんが食えます。東京行った時も安心安全のトリキ。',
    '{userName}はキャラバンに行きなさい。がっつりでてくるしめっちゃ安い。おなかすいたらここ。'
];

/**
 * 名前の文字列を渡すと診断結果を返す関数
 * @param {string} userName ユーザーの名前
 * @return {string} 診断結果
 */
function assessment(userName) {
    // TODO 診断処理を実装する
    //caliculate a sum of the code 
    let sumCharCode = 0;
    for(let i = 0; i< userName.length; i++){
        sumCharCode += userName.charCodeAt(i);
    }
    //choose answer by mod
    const index = sumCharCode % answers.length;
    let result = answers[index];

    result = result.replace(/\{userName\}/g, userName);
    return result;
  }

console.assert(
    assessment('太郎') === assessment('太郎'),
    '診断結果の文言の特定の部分を名前に置き換える処理が正しくありません。'
);
const socket = io.connect('http://localhost:3000', {
  'sync disconnect on unload': true
});
let userid;
let radioSelect = document.getElementById('radioSelect');
radioSelect.addEventListener('click', radioSelectHandler, false);

// messageイベントのイベントリスナーを設定
socket.on('message',onReceive);

//ラジオボタン判定
function radioSelectHandler(ev){
  ev.preventDefault();
  var flag = false;
  for(var i=0; i<document.form1.elements.length-1;i++){
      if(document.form1.elements[i].checked){
        flag = true;
       var answer = document.form1.elements[i].value;
      }
  }
  if(!flag){
    //alert("項目が選択されていません。");
  }
  let obj_a = {
    type: 'answer',
    id: `${userid}`,
    ans: `${answer}`
  };
  let json = JSON.stringify(obj_a);
  // messageイベントを発生させる
  socket.emit('message',json);
  userText.value = '';
}


// データ受信時の処理
function onReceive(data) {
  let json = JSON.parse(data);

  // チャット表示エリアを取得
  let chat = document.getElementById('chat');

  // リスト要素を作成
  let li = document.createElement('li');
    
  // 表示テキストを設定
  if(json.type  == 'userid'){
    userid  = json.data;
    li.textContent  = 'あなたのユーザーIDは'+ userid + 'です。';
    chat.appendChild(li);
  }else if(json.type == 'text'){
    li.textContent = json.data;
    chat.appendChild(li);
  }else if(json.type == 'answer'){
    li.textContent =  'ユーザー'+json.id+'が回答しました。';
    chat.appendChild(li);
  }else if(json.type == 'disconnect'){
    //li.textContent  = 'ユーザー'+json.data+'はいなくなりました。';
    li.textContent  = `相手が退室しました。ゲームをリセットします。`;
    chat.appendChild(li);
  }else if(json.type == 'question'){
    let li2 = document.createElement('li2');
    li2.textContent = json.data;
    chat.appendChild(li2);
  }else if(json.type == 'result'){
    let result = document.createElement('result');
    result.textContent = json.data;
    chat.appendChild(result);
  }
 
}


        
alert("Добро пожаловать в ретро игру: Tetris. Игра Тетрис была придумана советским программистом Алексеем Пажитновым в 1984 году. Первоначальная версия игры была написана Пажитновым на языке программирования Паскаль для компьютера «Электроника-60». Эта версия Тетриса написана на JavaScript, Html5, и CSS. Надмите ok и наслаждайтесь игрой.");
// Получение разрешения экрана для адаптивного дизайна

     var res_y=window.screen.availHeight; //y axis pixel count
        var res_x=window.screen.availWidth; //horizontal pixel count
        var coeff; 
 // Установка коэффициента размера для адаптивного дизайна в альбомной или портретной ориентации
        
        if (res_x*460>res_y*360) //set landscape size coefficient
            coeff=res_y/460;
        else                   //set portrait size coefficient
            coeff=res_x/360;
 // Изменение размера страницы для соответствия любому разрешению
       document.getElementById("div").style.transform="scale("+coeff+")"; //resize page to fit any resolution
        // Настройка холста и игровых переменных
        const maincanvas=document.getElementById('maincanvas');
        const con=maincanvas.getContext('2d');
        const subcanvas=document.getElementById('subcanvas');
        const ctx=subcanvas.getContext('2d');
        //controls
// Определение элементов управления и начальных параметров игры
// ...

        var left = document.getElementById("left");
        var right = document.getElementById("right");
        var down = document.getElementById("down");
        var rotate = document.getElementById("rotate");
        var rotatealt = document.getElementById("rotatealt");
        var dropinterval=0; //time to drop each piece
        var nextpiece='T'; //as the name suggests
        var threshold=1000;
        
 // Цвета для различных фигур Тетриса
 
        const colors=[null,'#000000','#000000','#000000','#000000','#000000','#000000','#000000','#000000','#000000','#000000','#000000','#000000',];
   // Уменьшение масштаба холста
   
        con.scale(20,20); //scale down the canvas
        ctx.scale(20,20);
   // Определение объекта игрока с начальными свойствами
   
        const player={
            pos:{x:0,y:0},
            matrix:createpiece(null),
            score:0,
        }
        //creates 2d array
  // Функция для создания двумерного массива
        
        function creatematrix(dim){
            const matrix = [];
            for (var i = 0; i < dim[0]; ++i) {
                matrix.push(dim.length == 1 ? 0 : creatematrix(dim.slice(1)));
            }
            return matrix;
        }
        
 // Инициализация игровой сетки
 
        var field=creatematrix([20,12]); //grid representation of canvas
        //copies one array into another with an offset
 // Функция для копирования одного массива в другой с учетом смещения
 
        function join(main,sub){
            for (var y=0; y<sub.matrix.length; ++y){
                for (var x=0; x<sub.matrix[y].length; ++x){
                    if(sub.matrix[x][y]!==0){
                        main[x+sub.pos.y][y+sub.pos.x]=sub.matrix[x][y];
                    }
                }
            }
        }
        //has layout of all pieces
    // Функция для создания различных фигур Тетриса
        
        function createpiece(piece){
            switch(piece){
              case 'L':
                  return [[0,1,0],
                          [0,1,0],
                          [0,1,1],];
              break;
              case 'O':
                  return [[2,2],
                          [2,2],];
              break;
              case 'I':
                  return [[0,3,0,0],
                          [0,3,0,0],
                          [0,3,0,0],
                          [0,3,0,0],];
              break;
              case 'T':
                  return [[0,0,0],
                          [4,4,4],
                          [0,4,0],];
              break;

              case 'S':
                  return [[0,5,5],
                          [5,5,0],
                          [0,0,0],];
                    //break;
              case 'Z':
                  return [[6,6,0],
                          [0,6,6],
                          [0,0,0],];
                  // break;     
              case 'J':
                  return [[0,7,0],
                          [0,7,0],
                          [7,7,0],];

                   break;
             case 'П':
    return [[0, 0, 0],
        [8, 8, 8],
        [8, 0, 8],];
    break;
    case '.':
    return [
        [0, 0, 0],
        [0, 9, 0],
        [0, 0, 0],
    ];
    break;
    case 'h':
    return [
        [0, 10, 0],
        [10, 10, 10],
        [10, 0, 10],
    ];
    break;
case ':':
    return [
        [0, 0, 0],
        [0, 11, 0],
        [0, 11, 0],
    ];
    break;
    case 'г':
    return [
        [0, 0, 0],
        [12, 12, 0],
        [0, 12, 0],
        
    ];
    break;
            }
        }
        //changes the next piece
  // Функция для изменения текущей фигуры игрока
  
        function changeplayer(){
            var pieces = ['L', 'O', 'I', 'T', 'S', 'Z', 'J','П','.','h',':','г',]; 
            player.matrix=createpiece(nextpiece);
            nextpiece=pieces[(Math.random() * pieces.length) | 0];
            player.pos.y=0;
            player.pos.x=(field[0].length/2|0)-(player.matrix[0].length/2|0);
            if(checkcollision(field,player)){
                alert("⚠GAME OVER!!!⚠\nScore: "+player.score);
                field=creatematrix([20,12]);
                player.score=0;
                scorerefresh();
            }
        }
        //draws each piece from its matrix
  // Функция для рисования фигур Тетриса на холсте
  
        function drawpieces(matrix, startpos){
            for (var y=0; y<matrix.length; ++y){
                for (var x=0; x<matrix[y].length; ++x){
                    if(matrix[y][x]!==0){
                        con.fillStyle = colors[matrix[y][x]];
                        con.fillRect(x+startpos.x,y+startpos.y,1,1);
                        con.lineWidth=0.1;
                        con.strokeStyle = '#ffffff';
                        con.strokeRect(x+startpos.x,y+startpos.y,1,1);
 
                    }
                }
            }
        }
        //draws the next piece
  // Функция для рисования следующей фигуры на отдельном холсте
  
        function drawnext(){
            matrix=createpiece(nextpiece);
            for (var y=0; y<matrix.length; ++y){
                for (var x=0; x<matrix[y].length; ++x){
                    if(matrix[y][x]!==0){
                        ctx.fillStyle = colors[matrix[y][x]];
                        ctx.fillRect(x+1,y+1,1,1);
                        ctx.lineWidth=0.1;
                        ctx.strokeStyle = '#ffffff';
                        ctx.strokeRect(x+1,y+1,1,1);
     
                    }
                }
            }
        }
        //clears all redraws on canvas
 // Функция для очистки и перерисовки всех элементов на холсте
 
        function draw(){
            con.fillStyle='#ffffff';
            con.fillRect(0,0,maincanvas.width,maincanvas.height);
            ctx.fillStyle='#ffffff';
            ctx.fillRect(0,0,subcanvas.width,subcanvas.height);
            drawpieces(field,{x:0,y:0});
            drawpieces(player.matrix,player.pos);
            drawnext();
        }
        //checks for collision using grid and matrix
   // Функция для проверки столкновения с использованием сетки и матрицы
   
        function checkcollision(main, sub){
            const matrix=sub.matrix,offset=sub.pos;
            for (var y=0;y<matrix.length;++y){
                for (var x=0;x<matrix[y].length;++x){
                    if ((matrix[y][x] !== 0)&&(main[y+offset.y]&&main[y+offset.y][x+offset.x])!==0) return true;
                }
            }
            return false;
        }
        //clears each filled row
        // Функция для очистки заполненных строк
        function clear(){
            var rowscleared=0;
            first: for(var y=field.length-1;y>0;--y){
                for(var x=0;x<field[y].length;++x){
                  if (field[y][x]===0)continue first;
                }
                const removed=[0,0,0,0,0,0,0,0,0,0,0,0]
                field.splice(y,1)[0];
                field.unshift(removed);
                ++rowscleared;
                ++y;
                player.score+=10*rowscleared;
            }
        }
        //moves piece on x axis
  // Функция для перемещения текущей
        function movepiece(dir){
            player.pos.x+=dir;
            if (checkcollision(field,player)) player.pos.x-=dir;
        }
        //drops each piece by one unit
 // Функция для опускания текущей фигуры на одну единицу
 
        function droppiece(){
            player.pos.y++;
            if(checkcollision(field,player)){
                player.pos.y--;
                join(field,player);
                changeplayer();
                clear();
                scorerefresh();
            }
            dropinterval=0;
        }
        //transposes each matrix then switches rows or columns
 // Функция для вращения матрицы (используется для вращения фигур Тетриса)
 
        function rotatematrix(matrix,clockwise){
            for (var y=0;y<matrix.length;++y){
                for (var x=0;x<y;++x){
                    var temp=matrix[y][x];
                    matrix[y][x]=matrix[x][y];
                    matrix[x][y]=temp;
                }
            }
            if (clockwise){
                for (var y=0;y<matrix.length;++y){
                    for (var x=0;x<Math.round(matrix[y].length/2);++x){
                        var temp=matrix[y][x];
                        matrix[y][x]=matrix[y][matrix[y].length-1-x];
                        matrix[y][matrix[y].length-1-x]=temp;
                    }
                }
            }
            else{
                for (var y=0;y<Math.round(matrix.length/2);++y){
                    for (var x=0;x<matrix[y].length;++x){
                        var temp=matrix[y][x];
                        matrix[y][x]=matrix[matrix.length-1-y][x];
                        matrix[matrix.length-1-y][x]=temp;
                    }
                }
            }
        }
        //rotates each piece
  // Функция для вращения текущей фигуры Тетриса
  
        function rotatepiece(clockwise){
            var pos=player.pos.x,offset=1;
            rotatematrix(player.matrix,clockwise);
            while(checkcollision(field,player)){
                player.pos.x+=offset;
                offset=-(offset+(offset>0?1:-1));
                if(offset>player.matrix[0].length){
                    rotatematrix(player.matrix,!clockwise);
                    player.pos.x=pos;
                    return;
                }
            }
        }
        //animates game with time change
   // Функция для обновления состояния игры и анимации
   
        var time_0=0,timechange;
        function update(timestamp){
            timechange=timestamp-time_0;
            dropinterval+=timechange;
            if (dropinterval>=threshold){
                droppiece();
            }
            draw();
            time_0=timestamp;
            window.webkitRequestAnimationFrame(update);
        }
        //updates score
  // Функция для обновления отображаемого счета
  
        function scorerefresh(){
            document.getElementById("score").innerText=player.score;
            document.getElementById("level").innerText=Math.floor(player.score/100)+1;
        }
        //event listeners
  // Слушатели событий для элементов управления
// ...

        left.addEventListener("click", onPressleft, false);
        right.addEventListener("click", onPressright, false);
        down.addEventListener("touchstart", onPressdown, false);
    down.addEventListener("touchend", onUnpress, false);
    down.addEventListener("touchcancel", onUnpress, false);
        rotate.addEventListener("click", onClockwise, false);
        rotatealt.addEventListener("click", onAnticlockwise, false);
        //event handlers
 // Обработчики событий для элементов управления
// ...

        function onPressleft() {
            movepiece(-1);
        }
        function onPressright() {
            movepiece(1);
        }
        function onPressdown() {
            threshold/=10;
        }
        function onUnpress() {
            threshold=1000;
        }
        function onClockwise(){
            rotatepiece(1);
        }
        function onAnticlockwise(){
            rotatepiece(0);
        }
  // Инициализация игры и запуск цикла анимации
        changeplayer();
        update(time_0); //sets time interval for animations 
        function обновитьСтраницу() {
            // Замените "ВАША_ССЫЛКА" на фактическую ссылку, куда вы хотите перейти
            window.location.href = "index.html";
        }

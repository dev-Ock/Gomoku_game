<template>
  <div class="background">
    <div v-show="setGaming" class="container">
      <!-- <div class="buttons">
        <button id="withdraw">한 번만~</button>
        <button id="reload">한 판 더 !</button>
      </div> -->
      <div class="winShow1">
        검정색 승리
        <!-- <div class="trophy">
          <img id="trophyImg" src="trophy.png" width="300px" height="300px" alt="" />
        </div> -->
      </div>
      <div class="winShow2">
        하얀색 승리
        <!-- <div class="trophy">
          <img id="trophyImg2" src="trophy.png" width="300px" height="300px" alt="" />
        </div> -->
      </div>
      <canvas id="oMokBoard" ref="myClass" width="600" height="600" />
      <div class="chatRoomTest">
        <textarea v-model="textarea" v-auto-scroll-bottom disabled />
        <input v-model="message" class="sendMessage_input" style="color: white" />
        <button class="sendMessage_button" @click="sendMessage()">Submit</button>
      </div>
      <div>
        <button></button>
      </div>
    </div>
    <div v-show="!setGaming" class="container">
      <form class="createRoom">
        <input v-model="roomTitle" class="createRoom_input" type="text" name="roomName" placeholder="Create room" />
        <button class="createRoom_button" @click="createNewRoom">Create</button>
      </form>
      <div class="roomList">
        <h3>방 목록</h3>
        <div v-for="(name, index) in roomList" :key="index" class="roomList__container">
          {{ roomList[index].name }}
          <button class="roomEnter" @click="enterRoom">입장하기</button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
// import Navbar from '@/components/Navbar.vue'

export default {
  name: 'TeamInfoView',

  components: {
    // Navbar
  },
  provide() {
    return {
      // provider: this.provider
    }
  },
  data() {
    return {
      textarea: '',
      message: '',
      socketId: '',
      setGaming: false,
      roomList: [],
      roomTitle: ''
    }
  },
  created() {
    console.log('Created data : ', this.$socket)
    this.$socket.on('playGame', data => {
      this.textarea += '[' + data.socketId + ']' + data.message + '\n'
    }),
      this.setRoomList()
  },
  mounted() {
    // this.oMokSetUp()
  },
  methods: {
    setRoomList() {
      this.$socket.on('room_list', list => {
        console.log('List를 받아오는 곳 : ', list)
        this.roomList = list
      })
      this.$socket.emit('room_list')
    },
    createNewRoom(event) {
      let savedRoomTitle = this.roomTitle
      this.roomTitle = ''
      event.preventDefault()
      console.log('방만들기 : ', savedRoomTitle)
      if (savedRoomTitle.length == 0) return

      this.$socket.emit('create_room', savedRoomTitle)
      this.enterRoom(savedRoomTitle)
    },
    enterRoom(savedRoomTitle) {
      console.log('아버지가방에들어가신다 : ', savedRoomTitle)
      this.$socket.emit('room_enter', savedRoomTitle)
      this.setGaming = true
      this.oMokSetUp()

      this.socket.on('room_enter', () => {
        console.log('check status', this.setGaming)
        this.setGaming = true
      })
    },
    sendMessage() {
      this.$socket.emit('playGame', {
        message: this.message,
        socketId: this.$socket.id
      })

      this.textarea += '[' + this.$socket.id + ']' + this.message + '\n'
      this.message = ''
      this.socketId = this.$socket.id

      this.$socket.on('playGame', msg => {
        console.log('받았나?', msg)
        this.textarea += '[' + msg.socketId + ']' + msg.message + '\n'
      })
    },
    sendGameStatus(history, board, savedRoomTitle) {
      this.$socket.emit('gameStatus', {
        history: history,
        board: board,
        roomName: savedRoomTitle
      })
    },
    oMokSetUp() {
      console.log('게임 상태?', this.setGaming)
      console.log('document?', document.getElementById('oMokBoard'))
      let html = document.documentElement
      let canvas = document.getElementById('oMokBoard')
      let ctx = this.$refs.myClass.getContext('2d')

      const margin = 30
      const ch = canvas.width + margin * 2
      const cw = (this.ch = canvas.width = canvas.height = 600 + margin * 2)
      let row = 18 // 바둑판 선 개수
      let rowSize = 600 / row // 바둑판 한 칸의 너비
      let dolSize = 13 // 바둑돌 크기
      let count = 0

      // reload : 한게임 더
      // let btn1 = document.querySelector('#reload')
      // withdraw : 한번 무르기
      // let btn2 = document.querySelector('#withdraw')

      let board = new Array(Math.pow(row + 1, 2)).fill(-1) // 144개의 배열을 생성해서 -1로 채움
      let history = new Array()

      console.log('history : ', history)
      console.log('board : ', board)

      let checkDirection = [
        [1, -1],
        [1, 0],
        [1, 1],
        [0, 1],
        [-1, 1],
        [-1, 0],
        [-1, -1],
        [0, -1]
      ]

      const blackWinScreen = document.querySelector('.winShow1')
      const whiteWinScreen = document.querySelector('.winShow2')
      // let audio1 = new Audio('tik.mp3')
      // let audio2 = new Audio('beep.wav')
      // let audio3 = new Audio('ending.wav')
      // let audio4 = new Audio('plz.m4a')
      // let audio5 = new Audio('oneMore.m4a')

      // // "한번 더" 버튼
      // btn1.addEventListener('mouseup', () => {
      //   // audio5.play()
      //   setTimeout(() => {
      //     location.reload()
      //   }, 2000)
      // })

      // // 무르기 버튼 누르면, 사운드 재생하고, withdraw() 함수 실행
      // btn2.addEventListener('mouseup', () => {
      //   // audio4.play()
      //   withdraw()
      // })

      draw() // 시작하면서 빈 바둑판 그리기

      // 배열을 콘솔창에 grid로 보여주는 함수.
      // 코딩하면서 바둑판이 어떻게 그려지는지 콘솔창에서 확인하려는 목적이고, 게임과는 관계 없음.
      function indexView(m) {
        let s = '\n'
        let c = 0
        for (let e of m) {
          s += `${e} `
          if (c % (row + 1) === row) s += '\n' //줄바꿈 문자 삽입
          c++
        }
        return s
      }

      console.log('indexView : ', indexView)

      // x,y 좌표를 배열의 index값으로 변환
      let xyToIndex = (x, y) => {
        return x + y * (row + 1)
      }
      console.log('xyToIndex : ', xyToIndex)

      // 배열 index값을 x,y좌표로 변환
      // this 값을 찾아서 넣어줘야 함
      let indexToXy = i => {
        this.w = Math.sqrt(board.length)
        this.x = i % this.w
        this.y = Math.floor(i / this.w)
        return [this.x, this.y]
      }

      function draw() {
        // 바둑판 그리기
        ctx.fillStyle = '#e38d00'
        ctx.fillRect(0, 0, cw, ch)
        for (let x = 0; x < row; x++) {
          for (let y = 0; y < row; y++) {
            let w = (cw - margin * 2) / row
            ctx.strokeStyle = 'black'
            ctx.lineWidth = 1
            ctx.strokeRect(w * x + margin, w * y + margin, w, w)
          }
        }

        // 화점에 점 찍기
        for (let a = 0; a < 3; a++) {
          for (let b = 0; b < 3; b++) {
            ctx.fillStyle = 'black'
            ctx.lineWidth = 1
            ctx.beginPath()
            ctx.arc(
              (3 + a) * rowSize + margin + a * 5 * rowSize,
              (3 + b) * rowSize + margin + b * 5 * rowSize,
              dolSize / 3,
              0,
              Math.PI * 2
            )
            ctx.fill()
          }
        }
      }

      // 방금 둔 바둑돌에 사각 표시
      const drawRect = (x, y) => {
        let w = rowSize / 2
        ctx.strokeStyle = 'red'
        ctx.lineWidth = 3
        ctx.strokeRect(x * rowSize + margin - w, y * rowSize + margin - w, w + rowSize / 2, w + rowSize / 2)
      }

      //바둑알 그리기. 실제로는 바둑판까지 매번 통째로 그려줌
      const drawCircle = (x, y) => {
        draw()
        drawRect(x, y)
        for (let i = 0; i < board.length; i++) {
          // 모든 눈금의 돌의 유무,색깔 알아내기
          let a = indexToXy(i)[0]
          let b = indexToXy(i)[1]

          if (board[xyToIndex(a, b)] == 1) {
            ctx.fillStyle = 'black'
            ctx.beginPath()
            ctx.arc(a * rowSize + margin, b * rowSize + margin, dolSize, 0, Math.PI * 2)
            ctx.fill()
          }
          if (board[xyToIndex(a, b)] == 2) {
            ctx.fillStyle = 'white'
            ctx.beginPath()
            ctx.arc(a * rowSize + margin, b * rowSize + margin, dolSize, 0, Math.PI * 2)
            ctx.fill()
          }
        }
        // audio1.currentTime = 0.5 // 돌 놓는 소리 파일을 0.5초 부분부터 재생
        // audio1.play() // 돌 놓는 소리 재생

        checkWin(x, y) // 돌이 5개 연속 놓였는지 확인 함수 실행

        let boardCopy = Object.assign([], board)
        history.push(boardCopy) //무르기를 위해서 판 전체 모양을 배열에 입력
        console.log('현재 게임 상태 history : ', history)
        console.log('현재 게임 상태 board : ', board)
        console.log('현재 게임 상태 board : ', this)
        this.sendGameStatus(history, board, this.savedRoomTitle)
      }

      // 물르기 함수
      // const withdraw = () => {
      //   history.pop() // 무르면서 가장 최근 바둑판 모양은 날려버림
      //   let lastBoard = history.slice(-1)[0] // 바둑판 마지막 모양
      //   board = lastBoard
      //   count-- // 흑,백 차례를 한 수 뒤로 물림

      //   draw()

      //   // 직전 판의 모양으로 바둑판 다시 그리기
      //   for (let i = 0; i < lastBoard.length; i++) {
      //     let a = indexToXy(i)[0]
      //     let b = indexToXy(i)[1]

      //     if (lastBoard[xyToIndex(a, b)] == 1) {
      //       ctx.fillStyle = 'black'
      //       ctx.beginPath()
      //       ctx.arc(a * rowSize + margin, b * rowSize + margin, dolSize, 0, Math.PI * 2)
      //       ctx.fill()
      //     }
      //     if (lastBoard[xyToIndex(a, b)] == 2) {
      //       ctx.fillStyle = 'white'
      //       ctx.beginPath()
      //       ctx.arc(a * rowSize + margin, b * rowSize + margin, dolSize, 0, Math.PI * 2)
      //       ctx.fill()
      //     }
      //   }
      // }

      // 승패 판정 함수
      function checkWin(x, y) {
        let thisColor = board[xyToIndex(x, y)] // 마지막 둔 돌의 색깔이 1(흑),2(백)인지...
        console.log('마지막으로 둔 색은 ? :', thisColor)
        //가로,세로와 대각선 두 방향, 총 네 방향 체크
        for (let k = 0; k < 4; k++) {
          let winBlack = 1
          let winWhite = 1
          // 놓여진 돌의 양쪽 방향으로
          for (let j = 0; j < 2; j++) {
            // 5개씩의 돌의 색깔을 확인
            for (let i = 1; i < 5; i++) {
              let a = x + checkDirection[k + 4 * j][0] * i
              let b = y + checkDirection[k + 4 * j][1] * i
              if (board[xyToIndex(a, b)] == thisColor) {
                // 색깔에 따라서 흑,백의 숫자를 하나씩 증가
                switch (thisColor) {
                  case 1:
                    winBlack++
                    console.log('판정 해보자 : ', checkDirection)
                    break
                  case 2:
                    winWhite++
                    console.log('판정 해보자 : ', checkDirection)
                    break
                }
              } else {
                break
              }
            }
          }
          // 연속 돌이 5개이면 승리
          if (winBlack == 5) {
            winShow(1)
          }
          if (winWhite == 5) {
            winShow(2)
          }
        }
      } // 승리확인 함수 끝

      // 승리 화면 표시
      function winShow(x) {
        // audio3.play()
        switch (x) {
          case 1:
            // 음악이 재생되도록 약간의 시차를 두고 화면 표시
            setTimeout(() => {
              blackWinScreen.style.visibility = 'visible'
              blackWinScreen.style.zIndex = 2
              // const troImg = document.querySelector('#trophyImg')
              // troImg.style.animationName = 'trophy'
            }, 300)
            break
          case 2:
            // 음악이 재생되도록 약간의 시차를 두고 화면 표시
            setTimeout(() => {
              whiteWinScreen.style.visibility = 'visible'
              whiteWinScreen.style.zIndex = 2
              // const troImg = document.querySelector('#trophyImg2')
              // troImg.style.animationName = 'trophy'
            }, 300)
            break
        }
      }

      // 마우스 클릭한 위치를 정확한 눈금 위치로 보정
      document.addEventListener('mouseup', e => {
        console.log('addEventListener 발생')
        console.log('e.target.id', e.target.id)
        if (e.target.id == 'oMokBoard') {
          let x = Math.round(Math.abs(e.offsetX - margin) / rowSize)
          let y = Math.round(Math.abs(e.offsetY - margin) / rowSize)
          console.log(e.offsetX, e.offsetY, x, y)
          if (e.offsetX > 10 && e.offsetX < 640 && e.offsetY > 10 && e.offsetY < 640) {
            // 이미 돌이 놓여진 자리이면 비프음 출력
            if (board[xyToIndex(x, y)] != -1) {
              console.log('놓여진 자리')
              // audio2.play()
            } else {
              // 비어있는 자리이면, 순서에 따라서 흑,백 구분해서 그리는 함수 실행
              count % 2 == 0 ? (board[xyToIndex(x, y)] = 1) : (board[xyToIndex(x, y)] = 2)
              count++
              drawCircle(x, y)
            }
          }
        }
      })
    }
  }
}
</script>

<style>
.background {
  height: 100vh;
  background: #000;
}
.container {
  display: grid;
  /* border: 4px solid red; */
  /* grid-template-columns: 200px 200px 300px; */
  /* grid-template-areas:
    'message message button'
    'canvas canvas canvas'; */
}
.createRoom {
  color: white;
}
.createRoom_input {
  color: white;
}
.roomList__container {
  color: white;
}
.sendMessage_button {
  color: white;
}
.sendMessage_input {
  color: white;
  border-color: white;
}

/* html {
  height: 100vh;
} */

/* body {
  height: 100vh;
  background: #000;
} */

canvas {
  /* position: fixed; */
  /* left: 50%;
  top: 50%; */
  /* transform: translate(-50%, -50%); */
  /* max-width: 100vw;
  max-height: 100vh; */

  grid-area: canvas;
  position: absolute;
  border: 4px solid violet;
  /* margin-left: 1vw; */
  top: 3vh;
  z-index: 1;
}

* {
  margin: 0;
  padding: 0;
}

#world {
  position: absolute;
  width: 100%;
  height: 100%;
  overflow: hidden;
  background: linear-gradient(#e4e0ba, #f7d9aa);
}
.message {
  /* position: absolute; */
  grid-area: message;
  font-size: 30px;
  font-weight: bolder;
  text-align: center;
  /* width: 400px;
    height: 50px; */
  /* border : 2px solid green; */
}

.buttons {
  grid-area: button;
  height: 30px;
  align-self: center;
  /* border : 2px solid purple; */
  display: grid;
  grid-template-columns: 1fr 1fr;
  grid-template-areas: 'withdraw restart';
}

#withdraw {
  grid-area: withdraw;
  top: 0px;
  left: 20px;
  width: 90px;
  font: 18px bold;
  /* border : 1px solid red; */
}

#reload {
  grid-area: restart;
  top: 0px;
  left: 150px;
  width: 90px;
  font: 18px bold;
}

.trophy {
  width: 600px;
  height: 600px;
}

#trophyImg {
  /* border : 1px solid red; */
  /* animation-name: trophy; */
  animation-timing-function: linear;
  animation-duration: 2s;
  /* animation-iteration-count: infinite; */
}
#trophyImg2 {
  /* border : 1px solid red; */
  /* animation-name: trophy; */
  animation-timing-function: linear;
  animation-duration: 2s;
  /* animation-iteration-count: infinite; */
}

.winShow1 {
  position: absolute;
  /* z-index: -1; */
  visibility: hidden;
  left: 30px;
  top: 60px;
  width: 630px;
  height: 570px;
  background-color: white;
  text-align: center;
  padding-top: 50px;
  display: inline-block;
  vertical-align: middle;
  font-size: 70px;
  font-weight: bolder;

  animation-name: blink;
  animation-timing-function: linear;
  animation-duration: 2s;
  animation-iteration-count: infinite;
}
.winShow2 {
  position: absolute;
  /* z-index: -1; */
  visibility: hidden;
  left: 30px;
  top: 60px;
  width: 630px;
  height: 570px;
  background-color: black;
  text-align: center;
  padding-top: 50px;
  display: inline-block;
  vertical-align: middle;
  font-size: 70px;
  color: white;
  font-weight: bolder;

  animation-name: blink;
  animation-timing-function: linear;
  animation-duration: 2s;
  animation-iteration-count: infinite;
}

textarea {
  height: 300px;
  color: white;
  background-color: rgb(49, 49, 49);
}
.chatRoomTest {
  margin-left: 800px;
}

@keyframes blink {
  0% {
    opacity: 0.6;
  }
  20% {
    opacity: 0.8;
  }
  40% {
    opacity: 0.6;
  }
  60% {
    opacity: 0.8;
  }
  80% {
    opacity: 0.6;
  }
  100% {
    opacity: 0.8;
  }
}
@keyframes trophy {
  0% {
    width: 30px;
    height: 30px;
  }
  80% {
    width: 300px;
    height: 300px;
  }
  100% {
    width: 30px;
    height: 30px;
  }
}
</style>

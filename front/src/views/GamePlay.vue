<template>
  <div class="background">
    <div v-show="setGaming" class="container">
      <div class="winShow1">검정색 승리</div>
      <div class="winShow2">하얀색 승리</div>
      <canvas id="oMokBoard" ref="myClass" width="600" height="600" />
      <div class="chatRoomTest">
        <textarea v-model="textarea" v-auto-scroll-bottom disabled />
        <input v-model="message" placeholder=" 채팅을 입력해주세요" class="sendMessage_input" style="color: white" />
        <button class="sendMessage_button" @click="sendMessage()">Submit</button>
      </div>
      <div class="reloadButton">한번 더 ?</div>
    </div>
    <div v-show="!setGaming" class="container">
      <form class="createRoom">
        방만들기 :
        <input v-model="roomTitle" class="createRoom_input" type="text" name="roomName" placeholder="Create room" />

        <button class="createRoom_button" @click="createNewRoom">Create</button>
      </form>
      <div class="roomList">
        <h3>방 목록</h3>
        <div v-for="(name, index) in roomList" :key="index" class="roomList__container">
          {{ roomList[index].name }}
          <button class="roomEnter" @click="enterRoom(roomList[index].name)">입장하기</button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
// import Navbar from '@/components/Navbar.vue'
// import omok from '@/views/omok'
import io from 'socket.io-client'

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
      roomTitle: '',
      sendingBoard: [],
      row: 18, // 바둑판 선 개수
      rowSize: 0, // 바둑판 한 칸의 너비
      dolSize: 13, // 바둑돌 크기
      count: 0,
      margin: 30,
      lastStone: {
        adjustedX: 0,
        adjustedY: 0
      }
    }
  },
  created() {
    this.socket = io.connect('http://192.168.0.16:3041', {
      withCredentials: true
    })
    this.rowSize = 600 / this.row

    this.$socket.on('playGame', data => {
      this.textarea += '[' + data.socketId + ']' + data.message + '\n'
    }),
      this.setRoomList()
  },
  mounted() {
    this.sendGameStatus()
    this.getGameStatus()
    this.drawStatus()
    console.log(this.rowSize)
    console.log(this.row)
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
      // this.roomTitle = ''
      event.preventDefault()
      if (savedRoomTitle.length == 0) return
      this.$socket.emit('create_room', savedRoomTitle)
      this.enterRoom(savedRoomTitle)
    },

    enterRoom(savedRoomTitle) {
      console.log('아버지가방에들어가신다 : ', savedRoomTitle)
      this.$socket.emit('room_enter', savedRoomTitle)
      this.roomTitle = savedRoomTitle
      this.setGaming = true
      this.oMokSetUp()

      this.$socket.on('room_enter', () => {
        console.log('check status', this.setGaming)
        this.setGaming = true
      })
      // // 환영메시지
      // this.$socket.on('welcome_message', message => {
      //   console.log('welcome_message : ', message)
      // })
    },

    sendMessage() {
      this.$socket.emit('playGame', {
        message: this.message,
        socketId: this.$socket.id
      })
      this.textarea += '[' + this.$socket.id + ']' + this.message + '\n'
      this.message = ''
      this.socketId = this.$socket.id
    },

    sendGameStatus() {
      this.$socket.emit('sendingBoard', {
        sendingBoard: this.sendingBoard,
        roomName: this.roomTitle,
        lastStone: this.lastStone,
        count: this.count
      })
      // this.drawStatus()
    },

    getGameStatus() {
      this.$socket.on('sendingBoard', (sentBoard, roomNumber, lastStone, count) => {
        this.sendingBoard = sentBoard
        this.roomTitle = roomNumber
        this.lastStone = lastStone
        this.count = count
        console.log('소켓 on 게임 정보 받자', lastStone)
        this.drawStatus()
      })
    },

    draw() {
      this.base()
      const ch = this.base().canvas.width + this.margin * 2
      const cw = (this.ch = this.base().canvas.width = this.base().canvas.height = 600 + this.margin * 2)

      // 바둑판 그리기
      this.base().ctx.fillStyle = '#e38d00'
      this.base().ctx.fillRect(0, 0, cw, ch)

      for (let x = 0; x < this.row; x++) {
        for (let y = 0; y < this.row; y++) {
          let w = (cw - this.margin * 2) / this.row
          this.base().ctx.strokeStyle = 'black'
          this.base().ctx.lineWidth = 1
          this.base().ctx.strokeRect(w * x + this.margin, w * y + this.margin, w, w)
        }
      }

      // 화점에 점 찍기
      for (let a = 0; a < 3; a++) {
        for (let b = 0; b < 3; b++) {
          this.base().ctx.fillStyle = 'black'
          this.base().ctx.lineWidth = 1
          this.base().ctx.beginPath()
          this.base().ctx.arc(
            (3 + a) * this.rowSize + this.margin + a * 5 * this.rowSize,
            (3 + b) * this.rowSize + this.margin + b * 5 * this.rowSize,
            this.dolSize / 3,
            0,
            Math.PI * 2
          )
          this.base().ctx.fill()
        }
      }
    },

    base() {
      let html = document.documentElement
      let canvas = document.getElementById('oMokBoard')
      let ctx = this.$refs.myClass.getContext('2d')
      let blackWinScreen = document.querySelector('.winShow1')
      let whiteWinScreen = document.querySelector('.winShow2')
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
      return { html, canvas, ctx, blackWinScreen, whiteWinScreen, checkDirection }
    },

    // 한번 더 그려주는 함수
    drawStatus() {
      console.log('한번 더 그려주는 함수 안쪽')
      // history.pop() // 무르면서 가장 최근 바둑판 모양은 날려버림
      // let lastBoard = history.slice(-1)[0] // 바둑판 마지막 모양
      this.board = this.sendingBoard
      // this.count-- // 흑,백 차례를 한 수 뒤로 물림
      this.base()
      this.draw()

      let indexToXy = i => {
        this.w = Math.sqrt(this.board.length)
        this.x = i % this.w
        this.y = Math.floor(i / this.w)
        return [this.x, this.y]
      }

      let xyToIndex = (x, y) => {
        return x + y * (this.row + 1)
      }
      // 직전 판의 모양으로 바둑판 다시 그리기
      for (let i = 0; i < this.board.length; i++) {
        let a = indexToXy(i)[0]
        let b = indexToXy(i)[1]

        if (this.board[xyToIndex(a, b)] == 1) {
          this.base().ctx.fillStyle = 'black'
          this.base().ctx.beginPath()
          this.base().ctx.arc(
            a * this.rowSize + this.margin,
            b * this.rowSize + this.margin,
            this.dolSize,
            0,
            Math.PI * 2
          )
          this.base().ctx.fill()
        }
        if (this.board[xyToIndex(a, b)] == 2) {
          this.base().ctx.fillStyle = 'white'
          this.base().ctx.beginPath()
          this.base().ctx.arc(
            a * this.rowSize + this.margin,
            b * this.rowSize + this.margin,
            this.dolSize,
            0,
            Math.PI * 2
          )
          this.base().ctx.fill()
        }
      }
      this.checkWin()
    },

    winShow(x) {
      this.base()
      // audio3.play()
      switch (x) {
        case 1:
          // 음악이 재생되도록 약간의 시차를 두고 화면 표시
          setTimeout(() => {
            this.base().blackWinScreen.style.visibility = 'visible'
            this.base().blackWinScreen.style.zIndex = 2
            // const troImg = document.querySelector('#trophyImg')
            // troImg.style.animationName = 'trophy'
          }, 300)
          break
        case 2:
          // 음악이 재생되도록 약간의 시차를 두고 화면 표시
          setTimeout(() => {
            this.base().whiteWinScreen.style.visibility = 'visible'
            this.base().whiteWinScreen.style.zIndex = 2
            // const troImg = document.querySelector('#trophyImg2')
            // troImg.style.animationName = 'trophy'
          }, 300)
          break
      }
    },

    checkWin() {
      let x = this.lastStone.adjustedX
      let y = this.lastStone.adjustedY
      let xyToIndex = (x, y) => {
        return x + y * (this.row + 1)
      }
      let thisColor = this.board[xyToIndex(x, y)] // 마지막 둔 돌의 색깔이 1(흑),2(백)인지...
      //가로,세로와 대각선 두 방향, 총 네 방향 체크
      for (let k = 0; k < 4; k++) {
        let winBlack = 1
        let winWhite = 1
        // 놓여진 돌의 양쪽 방향으로
        for (let j = 0; j < 2; j++) {
          // 5개씩의 돌의 색깔을 확인
          for (let i = 1; i < 5; i++) {
            let a = x + this.base().checkDirection[k + 4 * j][0] * i
            let b = y + this.base().checkDirection[k + 4 * j][1] * i
            if (this.board[xyToIndex(a, b)] == thisColor) {
              // 색깔에 따라서 흑,백의 숫자를 하나씩 증가
              switch (thisColor) {
                case 1:
                  winBlack++
                  console.log('판정 해보자 : ', this.base().checkDirection)
                  break
                case 2:
                  winWhite++
                  console.log('판정 해보자 : ', this.base().checkDirection)
                  break
              }
            } else {
              break
            }
          }
        }
        // 연속 돌이 5개이면 승리
        if (winBlack == 5) {
          this.winShow(1)
        }
        if (winWhite == 5) {
          this.winShow(2)
        }
      }
    }, // 승리확인 함수 끝

    oMokSetUp() {
      this.base()

      // const margin = 30
      const ch = this.base().canvas.width + this.margin * 2
      const cw = (this.ch = this.base().canvas.width = this.base().canvas.height = 600 + this.margin * 2)

      let board = new Array(Math.pow(this.row + 1, 2)).fill(-1) // 144개의 배열을 생성해서 -1로 채움
      let history = new Array()

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

      this.draw() // 시작하면서 빈 바둑판 그리기

      // x, y 좌표를 배열의 index값으로 변환
      let xyToIndex = (x, y) => {
        return x + y * (this.row + 1)
      }

      // 배열 index값을 x,y좌표로 변환
      // this 값을 찾아서 넣어줘야 함
      let indexToXy = i => {
        this.w = Math.sqrt(board.length)
        this.x = i % this.w
        this.y = Math.floor(i / this.w)
        return [this.x, this.y]
      }

      // 방금 둔 바둑돌에 사각 표시
      const drawRect = (x, y) => {
        let w = this.rowSize / 2
        this.base().ctx.strokeStyle = 'red'
        this.base().ctx.lineWidth = 3
        this.base().ctx.strokeRect(
          x * this.rowSize + this.margin - w,
          y * this.rowSize + this.margin - w,
          w + this.rowSize / 2,
          w + this.rowSize / 2
        )
      }

      //바둑알 그리기. 실제로는 바둑판까지 매번 통째로 그려줌
      const drawCircle = (x, y) => {
        this.draw()
        drawRect(x, y)
        for (let i = 0; i < this.board.length; i++) {
          // 모든 눈금의 돌의 유무,색깔 알아내기
          let a = indexToXy(i)[0]
          let b = indexToXy(i)[1]

          if (this.board[xyToIndex(a, b)] == 1) {
            this.base().ctx.fillStyle = 'black'
            // 흑돌 그리기
            this.base().ctx.beginPath()
            this.base().ctx.arc(
              a * this.rowSize + this.margin,
              b * this.rowSize + this.margin,
              this.dolSize,
              0,
              Math.PI * 2
            )
            this.base().ctx.fill()
          }
          if (this.board[xyToIndex(a, b)] == 2) {
            // 백돌 그리기
            this.base().ctx.fillStyle = 'white'
            this.base().ctx.beginPath()
            this.base().ctx.arc(
              a * this.rowSize + this.margin,
              b * this.rowSize + this.margin,
              this.dolSize,
              0,
              Math.PI * 2
            )
            this.base().ctx.fill()
          }
        }
        // audio1.currentTime = 0.5 // 돌 놓는 소리 파일을 0.5초 부분부터 재생
        // audio1.play() // 돌 놓는 소리 재생

        this.checkWin(x, y) // 돌이 5개 연속 놓였는지 확인 함수 실행

        let boardCopy = Object.assign([], this.board)
        history.push(boardCopy) //무르기를 위해서 판 전체 모양을 배열에 입력
        this.sendingBoard = this.board
        console.log('check that : ', this.sendingBoard == this.board)
        this.sendGameStatus()
      }

      // 마우스 클릭한 위치를 정확한 눈금 위치로 보정
      document.addEventListener('mouseup', e => {
        if (this.board.length == 0) {
          this.board = board
        }

        // 오목판 위에서 클릭이 발생하는지 보기 위해서
        if (e.target.id == 'oMokBoard') {
          let x = Math.round(Math.abs(e.offsetX - this.margin) / this.rowSize)
          let y = Math.round(Math.abs(e.offsetY - this.margin) / this.rowSize)
          console.log('좌표 : ', e.offsetX, e.offsetY, x, y)
          this.lastStone.adjustedX = x
          this.lastStone.adjustedY = y

          if (e.offsetX > 10 && e.offsetX < 640 && e.offsetY > 10 && e.offsetY < 640) {
            if (this.board[xyToIndex(x, y)] != -1) {
              console.log('놓여진 자리')
              // audio2.play()
            } else {
              // 비어있는 자리이면, 순서에 따라서 흑,백 구분해서 그리는 함수 실행
              this.count % 2 == 0 ? (this.board[xyToIndex(x, y)] = 1) : (this.board[xyToIndex(x, y)] = 2)
              this.count++
              drawCircle(x, y)
            }
          }
        }
      })
      console.log('한바꾸')
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
  justify-content: center;
  /* border: 4px solid red; */
  /* grid-template-columns: 200px 200px 300px; */
  /* grid-template-areas:
    'message message button'
    'canvas canvas canvas'; */
}
.createRoom {
  color: white;
}
.createRoom_button {
  margin-left: 10px;
  background-color: rgb(77, 77, 77);
}
.createRoom_input {
  color: white;
}
.roomList {
  margin-top: 20px;
  width: 800px;
  color: white;
  background-color: #3f3f3f;
  justify-content: center;
  border-radius: 3em;
}
.roomList__container {
  height: 200 px;
  width: 600px;
  color: white;
  background-color: #6e6e6e;
  border-radius: 3em;
}
.sendMessage_button {
  margin-left: 5px;
  border-radius: 3em;
  color: white;
}
.sendMessage_input {
  color: white;
  border-color: white;
  border-radius: 3em;
}

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
  width: 800px;
  height: 660px;
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
  width: 800px;
  height: 660px;
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
  height: 400px;
  width: 500px;
  color: white;
  background-color: rgb(49, 49, 49);
}
input {
  color: white;
  background-color: rgb(49, 49, 49);
}
.chatRoomTest {
  margin-left: 800px;
  margin-top: 10px;
}
.reloadButton {
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

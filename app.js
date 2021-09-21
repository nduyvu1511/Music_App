const $ = document.querySelector.bind(document);
const $$ = document.querySelectorAll.bind(document);

// Scroll Header
const header = $('.header-top')
const headerHeight = $('.header').offsetHeight
window.addEventListener('scroll', e => {
    const windowHeight = document.body.scrollTop || document.documentElement.scrollTop
    if(windowHeight > headerHeight + 80) {
        $('.transparent-form-title').classList.add('transparent-form-title-active')
    }
    if(windowHeight > headerHeight) {
        $('.header-song').style.display = 'flex'
        header.classList.add('header-active')
    }
     else {
        $('.header-song').style.display = 'none'
        header.classList.remove('header-active')
        $('.transparent-form-title').classList.remove('transparent-form-title-active')
    }
})

const songs = [
  {
    id: 1,
    name: "All Around Me",
    single: "Justin Bieber",
    path: "./music/All Around Me.m4a",
    duration: "2:17",
  },
  {
    id: 2,
    name: "Available",
    single: "Justin Bieber",
    path: "./music/Available.m4a",
    duration: "3:15",
  },
  {
    id: 3,
    name: "Come Around Me",
    single: "Justin Bieber",
    path: "./music/Come Around Me.m4a",
    duration: "3:21",
  },
  {
    id: 4,
    name: "Forever (feat. Post Malone & Clever)",
    single: "Justin Bieber, Post Malone, Clever",
    path: "./music/Forever.m4a",
    duration: "3:40",
  },
  {
    id: 5,
    name: "Get Me (feat Kehlani)",
    single: "Justin Bieber, Kehlani",
    path: "./music/Get me.m4a",
    duration: "3:05",
  },
  {
    id: 6,
    name: "Habitual",
    single: "Justin Bieber",
    path: "./music/Habitual.m4a",
    duration: "2:48",
  },
  {
    id: 7,
    name: "Intentions (feat. Quavo)",
    single: "Justin Bieber, Quavo",
    path: "./music/Intentions.m4a",
    duration: "3:33",
  },
  {
    id: 8,
    name: "Yummy",
    single: "Justin Bieber",
    path: "./music/Yummy.m4a",
    duration: "3:30",
  },
  {
    id: 9,
    name: "Running Over (feat Lil Dicky)",
    single: "Justin Bieber, Lil Dicky",
    path: "./music/Running Over.m4a",
    duration: "3:00",
  },
  {
    id: 10,
    name: "E.T.A.",
    single: "Justin Bieber",
    path: "./music/ETA.m4a",
    duration: "2:57",
  },
  {
    id: 11,
    name: "Second Emotion (feat. Travis Scott)",
    single: "Justin Bieber, Travis Scott",
    path: "./music/Second Emotion.m4a",
    duration: "3:23",
  },
  {
    id: 12,
    name: "Changes",
    single: "Justin Bieber",
    path: "./music/Changes.m4a",
    duration: "2:16",
  },
  {
    id: 13,
    name: "Confirmation",
    single: "Justin Bieber",
    path: "./music/Confirmation.m4a",
    duration: "2:51",
  },
  {
    id: 14,
    name: "At Least For Now",
    single: "Justin Bieber",
    path: "./music/At least For Now.m4a",
    duration: "2:30",
  },
  {
    id: 15,
    name: "That's What Love Is",
    single: "Justin Bieber",
    path: "./music/That's What Love Is.m4a",
    duration: "2:45",
  },
  {
    id: 16,
    name: "Take It Out On Me",
    single: "Justin Bieber",
    path: "./music/Take It Out On Me.m4a",
    duration: "2:57",
  },
];

const audio = $('#audio')
const playBtn = $('.play-btn')
const progressContainer = $('.progress-form')
const volumeKey = 'volume'
const localName = 'key'
let currentSong = JSON.parse(localStorage.getItem(localName)) || 0
let currentVolume = JSON.parse(localStorage.getItem(volumeKey)) || 0
loadSong(songs[currentSong])

function render() {
    renderTitle()
    const bigPlaybtn =  $$('.big-play-btn')
    bigPlaybtn.forEach(item => {
        item.addEventListener('click', playSong)
    })
    $('.prev-btn').addEventListener('click', prevSong) 
    $('.next-btn').addEventListener('click', nextSong) 
    $('.song__control-name').innerText = songs[currentSong].name
    $('.song__control-artist').innerText = songs[currentSong].single
    $('.header-current-song').innerText = songs[currentSong].name
    progressContainer.addEventListener('click', setProgress)
    audio.addEventListener('timeupdate', updateProgress)
    $('.progress-volume-container').addEventListener('click', setVolume)
    audio.addEventListener('volumechange', updateVolume)
    const titleSongs = $$('.song-item')
    titleSongs[currentSong].classList.add('song-item-active')
    const numberOrder = $$('.number-order')
    const waveMusic = $$('#container')
    waveMusic[currentSong].style.display = 'none'
    numberOrder[currentSong].style.display = 'block'

    for(let i = 0; i < titleSongs.length; i++) {
        titleSongs[i].addEventListener('click', () => {
            handleSong(i)
        })
    }
}

$('.total-song').innerText = (songs.length == 1) ? `${songs.length} song, ` : ` ${songs.length} songs `
$('.total-time').innerText = ' .50 minutes, 35 sec'

// Mix Button Listener

$('.mix-btn').addEventListener('click', () => {
    if(!$('.mix-btn').classList.contains('mix-btn-active')) {
        mixMode()
    $('.mix-btn').classList.add('mix-btn-active')
    $('.loop-btn').classList.remove('loop-btn-active')
    } else {
        $('.mix-btn').classList.remove('mix-btn-active')
    }
})

// loop Button Listener

$('.loop-btn').addEventListener('click', () => {
    if(!$('.loop-btn').classList.contains('loop-btn-active')) {
    $('.loop-btn').classList.add('loop-btn-active')
    $('.mix-btn').classList.remove('mix-btn-active')
    } else {
        $('.loop-btn').classList.remove('loop-btn-active')
    }       
})

// Volume Button listener
$('.volume-btn').addEventListener('click', () => {
    if($('.volume-btn').classList.contains('volume-btn-active')) {
        audio.muted = true
        $('.volume-btn').classList.remove('volume-btn-active')
        $('.progress-volume').style.width = 0
    } else {
        audio.muted = false
        $('.volume-btn').classList.add('volume-btn-active')
        $('.progress-volume').style.width = `${currentVolume * 100}%`
    }
}) 

playBtn.addEventListener('click', () => {
    if(playBtn.querySelector('i.fas').classList.contains('fa-play')) {
        playSong()
    } else {
     pauseSong()
    }
})

function updateVolume(e) {
    const currentVolume = e.srcElement.volume
    if($('.volume-btn').classList.contains('volume-btn-active')) {
        $('.progress-volume').style.width = `${currentVolume*100}%`
        localStorage.setItem(volumeKey,JSON.stringify(currentVolume))
    } else {
        $('.progress-volume').style.width = `0%`
    }  
}

function setVolume(e) {
    let currentWidth = e.offsetX
    const width = this.offsetWidth
    let current = currentWidth / width
    audio.volume = current.toFixed(1)
    localStorage.setItem(volumeKey,JSON.stringify(current.toFixed(1)))
}

function mixMode() {
    let random = Math.floor(Math.random() * 10)
    currentSong = random
    localStorage.setItem(localName, JSON.stringify(currentSong))
    return random
}

function updateProgress(e) {
    const{duration, currentTime} = e.srcElement
    let time = (currentTime / duration) * 100
    $('.progress-start').innerText = `${secondFormat(currentTime)}`
    // localStorage.setItem(localProgress,JSON.stringify(time))
    $('.progress').style.width = `${time}%  `
}

function setProgress(e) {
    let currentWidth = e.offsetX
    const width = this.offsetWidth
    const duration = audio.duration
    audio.currentTime = (currentWidth / width) * duration
}

function playSong() {
    playBtn.querySelector('i.fas').classList.remove('fa-play')
    playBtn.querySelector('i.fas').classList.add('fa-pause')
    render()
    audio.play()
}

function pauseSong() {
    playBtn.querySelector('i.fas').classList.add('fa-play')
    playBtn.querySelector('i.fas').classList.remove('fa-pause')
    audio.pause()
    render()
}

function loadSong(song) {
    audio.src = song.path
    audio.volume = currentVolume
    audio.addEventListener('playing', e => {
        const numberOrder = $$('.number-order')
        const waveMusic = $$('#container')
        waveMusic[currentSong].style.display = 'block'
        numberOrder[currentSong].style.display = 'none'
        $('.progress-end').innerText = secondFormat(e.srcElement.duration)
    })
    render()
}

function handleSong(index) {
    currentSong = index
    localStorage.setItem(localName,JSON.stringify(currentSong))
    $('.progress-end').innerText = songs[index].duration
    loadSong(songs[currentSong])
    playSong()
    render()
}

function secondFormat(duration) {
    duration = duration.toFixed(0)
    let minute = Math.floor(duration / 60)
    let second = duration % 60
    second = (second < 10) ? `0${second}` : second
    return `${minute}:${second}`
}                                                       

function prevSong() {
    currentSong --
    if(currentSong < 0) {
        currentSong = songs.length - 1
    }
    if($('.mix-btn').classList.contains('mix-btn-active')) {
        mixMode()
    }
    loadSong(songs[currentSong])
    playSong()
    render()
    localStorage.setItem(localName,JSON.stringify(currentSong))
}

function nextSong() {
    currentSong ++
    if(currentSong >= songs.length) {
        currentSong = 0
    }
    if($('.mix-btn').classList.contains('mix-btn-active')) {
        mixMode()
    }
    loadSong(songs[currentSong])
    playSong()
    render()
    localStorage.setItem(localName,JSON.stringify(currentSong))
}

function renderTitle() {
    const html = songs
    .map(
      (song) => `
    <li class="song-item">
        <span class="number-order">${song.id}</span>
        <div id='container'>  
            <span></span>  
            <span></span>  
            <span></span>  
            <span></span>  
            <span></span>  
        </div>
        <span class="song-info">
            <h3 class="song-name">${song.name}</h3>
            <h4 class="song-artist">${song.single}</h4>
        </span>
        <span class = "song-time">${song.duration}</span>
     </li>`
    )
    .join("");
  $(".song-list").innerHTML = html;
}

audio.addEventListener('ended', () => {
    render()
    if($('.loop-btn').classList.contains('loop-btn-active')) {
        loadSong(songs[currentSong])
        playSong()
    } else if($('.mix-btn').classList.contains('mix-btn-active')) {
        let random = mixMode()
        loadSong(songs[random])
        playSong()
    } else {
        currentSong ++
        if(currentSong >= songs.length) {
            currentSong = 0
        }
        loadSong(songs[currentSong])
        playSong()
    }

})

render()


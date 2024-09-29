/* Array of Songs */

const songs = [
  {
    id: 'x00000000001',
    artist: 'Rick Astley',
    title: 'Never Gonna Give You Up',
    mp3: 'assets/audio/summer.mp3',
    background: 'assets/images/summer.jpg',
    background_description: 'image of a summer scenery',
    disk: 'assets/images/summer-disk.jpg',
    disk_description: 'cover image of the Summer album',
  },
  {
    id: 'x00000000002',
    artist: 'Eric Clapton',
    title: 'Autumn Leaves',
    mp3: 'assets/audio/autumn.mp3',
    background: 'assets/images/autumn.jpg',
    background_description: 'image of a autumn scenery',
    disk: 'assets/images/autumn-disk.jpg',
    disk_description: 'cover image of the Autumn album',
  },
  {
    id: 'x00000000003',
    artist: 'Wham!',
    title: 'Last Christmas',
    mp3: 'assets/audio/winter.mp3',
    background: 'assets/images/winter.jpg',
    background_description: 'image of a winter scenery',
    disk: 'assets/images/winter-disk.jpg',
    disk_description: 'cover image of the Winter album',
  },
  {
    id: 'x00000000004',
    artist: 'Katrina & The Waves',
    title: 'Walking On Sunshine',
    mp3: 'assets/audio/spring.mp3',
    background: 'assets/images/spring.jpg',
    background_description: 'image of a spring scenery',
    disk: 'assets/images/spring-disk.jpg',
    disk_description: 'cover image of the Spring album',
  },
];

/* Populate Main Song */

const backgroundImage = document.querySelector('.background-image');
const albumCover = document.querySelector('.album-cover');
const totalSongTime = document.querySelector('.total-time');
const currentSongTime = document.querySelector('.current-time');
const artistName = document.querySelector('.artist-name');
const songName = document.querySelector('.song-name');
const audio = new Audio();
let currentSongIndex = 0;

function shuffle(array) {
  let currentIndex = array.length; 
  while (currentIndex != 0) {
    let randomIndex = Math.floor(Math.random() * currentIndex);
    currentIndex--;
    [array[currentIndex], array[randomIndex]] = [array[randomIndex], array[currentIndex]];
  }
  return array;
}

const playList = shuffle(songs);

function mainSong(song) {
  backgroundImage.src = song.background;
  backgroundImage.alt = song.background_description;
  albumCover.src = song.disk;
  albumCover.alt = song.description;
  artistName.innerHTML = `${song.artist}`;
  songName.innerHTML = `${song.title}`;
  audio.src = song.mp3;
  audio.id = song.id;
  currentSongTime.innerHTML = '0:00';
  audio.addEventListener('loadedmetadata', () => {
    const minutes = Math.floor(audio.duration / 60).toString();
    const seconds = Math.floor(audio.duration % 60).toString().padStart(2, '0');
    totalSongTime.innerHTML = `${minutes}:${seconds}`;
  });
}

document.addEventListener('DOMContentLoaded', () => {
  mainSong(playList[0]);
  updatePlaylistUi();
});

/* Populate Playlist */

const playlistList = document.querySelector('.playlist__list');

function populatePlaylist(array) {
  for (let i = 0; i < array.length; i += 1) {
    const playlistItem = document.createElement('li');
    playlistItem.classList.add('playlist__item');
    const playPauseMini = document.createElement('button');
    playPauseMini.classList.add('play-pause__mini');
    playPauseMini.classList.add('play__mini');
    playPauseMini.dataset.songId = array[i].id;
    const songTitleContainer = document.createElement('div');
    songTitleContainer.classList.add('song-title__container');
    const songTitle = document.createElement('p');
    songTitle.classList.add('song-title');
    songTitle.innerHTML = `${array[i].artist} - ${array[i].title}`;
    songTitle.dataset.songId = array[i].id;
    const downloadButton = document.createElement('button');
    downloadButton.classList.add('download');
    downloadButton.dataset.songId = array[i].id;

    playlistItem.appendChild(playPauseMini);
    playlistItem.appendChild(songTitleContainer);
    songTitleContainer.appendChild(songTitle);
    playlistItem.appendChild(downloadButton);

    playlistList.appendChild(playlistItem);

    playPauseMini.addEventListener('click', () => {
      const songId = playPauseMini.dataset.songId;
      const song = playList.find(song => song.id === songId);
      if (audio.id === songId && !audio.paused) {
        pauseSong();
      } else if (audio.id === songId && audio.paused) {
        playSong();
      } else {
        mainSong(song);
        currentSongIndex = playList.findIndex(currentsong => currentsong.id === song.id);
        playSong();
      }
    });

    songTitle.addEventListener('click', () => {
      const songId = songTitle.dataset.songId;
      const song = playList.find(song => song.id === songId);
      if (!audio.paused) {
        mainSong(song);
        currentSongIndex = playList.findIndex(currentsong => currentsong.id === song.id);
        playSong();
      } else {
        mainSong(song);
        currentSongIndex = playList.findIndex(currentsong => currentsong.id === song.id);
      }
      updatePlaylistUi();
      resetTimeLine();
    });

    downloadButton.addEventListener('click', () => {
      const songId = downloadButton.dataset.songId;
      const song = playList.find(song => song.id === songId);
      const downloadLink = document.createElement('a');
      downloadLink.href = song.mp3;
      downloadLink.download = `${song.artist} - ${song.title}.mp3`;
      document.body.appendChild(downloadLink);
      downloadLink.click();
      document.body.removeChild(downloadLink);
    });
  }
}

populatePlaylist(playList);

/* Show Playlist */

const playlistNameWrapper = document.querySelector('.playlist-name__container_wrapper');
const playlistArrow = document.querySelector('.playlist-arrow')

playlistNameWrapper.addEventListener('click', () => {
  if (playlistList.classList.contains('playlist__list_visible')) {
    playlistArrow.classList.remove('playlist-arrow_open');
    playlistList.classList.remove('playlist__list_visible');
    requestAnimationFrame(() => {
      playlistList.style.maxHeight = '0';
    });
  } else {
    playlistArrow.classList.add('playlist-arrow_open');
    playlistList.classList.add('playlist__list_visible');
    requestAnimationFrame(() => {
      playlistList.style.maxHeight = `${playlistList.scrollHeight}px`;
    });
  }
});

/* Shuffle Playlist */

const shufflePlaylist = document.querySelector('.shuffle');

function clearPlaylist() {
    playlistList.innerHTML = '';
}

shufflePlaylist.addEventListener('click', () => {
  const currentSong = playList[currentSongIndex];
  shuffle(playList);
  clearPlaylist();
  populatePlaylist(playList);
  currentSongIndex = playList.findIndex(song => song.id === currentSong.id);
  updatePlaylistUi();
});

/* Update PlayList UI */

function updatePlaylistUi() {
  document.querySelectorAll('.play-pause__mini').forEach(button => {
    if (button.dataset.songId === audio.id) {
      if (audio.paused) {
        button.classList.remove('pause__mini');
        button.classList.add('play__mini');
      } else if (!audio.paused) {
        button.classList.remove('play__mini');
        button.classList.add('pause__mini');
      }
    } else {
      button.classList.add('play__mini');
      button.classList.remove('pause__mini');
    }
  });

  document.querySelectorAll('.song-title').forEach(title => {
    if (title.dataset.songId === audio.id) {
      document.querySelectorAll('.song-title').forEach(title2 => {
        title2.classList.remove('song-title__active');
      });
      title.classList.add('song-title__active');
    }
  });

  document.querySelectorAll('.song-title').forEach(title => {
    const containerWidth = document.querySelector('.song-title__container').offsetWidth;
    const titleWidth = title.scrollWidth;
    const scrollDistance = (titleWidth - containerWidth) * 1.15;
    if (titleWidth > containerWidth) {
      title.addEventListener('mouseenter', () => {
        title.style.transition = `transform ${scrollDistance / 30}s ease-in-out, color 0.3s ease-in-out`;
        title.classList.add('song-title__scroll');
        title.style.transform = `translateX(-${scrollDistance}px)`;
      });
      title.addEventListener('mouseleave', () => {
        title.classList.remove('song-title__scroll');
        title.style.transform = 'translateX(0)';
        title.style.transition = `transform ${scrollDistance / 30}s ease-in-out, color 0.3s ease-in-out`;
      });
    }
  });
}

/* Play/Pause Songs */

const playButton = document.querySelector('.play-pause');
const timeline = document.querySelector('.timeline');
const timeSelector = document.querySelector('.time-selector');
let isPlaying = false;

function updateCurrentSongTime() {
  const minutes = Math.floor(audio.currentTime / 60).toString();
  const seconds = Math.floor(audio.currentTime % 60).toString().padStart(2, '0');
  currentSongTime.innerHTML = `${minutes}:${seconds}`;
  const songProgress = (audio.currentTime / audio.duration) * 100;
  timeline.style.width = `${songProgress}%`;
  timeSelector.style.left = `${songProgress}%`;
}

function playSong() {
  isPlaying = true;
  audio.play();
  playButton.classList.remove('play');
  playButton.classList.add('pause');
  audio.addEventListener('timeupdate', updateCurrentSongTime);
  updatePlaylistUi();
}

function pauseSong() {
  isPlaying = false
  audio.pause();
  playButton.classList.remove('pause');
  playButton.classList.add('play');
  updatePlaylistUi()
}

playButton.addEventListener('click', () => {
  if (playButton.classList.contains('play')) {
    playSong();
  } else {
    pauseSong();
  }
});
  
/* Change Song Current Play Time */

const timelineContainer = document.querySelector('.timeline-container');
let isDraggingTimeline = false;
let wasPlaying = false;

timelineContainer.addEventListener('mousedown', (event) => {
  isDraggingTimeline = true;
  const timelineContainerWidth = timelineContainer.offsetWidth;
  const clickPosition = event.clientX - timelineContainer.getBoundingClientRect().left;
  audio.currentTime = (clickPosition / timelineContainerWidth) * audio.duration;
  updateCurrentSongTime();
  if (isPlaying) {
    pauseSong();
    wasPlaying = true;
  } 
});

document.addEventListener('mousemove', (event) => {
  if (isDraggingTimeline) {
    const timelineContainerWidth = timelineContainer.offsetWidth;
    const clickPosition = event.clientX - timelineContainer.getBoundingClientRect().left;
    audio.currentTime = (clickPosition / timelineContainerWidth) * audio.duration;
    updateCurrentSongTime();
  }
});

document.addEventListener('mouseup', () => {
  isDraggingTimeline = false;
  if (wasPlaying) {
    playSong();
    wasPlaying = false;
  }
});

document.addEventListener('mouseleave', () => {
  if (isDraggingTimeline) {
    isDraggingTimeline = false;
  }
});

function resetTimeLine() {
  timeline.style.width = '0%';
  timeSelector.style.left = '0%';
}

/* Play Next/Previous Song */

const nextSong = document.querySelector('.next');
const previousSong = document.querySelector('.previous');
const repeatCheckbox = document.querySelector('.repeat__checkbox')

function setNextSong(index, playlist) {
  index = index < (playlist.length - 1) ? (index + 1) : 0;
  mainSong(playlist[index]);
  return index;
}

function setPreviousSong(index, playlist) {
  index = index > 0 ? (index - 1) : (playlist.length - 1);
  mainSong(playlist[index]);
  return index;
}

function setSameSong(index, playlist) {
  index = index;
  mainSong(playlist[index]);
  return index;
}

nextSong.addEventListener('click', () => {
  currentSongIndex = setNextSong(currentSongIndex, playList);
  resetTimeLine();
  updatePlaylistUi();
  updateCurrentSongTime();
  if (isPlaying) {
    playSong();
  }
});

previousSong.addEventListener('click', () => {
  currentSongIndex = setPreviousSong(currentSongIndex, playList);
  resetTimeLine();
  updatePlaylistUi();
  updateCurrentSongTime();
  if (isPlaying) {
    playSong();
  }
});

audio.addEventListener('ended', () => {
  currentSongIndex = repeatCheckbox.checked ? setSameSong(currentSongIndex, playList) : setNextSong(currentSongIndex, playList);
  if (isPlaying) {
    playSong();
  }
});

/* Mute/Unmute Song */

const volumeCheckbox = document.querySelector('.volume__checkbox');

volumeCheckbox.addEventListener('change', () => {
  audio.volume = volumeCheckbox.checked ? 0 : 1;
});
class VirtualDrumKit {
  constructor(name) {
    this.sounds = {
      'hihatRight': {key: 'E', audio: new Audio('assets/sounds/standard/hihat.mp3')},
      'hihatRightClosed': {key: 'R', audio: new Audio('assets/sounds/standard/hihat-open.mp3')},
      'hihatFoot': {key: 'C', audio: new Audio('assets/sounds/standard/hihat-foot.mp3')},
      'crash': {key: 'Y', audio: new Audio('assets/sounds/standard/crash.mp3')},
      'ride': {key: 'U', audio: new Audio('assets/sounds/standard/ride.mp3')},
      'snareRight': {key: 'S', audio: new Audio('assets/sounds/standard/snare-drum.mp3')},
      'snareRightCrossStick': {key: 'D', audio: new Audio('assets/sounds/standard/snare-stick.mp3')},
      'bass': {key: 'X', audio: new Audio('assets/sounds/standard/bass.mp3')},
      'tom1': {key: 'G', audio: new Audio('assets/sounds/standard/tom1.mp3')},
      'tom2': {key: 'H', audio: new Audio('assets/sounds/standard/tom2.mp3')},
      'floor': {key: 'J', audio: new Audio('assets/sounds/standard/floor-tom.mp3')},
    }
    this.currentlyPlaying = new Set();
    this.isPlayingSequence = false;
    this.editingSound = null;
    this.drumElements = {};
    this.init()
  }

  init() {
    this.createLayout();
    this.bindEvents();
    this.preloadSounds();
  }

  createLayout() {
    const wrapper = document.createElement('div');
    wrapper.className = 'wrapper';

    // Create drums container
    const drumsContainer = document.createElement('div');
    drumsContainer.className = 'drums';

    const img = document.createElement('img');
    img.src = 'assets/img/drum-kit-standard1.png';
    img.alt = 'drum-kit';
    drumsContainer.appendChild(img);

    const drumstickContainer = document.createElement('div');
    drumstickContainer.className = 'drumstick';
    ['drumstick--snareLeft',
      'drumstick--snareRight',
      'drumstick--hihatLeft',
      'drumstick--hihatRight',
      'drumstick--crash',
      'drumstick--ride',
      'drumstick--tom1',
      'drumstick--tom2',
      'drumstick--floor',
      'drumstick--default-left',
      'drumstick--default-right',
    ].forEach((drumstick, index) => {
      const drumstickSpan = document.createElement('span');
      drumstickSpan.classList.add(drumstick);
      drumstickSpan.classList.add(index % 2 === 0 ? 'left-drumstick' : 'right-drumstick');
      drumstickContainer.appendChild(drumstickSpan);
    });

    drumsContainer.appendChild(drumstickContainer);

    const bass = document.createElement('div');
    bass.classList.add('bass', 'drum');

    const bassPedalWrapper = document.createElement('div');
    bassPedalWrapper.classList.add('bass-pedal-wrapper');
    const bassHead = document.createElement('div');
    bassHead.classList.add('head');

    const bassPedal = document.createElement('div');
    bassPedal.classList.add('pedal');
    bassPedalWrapper.appendChild(bassHead);
    bassPedalWrapper.appendChild(bassPedal);

    const spanBuss = document.createElement('span');
    spanBuss.classList.add('shortcut-name');
    spanBuss.textContent = 'X';
    bass.appendChild(bassPedalWrapper);
    bass.appendChild(spanBuss);


    const hihat = document.createElement('div');
    hihat.classList.add('hihat');
    //  style="translate: none; rotate: none; scale: none; transform: translate(0px, 4.0723px); filter: brightness(1);"></div>
    let hihatCymbal = document.createElement('div');
    hihatCymbal.classList.add('hihatCymbal');
    hihat.appendChild(hihatCymbal);

    const drumm = document.createElement('div');
    drumm.className = 'drumm';

    const drum1 = document.createElement('div');
    drum1.className = 'drum';

    const spanDrum1 = document.createElement('span');
    spanDrum1.classList.add('shortcut-name');
    spanDrum1.textContent = 'E';
    drum1.appendChild(spanDrum1)

    const drum2 = document.createElement('div');
    drum2.className = 'drum';
    let spanDrum2 = document.createElement('span');
    spanDrum2.classList.add('shortcut-name', 'shortcut-bottom');
    spanDrum2.textContent = 'R';
    drum2.appendChild(spanDrum2)

    drumm.appendChild(drum1);
    drumm.appendChild(drum2);
    hihat.appendChild(drumm);

    const pedal = document.createElement('div');
    pedal.classList.add('pedal-wrapper', 'drum');
    const chain = document.createElement('div');
    chain.classList.add('chain'); //"translate: none; rotate: none; scale: none; transform: translate(0px, 5.7px);"
    pedal.appendChild(chain);

    const pedalInner = document.createElement('div');
    pedalInner.classList.add('pedal');//style="translate: none; rotate: none; scale: none; transform: translate(0px, 2.85px) rotate(-10.0001deg); margin-left: 0px; height: 76%; margin-top: 2px;">
    pedal.appendChild(pedalInner);
    const spanPedal = document.createElement('span');
    spanPedal.classList.add('shortcut-name');
    spanPedal.textContent = 'C';
    pedal.appendChild(spanPedal);

    hihat.appendChild(hihatCymbal);
    hihat.appendChild(pedal);

    hihatCymbal.appendChild(pedal);

    const snare = document.createElement('div');
    snare.classList.add('snare');

    const snareDrum = document.createElement('div');
    snareDrum.classList.add('drumm', 'drum');
    const snareDrumSpan = document.createElement('span');
    snareDrumSpan.classList.add('shortcut-name');
    snareDrumSpan.textContent = 'S';
    snareDrum.appendChild(snareDrumSpan);

    const crossDrum = document.createElement('div');
    crossDrum.classList.add('cross', 'drum');
    const crossDrumSpan = document.createElement('span');
    crossDrumSpan.classList.add('shortcut-name');
    crossDrumSpan.textContent = 'D';
    crossDrum.appendChild(crossDrumSpan);

    snare.appendChild(snareDrum);
    snare.appendChild(crossDrum);

    // --- TOM-1 ---
    const tom1 = document.createElement('div');
    tom1.classList.add('drum', 'tom-1');
    const gLabel = document.createElement('span');
    gLabel.classList.add('shortcut-name');
    gLabel.textContent = 'G';
    tom1.appendChild(gLabel);
    // --- TOM-2 ---
    const tom2 = document.createElement('div');
    tom2.classList.add('drum', 'tom-2');
    const hLabel = document.createElement('span');
    hLabel.classList.add('shortcut-name');
    hLabel.textContent = 'H';
    tom2.appendChild(hLabel);
// --- CRASH ---
    const crash = document.createElement('div');
    crash.classList.add('drum', 'crash');

    const yLabel = document.createElement('span');
    yLabel.classList.add('shortcut-name');
    yLabel.textContent = 'Y';
    crash.appendChild(yLabel);

    const fixator1 = document.createElement('span');
    fixator1.classList.add('fixator');
    crash.appendChild(fixator1);

    const crashFlicker = document.createElement('div');
    crashFlicker.classList.add('--crash-flicker');
    crash.appendChild(crashFlicker);

    const crashCymbal = document.createElement('div');
    crashCymbal.classList.add('--crash-cymbal');
    crash.appendChild(crashCymbal);

    const crashClickArea = document.createElement('div');
    crashClickArea.classList.add('--crash-click-area');
    crash.appendChild(crashClickArea);
    // --- RIDE ---
    const ride = document.createElement('div');
    ride.classList.add('drum', 'ride');

    const uLabel = document.createElement('span');
    uLabel.classList.add('shortcut-name');
    uLabel.textContent = 'U';
    ride.appendChild(uLabel);

    const rideCymbal = document.createElement('div');
    rideCymbal.classList.add('--ride-cymbal');
    ride.appendChild(rideCymbal);

    const fixator2 = document.createElement('span');
    fixator2.classList.add('fixator');
    ride.appendChild(fixator2);

    const rideClickArea = document.createElement('div');
    rideClickArea.classList.add('--ride-click-area');
    ride.appendChild(rideClickArea);
    // --- FLOOR ---
    const floor = document.createElement('div');
    floor.classList.add('drum', 'floor');
    const jLabel = document.createElement('span');
    jLabel.classList.add('shortcut-name');
    jLabel.textContent = 'J';
    floor.appendChild(jLabel);

    drumsContainer.appendChild(bass);
    drumsContainer.appendChild(hihat);
    drumsContainer.appendChild(snare);
    drumsContainer.appendChild(tom1);
    drumsContainer.appendChild(tom2);
    drumsContainer.appendChild(crash);
    drumsContainer.appendChild(ride);
    drumsContainer.appendChild(floor);

    // Create controls
    const controlsContainer = document.createElement('div');
    controlsContainer.className = 'buttons-module';
    const hideShortcutsButton = document.createElement('button');
    hideShortcutsButton.className = 'hide-shortcuts';
    hideShortcutsButton.innerText = 'Hide Shortcuts';

    const dropdownContainer = document.createElement('nav');
    dropdownContainer.className = 'dropdown';
    const dropdownButton = document.createElement('button');
    dropdownButton.className = 'dropdown-button';
    dropdownButton.innerText = 'Drum kit';

    const listContainer = document.createElement('ul');
    ['Standard', 'Powerful', 'Monumental', 'Fresh', 'Minimalistic', 'Energetic'].forEach((type, index) => {
      const listOption = document.createElement('li');
      listOption.innerText = type;
      if (index === 0) {
        listOption.classList.add('active');
      }
      listContainer.appendChild(listOption);
    })

    dropdownContainer.appendChild(dropdownButton);
    dropdownContainer.appendChild(listContainer);
    controlsContainer.appendChild(dropdownContainer);
    controlsContainer.appendChild(hideShortcutsButton);


    // Create sequence controls
    const sequenceContainer = document.createElement('div');
    sequenceContainer.className = 'sequence-container';

    const sequenceInput = document.createElement('input');
    sequenceInput.type = 'text';
    sequenceInput.id = 'sequence';
    sequenceInput.className = 'sequence-input';
    sequenceInput.placeholder = `Enter sequence (e.g: ${'XSEGHYUJ'})`;
    sequenceInput.maxLength = Object.keys(this.sounds).length * 2;

    const playButton = document.createElement('button');
    playButton.className = 'play-sequence';
    playButton.textContent = 'Play Sequence';

    sequenceContainer.appendChild(sequenceInput);
    sequenceContainer.appendChild(playButton);

    wrapper.appendChild(controlsContainer);
    wrapper.appendChild(drumsContainer);
    wrapper.appendChild(sequenceContainer);
    document.body.prepend(wrapper);


    this.sequenceInput = sequenceInput;
    this.playButton = playButton;
    this.drumsContainer = drumsContainer;
  }

  bindEvents() {
    // Click events for drums
    this.drumsContainer.addEventListener('click', (e) => {
      if (this.isPlayingSequence) return;

      const drum = e.target.closest('.drum');
      if (drum) {
        if (e.target.classList.contains('edit-btn')) {
          this.startEdit(drum);
        } else {
          this.playDrum(drum);
        }
      }
    });

    // Keyboard events
    document.addEventListener('keydown', (e) => {
      if (this.isPlayingSequence) return;

      const key = e.key.toUpperCase();
      const sound = Object.values(this.sounds).find(s => s.key === key);

      if (sound && !this.currentlyPlaying.has(key)) {
        this.currentlyPlaying.add(key);
        this.playSound(sound);
        this.highlightDrum(key, true);
      }
    });

    document.addEventListener('keyup', (e) => {
      const key = e.key.toUpperCase();
      this.currentlyPlaying.delete(key);
      this.highlightDrum(key, false);
    });

    // Sequence playback
    this.playButton.addEventListener('click', () => {
      this.playSequence();
    });

    // Input validation for sequence
    this.sequenceInput.addEventListener('input', (e) => {
      const validKeys = Object.values(this.sounds).map(s => s.key);
      e.target.value = e.target.value.toUpperCase().split('')
        .filter(char => validKeys.includes(char))
        .join('');
    });
  }

  playDrum(drum) {
    const keyElement = drum.querySelector('.shortcut-name');
    const key = keyElement.textContent;
    const sound = Object.values(this.sounds).find(s => s.key === key);

    if (sound) {
      this.playSound(sound);
      this.highlightDrum(key, true);
      setTimeout(() => this.highlightDrum(key, false), 200);
    }
  }

  playSound(sound) {
    sound.audio.currentTime = 0;
    sound.audio.play().catch(e => console.log('Audio play failed:', e));
  }

  highlightDrum(key, isActive) {
    const drums = this.drumsContainer.querySelectorAll('.drum');
    drums.forEach(drum => {
      const drumKey = drum.querySelector('.shortcut-name').textContent;
      if (drumKey === key) {
        drum.classList.toggle('active', isActive);
      }
    });
  }

  startEdit(drum) {
    const keyElement = drum.querySelector('.shortcut-name');
    const currentKey = keyElement.textContent;

    this.editingSound = drum;
    this.showEditOverlay(currentKey);
  }


  showEditOverlay(currentKey) {
    const overlay = document.createElement('div');
    overlay.className = 'edit-overlay';

    const container = document.createElement('div');
    container.className = 'edit-input-container';

    const input = document.createElement('input');
    input.type = 'text';
    input.className = 'edit-input';
    input.value = currentKey;
    input.maxLength = 1;

    const hint = document.createElement('div');
    hint.className = 'edit-hint';
    hint.textContent = 'Press Enter to save, click outside to cancel';

    container.appendChild(input);
    container.appendChild(hint);
    overlay.appendChild(container);
    document.body.appendChild(overlay);

    input.focus();
    input.select();

    const saveEdit = () => {
      const newKey = input.value.toUpperCase();
      if (this.isValidKey(newKey)) {
        this.updateKey(this.editingSound, newKey);
      }
      this.closeEditOverlay(overlay);
    };

    input.addEventListener('keypress', (e) => {
      if (e.key === 'Enter') {
        saveEdit();
      }
    });

    overlay.addEventListener('click', (e) => {
      if (e.target === overlay) {
        this.closeEditOverlay(overlay);
      }
    });
  }

  closeEditOverlay(overlay) {
    document.body.removeChild(overlay);
    this.editingSound = null;
  }

  isValidKey(key) {
    if (!/^[A-Z]$/.test(key)) return false;

    const existingKeys = Object.values(this.sounds).map(s => s.key);
    return !existingKeys.includes(key);
  }

  updateKey(drum, newKey) {
    const keyElement = drum.querySelector('.shortcut-name');
    const oldKey = keyElement.textContent;

    // Update sounds mapping
    const soundName = Object.keys(this.sounds).find(name =>
      this.sounds[name].key === oldKey
    );

    if (soundName) {
      this.sounds[soundName].key = newKey;
      keyElement.textContent = newKey;
    }
  }

  async playSequence() {
    if (this.isPlayingSequence) return;

    const sequence = this.sequenceInput.value.toUpperCase();
    if (!sequence) return;

    this.isPlayingSequence = true;
    this.sequenceInput.disabled = true;
    this.playButton.disabled = true;

    for (let i = 0; i < sequence.length; i++) {
      const key = sequence[i];
      const sound = Object.values(this.sounds).find(s => s.key === key);

      if (sound) {
        this.playSound(sound);
        this.highlightDrum(key, true);

        await new Promise(resolve => {
          setTimeout(() => {
            this.highlightDrum(key, false);
            resolve();
          }, 400);
        });
      }
    }

    this.isPlayingSequence = false;
    this.sequenceInput.disabled = false;
    this.playButton.disabled = false;
  }

  preloadSounds() {
    Object.values(this.sounds).forEach(sound => {
      sound.audio.load();
    });
  }
}

document.addEventListener('DOMContentLoaded', () => {
  new VirtualDrumKit();
});


// bass.mp3
// crash.mp3
// floor-tom.mp3
// hihat-foot.mp3
// hihat-open.mp3
// hihat.mp3
// ride.mp3
// snare-drum.mp3
// snare-stick.mp3
// tom1.mp3
// tom2.mp3
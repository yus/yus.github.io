// UI Manager Class (LTS Approach)
class UIManager {
  constructor() {
    this.controls = null;
    this.footer = null;
    this.headerContent = null;
    this.speedSlider = null;
    this.initUI();
  }

  initUI() {
    this.createHeader();
    this.createControls();
    this.createFooter();
    this.setupEventListeners();
  }

  createHeader() {
    // Header container
    this.headerContent = createDiv('').class('header-content');

    // Your logo
    createImg('images/yus143.png', 'YUS Logo')
      .class('logo')
      .parent(this.headerContent);

    // p5.js logo (inline SVG)
    const p5Logo = createDiv('').html(`
      <a href="https://p5js.org" target="_blank">
        <svg viewBox="0 0 28 28" class="p5-logo">
          <path fill="#ED225D" d="M16.9 10.3l8.5-2.6 1.7 5.2-8.5 2.9 5.3 7.5-4.4 3.2-5.6-7.3-5.6 7.3-4.3-3.3 5.3-7.2L.9 12.6l1.7-5.2 8.6 2.8V1.4h5.8v8.9z"/>
        </svg>
      </a>
    `).parent(this.headerContent);
  }

  createControls() {
    // Main controls container
    this.controls = createDiv('').id('controls');
    this.headerContent.parent(this.controls);

    // Control buttons container
    const btnContainer = createDiv('').class('btn-container');

    // Play/Pause
    this.playPauseBtn = createButton('⏯ Play')
      .class('control-btn')
      .parent(btnContainer);

    // Step
    createButton('⏭ Step')
      .class('control-btn')
      .parent(btnContainer)
      .mousePressed(() => {
        if (!isPlaying) grid.computeNextGeneration();
      });

    // Clear
    createButton('🗑 Clear')
      .class('control-btn')
      .parent(btnContainer)
      .mousePressed(() => {
        grid.clear();
        if (isPlaying) this.togglePlay();
      });

    // Randomize
    createButton('🎲 Random')
      .class('control-btn')
      .parent(btnContainer)
      .mousePressed(() => grid.randomize());

    // Colors
    createButton('🎨 Colors')
      .class('control-btn')
      .parent(btnContainer)
      .mousePressed(() => colorManager.nextColorPair());

    btnContainer.parent(this.controls);

    // Color modes
    const colorModeDiv = createDiv('').class('color-mode');
    createSpan('Color Mode:').parent(colorModeDiv);

    ['Pair', 'Palette', 'Full'].forEach(mode => {
      createButton(mode)
        .class('mode-btn')
        .parent(colorModeDiv)
        .mousePressed(() => colorManager.randomizeColors(mode.toLowerCase()));
    });

    colorModeDiv.parent(this.controls);
  }

  createFooter() {
    this.footer = createDiv('').id('footer');

    // Speed control
    createSpan('Speed:').parent(this.footer);
    this.speedSlider = createSlider(1, 60, 30, 1)
      .class('speed-slider')
      .parent(this.footer)
      .input(() => frameRate(this.speedSlider.value()));

    // Save button
    createButton('💾 Save')
      .class('save-btn')
      .parent(this.footer)
      .mousePressed(() => {
        saveCanvas(`game-of-life-${new Date().toISOString().slice(0,10)}`, 'png');
      });

    // Credits
    createDiv('Conway\'s Game of Life by YUS | Powered by p5.js')
      .class('credits')
      .parent(this.footer);
  }

  setupEventListeners() {
    this.playPauseBtn.mousePressed(() => this.togglePlay());
  }

  togglePlay() {
    isPlaying = !isPlaying;
    this.playPauseBtn.html(isPlaying ? '⏸ Pause' : '⏯ Play');
  }
}

// Initialize UI
let uiManager;

function setupUI() {
  uiManager = new UIManager();
}

class ColorManager {
  constructor() {
    this.palettes = [
      {name: "AdelardOfBath", colors: ["#211830","#5c6e94","#87f4e2","#fffd97","#ffb594"]},
      {name: "AdobeHut", colors: ["#d5e05f","#868a61","#d19390","#ad4b45","#78b0e6"]},
      {name: "AiryTilt", colors: ["#6a78b8","#babfdb","#ededed","#dbd3ba","#b8a363"]},
      {name: "ArdentGaze", colors: ["#232925","#3c5940","#f2a444","#a6351c","#732f17"]},
      {name: "Ceramo", colors: ["#1252ff","#1a89ff","#23bcff","#2cebff","#34ffe5"]},
      {name: "ClayGolem", colors: ["#ffd01e","#b88e1a","#946f21","#664c23","#473625"]},
      {name: "DualDream", colors: ["#b27869","#e8b79b","#ffcf9c","#e8c587","#b5a473"]},
      {name: "EasyLight", colors: ["#a88973","#ccc7a2","#f5ffc9","#9ed7d9","#5197b2"]},
      {name: "ElectricSteel", colors: ["#194655","#326e7d","#4b8c9b","#64afc8","#7df0ff"]},
      {name: "FiddleWear", colors: ["#ff9f00","#cc6a00","#993f00","#661e00","#330900"]},
      {name: "FireGlow", colors: ["#c61100","#ff7117","#ffb73d","#ffe073","#fff9bb"]},
      {name: "GoodDay", colors: ["#2868a1","#6dace3","#a8d7ff","#ffe3b6","#ffb441"]},
      {name: "HypeReverse", colors: ["#9bcc00","#665b52","#332828","#544959","#00b3cc"]},
      {name: "Indioptry", colors: ["#001454","#5276a4","#ffffff","#ffdf86","#ffa400"]},
      {name: "KhakiChrome", colors: ["#2b3924","#5e923e","#c8ffad","#c4e4fd","#183b59"]},
      {name: "LoftWools", colors: ["#692309","#857d69","#c6d4a7","#52706a","#444b69"]},
      {name: "MonoTag", colors: ["#d3dff0","#97b2d2","#577ea5","#18608b","#004a76"]},
      {name: "MorningConcrete", colors: ["#ffe7c1","#b2a687","#645d56","#b29687","#ffcdc1"]},
      {name: "MossPhase2", colors: ["#403e2f","#807c5f","#bfba8e","#e5dfaa","#fff8bd"]},
      {name: "MossPhase", colors: ["#161a13","#2b3327","#56664d","#accc9a","#d7ffc1"]},
      {name: "MossShades", colors: ["#fff3c9","#ccc3a1","#999279","#666151","#333128"]},
      {name: "NauticaRusso", colors: ["#113940","#39735d","#ffff94","#ffc950","#ff7400"]},
      {name: "NavigatorLog", colors: ["#fff8dc","#ccaf88","#c19a6b","#8b0000","#003153"]},
      {name: "NiftyApt", colors: ["#9fc4d6","#b0d6a9","#fff1a0","#ffcf6f","#ffb050"]},
      {name: "OldCubes", colors: ["#3c9090","#81c86f","#ffc851","#ff3737","#516fae"]},
      {name: "OrangePip", colors: ["#000000","#404040","#808080","#ffffff","#ff9600"]},
      {name: "OvenZDoor", colors: ["#ff8c24","#ffbe5b","#ffdf8e","#fff7c4","#372626"]},
      {name: "ParadoxLustre", colors: ["#fff69b","#e5e0a9","#bfbc9d","#807e73","#404040"]},
      {name: "PentaCycle", colors: ["#f2d97b","#84bf7e","#6e818c","#544a59","#24201f"]},
      {name: "PentacularMeasure", colors: ["#302733","#a08378","#f5e7b4","#698062","#273133"]},
      {name: "PythagorasNude", colors: ["#3ebf00","#ffc800","#e50000","#99008f","#006099"]},
      {name: "QuarterCanon", colors: ["#802c2c","#b24d2d","#cc6e1f","#e59a0f","#ffc800"]},
      {name: "RadioMoss", colors: ["#738069","#999375","#b29e84","#ccafa5","#e5bdde"]},
      {name: "RedDust", colors: ["#7a0000","#ff6747","#ffcfac","#e6c8c8","#4a3737"]},
      {name: "RedClay", colors: ["#402c24","#66463a","#8c6050","#b27a66","#d9947b"]},
      {name: "RedGray", colors: ["#7a0000","#ff6747","#ffcfac","#c9c9c9","#1c1c1c"]},
      {name: "SakuraPastel", colors: ["#b860b4","#f48cda","#ffb8f4","#ff9382","#ae5e4f"]},
      {name: "Sandbox", colors: ["#ffa900","#967b45","#c7a259","#e3cea4","#ffffff"]},
      {name: "SheSunset", colors: ["#401925","#80483b","#bf8959","#e5bd77","#ffeca7"]},
      {name: "SmokerAttic", colors: ["#4e4e57","#b0b0bf","#e8e9ff","#adac8f","#c9700b"]},
      {name: "SmokerJeans", colors: ["#005a6e","#6496aa","#c8e1e1","#afa0a0","#643c3c"]},
      {name: "StarmarCinnabari", colors: ["#f5f5f5","#dcdcdc","#a9a9a9","#1f1a17","#bf0000"]},
      {name: "TriangleBisectors", colors: ["#1e4566","#5e8268","#b2b04a","#fcda5c","#ffb029"]},
      {name: "VitalityHerbarium", colors: ["#730202","#b53c25","#bd8d46","#ffb03b","#f6e497"]},
      {name: "WewakShade", colors: ["#f2a4a5","#b07777","#7a5353","#4c3434","#291c1c"]}
    ];
    this.colorPairs = []; // Generated from palettes
    this.currentPair = 0;
    this.colorMode = 'pair'; // 'pair', 'palette', 'full'
    this.loadColors();
  }

  async loadColors() {
    try {
      // const response = await fetch('colors.csv');
      // const csvData = await response.text();
      // this.parseCSV(csvData);

      // Generate color pairs (first and last color of each palette)
      this.colorPairs = this.palettes.map(palette => ({
        alive: palette.colors[0],
        dead: palette.colors[palette.colors.length-1]
      }));
    } catch (error) {
      console.error("Error loading colors:", error);
      // Fallback colors
      this.palettes = [{
        name: "Default",
        colors: [
          [255, 0, 0],   // alive
          [200, 0, 0],   // dead
          [150, 0, 0],
          [100, 0, 0],
          [50, 0, 0]
        ]
      }];
      this.colorPairs = this.palettes.map(p => ({
        alive: p.colors[0],
        dead: p.colors[p.colors.length-1]
      }));
    }
  }

  // parseCSV(csvData) {
  //   const lines = csvData.split('\n').filter(line => line.trim() !== '');
  //   let currentPalette = null;
  //
  //   for (const line of lines) {
  //     if (line.startsWith('Palette')) {
  //       if (currentPalette) this.palettes.push(currentPalette);
  //       currentPalette = {
  //         name: line.trim(),
  //         colors: []
  //       };
  //     } else {
  //       const [r, g, b] = line.split(',').map(Number);
  //       if (!isNaN(r) && !isNaN(g) && !isNaN(b)) {
  //         currentPalette.colors.push([r, g, b]);
  //       }
  //     }
  //   }
  //
  //   if (currentPalette) this.palettes.push(currentPalette);
  // }

  getAliveColor() {
    return this.colorPairs[this.currentPair].alive;
  }

  getDeadColor() {
    return this.colorPairs[this.currentPair].dead;
  }

  getRandomColorFromPalette(paletteIndex) {
    const palette = this.palettes[paletteIndex];
    return palette.colors[floor(random(palette.colors.length))];
  }

  randomizeColors(mode = this.colorMode) {
    this.colorMode = mode;

    switch(this.colorMode) {
      case 'pair':
        // Random pair from existing pairs
        this.currentPair = floor(random(this.colorPairs.length));
        break;

      case 'palette':
        // Random palette, create new pair from first/last
        const palette = random(this.palettes);
        this.colorPairs = [{
          alive: palette.colors[0],
          dead: palette.colors[palette.colors.length-1]
        }];
        this.currentPair = 0;
        break;

      case 'full':
        // Random colors from all available
        const allColors = this.palettes.flatMap(p => p.colors);
        this.colorPairs = [{
          alive: random(allColors),
          dead: random(allColors)
        }];
        this.currentPair = 0;
        break;
    }
  }

  nextColorPair() {
    this.currentPair = (this.currentPair + 1) % this.colorPairs.length;
  }
}

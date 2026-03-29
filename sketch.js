let glitchTimer = 0;
let glitchDuration = 0;
let glitchOffset = 0;
let glitchStrength = 1; // сила глитча
let asciiChars = ['.', ':', '+', '*', '0', '1'];

// шаг между вертикальными линиями
let step = 6;

// графический буфер для текста-маски
let maskG;

// базовый размер
const BASE_W = 600;
const BASE_H = 800;

// финальный размер
const W = 4961;
const H = 7016;

let S;

function setup() {
  createCanvas(W, H);
  pixelDensity(1); 
  textFont('Helvetica');

  S = width / BASE_W;
  step = max(1, int(6 * S));

  // это offscreen-буфер для текста
  maskG = createGraphics(width, height);

  // рисуем текст в буфер 
  maskG.background(0); // черный фон = 'нет текста'
  maskG.fill(255);     // белый = 'есть текст'
  maskG.noStroke();

  maskG.textAlign(CENTER, CENTER); 
  maskG.textStyle(BOLD);         
  maskG.textSize(110 * S);             

  // рисуем строки текста 
  maskG.text('CHAOS', width / 2, height / 2 - 80 * S);
  maskG.text('IS', width / 2, height / 2);
  maskG.text('BEAU', width / 2, height / 2 + 80 * S);
  maskG.text('TIFUL', width / 2, height / 2 + 160 * S);
}

function labelBlock(txt, cx, cy, w, h) {
  push();

  rectMode(CENTER);
  noStroke();

  // черная плашка
  fill(0);
  rect(cx, cy, w, h);

  // текст
  fill(255);
  textAlign(CENTER, CENTER);
  textSize(12 * S);
  textStyle(NORMAL);
  textFont('Helvetica');

  text(txt, cx, cy);

  pop();
}

// сохраняем как картинку
function mousePressed() {
  save('myArt.png'); 
}

function draw() {
  background('#000000'); 
  
  // ! запуск редкого глитча 
  if (glitchTimer <= 0 && random() < 0.05) {
    glitchDuration = int(random(3, 10));
    glitchTimer = glitchDuration;
    glitchOffset = random(-50, 50) * S;
    glitchStrength = random(0.6, 1.8);
  }

  // уменьшаем таймер
  if (glitchTimer > 0) {
    glitchTimer--;
  }

  maskG.loadPixels(); // загружаем пиксели маски

  strokeWeight(max(1, 2 * S * 0.5));

  // идем по вертикальным колонкам
  for (let x = 0; x < width; x += step) {

    // идем по строкам
    for (let y = 0; y < height; y += max(1, 2 * S)) {

      // индекс пикселя в маске
      let idx = 4 * (floor(y) * width + floor(x));

      // яркость
      let bright = maskG.pixels[idx];

      // базовое смещение полос 
      let block = floor(y / (80 * S));
      let offset = block % 2 === 0 ? 0 : 5 * S;

      // мягкая волна 
      offset += sin(y * 0.05 + frameCount * 0.09) * 8 * S;

      // ! (ПОЛОСНЫЙ ГЛИТЧ) 
      let sliceShift = 0;

      if (glitchTimer > 0) {
        let sliceNoise = noise(y * 0.05, frameCount * 0.1);

        if (sliceNoise > 0.55) {
          sliceShift =
            glitchOffset *
            glitchStrength *
            map(sliceNoise, 0.55, 1, 0.2, 1.2);
        }
      }

      // цвет 
      if (bright > 128) {
        stroke('#464646');
      } else {
        stroke('#F5F5F5');
      }

      // ! редкие ASCII-артефакты
      if (random() < 0.002 && bright < 128) {
        push();
        noStroke();
        fill('rgba(255,255,255,0.7)');
        textSize(10 * S);
        text(
          random(asciiChars),
          x + offset + sliceShift,
          y
        );
        pop();
      }
      
      // ! микродрожание 
      let jitterX = random(-0.6, 0.6) * S;
      let jitterY = random(-0.6, 0.6) * S;

      point(x + offset + sliceShift + jitterX, y + jitterY);
    }
  }
  
  // верхний блок текста
  labelBlock(
    '( creative coding )',
    width / 2,
    60 * S,
    100 * S,
    26 * S
  );
  
  // нижний блок текста
  labelBlock(
    '( generative art )',
    width / 2,
    height - 60 * S,
    90 * S,
    26 * S
  );
}


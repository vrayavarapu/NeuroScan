particlesJS('particles-js', {
  particles: {
    number: {
      value: 80,
      density: {
        enable: true,
        value_area: 800
      }
    },
    color: {
      value: '#000000'
    },
    shape: {
      type: 'circle',
      stroke: {
        width: 0
      }
    },
    opacity: {
      value: 0.5,
      random: true,
      anim: {
        enable: true,
        speed: 1.5,
        opacity_min: 0.1,
        sync: false
      }
    },
    size: {
      value: 3,
      random: true,
      anim: {
        enable: true,
        speed: 4,
        size_min: 0.1,
        sync: false
      }
    },
    line_linked: {
      enable: true,
      distance: 150,
      color: '#000000',
      opacity: 0.5,
      width: 2
    },
    move: {
      enable: true,
      speed: 2,
      direction: 'none',
      random: true,
      straight: false,
      out_mode: 'out',
      attract: {
        enable: false
      }
    }
  },
  interactivity: {
    detect_on: 'window',
    events: {
      onhover: {
        enable: true,
        mode: 'repulse'
      },
      onclick: {
        enable: true,
        mode: 'push'
      }
    },
    modes: {
      repulse: {
        distance: 100,
        duration: 0.4
      },
      push: {
        particles_nb: 4
      }
    }
  },
  retina_detect: true
});
const targetText = "NeuroScan"; // Final title
const glitchTitle = document.getElementById("glitch-title");
const chars = "01"; // Binary code
let currentText = "";
let iterations = 0;
let maxIterations = 7; // Number of cycles before final text appears

function generateBinary(length) {
  let binaryStr = "";
  for (let i = 0; i < length; i++) {
    binaryStr += chars[Math.floor(Math.random() * chars.length)];
  }
  return binaryStr;
}

function glitchEffect() {
  if (iterations < maxIterations) {
    currentText = generateBinary(targetText.length);
    glitchTitle.innerText = currentText;
    iterations++;
    setTimeout(glitchEffect, 50); // Speed of transition
  } else {
    revealText();
  }
}

function revealText() {
  let i = 0;
  const interval = setInterval(() => {
    glitchTitle.innerText = targetText.substring(0, i) + generateBinary(targetText.length - i);
    i++;
    if (i > targetText.length) {
      clearInterval(interval);
      glitchTitle.innerText = targetText;
    }
  }, 100);
}

// Start effect after page load
window.onload = () => {
  glitchEffect();
};
document.querySelectorAll(".dropdown").forEach((dropdown) => {
  dropdown.addEventListener("mouseenter", function () {
    this.querySelector(".dropdown-menu").style.display = "block";
    this.querySelector(".dropdown-menu").style.opacity = 0;
    setTimeout(() => {
      this.querySelector(".dropdown-menu").style.opacity = 1;
    }, 10);
  });

  dropdown.addEventListener("mouseleave", function () {
    this.querySelector(".dropdown-menu").style.opacity = 0;
    setTimeout(() => {
      this.querySelector(".dropdown-menu").style.display = "none";
    }, 200);
  });
});


(() => {
  const startBtn = document.getElementById('start-btn-menu');
  const optionsBtn = document.getElementById('options-btn');
  const creditsBtn = document.getElementById('credits-btn');
  const title = document.getElementById('title');

  const buttons = [startBtn, optionsBtn, creditsBtn];

  let selectedIndex = 0;
  let isMenuActive = true;

  const menuMusic = new Audio('../sound/Menu.ogg');
  menuMusic.loop = true;
  menuMusic.volume = 0.5;

  window.addEventListener('load', () => {
    setTimeout(() => {
      menuMusic.play().catch(() => {});
    }, 3000);
  });

  document.addEventListener('click', () => {
    menuMusic.play().catch(() => {});
  }, { once: true });

  const musicCheckbox = document.getElementById('music');
  if (musicCheckbox) {
    musicCheckbox.addEventListener('change', (e) => {
      if (e.target.checked) {
        menuMusic.play().catch(() => {});
      } else {
        menuMusic.pause();
      }
    });
  }

  function updateSelection() {
    buttons.forEach((btn, index) => {
      if (index === selectedIndex) {
        btn.classList.add('selected');
      } else {
        btn.classList.remove('selected');
      }
    });
  }

  function handleStart() {
    window.location.href = '../src/options.html';
  }

  function handleOptions() {
    window.location.href = '../src/options.html';
  }

  function handleCredits() {
    alert('Criado por: Você\nInspirado em: Granny');
  }

  document.addEventListener('keydown', (e) => {
    if (!isMenuActive) return;

    if (e.code === 'ArrowUp' || e.code === 'KeyW') {
      selectedIndex = (selectedIndex - 1 + buttons.length) % buttons.length;
      updateSelection();
    } else if (e.code === 'ArrowDown' || e.code === 'KeyS') {
      selectedIndex = (selectedIndex + 1) % buttons.length;
      updateSelection();
    } else if (e.code === 'Enter' || e.code === 'Space') {
      if (selectedIndex === 0) handleStart();
      else if (selectedIndex === 1) handleOptions();
      else if (selectedIndex === 2) handleCredits();
    }
  });

  startBtn.addEventListener('click', () => {
    handleStart();
  });
  optionsBtn.addEventListener('click', () => {
    handleOptions();
  });
  creditsBtn.addEventListener('click', () => {
    handleCredits();
  });

  const backBtn = document.getElementById('back-btn');
  if (backBtn) {
    backBtn.addEventListener('click', () => {
      window.location.href = 'mainmenu.html';
    });
  }

  startBtn.addEventListener('mouseenter', () => {
    selectedIndex = 0;
    updateSelection();
  });
  optionsBtn.addEventListener('mouseenter', () => {
    selectedIndex = 1;
    updateSelection();
  });
  creditsBtn.addEventListener('mouseenter', () => {
    selectedIndex = 2;
    updateSelection();
  });

  let titlePulse = 0;
  function animateTitle() {
    titlePulse += 0.05;
    const scale = 1 + Math.sin(titlePulse) * 0.02;
    title.style.transform = `scale(${scale})`;
    requestAnimationFrame(animateTitle);
  }

  updateSelection();
  animateTitle();
})();
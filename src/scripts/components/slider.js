/* eslint-disable */
export default function createSlider(content) {
  const target = document.getElementById('slider-content');

  // render layout for slider
  for (let i = 0; i < content.length; i++) {
    const slide = renderFrame(content[i], i);
    target.insertAdjacentHTML('beforeEnd', slide);
  }

  slider({
    autoplay: false, // starts the rotation automatically
    infinite: true, // enables the infinite mode
    interval: 2000, // interval between slide changes
    nav: true, // show navigation dots
    arrows: true, // show navigation arrows
    buttons: true, // hide play/stop buttons,
    btnStopText: 'Pause' // STOP button text
  });
}

function renderFrame(slideContent, index) {
  const {
    image_url,
    name,
    availability,
    category,
    description,
    price,
    price_currency_code,
    url
  } = slideContent;

  return `
    <li class="frame">
      <a href="${url}">
        <img 
          class="frame-image"
          src="${image_url}" 
          alt="${name}">
      </a>
      <p class="frame-availability">${availability}</p>
      <p class="frame-category">${category}</p>
      <p class="frame-description">${description}</p>
      <p class="frame-price">${price}${price_currency_code}</p>
    </li>`;
}

function slider(options) {
  const element = document.getElementById('slider');
  const count = element.querySelectorAll('li').length;
  const interval = options.interval || 3000;

  // style classes
  const slClass = 'slider';
  const slArrowPrevClass = 'slider-arrowPrev';
  const slArrowNextClass = 'slider-arrowNext';
  const slButtonStopClass = 'slider-btnStop';
  const slButtonPlayClass = 'slider-btnPlay';
  const slNavClass = 'slider-nav';

  // controls
  const btnPlayText = options.btnPlayText || 'Play';
  const btnStopText = options.btnStopText || 'Stop';
  const arrNextText = options.arrNextText || '&rsaquo;';
  const arrPrevText = options.arrPrevText || '&lsaquo;';

  let current = 0;
  let cycle = null;

  /* render if more than one slide.*/
  if (count > 1) {
    _render();
  }

  function _render() {
    const actions = {
      nav: () => showNav(),
      arrows: () => showArrows(),
      buttons: () => showButtons(),
      autoplay: () => play(),
      initial: () => show(0),
      infinite: () =>
        moveItem(count - 1, `-${element.offsetWidth}px`, 'afterBegin')
    };

    for (const key in actions) {
      if (options.hasOwnProperty(key) && options[key]) {
        actions[key]();
      }
    }
  }

  function moveItem(i, marginLeft, position) {
    const itemToMove = element.querySelectorAll(`.${slClass} > ul li`)[i];
    itemToMove.style.marginLeft = marginLeft;

    element.querySelector(`.${slClass} > ul`).removeChild(itemToMove);

    element
      .querySelector(`.${slClass} > ul`)
      .insertAdjacentHTML(position, itemToMove.outerHTML);
  }

  function showNav() {
    const dotContainer = document.createElement('ul');
    dotContainer.classList.add(slNavClass);
    dotContainer.addEventListener('click', scrollToImage.bind(this));

    for (let i = 0; i < count; i++) {
      const dotElement = document.createElement('li');
      dotElement.setAttribute('data-position', i);

      dotContainer.appendChild(dotElement);
    }

    element.appendChild(dotContainer);
    currentDot();
  }

  function currentDot() {
    [].forEach.call(element.querySelectorAll(`.${slNavClass} li`), function(
      item
    ) {
      item.classList.remove('is-active');
    });

    element
      .querySelectorAll(`.${slNavClass} li`)
      [current].classList.add('is-active');
  }

  function scrollToImage(e) {
    if (e.target.tagName === 'LI') {
      show(e.target.getAttribute('data-position'));

      resetInterval();
    }
  }

  function showArrows() {
    const buttonPrev = document.createElement('button');
    buttonPrev.innerHTML = arrPrevText;
    buttonPrev.classList.add(slArrowPrevClass);

    const buttonNext = document.createElement('button');
    buttonNext.innerHTML = arrNextText;
    buttonNext.classList.add(slArrowNextClass);

    buttonPrev.addEventListener('click', showPrev);
    buttonNext.addEventListener('click', showNext);

    element.appendChild(buttonPrev);
    element.appendChild(buttonNext);
  }

  function showButtons() {
    const buttonPlay = document.createElement('button');
    buttonPlay.innerHTML = btnPlayText;
    buttonPlay.classList.add(slButtonPlayClass);
    buttonPlay.addEventListener('click', play);

    const buttonStop = document.createElement('button');
    buttonStop.innerHTML = btnStopText;
    buttonStop.classList.add(slButtonStopClass);
    buttonStop.addEventListener('click', stop);

    element.appendChild(buttonPlay);
    element.appendChild(buttonStop);
  }

  function animatePrev(item) {
    item.style.marginLeft = '';
  }

  function animateNext(item) {
    item.style.marginLeft = -element.offsetWidth + 'px';
  }

  function show(slide) {
    const delta = current - slide;

    if (delta < 0) {
      moveByDelta(-delta, showNext);
    } else {
      moveByDelta(delta, showPrev);
    }
  }

  function moveByDelta(delta, direction) {
    for (let i = 0; i < delta; i++) {
      direction();
    }
  }

  function showPrev() {
    if (options.infinite) {
      showPrevInfinite();
    } else {
      showPrevLinear();
    }

    resetInterval();
  }

  function showPrevInfinite() {
    animatePrev(element.querySelectorAll(`.${slClass}> ul li`)[0]);
    moveItem(count - 1, -element.offsetWidth + 'px', 'afterBegin');

    adjustCurrent(-1);
  }

  function showPrevLinear() {
    stop();
    if (current === 0) {
      return;
    }
    animatePrev(element.querySelectorAll(`.${slClass}> ul li`)[current - 1]);

    adjustCurrent(-1);
  }

  function showNext() {
    if (options.infinite) {
      showNextInfinite();
    } else {
      showNextLinear();
    }

    resetInterval();
  }

  function showNextInfinite() {
    animateNext(element.querySelectorAll(`.${slClass}> ul li`)[1]);
    moveItem(0, '', 'beforeEnd');

    adjustCurrent(1);
  }

  function showNextLinear() {
    if (current === count - 1) {
      stop();
      return;
    }
    animateNext(element.querySelectorAll(`.${slClass}> ul li`)[current]);

    adjustCurrent(1);
  }

  function adjustCurrent(val) {
    current += val;

    switch (current) {
      case -1:
        current = count - 1;
        break;
      case count:
        current = 0;
        break;
      default:
        current = current;
    }

    if (options.nav) {
      currentDot();
    }
  }

  function resetInterval() {
    if (cycle) {
      stop();
      play();
    }
  }

  function play() {
    if (cycle) {
      return;
    }
    cycle = setInterval(showNext.bind(this), interval);
  }

  function stop() {
    clearInterval(cycle);
    cycle = null;
  }

  function live() {
    return current;
  }

  return {
    live: live,
    show: show,
    prev: showPrev,
    next: showNext,
    play: play,
    stop: stop
  };
}
/* eslint-enable */

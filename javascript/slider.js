(function () {
  var sliderQuerySelector = '[data-controller="slider"]';
  var navigationNextQuerySelector = '[data-controller="slider/button/next"]';
  var navigationPrevQuerySelector = '[data-controller="slider/button/prev"]';
  var paginationQuerySelector = '[data-controller="slider/pagination"]';

  var selectors = {
    oembedContainer: '[data-controller="oembed"]',
    oembedIframe: '[data-controller="oembed/iframe"]'
  };

  function loadOEmbed(container) {
    var iframeWrapper = container.querySelector(selectors.oembedIframe);
    var customThumbnail = container.querySelector('.oembed_custom-thumbnail');
    var url = iframeWrapper.dataset.embedUrl;

    if (!url) {
      return false;
    }

    var requestUrl = "/_hcms/oembed?url=" + url + "&autoplay=0";
    var cachedData = sessionStorage.getItem(requestUrl);

    if (cachedData) {
      handleOEmbedData(JSON.parse(cachedData));
    } else {
      fetch(requestUrl)
        .then(response => {
          if (response.ok) {
            return response.json();
          }
          throw new Error('Network response was not ok.');
        })
        .then(data => {
          handleOEmbedData(data);
          sessionStorage.setItem(requestUrl, JSON.stringify(data));
        })
        .catch(error => {
          console.error('Error fetching oEmbed data:', error);
        });
    }

    function handleOEmbedData(data) {
      var maxHeight = iframeWrapper.dataset.maxHeight !== undefined && !iframeWrapper.dataset.maxHeight ? undefined : iframeWrapper.dataset.maxHeight;
      var maxWidth = iframeWrapper.dataset.maxWidth !== undefined && !iframeWrapper.dataset.maxWidth ? undefined : iframeWrapper.dataset.maxWidth;
      var height = iframeWrapper.dataset.height !== undefined && !iframeWrapper.dataset.height ? undefined : iframeWrapper.dataset.height;
      var width = iframeWrapper.dataset.width !== undefined && !iframeWrapper.dataset.width ? undefined : iframeWrapper.dataset.width;
      var el = document.createElement('div');
      el.innerHTML = data.html;
      var iframe = el.firstChild;
      iframe.setAttribute("class", "oembed_container_iframe");
      iframe.setAttribute("title", data.title);
      iframe.setAttribute("loading", 'lazy');

      if (customThumbnail) {
        customThumbnail.onclick = function(){
          iframe.src += "&autoplay=1";
          this.setAttribute("class", "oembed_custom-thumbnail--hide");
          iframeWrapper.appendChild(iframe);
        };
      } else {
        iframeWrapper.appendChild(iframe);
      }

      if (maxHeight) {
        var maxHeightStr = maxHeight.toString(10) + "px";
        container.style.maxHeight = maxHeightStr;
        iframe.style.maxHeight = maxHeightStr;
        if (customThumbnail) {
          customThumbnail.style.maxHeight = maxHeightStr;
        }
      }

      if (maxWidth) {
        var maxWidthStr = maxWidth.toString(10) + "px";
        container.style.maxWidth = maxWidthStr;
        iframe.style.maxWidth = maxWidthStr;
        if (customThumbnail) {
          customThumbnail.style.maxWidth = maxWidthStr;
        }
      }

      if (height) {
        var heightStr = height.toString(10) + "px";
        container.style.height = heightStr;
        iframe.style.height = heightStr;
        if (customThumbnail) {
          customThumbnail.style.height = heightStr;
        }
      }

      if (width) {
        var widthStr = width.toString(10) + "px";
        container.style.width = widthStr;
        iframe.style.width = widthStr;
        if (customThumbnail) {
          customThumbnail.style.width = widthStr;
        }
      }
    }
  }

  var defaultSliderSettings = {
    mouseDrag: true,
    items: 1,
    slideBy: 1,
    autoplay: false,
    gutter: window.theme.gridGutter / 2, // Space between slides (in "px").
    fixedWidth: false,
    autoWidth: false,
    center: false, // Center the active slide in the viewport.
    controls: false, // Controls the display and functionalities of controls components (prev/next buttons). If true, display the controls and add all functionalities. For better accessibility, when a prev/next button is focused, user will be able to control the slider using left/right arrow keys.
    controlsText: ["", ""],
    controlsContainer: false,
    prevButton: false,
    nextButton: false,
    reverse: true,
    nav: true,
    navPosition: 'bottom',
    navContainer: false,
    navAsThumbnails: true,
    loop: false,
    lazyload: false,
    touch: true,
    onInit: function(info) {
      if (info.navContainer) info.navContainer.classList.add('slider-nav');

      /**
       * highlighted
       */
      const indexCurr = info.index;

      const elements = info.container.getElementsByClassName("slider__item--highlighted");
      while (elements.length > 0) {
        elements[0].classList.remove("slider__item--highlighted");
      }
      info.slideItems[indexCurr].classList.add("slider__item--highlighted");

      var oembedContainers = info.container.querySelectorAll('[data-controller="oembed"]');

      if (oembedContainers.length !== 0) {
        Array.prototype.forEach.call(oembedContainers, function(el) {
          loadOEmbed(el);
        });
      }
    }
  };

  /**
   * before each slider starts
   * @param element
   */
  function onEachSlider (element) {
    var id = element.getAttribute('id');
    var dataSettings = element.getAttribute('data-settings') || false;
    var sliderSettings = Object.assign({}, defaultSliderSettings);

    if (dataSettings) {
      sliderSettings = Object.assign(
        {},
        defaultSliderSettings,
        parseDataSettings(dataSettings)
      );
    }

    var sliders = window.sliders || {}

    sliderSettings = Object.assign(sliderSettings, {container: element})

    var slider = tns(sliderSettings)

    slider.events.on("indexChanged", () => {
      slider
        .getInfo()
        .slideItems[slider.getInfo().index].classList.add(
        "slider__item--highlighted"
      );
    });
    slider.events.on("indexChanged", () => {
      const info = slider.getInfo();
      const indexCurr = info.index;
      const elements = info.container.getElementsByClassName("slider__item--highlighted");
      while (elements.length > 0) {
        elements[0].classList.remove("slider__item--highlighted");
      }
      info.slideItems[indexCurr].classList.add("slider__item--highlighted");
    });
    sliders[id]= slider;
  }

  function parseDataSettings(data) {
    var settings = JSON.parse(data);
    if (settings.responsive) {
      var breakpoints = settings.responsive
      settings.responsive = {}

      if (breakpoints.tablet) {
        settings.responsive[theme.breakpoints.lg] = breakpoints.tablet;
      }
      if (breakpoints.desktop) {
        settings.responsive[theme.breakpoints.xl] = breakpoints.desktop;
      }
    }

    return settings;
  }

  domReady(function () {
    var sliders = document.querySelectorAll(sliderQuerySelector);
    sliders.forEach(onEachSlider);
  })
})();

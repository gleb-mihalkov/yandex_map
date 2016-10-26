!(function($) {
	if ($ == null) {
		console.warn('jQuery is required.');
		return;
	}
	if (ymaps == null) {
		console.warn('Yandex maps is required.');
		return;
	}

	/**
	 * Настройки плагина по умолчанию.
	 * @type {Object}
	 */
	var OPTIONS = {

		/**
		 * Положение метки карты.
		 * @type {Array}
		 */
		'center': null,

		/**
		 * Начальное приближение карты.
		 * @type {Number}
		 */
		'zoom': 18,

		/**
		 * Вид маркера карты.
		 * @type {String}
		 */
		'preset': null,

		/**
		 * Текст всплывающей подсказки над маркером.
		 * @type {String}
		 */
		'hint': null,

		/**
		 * Текст балуна. Если не задан, используется текст всплывающей подсказки.
		 * @type {String}
		 */
		'balloon': null,

		/**
		 * Путь к файлу иконки.
		 * @type {String}
		 */
		'icon': null,

		/**
		 * Размеры иконки.
		 * @type {Array}
		 */
		'icon-size': null,

		/**
		 * Смещение иконки относительно левого верхнего края изображения.
		 * @type {Array}
		 */
		'icon-offset': null
	};

	/**
	 * Получает настройки экземпляра плагина.
	 * @param {jQuery} $self Элемент.
	 */
	var options = function($self) {
		var result = {};

		for (var key in OPTIONS) {
			if (!OPTIONS.hasOwnProperty(key)) {
				continue;
			}

			var value = $self.data(key);
			result[key] = value == null ? OPTIONS[key] : value;
		}

		return result;
	};

	/**
	 * Список элементов для плагинов карт.
	 * @type {Array}
	 */
	var $elements = [];

	/**
	 * Инициализирует плагин для элемента.
	 * @param {jQuery} $self Элемент.
	 */
	var init = function($self) {
		var opts = options($self);
		
		if (opts.center == null) {
			console.warn('Attribute "center" is required.');
			return;
		}

		var map = new ymaps.Map($self.get(0), {
			center: opts.center,
			zoom: opts.zoom
		});

		map.behaviors.disable('scrollZoom');

		var pmSettings = {};
		var pmOptions = {};

		if (opts['preset']) {
			pmOptions.preset = opts['preset'];
		}

		if (opts['hint']) {
			pmSettings.hintContent = opts['hint'];
			pmSettings.balloonContent = opts['hint'];
		}

		if (opts['balloon']) {
			pmSettings.balloonContent = opts['balloon'];
		}

		if (opts.icon) {
			pmOptions.iconLayout = 'default#image';
			pmOptions.iconImageHref = opts['icon'];

			if (opts['icon-size']) {
				pmOptions.iconImageSize = opts['icon-size'];
				pmOptions.iconImageOffset = [
					-Math.round(pmOptions.iconImageSize[0] / 2),
					-pmOptions.iconImageSize[1]
				];	

				if (opts['icon-offset']) {
					pmOptions.iconImageOffset = opts['icon-offset'];
				}
			}
		}

		var placemark = new ymaps.Placemark(opts.center, pmSettings, pmOptions);
		map.geoObjects.add(placemark);

		$self.trigger('ymap', map);
		$self.addClass('active');
	};

	// Подключение карт.
	$('.js-yandex-map').each(function() {
		var $self = $(this);
		$elements.push($self);
	});

	// Инициализация плагинов.
	ymaps.ready(function() {
		for (var i = 0; i < $elements.length; i++) {
			var $self = $elements[i];
			init($self);
		}
	});
})(window.jQuery)
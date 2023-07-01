let loader = document.querySelector('.loader');
window.addEventListener('load', () => {
	//document.querySelector('body').classList.add('loaded');
	//loader.classList.add('hide');
	setTimeout(() => {
		document.querySelector('body').classList.add('loaded');
		loader.remove();
	}, 600)
});

// firstscreen 100 vh
const fullScreens = document.querySelector('[data-fullscreen]');
//if (fullScreens && isMobile.any()) {
if (fullScreens) {
	const resizeHeight = () => {
		let windowHeight = window.innerHeight * 0.01;
		const datasetElement = fullScreens.dataset.fullscreen;
		let vh;
		if (datasetElement) {
			const innerElement = document.querySelector(datasetElement);
			vh = windowHeight - innerElement.offsetHeight * 0.01;
		} else {
			vh = windowHeight;
		}
		document.documentElement.style.setProperty('--vh', `${vh}px`);
	}
	window.addEventListener('resize', resizeHeight);
	resizeHeight();
}

document.addEventListener('DOMContentLoaded', () => {
	"use strict"

	const input = document.querySelectorAll('input, textarea');
	if (input.length > 0) {
		for (let i = 0; i < input.length; i++) {
			input[i].addEventListener('input', updateValue);

		}
	}

	function updateValue(e) {
		if (e.target.value) {
			e.target.classList.add('val');
		} else {
			e.target.classList.remove('val');
		}
	}

	let isMobile = {
		Android: function () {
			return navigator.userAgent.match(/Android/i);
		},
		BlackBerry: function () {
			return navigator.userAgent.match(/BlackBerry/i);
		},
		iOS: function () {
			return navigator.userAgent.match(/iPhone|iPad|iPod/i);
		},
		Opera: function () {
			return navigator.userAgent.match(/Opera Mini/i);
		},
		Windows: function () {
			return navigator.userAgent.match(/IEMobile/i);
		},
		any: function () {
			return (
				isMobile.Android() ||
				isMobile.BlackBerry() ||
				isMobile.iOS() ||
				isMobile.Opera() ||
				isMobile.Windows()
			);
		}
	}
	const isDevice = () => {
		if (isMobile.any()) {
			document.body.classList.add('_touch');
		} else {
			document.body.classList.add('_pc');
		}
		if (isMobile.iOS()) {
			document.body.classList.add('_ios');
		}
	}
	isDevice();

	// Send Form
	const forms = () => {
		const forms = document.querySelectorAll('.form'),
			submitBtn = document.querySelectorAll('[type="submit"]'),
			inputs = document.querySelectorAll('._form-input');

		if (forms) {
			const message = {
				loading: 'Senden...',
				success: 'Grazie! Messagio è stato inviato! La contatteremo all\'indirizzo e-mail specificato',
				failure: 'Something went wrong',
				fill_in_field: 'Occupancy, please fields'
			}

			const formAddError = (field) => {
				field.classList.add('_error');
			}

			const formRemoveError = (field) => {
				field.classList.remove('_error');
			}

			const emailCheck = (field) => {
				return !/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,8})+$/.test(field.value);
			}

			const phoneCheck = (field) => {
				return /^(\+3|3|8)?[\s\-]?\(?[489][0-9]{2}\)?[\s\-]?[0-9]{3}[\s\-]?[0-9]{2}[\s\-]?[0-9]{2}$/.test(field.value);
			}


			function formValidate(form) {
				let error = 0;

				const phoneInputs = form.querySelectorAll('._form-phone'),
					emailInputs = form.querySelectorAll('input[type="email"]'),
					reqInputs = form.querySelectorAll('._req');
				form.querySelectorAll('input').forEach(input => {
					formRemoveError(input);
				});

				if (phoneInputs) {
					phoneInputs.forEach(item => {
						item.addEventListener('input', () => {
							item.value = item.value.replace(/\D/, '');
						});
						if (phoneCheck(item)) {
							formAddError(item);
							error++;
						}
					})
				}

				if (emailInputs) {
					emailInputs.forEach(item => {
						if (emailCheck(item)) {
							formAddError(item);
							error++;
						}
					})
				}

				if (reqInputs) {
					reqInputs.forEach(item => {
						if (item.value === '') {
							formAddError(item);
							error++;
						}
					})
				}
				return error;
			}

			const postData = async (url, data) => {
				const formStatus = document.querySelector('._form__status');
				formStatus.classList.remove('_form__status-error');
				formStatus.classList.remove('_form__status-ok');
				formStatus.textContent = message.loading;
				let result = await fetch(url, {
					method: 'POST',
					body: data
				});

				return await result.text();
			}

			const clearInputs = () => {
				inputs.forEach(item => {
					item.value = '';
				})
			}

			forms.forEach(item => {

				let statusMessage = document.createElement('div');
				statusMessage.classList.add('_form__status');
				item.appendChild(statusMessage);

				item.addEventListener('submit', (e) => {
					e.preventDefault();

					let error = formValidate(item);

					console.log(error);
					if (error === 0) {
						const formData = new FormData(item);

						postData('./sendmail.php', formData)
							.then(result => {
								//console.log(result)
								item.classList.add('_ok');
								statusMessage.classList.remove('_form__status-error');
								statusMessage.classList.add('_form__status-ok');
								//statusMessage.textContent = message.success;
								document.querySelector('.popup__form').hidden = true;
								document.querySelector('.popup__ok').hidden = false;
								document.querySelector('.popup__ok').classList.add('show');
								document.querySelector('.popup__form').classList.add('hide');
							})
							.catch(() => {
								statusMessage.classList.add('_form__status-error');
								statusMessage.textContent = message.failure;
							})
							.finally(() => {
								clearInputs();
								setTimeout(() => {
									statusMessage.remove();
								}, 50000)
							});
					}
				})
			})

		}
	}

	const popupClose = () => {
		document.querySelector('.popup__close').addEventListener('click', () => {
			document.querySelector('.overlay').classList.remove('open');
			document.querySelector('.popup').classList.remove('open');
			document.body.classList.remove('look');
		});
		document.querySelector('.close__btn').addEventListener('click', () => {
			document.querySelector('.overlay').classList.remove('open');
			document.querySelector('.popup').classList.remove('open');
			document.body.classList.remove('look');
		});
	}
	const openPopup = (e) => {
		e.preventDefault();
		document.querySelector('.overlay').classList.add('open');
		document.querySelector('.popup').classList.add('open');
		document.body.classList.add('look');
		popupClose();
		forms();
	}
	const buttonOpenPopup = document.querySelectorAll('.firstscreen__contact--btn');
	if (buttonOpenPopup.length > 0) {
		for (let i = 0; i < buttonOpenPopup.length; i++) {
			buttonOpenPopup[i].addEventListener('click', openPopup);

		}
	}


	const slideImgPc = document.querySelectorAll('.firstscreen__slider--pc'),
		slideImgMob = document.querySelectorAll('.firstscreen__slider--mob');
	if (slideImgPc.length > 1 && slideImgMob.length > 1) {
		const delay = 3000;
		let currentIndex = 0;

		setInterval(function () {
			let inImg = document.querySelectorAll('.in');
			let nextImg = document.querySelectorAll('.next');
			if (inImg.length > 0 && nextImg.length > 0) {
				for (let i = 0; i < inImg.length; i++) {
					inImg[i].classList.remove('in');
					inImg[i].classList.remove('next');
				}

			}
			slideImgPc[currentIndex].classList.add('in');
			slideImgMob[currentIndex].classList.add('in');
			currentIndex++;
			if (slideImgPc[currentIndex] && slideImgMob[currentIndex]) {
				slideImgPc[currentIndex].classList.add('next');
				slideImgMob[currentIndex].classList.add('next');
			}
			if (currentIndex >= slideImgPc.length && currentIndex >= slideImgMob.length) {
				currentIndex = 0;
			}
		}, delay);
	}
	/*initImg('.firstscreen__slider', [
		'./pugsite-files/img-content/slider/01-min.png',
		'./pugsite-files/img-content/slider/02-min.png',
		'./pugsite-files/img-content/slider/03-min.png',
		'./pugsite-files/img-content/slider/04-min.png',
		'./pugsite-files/img-content/slider/05-min.png',
		'./pugsite-files/img-content/slider/06-min.png',
		'./pugsite-files/img-content/slider/07-min.png',
		'./pugsite-files/img-content/slider/08-min.png',
		'./pugsite-files/img-content/slider/09-min.png'
	]);
	function initImg(selector, srcArr) {
		const img = document.querySelector(selector);
		Object.assign(img, {
			buf: Object.assign(new Image(), { img }),
			srcArr: [...srcArr],
			changeInterval: 4e2,
			bufIdx: 0,
			change: function () {
				this.style.animationName = 'img-in';
				this.src = this.buf.src || this.nextImage();
				this.buf.src = this.nextImage();
			},
			nextImage: function () {
				this.bufIdx = ++this.bufIdx < this.srcArr.length ? this.bufIdx : 0;
				return this.srcArr[this.bufIdx];
			}
		});
		img.buf.addEventListener('load', loadHandler);
		img.addEventListener('animationend', animEndHandler);
		img.change();
		return img;

		function loadHandler() {
			setTimeout(
				() => this.img.style.animationName = 'img-out',
				this.img.changeInterval
			);
		}
		function animEndHandler({ animationName }) {
			if (animationName === 'img-out')
				this.change();
		}
	}*/

});
document.addEventListener('DOMContentLoaded', function() {
    // Пути к изображениям - 3 изображения
    const imagePaths = [
        'C:/Users/yakol/OneDrive/Desktop/Курсовая/Курсовая закрыто.png',       // 1. Начальное - закрытое
        'C:/Users/yakol/OneDrive/Desktop/Курсовая/Курсовая почти закрыто.png', // 2. Среднее - почти закрытое  
        'C:/Users/yakol/OneDrive/Desktop/Курсовая/Курсовая открыто.png'        // 3. Открытое
    ];
    
    const fallbackImages = [
        'Курсовая закрыто.png',
        'Курсовая почти закрыто.png',
        'Курсовая открыто.png',
        'https://images.unsplash.com/photo-1553877522-43269d4ea984?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1920&q=80'
    ];
    
    const fullImage = document.querySelector('.full-image');
    const loginBtn = document.getElementById('loginBtn');
    const registerBtn = document.getElementById('registerBtn');
    const features = document.querySelectorAll('.feature');
    
    // Переменные для управления анимацией
    let imageChangeTimeout;
    let currentImageIndex = 0; // Текущее изображение (0-закрытое, 1-почти, 2-открытое)
    let isHovering = false;
    
    // Функция для проверки доступности изображения
    function checkImageAvailability(url, callback) {
        const img = new Image();
        img.onload = function() {
            callback(true, url);
        };
        img.onerror = function() {
            callback(false, url);
        };
        img.src = url;
    }
    
    // Функция для смены изображения с анимацией
    function changeImage(imageIndex) {
        const imageUrl = imagePaths[imageIndex];
        currentImageIndex = imageIndex;
        
        // Эффекты в зависимости от изображения
        if (imageIndex === 0) { // Закрытое
            fullImage.style.filter = 'brightness(1) contrast(1)';
        } else if (imageIndex === 1) { // Почти закрытое
            fullImage.style.filter = 'brightness(1.05) contrast(1.02)';
        } else { // Открытое
            fullImage.style.filter = 'brightness(1.1) contrast(1.05)';
        }
        
        // Плавная анимация изменения
        fullImage.style.opacity = '0.7';
        
        setTimeout(() => {
            checkImageAvailability(imageUrl, function(isAvailable, url) {
                if (isAvailable) {
                    console.log(`Показываем изображение ${imageIndex + 1}:`, url);
                    fullImage.style.backgroundImage = `url('${url}')`;
                } else {
                    // Если изображение недоступно, пробуем резервное
                    const fallbackUrl = imageIndex < fallbackImages.length - 1 
                        ? fallbackImages[imageIndex] 
                        : fallbackImages[fallbackImages.length - 1];
                    
                    console.log(`Показываем резервное изображение ${imageIndex + 1}:`, fallbackUrl);
                    fullImage.style.backgroundImage = `url('${fallbackUrl}')`;
                }
                
                setTimeout(() => {
                    fullImage.style.opacity = '1';
                    // Плавно убираем фильтры через 0.3 секунды
                    setTimeout(() => {
                        fullImage.style.filter = 'brightness(1) contrast(1)';
                    }, 300);
                }, 200);
            });
        }, 200);
    }
    
    // Функция для запуска последовательности при наведении (закрытое → почти → открытое)
    function startForwardSequence() {
        clearTimeout(imageChangeTimeout);
        isHovering = true;
        
        // Если уже на открытом изображении, не запускаем последовательность
        if (currentImageIndex === 2) return;
        
        console.log('Начало последовательности: закрытое → почти → открытое');
        
        // 1. Сразу показываем почти закрытое (пропускаем закрытое, т.к. оно уже показано)
        setTimeout(() => {
            if (isHovering) {
                changeImage(1);
                
                // 2. Через 300мс показываем открытое
                imageChangeTimeout = setTimeout(() => {
                    if (isHovering) {
                        changeImage(2);
                    }
                }, 300);
            }
        }, 0);
    }
    
    // Функция для запуска обратной последовательности при уходе (открытое → почти → закрытое)
    function startBackwardSequence() {
        clearTimeout(imageChangeTimeout);
        isHovering = false;
        
        console.log('Начало обратной последовательности: открытое → почти → закрытое');
        
        // Если уже на закрытом изображении, не запускаем последовательность
        if (currentImageIndex === 0) return;
        
        // 1. Сразу показываем почти закрытое (открытое уже показано)
        setTimeout(() => {
            if (!isHovering) {
                changeImage(1);
                
                // 2. Через 300мс показываем закрытое
                imageChangeTimeout = setTimeout(() => {
                    if (!isHovering) {
                        changeImage(0);
                    }
                }, 300);
            }
        }, 0);
    }
    
    // Обработчик для кнопки "Вход" - наведение
    loginBtn.addEventListener('mouseenter', function() {
        this.style.backgroundColor = '#2980b9';
        this.style.color = 'white';
        this.style.boxShadow = '0 10px 30px rgba(41, 128, 185, 0.3)';
        console.log('Наведение на кнопку "Вход" - начинаем последовательность');
        startForwardSequence();
    });
    
    // Обработчик для кнопки "Вход" - уход курсора
    loginBtn.addEventListener('mouseleave', function() {
        this.style.backgroundColor = 'white';
        this.style.color = '#2c3e50';
        this.style.boxShadow = '0 6px 20px rgba(0, 0, 0, 0.15)';
        console.log('Уход с кнопки "Вход" - начинаем обратную последовательность');
        startBackwardSequence();
    });
    
    // Обработчик для кнопки "Регистрация" - наведение
    registerBtn.addEventListener('mouseenter', function() {
        this.style.backgroundColor = '#3498db';
        this.style.color = 'white';
        this.style.boxShadow = '0 10px 30px rgba(52, 152, 219, 0.3)';
        console.log('Наведение на кнопку "Регистрация" - начинаем последовательность');
        startForwardSequence();
    });
    
    // Обработчик для кнопки "Регистрация" - уход курсора
    registerBtn.addEventListener('mouseleave', function() {
        this.style.backgroundColor = 'white';
        this.style.color = '#2c3e50';
        this.style.boxShadow = '0 6px 20px rgba(0, 0, 0, 0.15)';
        console.log('Уход с кнопки "Регистрация" - начинаем обратную последовательность');
        startBackwardSequence();
    });
    
    // Обработчик для клика на кнопку "Вход"
    loginBtn.addEventListener('click', function(e) {
        // Отменяем стандартное поведение ссылки на короткое время для анимации
        e.preventDefault();
        
        // Анимация нажатия
        this.style.transform = 'scale(0.95)';
        
        // Запускаем последовательность изображений
        startForwardSequence();
        
        // Ждем 300мс для завершения анимации, затем переходим
        setTimeout(() => {
            this.style.transform = 'scale(1)';
            window.location.href = this.getAttribute('href');
        }, 300);
    });
    
    // Обработчик для клика на кнопку "Регистрация"
    registerBtn.addEventListener('click', function(e) {
        // Отменяем стандартное поведение ссылки на короткое время для анимации
        e.preventDefault();
        
        // Анимация нажатия
        this.style.transform = 'scale(0.95)';
        
        // Запускаем последовательность изображений
        startForwardSequence();
        
        // Ждем 300мс для завершения анимации, затем переходим
        setTimeout(() => {
            this.style.transform = 'scale(1)';
            window.location.href = this.getAttribute('href');
        }, 300);
    });
    
    // Анимация элементов при скролле
    window.addEventListener('scroll', function() {
        const textSection = document.querySelector('.text-section');
        const textPosition = textSection.getBoundingClientRect().top;
        const screenPosition = window.innerHeight / 1.5;
        
        if (textPosition < screenPosition) {
            textSection.style.opacity = '1';
            textSection.style.transform = 'translateY(0)';
        }
        
        // Анимация для features
        features.forEach((feature, index) => {
            const featurePosition = feature.getBoundingClientRect().top;
            const screenFeaturePosition = window.innerHeight / 1.2;
            
            if (featurePosition < screenFeaturePosition) {
                setTimeout(() => {
                    feature.style.opacity = '1';
                    feature.style.transform = 'translateY(0)';
                }, index * 100);
            }
        });
    });
    
    // Инициализация анимации текста
    const textSection = document.querySelector('.text-section');
    textSection.style.opacity = '0';
    textSection.style.transform = 'translateY(20px)';
    textSection.style.transition = 'opacity 0.8s, transform 0.8s';
    
    // Инициализация анимации features
    features.forEach(feature => {
        feature.style.opacity = '0';
        feature.style.transform = 'translateY(30px)';
        feature.style.transition = 'opacity 0.6s, transform 0.6s';
    });
    
    // Запуск анимации после загрузки страницы
    setTimeout(() => {
        textSection.style.opacity = '1';
        textSection.style.transform = 'translateY(0)';
    }, 300);
    
    // Анимация для кнопок
    const authButtons = document.querySelector('.auth-buttons');
    authButtons.style.opacity = '0';
    authButtons.style.transform = 'translateY(30px)';
    authButtons.style.transition = 'opacity 1s, transform 1s';
    
    setTimeout(() => {
        authButtons.style.opacity = '1';
        authButtons.style.transform = 'translateY(0)';
    }, 600);
    
    // Устанавливаем начальное закрытое изображение при загрузке
    console.log('Загрузка начального изображения...');
    setTimeout(() => {
        changeImage(0);
    }, 500);
    
    console.log('Сайт загружен!');
    console.log('Изображения в последовательности:');
    console.log('Наведение на кнопку:');
    console.log('  - Закрытое → почти закрытое → открытое');
    console.log('Уход с кнопки:');
    console.log('  - Открытое → почти закрытое → закрытое');
    console.log('Задержка между переходами: 300мс');
});
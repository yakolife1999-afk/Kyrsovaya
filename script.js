document.addEventListener('DOMContentLoaded', function() {
    // ========== ФУНКЦИИ ДЛЯ АВТОРИЗАЦИИ (РЕАЛЬНЫЕ) ==========
    
    function getUser() {
        const userStr = localStorage.getItem('user');
        return userStr ? JSON.parse(userStr) : null;
    }
    
    function getToken() {
        return localStorage.getItem('token');
    }
    
    function isUserLoggedIn() {
        return !!localStorage.getItem('token');
    }
    
    function logoutUser() {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        updateNavigation();
        window.location.href = 'index.html';
    }
    
    function updateNavigation() {
        const navRight = document.querySelector('.nav-right');
        if (!navRight) return;
        
        const isLoggedIn = isUserLoggedIn();
        const currentPath = window.location.pathname.split('/').pop() || 'index.html';
        
        if (isLoggedIn) {
            const user = getUser();
            navRight.innerHTML = `
                <a href="progress.html" class="${currentPath === 'progress.html' ? 'active' : ''}"><i class="fas fa-chart-line"></i> Прогресс</a>
                <a href="profile.html" class="${currentPath === 'profile.html' ? 'active' : ''}"><i class="fas fa-user"></i> ${user?.name || 'Профиль'}</a>
                <a href="#" id="logoutBtn"><i class="fas fa-sign-out-alt"></i> Выйти</a>
            `;
            
            const logoutBtn = document.getElementById('logoutBtn');
            if (logoutBtn) {
                logoutBtn.addEventListener('click', function(e) {
                    e.preventDefault();
                    logoutUser();
                });
            }
        } else {
            navRight.innerHTML = `
                <a href="progress.html" class="${currentPath === 'progress.html' ? 'active' : ''}"><i class="fas fa-chart-line"></i> Прогресс</a>
                <a href="login.html" class="${currentPath === 'login.html' ? 'active' : ''}"><i class="fas fa-sign-in-alt"></i> Вход</a>
                <a href="register.html" class="${currentPath === 'register.html' ? 'active' : ''}"><i class="fas fa-user-plus"></i> Регистрация</a>
            `;
        }
    }
    
    updateNavigation();
    
    // ========== КОД ДЛЯ КАРТИНОК НА ГЛАВНОЙ ==========
    const fullImage = document.querySelector('.full-image');
    if (fullImage) {
        const imagePaths = [
            'images/kursovaya_zakrito.png',
            'images/kursovaya_pochti_zakrito.png',
            'images/kursovaya_otkrito.png'
        ];
        
        const fallbackImages = [
            'https://images.unsplash.com/photo-1553877522-43269d4ea984?ixlib=rb-4.0.3&auto=format&fit=crop&w=1920&q=80',
            'https://images.unsplash.com/photo-1517077304055-6e89abbf09b0?ixlib=rb-4.0.3&auto=format&fit=crop&w=1920&q=80',
            'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?ixlib=rb-4.0.3&auto=format&fit=crop&w=1920&q=80'
        ];
        
        const loginBtn = document.getElementById('loginBtn');
        const registerBtn = document.getElementById('registerBtn');
        const features = document.querySelectorAll('.feature');
        
        let imageChangeTimeout;
        let currentImageIndex = 0;
        let isHovering = false;
        
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
        
        function changeImage(imageIndex) {
            if (!fullImage) return;
            
            const imageUrl = imagePaths[imageIndex];
            currentImageIndex = imageIndex;
            
            if (imageIndex === 0) {
                fullImage.style.filter = 'brightness(1) contrast(1)';
            } else if (imageIndex === 1) {
                fullImage.style.filter = 'brightness(1.05) contrast(1.02)';
            } else {
                fullImage.style.filter = 'brightness(1.1) contrast(1.05)';
            }
            
            fullImage.style.opacity = '0.7';
            
            setTimeout(() => {
                checkImageAvailability(imageUrl, function(isAvailable, url) {
                    if (isAvailable) {
                        fullImage.style.backgroundImage = `url('${url}')`;
                    } else {
                        const fallbackUrl = imageIndex < fallbackImages.length - 1 
                            ? fallbackImages[imageIndex] 
                            : fallbackImages[fallbackImages.length - 1];
                        
                        fullImage.style.backgroundImage = `url('${fallbackUrl}')`;
                    }
                    
                    setTimeout(() => {
                        fullImage.style.opacity = '1';
                        setTimeout(() => {
                            fullImage.style.filter = 'brightness(1) contrast(1)';
                        }, 300);
                    }, 200);
                });
            }, 200);
        }
        
        function startForwardSequence() {
            if (!fullImage) return;
            
            clearTimeout(imageChangeTimeout);
            isHovering = true;
            
            if (currentImageIndex === 2) return;
            
            setTimeout(() => {
                if (isHovering) {
                    changeImage(1);
                    
                    imageChangeTimeout = setTimeout(() => {
                        if (isHovering) {
                            changeImage(2);
                        }
                    }, 300);
                }
            }, 0);
        }
        
        function startBackwardSequence() {
            if (!fullImage) return;
            
            clearTimeout(imageChangeTimeout);
            isHovering = false;
            
            if (currentImageIndex === 0) return;
            
            setTimeout(() => {
                if (!isHovering) {
                    changeImage(1);
                    
                    imageChangeTimeout = setTimeout(() => {
                        if (!isHovering) {
                            changeImage(0);
                        }
                    }, 300);
                }
            }, 0);
        }
        
        if (loginBtn) {
            loginBtn.addEventListener('mouseenter', startForwardSequence);
            loginBtn.addEventListener('mouseleave', startBackwardSequence);
        }
        
        if (registerBtn) {
            registerBtn.addEventListener('mouseenter', startForwardSequence);
            registerBtn.addEventListener('mouseleave', startBackwardSequence);
        }
        
        // Анимация при скролле
        window.addEventListener('scroll', function() {
            const textSection = document.querySelector('.text-section');
            if (!textSection) return;
            
            const textPosition = textSection.getBoundingClientRect().top;
            const screenPosition = window.innerHeight / 1.5;
            
            if (textPosition < screenPosition) {
                textSection.style.opacity = '1';
                textSection.style.transform = 'translateY(0)';
            }
            
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
        
        // Инициализация анимаций
        const textSection = document.querySelector('.text-section');
        if (textSection) {
            textSection.style.opacity = '0';
            textSection.style.transform = 'translateY(20px)';
            textSection.style.transition = 'opacity 0.8s, transform 0.8s';
        }
        
        features.forEach(feature => {
            feature.style.opacity = '0';
            feature.style.transform = 'translateY(30px)';
            feature.style.transition = 'opacity 0.6s, transform 0.6s';
        });
        
        setTimeout(() => {
            if (textSection) {
                textSection.style.opacity = '1';
                textSection.style.transform = 'translateY(0)';
            }
        }, 300);
        
        const authButtons = document.querySelector('.auth-buttons');
        if (authButtons) {
            authButtons.style.opacity = '0';
            authButtons.style.transform = 'translateY(30px)';
            authButtons.style.transition = 'opacity 1s, transform 1s';
            
            setTimeout(() => {
                authButtons.style.opacity = '1';
                authButtons.style.transform = 'translateY(0)';
            }, 600);
        }
        
        if (fullImage) {
            setTimeout(() => {
                changeImage(0);
            }, 500);
        }
    }
});

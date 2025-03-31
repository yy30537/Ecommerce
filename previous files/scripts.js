document.addEventListener('DOMContentLoaded', function() {
    // 加载页面组件
    loadComponents();
    
    // 根据当前页面设置导航栏活动项
    setActiveNavItem();
    
    // 设置TikTok区域选择功能
    setupTikTokRegionSelector();
    
    // 尝试自动检测用户区域
    detectUserRegion();
});

// 加载页面组件
async function loadComponents() {
    try {
        // 加载头部
        const headerResponse = await fetch('components/header.html');
        const headerHtml = await headerResponse.text();
        const headerPlaceholder = document.getElementById('header-placeholder');
        if (headerPlaceholder) {
            headerPlaceholder.innerHTML = headerHtml;
        }
        
        // 加载页脚
        const footerResponse = await fetch('components/footer.html');
        const footerHtml = await footerResponse.text();
        const footerPlaceholder = document.getElementById('footer-placeholder');
        if (footerPlaceholder) {
            footerPlaceholder.innerHTML = footerHtml;
        }
        
        // 组件加载完成后，设置导航栏活动项
        setActiveNavItem();
        
        // 组件加载完成后，设置TikTok区域选择功能
        setupTikTokRegionSelector();
    } catch (error) {
        console.error('Error loading components:', error);
    }
}

// 设置导航栏活动项
function setActiveNavItem() {
    // 获取当前页面URL
    const currentPage = window.location.pathname.split('/').pop();
    
    // 清除所有活动类
    const navLinks = document.querySelectorAll('.nav-link');
    navLinks.forEach(link => {
        link.classList.remove('active');
    });
    
    // 设置当前页面对应的导航项为活动状态
    if (currentPage === 'home.html' || currentPage === '' || currentPage === '/') {
        const homeLink = document.querySelector('.nav-link[href="home.html"]');
        if (homeLink) homeLink.classList.add('active');
    } else if (currentPage.includes('products.html')) {
        const shopLink = document.getElementById('navbarDropdown');
        if (shopLink) shopLink.classList.add('active');
    } else if (currentPage.includes('about.html')) {
        const aboutLink = document.querySelector('.nav-link[href="about.html"]');
        if (aboutLink) aboutLink.classList.add('active');
    } else if (currentPage.includes('contact.html')) {
        const contactLink = document.querySelector('.nav-link[href="contact.html"]');
        if (contactLink) contactLink.classList.add('active');
    }
}

// 设置TikTok区域选择功能
function setupTikTokRegionSelector() {
    const tiktokIcon = document.getElementById('tiktokIcon');
    const tiktokRegions = document.getElementById('tiktokRegions');
    const regionItems = document.querySelectorAll('.tiktok-region-item');
    
    if (!tiktokIcon || !tiktokRegions || !regionItems.length) return;
    
    // 点击TikTok图标显示区域选择
    tiktokIcon.addEventListener('click', function(e) {
        e.preventDefault();
        tiktokRegions.style.display = tiktokRegions.style.display === 'block' ? 'none' : 'block';
    });
    
    // 点击区域项目跳转到相应TikTok页面
    regionItems.forEach(item => {
        item.addEventListener('click', function() {
            const link = this.getAttribute('data-link');
            window.open(link, '_blank');
            tiktokRegions.style.display = 'none';
        });
    });
    
    // 点击页面其他区域关闭下拉菜单
    document.addEventListener('click', function(e) {
        if (!e.target.closest('.tiktok-wrapper')) {
            tiktokRegions.style.display = 'none';
        }
    });
}

// 尝试根据用户IP自动检测区域
function detectUserRegion() {
    try {
        fetch('https://ipapi.co/json/')
            .then(response => response.json())
            .then(data => {
                // 根据国家代码设置默认TikTok链接
                let defaultTiktok = 'https://www.tiktok.com/@puressence_official';
                
                switch(data.country_code) {
                    case 'SG':
                        defaultTiktok = 'https://www.tiktok.com/@puressence_sg';
                        break;
                    case 'MY':
                        defaultTiktok = 'https://www.tiktok.com/@puressence_my';
                        break;
                    case 'TH':
                        defaultTiktok = 'https://www.tiktok.com/@puressence_th';
                        break;
                    case 'PH':
                        defaultTiktok = 'https://www.tiktok.com/@puressence_ph';
                        break;
                }
                
                // 更新TikTok默认链接
                const tiktokIcon = document.getElementById('tiktokIcon');
                if (tiktokIcon) tiktokIcon.href = defaultTiktok;
            })
            .catch(error => console.log('Error detecting location:', error));
    } catch (error) {
        console.log('Location detection not supported');
    }
} 
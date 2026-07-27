/* ============================================================
   镜中世界 · 线上画廊
   核心逻辑：登录验证 + 数据管理 + 后台操作
   性能：图片压缩 / 懒加载 / 防抖 / 乐观更新 / 触摸滑动
   ============================================================ */

(function () {
    'use strict';

    // ---------- 存储键 ----------
    var KEY_ACCOUNT = 'mw2_account';
    var KEY_DATA    = 'mw2_data';

    // ---------- 默认账号 ----------
    var DEFAULT_ACCOUNT = { username: '海屿', password: 'mse20221028' };

    // ---------- 图片处理参数 ----------
    var IMG_MAX_DIMENSION  = 2400;   // 最长边像素
    var IMG_JPEG_QUALITY   = 0.88;   // JPEG 质量
    var IMG_MAX_SIZE_MB    = 12;     // 允许上传的原始文件上限(MB)

    // ---------- 默认画廊数据 ----------
    var DEFAULT_DATA = {
        exhibitions: [
            {
                id: 'e2025',
                title: '2025夏天的颜色',
                tags: ['摄影 · 年度特展'],
                description: '关于2025年夏天，那些被光线雕刻的瞬间。一场关于色彩、记忆与时间的视觉考古。',
                essay: '在摄影术发明之初，人类便试图用银盐的化学反应凝固时间。2025年的夏天，我们以数字之眼重新审视光与影的对话。\n\n每一张照片都是一扇通向平行宇宙的门——在那里，夏天的颜色不是记忆中的模样，而是被镜头重新编码的真实。蓝不再是蓝，绿不再是绿，一切色彩都在镜面折射中获得了新的命名。\n\n本展览汇集了多位摄影师在2025年夏至秋初的创作，它们共同构成了这一季的视觉志。',
                artworks: []
            },
            {
                id: 'e2026',
                title: '2026夏天的颜色',
                tags: ['摄影 · 年度特展'],
                description: '当夏天再次来临，我们带着新的目光重返光的现场。2026，色彩的语法正在改写。',
                essay: '如果说2025年的夏天是关于发现，那么2026年则是关于重写。\n\n在这一年的创作中，摄影师们不再满足于对现实的记录，而是试图用镜头重新构建夏天的色谱。从克莱因蓝的海面到深绿幽暗的密林，每一帧都在追问：我们看到的颜色，究竟是光的物理属性，还是心灵的投射？\n\n本展览是对"夏天"这一概念的一次视觉解构与重建。正如伊夫·克莱因所言："蓝色是没有维度的。"',
                artworks: []
            },
            {
                id: 'ehappy',
                title: '快乐之家',
                tags: ['纪实 · 长期项目'],
                description: '家庭作为最小的社会单元，承载着最复杂的情感光谱。"快乐之家"试图在平凡的日常生活中寻找诗性。',
                essay: '家庭摄影（Family Photography）自19世纪中叶便出现在摄影史中。从维多利亚时代的正式肖像，到荒木经惟的私密日记，再到当代艺术家的社会性家庭研究——"家"始终是摄影无法绕开的母题。\n\n"快乐之家"不是一个关于幸福的定义，而是一次关于"家"的开放性讨论。镜头下的客厅、厨房、阳台和卧室，既是私人记忆的容器，也是时代精神的缩影。\n\n我们希望通过这些影像，让观者重新思考：什么构成了"家"的感觉？',
                artworks: []
            },
            {
                id: 'eland',
                title: '风光与星空',
                tags: ['风景摄影 · 自然纪实'],
                description: '从大地到苍穹，风光摄影的百年传统在当代获得了新的表达。这是一场关于尺度与永恒的视觉旅行。',
                essay: '风光摄影起源于19世纪的"探险摄影"——摄影师们背负笨重的设备深入荒野，用湿版火棉胶记录下人类未曾触及的壮丽。从卡尔顿·沃特金斯的约塞米蒂，到安塞尔·亚当斯的月升，再到当代的星空摄影——自然的影像始终在重塑我们对"壮美"的理解。\n\n"风光与星空"将目光投向两个极端：脚下的大地与头顶的宇宙。在光污染日益严重的今天，星空摄影不仅是一种美学实践，更是一份关于人类与自然关系的视觉档案。\n\n当你的眼睛适应了黑暗，星空才会显现。观看亦如是。',
                artworks: []
            }
        ],
        columns: [
            {
                id: 'c1',
                title: '镜面与凝视：自摄影术诞生以来的"自我"',
                date: '2026.03',
                body: '1839年，达盖尔公布摄影术的那一年，人类获得了一种全新的"看"的方式。\n\n此后的近两个世纪里，摄影从科学工具演变为艺术媒介，再演变为日常语言。而"镜中世界"这个概念，自始至终缠绕在摄影的基因之中——因为每一张照片，本质上都是现实世界在银盐或传感器上的一次"镜像"。\n\n本文试图梳理摄影史中"镜面"这一隐喻的演变脉络，从早期摄影中的镜子符号，到当代艺术家对镜像、屏幕与数字身份的探索。'
            },
            {
                id: 'c2',
                title: '关于"夏天"的视觉考古学',
                date: '2026.06',
                body: '为什么要做"夏天的颜色"这个系列？\n\n因为夏天是最容易被遗忘的季节。春天有花，秋天有落叶，冬天有雪——它们都以鲜明的方式标记了时间的流逝。而夏天，炎热、漫长、重复，往往在时间感知中变成一片模糊的空白。\n\n但正是这种"空白"，给了摄影师最大的自由。没有既定的视觉符号需要遵循，每一次快门的按下，都是在为夏天这个词发明新的定义。\n\n从2025到2026，我们持续追踪这个主题，记录下每个夏天独一无二的色彩指纹。'
            }
        ],
        curator: {
            name: '张昊文',
            role: '独立策展人 · 摄影研究者',
            bio: '张昊文，独立策展人、影像研究者，现工作生活于上海。\n\n研究方向涵盖当代摄影、影像档案与视觉文化批评。曾策划多个影像展览项目，致力于在技术与人文的交汇处寻找摄影的新可能。\n\n长期关注摄影媒介在数字技术转型中的语言变迁，以及影像作为"记忆技术"的社会功能。\n\n（请在管理后台补充完整履历）'
        }
    };

    // ---------- 工具函数 ----------
    function loadAccount() {
        try { return JSON.parse(localStorage.getItem(KEY_ACCOUNT)); }
        catch(e) { return null; }
    }
    function saveAccount(acc) { localStorage.setItem(KEY_ACCOUNT, JSON.stringify(acc)); }

    function loadData() {
        try { return JSON.parse(localStorage.getItem(KEY_DATA)); }
        catch(e) { return null; }
    }
    function saveData(d) { localStorage.setItem(KEY_DATA, JSON.stringify(d)); }

    function genId(prefix) {
        return prefix + '_' + Date.now() + '_' + Math.random().toString(36).slice(2,7);
    }

    function escapeHtml(str) {
        if (!str) return '';
        return str
            .replace(/&/g, '&amp;')
            .replace(/</g, '&lt;')
            .replace(/>/g, '&gt;')
            .replace(/"/g, '&quot;')
            .replace(/'/g, '&#39;');
    }

    // 防抖
    function debounce(fn, wait) {
        var t;
        return function () {
            var args = arguments, ctx = this;
            clearTimeout(t);
            t = setTimeout(function () { fn.apply(ctx, args); }, wait);
        };
    }

    // ---------- 图片压缩（核心） ----------
    // 读取文件 → 创建Image → canvas降采样+JPEG编码 → 返回base64
    function compressImage(file, cb, progressCb) {
        if (progressCb) progressCb('读取文件…');
        var reader = new FileReader();
        reader.onload = function (e) {
            var img = new Image();
            img.onload = function () {
                var sw = img.width, sh = img.height;
                var scale = Math.min(1, IMG_MAX_DIMENSION / Math.max(sw, sh));
                var dw = Math.round(sw * scale), dh = Math.round(sh * scale);

                var canvas = document.createElement('canvas');
                canvas.width = dw; canvas.height = dh;
                var ctx = canvas.getContext('2d');
                // 高质量缩放
                ctx.imageSmoothingEnabled = true;
                ctx.imageSmoothingQuality = 'high';
                ctx.drawImage(img, 0, 0, dw, dh);

                if (progressCb) progressCb('压缩编码…');
                // 尝试不同质量找到体积<1MB的
                var quality = IMG_JPEG_QUALITY;
                var b64 = canvas.toDataURL('image/jpeg', quality);
                // 如果仍太大，逐步降质量
                var maxB64Len = 1400000; // ~1MB base64
                while (b64.length > maxB64Len && quality > 0.55) {
                    quality -= 0.08;
                    b64 = canvas.toDataURL('image/jpeg', quality);
                }
                if (progressCb) progressCb('完成 (' + Math.round(b64.length/1024) + 'KB)');
                cb(b64, { width: dw, height: dh, quality: Math.round(quality*100) });
            };
            img.onerror = function () { cb(null); };
            img.src = e.target.result;
        };
        reader.onerror = function () { cb(null); };
        reader.readAsDataURL(file);
    }

    // ---------- 懒加载（IntersectionObserver） ----------
    var io;
    function initLazyLoad() {
        if (io) return;
        if (!('IntersectionObserver' in window)) return; // 降级：直接显示
        io = new IntersectionObserver(function (entries) {
            entries.forEach(function (entry) {
                if (entry.isIntersecting) {
                    var img = entry.target;
                    var src = img.dataset.src;
                    if (src && img.src !== src) {
                        img.src = src;
                        img.classList.add('lazy-loaded');
                    }
                    io.unobserve(img);
                }
            });
        }, { rootMargin: '200px 0px', threshold: 0.01 });
    }

    function observeLazy(img) {
        if (io) io.observe(img);
    }

    // ---------- 初始化 ----------
    var isAdminLoggedIn = false;

    function init() {
        if (!loadAccount()) saveAccount(DEFAULT_ACCOUNT);
        if (!loadData())    saveData(DEFAULT_DATA);

        initLazyLoad();
        renderAll();
        bindEvents();
        initTouchSwipe();
    }

    // ---------- 事件绑定 ----------
    function bindEvents() {
        // 登录
        document.getElementById('loginBtn').addEventListener('click', doLogin);
        document.getElementById('loginPassword').addEventListener('keydown', function (e) {
            if (e.key === 'Enter') doLogin();
        });
        document.getElementById('loginUsername').addEventListener('keydown', function (e) {
            if (e.key === 'Enter') document.getElementById('loginPassword').focus();
        });

        // 管理后台按钮
        document.getElementById('btnOpenAdmin').addEventListener('click', function () {
            if (isAdminLoggedIn) openAdminPanel();
            else openLoginModal();
        });

        var logoutBtn = document.getElementById('btnAdminLogout');
        if (logoutBtn) logoutBtn.addEventListener('click', adminLogout);

        // Tab 切换（事件委托）
        var tabBar = document.querySelector('.admin-tabs');
        if (tabBar) {
            tabBar.addEventListener('click', function (e) {
                var btn = e.target.closest('.admin-tab');
                if (btn) switchAdminTab(btn.getAttribute('data-tab'));
            });
        }

        // 文件选择 → 压缩预览
        document.getElementById('f-up-file').addEventListener('change', function (e) {
            var file = e.target.files[0];
            if (!file) return;
            if (file.size > IMG_MAX_SIZE_MB * 1024 * 1024) {
                alert('图片过大（最大' + IMG_MAX_SIZE_MB + 'MB），请压缩后重试');
                return;
            }
            var box = document.getElementById('uploadPreview');
            box.innerHTML = '<div class="upload-status">⏳ 处理中…</div>';
            compressImage(file, function (b64, info) {
                if (!b64) { box.innerHTML = '<div class="upload-status upload-error">❌ 处理失败</div>'; return; }
                box.innerHTML = '<img src="' + b64 + '" alt="preview"><div class="upload-meta">' + info.width + '×' + info.height + ' · ' + Math.round(b64.length/1024) + 'KB</div>';
                box.dataset.b64 = b64;
            }, function (msg) {
                box.innerHTML = '<div class="upload-status">' + msg + '</div>';
            });
        });

        // ESC 关闭弹窗
        document.addEventListener('keydown', function (e) {
            if (e.key === 'Escape') {
                closeExhibitModal();
                closeColumnModal();
                closeAdmin();
                closeLoginModal();
            }
        });

        // 滚动监听：导航栏高亮
        window.addEventListener('scroll', debounce(updateNavActive, 80), { passive: true });
    }

    // ---------- 登录 ----------
    function openLoginModal() {
        document.getElementById('loginModal').style.display = 'flex';
        document.body.style.overflow = 'hidden';
        document.getElementById('loginUsername').value = '';
        document.getElementById('loginPassword').value = '';
        document.getElementById('loginMsg').textContent = '';
        setTimeout(function () { document.getElementById('loginUsername').focus(); }, 100);
    }

    window.closeLoginModal = function () {
        document.getElementById('loginModal').style.display = 'none';
        document.body.style.overflow = '';
    };

    function doLogin() {
        var user = document.getElementById('loginUsername').value.trim();
        var pass = document.getElementById('loginPassword').value;
        var msg  = document.getElementById('loginMsg');
        var acc  = loadAccount();

        if (!acc || user !== acc.username || pass !== acc.password) {
            msg.textContent = '账号或密码错误，请重新输入';
            var box = document.querySelector('.login-box');
            box.style.animation = 'none';
            setTimeout(function () { box.style.animation = 'shake 0.4s ease'; }, 10);
            return;
        }
        isAdminLoggedIn = true;
        msg.textContent = '';
        closeLoginModal();
        openAdminPanel();
    }

    function adminLogout() {
        isAdminLoggedIn = false;
        closeAdmin();
        document.getElementById('loginUsername').value = '';
        document.getElementById('loginPassword').value = '';
    }

    // ---------- 导航高亮 ----------
    function updateNavActive() {
        var sections = ['sec-exhibitions', 'sec-columns', 'sec-curator'];
        var scrollY = window.scrollY + 120;
        var current = '';
        for (var i = 0; i < sections.length; i++) {
            var el = document.getElementById(sections[i]);
            if (el && el.offsetTop <= scrollY) current = sections[i];
        }
        var links = document.querySelectorAll('.topbar-nav a[href^="#"]');
        for (var j = 0; j < links.length; j++) {
            links[j].classList.remove('nav-active');
            if (links[j].getAttribute('href') === '#' + current) {
                links[j].classList.add('nav-active');
            }
        }
    }

    // ---------- 平滑滚动 ----------
    document.documentElement.style.scrollBehavior = 'smooth';

    // ---------- 渲染：展览 ----------
    function renderAll() {
        renderExhibitions();
        renderColumns();
        renderCurator();
    }

    function renderExhibitions() {
        var data = loadData();
        var list = document.getElementById('exhibitionList');
        if (!data.exhibitions.length) {
            list.innerHTML = '<div class="empty-state">暂无展览</div>';
            return;
        }
        var html = '';
        for (var i = 0; i < data.exhibitions.length; i++) {
            var ex = data.exhibitions[i];
            var coverImg = '';
            if (ex.artworks && ex.artworks.length > 0) {
                var firstImg = ex.artworks[0].image;
                coverImg = '<img class="lazy-img" data-src="' + firstImg + '" src="data:image/svg+xml,%3Csvg xmlns=%22http://www.w3.org/2000/svg%22 viewBox=%220 0 16 10%22%3E%3C/svg%3E" alt="' + escapeHtml(ex.title) + '">';
            } else {
                coverImg = '<span class="cover-placeholder">' + escapeHtml(ex.title) + '</span>';
            }
            var tagsHtml = '';
            for (var t = 0; t < ex.tags.length; t++) {
                tagsHtml += '<span class="tag-chip">' + escapeHtml(ex.tags[t]) + '</span>';
            }
            html += ''
                + '<div class="exhibit-card reveal" style="animation-delay:' + (i*0.08) + 's">'
                +   '<div class="exhibit-cover">' + coverImg + '</div>'
                +   '<div class="exhibit-body">'
                +     '<div class="exhibit-tags">' + tagsHtml + '</div>'
                +     '<h3 class="exhibit-card-title">' + escapeHtml(ex.title) + '</h3>'
                +     '<p class="exhibit-desc">' + escapeHtml(ex.description || '') + '</p>'
                +     '<div class="exhibit-meta">'
                +       '<span>' + (ex.artworks ? ex.artworks.length : 0) + ' 件作品</span>'
                +     '</div>'
                +   '</div>'
                + '</div>';
        }
        list.innerHTML = html;

        // 注册懒加载
        var lazyImgs = list.querySelectorAll('.lazy-img');
        for (var k = 0; k < lazyImgs.length; k++) observeLazy(lazyImgs[k]);

        // 入场动画
        revealOnScroll();
    }

    // ---------- 渲染：专栏 ----------
    function renderColumns() {
        var data = loadData();
        var list = document.getElementById('columnList');
        if (!data.columns.length) {
            list.innerHTML = '<div class="empty-state">暂无专栏文章</div>';
            return;
        }
        var html = '';
        for (var i = 0; i < data.columns.length; i++) {
            var col = data.columns[i];
            var preview = col.body ? col.body.substring(0, 160).replace(/\n/g, ' ') : '';
            html += ''
                + '<div class="column-item reveal" style="animation-delay:' + (i*0.06) + 's" onclick="openColumn(\'' + col.id + '\')">'
                +   '<div class="column-item-head">'
                +     '<span class="column-item-title">' + escapeHtml(col.title) + '</span>'
                +     '<span class="column-item-date">' + escapeHtml(col.date || '') + '</span>'
                +   '</div>'
                +   '<div class="column-item-preview">' + escapeHtml(preview) + '</div>'
                + '</div>';
        }
        list.innerHTML = html;
    }

    // ---------- 渲染：策展人 ----------
    function renderCurator() {
        var data = loadData();
        var c = data.curator;
        var block = document.getElementById('curatorBlock');
        var bioHtml = '';
        if (c.bio) {
            var paras = c.bio.split('\n').filter(function (p) { return p.trim(); });
            for (var i = 0; i < paras.length; i++) bioHtml += '<p>' + escapeHtml(paras[i]) + '</p>';
        }
        block.innerHTML = ''
            + '<div class="curator-portrait">策展人<br>肖像</div>'
            + '<div class="curator-info reveal">'
            +   '<h3>' + escapeHtml(c.name || '张昊文') + '</h3>'
            +   '<p class="curator-role">' + escapeHtml(c.role || '') + '</p>'
            +   '<div class="curator-bio-text">' + bioHtml + '</div>'
            + '</div>';
    }

    // ---------- 入场动画（IntersectionObserver） ----------
    var revealIO;
    function revealOnScroll() {
        if (revealIO) return;
        if (!('IntersectionObserver' in window)) {
            // 降级：直接显示
            var all = document.querySelectorAll('.reveal');
            for (var i = 0; i < all.length; i++) all[i].classList.add('revealed');
            return;
        }
        revealIO = new IntersectionObserver(function (entries) {
            entries.forEach(function (entry) {
                if (entry.isIntersecting) {
                    entry.target.classList.add('revealed');
                    revealIO.unobserve(entry.target);
                }
            });
        }, { rootMargin: '0px 0px -60px', threshold: 0.05 });
        var els = document.querySelectorAll('.reveal');
        for (var i = 0; i < els.length; i++) revealIO.observe(els[i]);
    }

    // ---------- 展览详情弹窗 ----------
    window.openExhibit = function (id) {
        var data = loadData();
        var ex = null;
        for (var i = 0; i < data.exhibitions.length; i++) {
            if (data.exhibitions[i].id === id) { ex = data.exhibitions[i]; break; }
        }
        if (!ex) return;

        var body = document.getElementById('exhibitModalBody');
        var tagsHtml = '';
        for (var t = 0; t < ex.tags.length; t++) tagsHtml += '<span class="tag-chip">' + escapeHtml(ex.tags[t]) + '</span>';
        var essayHtml = escapeHtml(ex.essay || '').replace(/\n/g, '<br>');

        // 大图查看器
        var worksHtml = '';
        if (ex.artworks && ex.artworks.length > 0) {
            for (var w = 0; w < ex.artworks.length; w++) {
                var wk = ex.artworks[w];
                worksHtml += ''
                    + '<div class="detail-work" onclick="openLightbox(\'' + ex.id + '\',' + w + ')">'
                    +   '<img class="lazy-img" data-src="' + wk.image + '" src="data:image/svg+xml,%3Csvg xmlns=%22http://www.w3.org/2000/svg%22 viewBox=%220 0 4 3%22%3E%3C/svg%3E" alt="' + escapeHtml(wk.title) + '">'
                    +   '<div class="detail-work-info">'
                    +     '<div class="detail-work-title">' + escapeHtml(wk.title || '无题') + '</div>'
                    +     '<div class="detail-work-desc">' + escapeHtml(wk.desc || '') + '</div>'
                    +   '</div>'
                    + '</div>';
            }
        } else {
            worksHtml = '<p style="color:var(--text-3);font-size:14px;">该展览暂无作品，请在管理后台上传。</p>';
        }

        body.innerHTML = ''
            + '<h2 class="detail-title">' + escapeHtml(ex.title) + '</h2>'
            + '<div class="detail-sub">' + tagsHtml + '</div>'
            + '<div class="detail-essay">' + essayHtml + '</div>'
            + '<h3 style="font-size:17px;color:#fff;margin-bottom:18px;letter-spacing:2px;">作品 (' + (ex.artworks?ex.artworks.length:0) + ')</h3>'
            + '<div class="detail-works-grid">' + worksHtml + '</div>';

        document.getElementById('exhibitModal').style.display = 'flex';
        document.body.style.overflow = 'hidden';

        // 懒加载弹窗内图片
        var modalImgs = body.querySelectorAll('.lazy-img');
        for (var m = 0; m < modalImgs.length; m++) observeLazy(modalImgs[m]);
    };

    window.closeExhibitModal = function () {
        document.getElementById('exhibitModal').style.display = 'none';
        document.body.style.overflow = '';
        closeLightbox();
    };

    // ---------- 大图灯箱 ----------
    var lightboxIdx = -1;
    var lightboxImgs = [];

    window.openLightbox = function (exId, idx) {
        var data = loadData();
        var ex = null;
        for (var i = 0; i < data.exhibitions.length; i++) {
            if (data.exhibitions[i].id === exId) { ex = data.exhibitions[i]; break; }
        }
        if (!ex || !ex.artworks.length) return;
        lightboxImgs = ex.artworks;
        lightboxIdx = idx;

        var lb = document.getElementById('lightboxModal');
        if (!lb) {
            lb = document.createElement('div');
            lb.id = 'lightboxModal';
            lb.className = 'modal lightbox-modal';
            lb.innerHTML = ''
                + '<button class="lb-close" onclick="closeLightbox()">×</button>'
                + '<button class="lb-nav lb-prev" onclick="lightboxPrev()">‹</button>'
                + '<button class="lb-nav lb-next" onclick="lightboxNext()">›</button>'
                + '<div class="lb-counter" id="lbCounter"></div>'
                + '<div class="lb-content" id="lbContent"></div>';
            document.body.appendChild(lb);
            // 键盘导航
            lb._keyHandler = function (e) {
                if (e.key === 'ArrowLeft') lightboxPrev();
                if (e.key === 'ArrowRight') lightboxNext();
            };
            document.addEventListener('keydown', lb._keyHandler);
        }
        lb.style.display = 'flex';
        renderLightbox();
    };

    function renderLightbox() {
        if (lightboxIdx < 0 || lightboxIdx >= lightboxImgs.length) return;
        var wk = lightboxImgs[lightboxIdx];
        var c = document.getElementById('lbContent');
        c.style.opacity = '0';
        setTimeout(function () {
            c.innerHTML = '<img src="' + wk.image + '" alt="' + escapeHtml(wk.title) + '">'
                + '<div class="lb-caption"><strong>' + escapeHtml(wk.title || '') + '</strong>'
                + (wk.desc ? '<p>' + escapeHtml(wk.desc) + '</p>' : '') + '</div>';
            c.style.opacity = '1';
        }, 80);
        var counter = document.getElementById('lbCounter');
        if (counter) counter.textContent = (lightboxIdx + 1) + ' / ' + lightboxImgs.length;
    }

    window.lightboxPrev = function () {
        lightboxIdx = (lightboxIdx - 1 + lightboxImgs.length) % lightboxImgs.length;
        renderLightbox();
    };

    window.lightboxNext = function () {
        lightboxIdx = (lightboxIdx + 1) % lightboxImgs.length;
        renderLightbox();
    };

    window.closeLightbox = function () {
        var lb = document.getElementById('lightboxModal');
        if (lb) { lb.style.display = 'none'; lightboxIdx = -1; lightboxImgs = []; }
    };

    // ---------- 专栏详情弹窗 ----------
    window.openColumn = function (id) {
        var data = loadData();
        var col = null;
        for (var i = 0; i < data.columns.length; i++) {
            if (data.columns[i].id === id) { col = data.columns[i]; break; }
        }
        if (!col) return;
        var body = document.getElementById('columnModalBody');
        var bodyHtml = escapeHtml(col.body || '').replace(/\n/g, '<br>');
        body.innerHTML = ''
            + '<h2 class="detail-title">' + escapeHtml(col.title) + '</h2>'
            + '<div class="detail-sub">' + escapeHtml(col.date || '') + '</div>'
            + '<div class="detail-essay" style="border-left-color:var(--gold);">' + bodyHtml + '</div>';
        document.getElementById('columnModal').style.display = 'flex';
        document.body.style.overflow = 'hidden';
    };

    window.closeColumnModal = function () {
        document.getElementById('columnModal').style.display = 'none';
        document.body.style.overflow = '';
    };

    // ---------- 管理后台 ----------
    function openAdminPanel() {
        document.getElementById('adminModal').style.display = 'flex';
        document.body.style.overflow = 'hidden';
        switchAdminTab('tab-exhibits');
    }

    window.openAdmin = openAdminPanel;

    window.closeAdmin = function () {
        document.getElementById('adminModal').style.display = 'none';
        document.body.style.overflow = '';
        renderAll();
    };

    function switchAdminTab(tabId) {
        var btns = document.querySelectorAll('.admin-tab');
        for (var i = 0; i < btns.length; i++) btns[i].classList.remove('active');
        var activeBtn = document.querySelector('.admin-tab[data-tab="' + tabId + '"]');
        if (activeBtn) activeBtn.classList.add('active');

        var panels = document.querySelectorAll('.admin-tab-panel');
        for (var j = 0; j < panels.length; j++) {
            panels[j].classList.remove('active');
            panels[j].style.opacity = '0';
        }
        var panel = document.getElementById(tabId);
        panel.classList.add('active');
        requestAnimationFrame(function () { panel.style.opacity = '1'; });

        if (tabId === 'tab-exhibits')  renderAdminExhibits();
        if (tabId === 'tab-columns')   renderAdminColumns();
        if (tabId === 'tab-curator')   renderAdminCurator();
        if (tabId === 'tab-upload')    renderAdminUpload();
    }

    // ---- 展览管理 ----
    function renderAdminExhibits() {
        var data = loadData();
        var list = document.getElementById('adminExhibitList');
        if (!data.exhibitions.length) {
            list.innerHTML = '<div class="empty-state">暂无展览</div>';
            return;
        }
        var html = '';
        for (var i = 0; i < data.exhibitions.length; i++) {
            var ex = data.exhibitions[i];
            html += ''
                + '<div class="admin-list-item fade-in" style="animation-delay:' + (i*0.04) + 's">'
                +   '<span>' + escapeHtml(ex.title) + ' <small style="color:var(--text-3)">(' + (ex.artworks?ex.artworks.length:0) + '件)</small></span>'
                +   '<div class="admin-list-actions">'
                +     '<button class="btn-small" onclick="editExhibit(' + i + ')">编辑</button>'
                +     '<button class="btn-danger" onclick="deleteExhibit(' + i + ')">删除</button>'
                +   '</div>'
                + '</div>';
        }
        list.innerHTML = html;
        document.getElementById('exhibitEditForm').style.display = 'none';
    }

    window.adminAddExhibit = function () {
        var title = prompt('请输入新展览名称：');
        if (!title || !title.trim()) return;
        var data = loadData();
        data.exhibitions.push({
            id: genId('ex'),
            title: title.trim(),
            tags: ['展览'],
            description: '',
            essay: '',
            artworks: []
        });
        saveData(data);
        renderAdminExhibits();
        renderAll();
        editExhibit(data.exhibitions.length - 1);
    };

    var editingExhibitIndex = -1;
    window.editExhibit = function (index) {
        var data = loadData();
        var ex = data.exhibitions[index];
        editingExhibitIndex = index;
        document.getElementById('f-ex-name').value  = ex.title || '';
        document.getElementById('f-ex-tags').value  = (ex.tags || []).join(', ');
        document.getElementById('f-ex-desc').value  = ex.description || '';
        document.getElementById('f-ex-essay').value = ex.essay || '';
        var form = document.getElementById('exhibitEditForm');
        form.style.display = 'block';
        var ef = form;
        if (ef.scrollIntoView) ef.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
    };

    window.saveExhibitEdit = function () {
        if (editingExhibitIndex < 0) return;
        var data = loadData();
        var ex = data.exhibitions[editingExhibitIndex];
        ex.title       = document.getElementById('f-ex-name').value.trim();
        ex.tags        = document.getElementById('f-ex-tags').value.split(/[,，]/).map(function (s) { return s.trim(); }).filter(Boolean);
        ex.description = document.getElementById('f-ex-desc').value.trim();
        ex.essay       = document.getElementById('f-ex-essay').value.trim();
        saveData(data);
        editingExhibitIndex = -1;
        showToast('✓ 已保存');
        renderAdminExhibits();
        renderAll();
    };

    window.cancelExhibitEdit = function () {
        editingExhibitIndex = -1;
        document.getElementById('exhibitEditForm').style.display = 'none';
    };

    window.deleteExhibit = function (index) {
        var data = loadData();
        var ex = data.exhibitions[index];
        if (!confirm('确定删除展览「' + ex.title + '」？\n该展览下所有作品也将被删除。')) return;
        data.exhibitions.splice(index, 1);
        saveData(data);
        renderAdminExhibits();
        renderAll();
        showToast('已删除');
    };

    // ---- 专栏管理 ----
    function renderAdminColumns() {
        var data = loadData();
        var list = document.getElementById('adminColumnList');
        if (!data.columns.length) {
            list.innerHTML = '<div class="empty-state">暂无专栏文章</div>';
            return;
        }
        var html = '';
        for (var i = 0; i < data.columns.length; i++) {
            var col = data.columns[i];
            html += ''
                + '<div class="admin-list-item fade-in" style="animation-delay:' + (i*0.04) + 's">'
                +   '<span>' + escapeHtml(col.title) + ' <small style="color:var(--text-3)">(' + escapeHtml(col.date || '') + ')</small></span>'
                +   '<div class="admin-list-actions">'
                +     '<button class="btn-small" onclick="editColumn(' + i + ')">编辑</button>'
                +     '<button class="btn-danger" onclick="deleteColumn(' + i + ')">删除</button>'
                +   '</div>'
                + '</div>';
        }
        list.innerHTML = html;
        document.getElementById('columnEditForm').style.display = 'none';
    }

    window.adminAddColumn = function () {
        var data = loadData();
        data.columns.push({
            id: genId('col'),
            title: '新文章标题',
            date: new Date().toISOString().slice(0,7).replace('-', '.'),
            body: ''
        });
        saveData(data);
        renderAdminColumns();
        renderAll();
        editColumn(data.columns.length - 1);
    };

    var editingColumnIndex = -1;
    window.editColumn = function (index) {
        var data = loadData();
        var col = data.columns[index];
        editingColumnIndex = index;
        document.getElementById('f-col-title').value = col.title || '';
        document.getElementById('f-col-date').value  = (col.date || '').replace('.', '-');
        document.getElementById('f-col-body').value   = col.body || '';
        var form = document.getElementById('columnEditForm');
        form.style.display = 'block';
        if (form.scrollIntoView) form.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
    };

    window.saveColumnEdit = function () {
        if (editingColumnIndex < 0) return;
        var data = loadData();
        var col = data.columns[editingColumnIndex];
        col.title = document.getElementById('f-col-title').value.trim();
        col.date  = document.getElementById('f-col-date').value.replace('-', '.');
        col.body  = document.getElementById('f-col-body').value.trim();
        saveData(data);
        editingColumnIndex = -1;
        showToast('✓ 已保存');
        renderAdminColumns();
        renderAll();
    };

    window.cancelColumnEdit = function () {
        editingColumnIndex = -1;
        document.getElementById('columnEditForm').style.display = 'none';
    };

    window.deleteColumn = function (index) {
        var data = loadData();
        var col = data.columns[index];
        if (!confirm('确定删除文章「' + col.title + '」？')) return;
        data.columns.splice(index, 1);
        saveData(data);
        renderAdminColumns();
        renderAll();
        showToast('已删除');
    };

    // ---- 策展人信息 ----
    function renderAdminCurator() {
        var data = loadData();
        var c = data.curator;
        document.getElementById('f-cu-name').value = c.name || '';
        document.getElementById('f-cu-role').value = c.role || '';
        document.getElementById('f-cu-bio').value  = c.bio || '';
    }

    // 防抖保存
    var curatorSaveTimer;
    window.saveCurator = function () {
        clearTimeout(curatorSaveTimer);
        curatorSaveTimer = setTimeout(function () {
            var data = loadData();
            data.curator.name = document.getElementById('f-cu-name').value.trim();
            data.curator.role = document.getElementById('f-cu-role').value.trim();
            data.curator.bio  = document.getElementById('f-cu-bio').value.trim();
            saveData(data);
            renderAll();
            showToast('✓ 策展人信息已保存');
        }, 300);
    };

    // ---- 上传作品 ----
    function renderAdminUpload() {
        var data = loadData();
        var sel = document.getElementById('f-up-exhibit');
        var html = '';
        for (var i = 0; i < data.exhibitions.length; i++) {
            html += '<option value="' + i + '">' + escapeHtml(data.exhibitions[i].title) + '</option>';
        }
        sel.innerHTML = html;
        document.getElementById('f-up-title').value = '';
        document.getElementById('f-up-desc').value = '';
        document.getElementById('f-up-file').value = '';
        document.getElementById('uploadPreview').innerHTML = '';
    }

    window.doUpload = function () {
        var idx  = document.getElementById('f-up-exhibit').value;
        var title = document.getElementById('f-up-title').value.trim();
        var desc  = document.getElementById('f-up-desc').value.trim();
        var preview = document.getElementById('uploadPreview');

        if (!preview.dataset.b64) { showToast('请先选择一张图片', true); return; }
        if (!title) { showToast('请输入作品标题', true); return; }

        var data = loadData();
        data.exhibitions[idx].artworks.push({
            id: genId('wk'),
            title: title,
            desc: desc,
            image: preview.dataset.b64
        });
        saveData(data);

        preview.innerHTML = '';
        preview.dataset.b64 = '';
        document.getElementById('f-up-file').value = '';
        document.getElementById('f-up-title').value = '';
        document.getElementById('f-up-desc').value = '';

        renderAll();
        showToast('✓ 上传成功');

        // 切到展览管理看效果
        switchAdminTab('tab-exhibits');
    };

    // ---- 备份与设置 ----
    window.exportBackup = function () {
        var payload = {
            account: loadAccount(),
            data: loadData(),
            exportedAt: new Date().toISOString()
        };
        var json = JSON.stringify(payload, null, 2);
        var blob = new Blob([json], { type: 'application/json' });
        var url = URL.createObjectURL(blob);
        var a = document.createElement('a');
        a.href = url;
        a.download = '镜中世界备份_' + new Date().toISOString().slice(0,10) + '.json';
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
        showToast('✓ 备份已导出');
    };

    window.importBackup = function (e) {
        var file = e.target.files[0];
        if (!file) return;
        var reader = new FileReader();
        reader.onload = function (ev) {
            try {
                var obj = JSON.parse(ev.target.result);
                if (!confirm('导入将覆盖当前所有数据，确定继续吗？')) return;
                if (obj.data)    saveData(obj.data);
                if (obj.account) saveAccount(obj.account);
                showToast('✓ 导入成功，即将刷新');
                setTimeout(function () { location.reload(); }, 800);
            } catch (err) {
                showToast('导入失败：文件格式不正确', true);
            }
        };
        reader.readAsText(file);
        e.target.value = '';
    };

    window.changeCredentials = function () {
        var u = document.getElementById('f-set-username').value.trim();
        var p = document.getElementById('f-set-password').value.trim();
        var msg = document.getElementById('settingsMsg');
        if (!u || !p) { msg.style.color = '#e74c3c'; msg.textContent = '账号和密码都不能为空'; return; }
        if (p.length < 6) { msg.style.color = '#e74c3c'; msg.textContent = '密码至少6位'; return; }
        saveAccount({ username: u, password: p });
        msg.style.color = 'var(--klein)';
        msg.textContent = '账号密码已更新，下次登录生效';
        document.getElementById('f-set-username').value = '';
        document.getElementById('f-set-password').value = '';
        showToast('✓ 账号密码已更新');
    };

    // ---------- Toast 提示 ----------
    function showToast(text, isError) {
        var t = document.getElementById('toast');
        if (!t) {
            t = document.createElement('div');
            t.id = 'toast';
            document.body.appendChild(t);
        }
        t.textContent = text;
        t.className = isError ? 'toast toast-error' : 'toast toast-ok';
        t.classList.add('toast-show');
        clearTimeout(t._timer);
        t._timer = setTimeout(function () {
            t.classList.remove('toast-show');
        }, 2200);
    }

    // ---------- 触摸滑动（移动端） ----------
    function initTouchSwipe() {
        var modal = document.getElementById('exhibitModal');
        var startX = 0, startY = 0, distX = 0, distY = 0;
        modal.addEventListener('touchstart', function (e) {
            startX = e.touches[0].clientX;
            startY = e.touches[0].clientY;
            distX = 0; distY = 0;
        }, { passive: true });
        modal.addEventListener('touchmove', function (e) {
            distX = e.touches[0].clientX - startX;
            distY = e.touches[0].clientY - startY;
        }, { passive: true });
        modal.addEventListener('touchend', function () {
            if (Math.abs(distX) > 60 && Math.abs(distX) > Math.abs(distY)) {
                // 横向滑动关闭展览弹窗
                if (distX > 0) closeExhibitModal(); // 右滑关闭
            } else if (distY > 100) {
                closeExhibitModal(); // 下滑关闭
            }
        }, { passive: true });

        // 列表面板滑动切换（移动端）
        var colModal = document.getElementById('columnModal');
        colModal.addEventListener('touchstart', function (e) {
            startX = e.touches[0].clientX;
        }, { passive: true });
        colModal.addEventListener('touchend', function () {
            var dx = e.changedTouches[0].clientX - startX;
            if (dx > 60) closeColumnModal();
        }, { passive: true });
    }

    // ---------- 启动 ----------
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }

})();

/* 抖动动画注入 */
(function injectShakeCSS() {
    var s = document.createElement('style');
    s.textContent = '@keyframes shake{0%,100%{transform:translateX(0)}20%{transform:translateX(-8px)}40%{transform:translateX(8px)}60%{transform:translateX(-4px)}80%{transform:translateX(4px)}}';
    document.head.appendChild(s);
})();

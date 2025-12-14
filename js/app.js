// メインアプリケーション

// 初期化
document.addEventListener('DOMContentLoaded', () => {
    // 認証チェック
    const user = checkAuth();
    if (!user) return;

    // ユーザー名表示
    document.getElementById('currentUser').textContent = user.displayName;

    // ログアウトボタン
    document.getElementById('logoutBtn').addEventListener('click', logout);

    // メンバーフィルターボタンを動的生成
    initMemberFilters();

    // フィルターイベントリスナー
    initFilterListeners();

    // 検索イベントリスナー
    initSearchListener();

    // モーダルイベントリスナー
    initModalListeners();

    // 初回レンダリング
    renderRestaurants(filterRestaurants());
});

// メンバーフィルターの初期化
function initMemberFilters() {
    const memberFilters = document.getElementById('memberFilters');

    MEMBERS.forEach(member => {
        const btn = document.createElement('button');
        btn.className = 'filter-btn';
        btn.dataset.member = member.id;
        btn.textContent = `${member.emoji} ${member.name}`;
        memberFilters.appendChild(btn);
    });
}

// フィルターリスナーの初期化
function initFilterListeners() {
    // メンバーフィルター
    document.getElementById('memberFilters').addEventListener('click', (e) => {
        if (e.target.classList.contains('filter-btn')) {
            // アクティブ状態の切り替え
            document.querySelectorAll('#memberFilters .filter-btn').forEach(btn => {
                btn.classList.remove('active');
            });
            e.target.classList.add('active');

            // フィルター適用
            const member = e.target.dataset.member;
            const filtered = updateFilter('member', member);
            renderRestaurants(filtered);
        }
    });

    // シーンフィルター
    document.getElementById('sceneFilters').addEventListener('click', (e) => {
        if (e.target.classList.contains('filter-btn')) {
            // アクティブ状態の切り替え
            document.querySelectorAll('#sceneFilters .filter-btn').forEach(btn => {
                btn.classList.remove('active');
            });
            e.target.classList.add('active');

            // フィルター適用
            const scene = e.target.dataset.scene;
            const filtered = updateFilter('scene', scene);
            renderRestaurants(filtered);
        }
    });
}

// 検索リスナーの初期化
function initSearchListener() {
    const searchInput = document.getElementById('searchInput');
    let debounceTimer;

    searchInput.addEventListener('input', (e) => {
        clearTimeout(debounceTimer);
        debounceTimer = setTimeout(() => {
            const filtered = updateFilter('search', e.target.value);
            renderRestaurants(filtered);
        }, 300);
    });
}

// モーダルリスナーの初期化
function initModalListeners() {
    const modal = document.getElementById('restaurantModal');
    const modalClose = document.getElementById('modalClose');

    modalClose.addEventListener('click', () => {
        modal.classList.remove('active');
    });

    modal.addEventListener('click', (e) => {
        if (e.target === modal) {
            modal.classList.remove('active');
        }
    });
}

// レストラン一覧のレンダリング
function renderRestaurants(restaurants) {
    const grid = document.getElementById('restaurantsGrid');
    const resultsCount = document.getElementById('resultsCount');

    // 件数表示
    resultsCount.textContent = `${restaurants.length}件のレストラン`;

    // グリッドをクリア
    grid.innerHTML = '';

    // レストランカードを生成
    restaurants.forEach((restaurant, index) => {
        const card = createRestaurantCard(restaurant, index);
        grid.appendChild(card);
    });

    // 結果がない場合
    if (restaurants.length === 0) {
        grid.innerHTML = '<p style="color: var(--text-secondary); text-align: center; grid-column: 1 / -1; padding: 2rem;">該当するレストランが見つかりませんでした。</p>';
    }
}

// レストランカードの作成
function createRestaurantCard(restaurant, index) {
    const card = document.createElement('div');
    card.className = 'restaurant-card';
    card.style.animationDelay = `${index * 0.05}s`;

    // レコメンダー名を取得
    const recommenderNames = restaurant.recommenders
        .map(id => MEMBERS.find(m => m.id === id)?.name || id)
        .join(', ');

    // お気に入り状態
    const favoriteClass = isFavorite(restaurant.id) ? 'active' : '';

    card.innerHTML = `
        <div class="restaurant-header">
            <h3 class="restaurant-name">${restaurant.name}</h3>
            <p class="restaurant-genre">${restaurant.genre} / ${restaurant.area}</p>
        </div>
        
        <div class="restaurant-info">
            <div class="info-item">
                <span>💰</span>
                <span>${restaurant.priceRange}</span>
            </div>
            <div class="info-item">
                <span>⭐</span>
                <span>${restaurant.rating}</span>
            </div>
        </div>
        
        <div class="restaurant-tags">
            ${restaurant.scenes.map(scene => `<span class="tag">${scene}</span>`).join('')}
        </div>
        
        <div class="restaurant-footer">
            <div class="recommender">
                <span>👤</span>
                <span>${recommenderNames}</span>
            </div>
            <button class="favorite-btn ${favoriteClass}" data-id="${restaurant.id}">
                ❤️
            </button>
        </div>
    `;

    // カードクリックで詳細表示
    card.addEventListener('click', (e) => {
        if (!e.target.classList.contains('favorite-btn')) {
            showRestaurantDetail(restaurant);
        }
    });

    // お気に入りボタン
    const favoriteBtn = card.querySelector('.favorite-btn');
    favoriteBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        const isFav = toggleFavorite(restaurant.id);
        favoriteBtn.classList.toggle('active', isFav);
    });

    return card;
}

// レストラン詳細モーダルの表示
function showRestaurantDetail(restaurant) {
    const modal = document.getElementById('restaurantModal');
    const modalBody = document.getElementById('modalBody');

    // レコメンダー名を取得
    const recommenderNames = restaurant.recommenders
        .map(id => MEMBERS.find(m => m.id === id)?.name || id)
        .join(', ');

    modalBody.innerHTML = `
        <h2 class="modal-restaurant-name">${restaurant.name}</h2>
        <p class="modal-restaurant-genre">${restaurant.genre} / ${restaurant.area}</p>
        
        <div class="modal-section">
            <h4>📝 説明</h4>
            <p>${restaurant.description}</p>
        </div>
        
        <div class="modal-section">
            <h4>📍 基本情報</h4>
            <p><strong>住所:</strong> ${restaurant.address}</p>
            <p><strong>電話:</strong> ${restaurant.phone}</p>
            <p><strong>価格帯:</strong> ${restaurant.priceRange}</p>
            <p><strong>評価:</strong> ⭐ ${restaurant.rating}</p>
        </div>
        
        <div class="modal-section">
            <h4>🎭 おすすめシーン</h4>
            <p>${restaurant.scenes.join(' / ')}</p>
        </div>
        
        <div class="modal-section">
            <h4>👤 おすすめしたメンバー</h4>
            <p>${recommenderNames}</p>
        </div>
    `;

    modal.classList.add('active');
}

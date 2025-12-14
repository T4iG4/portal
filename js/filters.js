// フィルタリング機能

// 現在のフィルター状態
let currentFilters = {
    member: 'all',
    scene: 'all',
    search: ''
};

// レストランをフィルタリング
function filterRestaurants() {
    let filtered = [...RESTAURANTS];

    // メンバーフィルター
    if (currentFilters.member !== 'all') {
        filtered = filtered.filter(r =>
            r.recommenders.includes(currentFilters.member)
        );
    }

    // シーンフィルター
    if (currentFilters.scene !== 'all') {
        filtered = filtered.filter(r =>
            r.scenes.includes(currentFilters.scene)
        );
    }

    // 検索フィルター
    if (currentFilters.search) {
        const searchLower = currentFilters.search.toLowerCase();
        filtered = filtered.filter(r =>
            r.name.toLowerCase().includes(searchLower) ||
            r.genre.toLowerCase().includes(searchLower) ||
            r.area.toLowerCase().includes(searchLower) ||
            r.description.toLowerCase().includes(searchLower)
        );
    }

    return filtered;
}

// フィルターの更新
function updateFilter(type, value) {
    currentFilters[type] = value;
    return filterRestaurants();
}

// フィルターのリセット
function resetFilters() {
    currentFilters = {
        member: 'all',
        scene: 'all',
        search: ''
    };
    return filterRestaurants();
}

// フィルターの取得
function getCurrentFilters() {
    return { ...currentFilters };
}

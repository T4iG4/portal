// 認証システム

// デモ用ユーザーデータ
const DEMO_USERS = [
    { username: 'demo', password: 'demo', displayName: '田中太郎' },
    { username: 'satou', password: 'satou123', displayName: '佐藤花子' },
    { username: 'suzuki', password: 'suzuki123', displayName: '鈴木一郎' }
];

// ログイン処理
function login(username, password) {
    const user = DEMO_USERS.find(u => u.username === username && u.password === password);

    if (user) {
        // セッション情報をLocalStorageに保存
        sessionStorage.setItem('currentUser', JSON.stringify({
            username: user.username,
            displayName: user.displayName
        }));
        return true;
    }
    return false;
}

// ログアウト処理
function logout() {
    sessionStorage.removeItem('currentUser');
    window.location.href = 'login.html';
}

// 現在のユーザー情報を取得
function getCurrentUser() {
    const userStr = sessionStorage.getItem('currentUser');
    return userStr ? JSON.parse(userStr) : null;
}

// 認証チェック（メインページで使用）
function checkAuth() {
    const user = getCurrentUser();
    if (!user) {
        window.location.href = 'login.html';
        return null;
    }
    return user;
}

// ログインページのチェック（既にログイン済みの場合はリダイレクト）
function checkLoginPage() {
    const user = getCurrentUser();
    if (user) {
        window.location.href = 'index.html';
    }
}

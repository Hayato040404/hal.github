// URL を短縮する（暗号化）
function shortenUrl() {
    let originalUrl = document.getElementById("originalUrl").value;
    if (!originalUrl) {
        alert("URLを入力してください");
        return;
    }

    // URL を Base64 エンコードし、6 文字に短縮
    let encoded = btoa(originalUrl).replace(/[^A-Za-z0-9]/g, '').slice(0, 6);
    let shortUrl = window.location.origin + "/" + encoded;
    
    document.getElementById("shortenedUrl").innerHTML = `<a href="${shortUrl}">${shortUrl}</a>`;
}

// 短縮URLを復号してリダイレクト
function handleRedirect() {
    let path = window.location.pathname.substring(1); // 先頭の / を削除
    if (!path) return;

    try {
        let decodedUrl = atob(path);
        window.location.href = decodedUrl;
    } catch (e) {
        document.body.innerHTML = "<p>無効な短縮URLです。</p>";
    }
}

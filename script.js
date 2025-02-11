// Base62エンコード用の文字セット
const BASE62_CHARS = "0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz";

// SHA-256でURLをハッシュ化し、Base62に変換
async function generateShortCode(url) {
    const encoder = new TextEncoder();
    const data = encoder.encode(url);
    const hashBuffer = await crypto.subtle.digest("SHA-256", data);
    const hashArray = Array.from(new Uint8Array(hashBuffer));
    const hashHex = hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
    
    let num = BigInt("0x" + hashHex); // 16進数 → 数値
    let shortCode = "";

    while (num > 0n) {
        shortCode = BASE62_CHARS[num % 62n] + shortCode;
        num /= 62n;
    }

    return shortCode || "0"; // 必ず1文字以上になる
}

// URL を短縮する
async function shortenUrl() {
    let originalUrl = document.getElementById("originalUrl").value;
    if (!originalUrl) {
        alert("URLを入力してください");
        return;
    }

    let shortCode = await generateShortCode(originalUrl);
    let shortUrl = window.location.origin + "/" + shortCode;
    
    document.getElementById("shortenedUrl").innerHTML = `<a href="${shortUrl}">${shortUrl}</a>`;
}

// 短縮URLを復号してリダイレクト
async function handleRedirect() {
    let path = window.location.pathname.substring(1); // 先頭の / を削除
    if (!path) return;

    try {
        // LocalStorage から元のURLを取得
        let originalUrl = localStorage.getItem(path);
        if (originalUrl) {
            window.location.href = originalUrl;
        } else {
            document.body.innerHTML = "<p>無効な短縮URLです。</p>";
        }
    } catch (e) {
        document.body.innerHTML = "<p>エラーが発生しました。</p>";
    }
}

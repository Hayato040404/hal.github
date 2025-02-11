// Base62 エンコード用の文字セット
const BASE62_CHARS = "0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz";

// Base64 を Base62 に変換
function base64ToBase62(base64Str) {
    let num = BigInt("0x" + Buffer.from(base64Str, 'base64').toString('hex')); // Base64 → 16進数
    let base62Str = "";

    while (num > 0) {
        base62Str = BASE62_CHARS[num % 62n] + base62Str;
        num = num / 62n;
    }

    return base62Str || "0"; // 変換後の文字列（最低1文字）
}

// URL を短縮する
function shortenUrl() {
    let originalUrl = document.getElementById("originalUrl").value;
    if (!originalUrl) {
        alert("URLを入力してください");
        return;
    }

    let base64Encoded = btoa(originalUrl); // URLをBase64エンコード
    let base62Encoded = base64ToBase62(base64Encoded).slice(0, 6); // Base62変換し、6文字に短縮
    let shortUrl = window.location.origin + "/" + base62Encoded;
    
    document.getElementById("shortenedUrl").innerHTML = `<a href="${shortUrl}">${shortUrl}</a>`;
}

// Base62 から Base64 に復号
function base62ToBase64(base62Str) {
    let num = 0n;
    
    for (let char of base62Str) {
        num = num * 62n + BigInt(BASE62_CHARS.indexOf(char));
    }

    let hex = num.toString(16);
    if (hex.length % 2) hex = "0" + hex; // バイト数を揃える
    return Buffer.from(hex, 'hex').toString('base64'); // 16進数 → Base64
}

// 短縮URLを復号してリダイレクト
function handleRedirect() {
    let path = window.location.pathname.substring(1); // 先頭の / を削除
    if (!path) return;

    try {
        let base64Decoded = base62ToBase64(path); // Base62 から Base64 に復号
        let decodedUrl = atob(base64Decoded); // Base64 から元のURLへ
        window.location.href = decodedUrl;
    } catch (e) {
        document.body.innerHTML = "<p>無効な短縮URLです。</p>";
    }
}

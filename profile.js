// ========================================
// Supabase設定
// ========================================

const SUPABASE_URL =
  "https://gpunelgpefimghugqequ.supabase.co";

const SUPABASE_KEY =
  "sb_publishable_CJ-MrDkSya8fwXii_PWJpQ_9aStV1ci";

console.log("① profile.js 読み込みOK");

const supabaseClient = window.supabase.createClient(
  SUPABASE_URL,
  SUPABASE_KEY
);

console.log("② Supabase接続OK");


// ========================================
// ページ読み込み
// ========================================

document.addEventListener("DOMContentLoaded", () => {

  console.log("③ ページ読み込み完了");

  loadProfile();
  loadPosts();

});


// ========================================
// ユーザー情報を取得
// ========================================

async function loadProfile() {

  const { data, error } =
    await supabaseClient.auth.getUser();

  console.log("ユーザー情報:", data);

  if (error || !data.user) {

    console.log("ログインしているユーザーがいません");

    window.location.href = "login.html";

    return;
  }

  const user = data.user;

  // 登録時に保存したnickname
  const nickname =
    user.user_metadata?.nickname;

  console.log("ユーザーネーム:", nickname);


  // プロフィール名
  const profileName =
    document.getElementById("profileName");

  if (profileName) {

    profileName.textContent =
      nickname || "名前未設定";

  }


  // @username部分
  const usernameTop =
    document.querySelector(".username-top");

  if (usernameTop) {

    usernameTop.textContent =
      "@" + (nickname || "username");

  }

}


// ========================================
// 投稿取得
// ========================================

async function loadPosts() {

  console.log("④ 投稿を取得します");

  const postList =
    document.getElementById("postList");

  const postCount =
    document.getElementById("postCount");


  // Supabaseから投稿取得
  const { data, error } =
    await supabaseClient
      .from("posts")
      .select("*")
      .order("created_at", {
        ascending: false
      });


  console.log("⑤ 取得データ:", data);
  console.log("⑥ 取得エラー:", error);


  // ========================================
  // エラー
  // ========================================

  if (error) {

    console.error(
      "投稿取得エラー:",
      error
    );

    postList.innerHTML = `
      <p>
        投稿の読み込みに失敗しました。
      </p>
    `;

    return;
  }


  // ========================================
  // 投稿数
  // ========================================

  postCount.textContent =
    `投稿数 ${data.length}`;


  // ========================================
  // 投稿なし
  // ========================================

  if (data.length === 0) {

    postList.innerHTML = `
      <p>
        まだ投稿がありません。
      </p>
    `;

    return;
  }


  postList.innerHTML = "";


  // ========================================
  // 現在ログインしているユーザー
  // ========================================

  const { data: userData } =
    await supabaseClient.auth.getUser();


  const nickname =
    userData.user?.user_metadata?.nickname
    || "名前未設定";


  // ========================================
  // 投稿表示
  // ========================================

  data.forEach((post) => {

    const article =
      document.createElement("article");

    article.className = "post";


    // ========================================
    // 投稿日時
    // ========================================

    const date =
      new Date(post.created_at);


    // 確認用ログ
    console.log(
      "created_atの元データ:",
      post.created_at
    );

    console.log(
      "Date変換後:",
      date
    );


    // 日本時間で表示
    const formattedDate =
      date.toLocaleString("ja-JP", {

        timeZone: "Asia/Tokyo",

        year: "numeric",

        month: "numeric",

        day: "numeric",

        hour: "2-digit",

        minute: "2-digit"

      });


    // ========================================
    // 投稿HTML
    // ========================================

    article.innerHTML = `

      <div class="post-user">

        <div class="post-icon"></div>

        <div>

          <div class="post-name">
            ${escapeHTML(nickname)}
          </div>

          <div class="post-id">
            @${escapeHTML(nickname)}
          </div>

        </div>

      </div>


      <div class="bookmark">
        ♡
      </div>


      <div class="post-content">

        <h3>
          ${escapeHTML(post.title)}
        </h3>

        <p>
          ${escapeHTML(post.content)}
        </p>

      </div>


      <div class="post-date">
        投稿日：${formattedDate}
      </div>


      <div class="post-type">

        ${
          post.type === "public"
            ? "🌎 みんなに公開"
            : "🔒 限定公開"
        }

      </div>


      <div class="post-reactions">

        <span>💬</span>

        <span>良いね！</span>

        <span>わかる</span>

        <span>面白い</span>

      </div>

    `;


    postList.appendChild(article);

  });


  console.log("⑦ 投稿表示完了");

}


// ========================================
// HTMLエスケープ
// ========================================

function escapeHTML(text) {

  const div =
    document.createElement("div");

  div.textContent =
    text ?? "";

  return div.innerHTML;

}
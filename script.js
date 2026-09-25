console.log("① script.js 読み込みOK");


// ========================================
// Supabase設定
// ========================================

const SUPABASE_URL =
  "https://gpunelgpefimghugqequ.supabase.co";

const SUPABASE_KEY =
  "sb_publishable_CJ-MrDkSya8fwXii_PWJpQ_9aStV1ci";


console.log("② URLとKEY OK");


// Supabase Client作成
const supabaseClient = window.supabase.createClient(
  SUPABASE_URL,
  SUPABASE_KEY
);

console.log("③ Supabase Client作成OK");


// ========================================
// 新規登録
// ========================================

const registerButton =
  document.getElementById("registerButton");

if (registerButton) {

  registerButton.addEventListener("click", async () => {

    const nickname =
      document.getElementById("nickname").value.trim();

    const email =
      document.getElementById("email").value.trim();

    const password =
      document.getElementById("password").value;

    const message =
      document.getElementById("message");


    if (!nickname || !email || !password) {

      message.textContent =
        "すべて入力してください。";

      message.style.color = "red";

      return;
    }


    message.textContent =
      "登録しています...";

    message.style.color = "black";


    const { data, error } =
      await supabaseClient.auth.signUp({

        email: email,

        password: password,

        options: {
          data: {
            nickname: nickname
          }
        }

      });


    console.log("登録結果:", data);
    console.log("登録エラー:", error);


    if (error) {

      message.textContent =
        "❌ 登録に失敗しました：" +
        error.message;

      message.style.color = "red";

      return;
    }


    message.textContent =
      "🎉 登録成功！";

    message.style.color = "green";

  });

}


// ========================================
// ログイン
// ========================================

const loginButton =
  document.getElementById("loginButton");

if (loginButton) {

  loginButton.addEventListener("click", async () => {

    console.log("① ログインボタンを押しました");


    const email =
      document.getElementById("email").value.trim();

    const password =
      document.getElementById("password").value;

    const message =
      document.getElementById("message");


    if (!email || !password) {

      message.textContent =
        "メールアドレスとパスワードを入力してください。";

      return;
    }


    message.textContent =
      "ログインしています...";


    const { data, error } =
      await supabaseClient.auth.signInWithPassword({

        email: email,

        password: password

      });


    console.log("ログイン結果:", data);
    console.log("ログインエラー:", error);


    if (error) {

      message.textContent =
        "❌ ログインに失敗しました：" +
        error.message;

      message.style.color = "red";

      return;
    }


    message.textContent =
      "🎉 ログイン成功！";

    message.style.color = "green";


    setTimeout(() => {

      window.location.href =
        "main.html";

    }, 1000);

  });

}


// ========================================
// ログアウト
// ========================================

const logoutButton =
  document.getElementById("logoutButton");

if (logoutButton) {

  logoutButton.addEventListener("click", async () => {

    console.log("ログアウトボタンを押しました");


    const { error } =
      await supabaseClient.auth.signOut();


    console.log("ログアウト結果:", error);


    if (error) {

      console.log(
        "❌ ログアウト失敗"
      );

      return;
    }


    console.log(
      "③ ログアウト成功"
    );


    window.location.href =
      "login.html";

  });

}


// ========================================
// プロフィール情報
// ========================================

const profileName =
  document.getElementById("profileName");

if (profileName) {

  async function loadProfile() {

    const { data, error } =
      await supabaseClient.auth.getUser();


    console.log(
      "ユーザー情報:",
      data.user
    );


    if (error || !data.user) {

      window.location.href =
        "login.html";

      return;
    }


    const nickname =
      data.user.user_metadata?.nickname;


    if (nickname) {

      profileName.textContent =
        nickname;

    } else {

      profileName.textContent =
        "名前未設定";

    }

  }


  loadProfile();

}


// ========================================
// メイン画面ボタン
// ========================================

const mainButton =
  document.getElementById("mainButton");

if (mainButton) {

  mainButton.addEventListener("click", () => {

    window.location.href =
      "main.html";

  });

}


// ========================================
// 投稿
// ========================================

const submitPost =
  document.getElementById("submitPost");


if (submitPost) {

  console.log(
    "④ 投稿ボタンを発見しました"
  );


  submitPost.addEventListener(
    "click",
    async () => {

      console.log(
        "⑤ 投稿ボタンが押されました"
      );


      const title =
        document
          .getElementById("postTitle")
          .value
          .trim();


      const content =
        document
          .getElementById("postText")
          .value
          .trim();


      const type =
        document
          .getElementById("postType")
          .value;


      const message =
        document.getElementById("postMessage");


      console.log("タイトル:", title);
      console.log("内容:", content);
      console.log("公開設定:", type);


      // ========================================
      // 入力チェック
      // ========================================

      if (title === "") {

        message.textContent =
          "タイトルを入力してください。";

        return;
      }


      if (content === "") {

        message.textContent =
          "内容を入力してください。";

        return;
      }


      // ========================================
      // 投稿中
      // ========================================

      submitPost.disabled = true;

      submitPost.textContent =
        "投稿中...";

      message.textContent =
        "投稿しています...";


      try {

        // ========================================
        // Supabaseへ保存
        // ========================================

      const now = new Date();

      const japanTime = new Date(
        now.getTime() + 9 * 60 * 60 * 1000
      );

      const { data, error } =
        await supabaseClient
          .from("posts")
          .insert([
            {
              title,
              content,
              type,
              created_at: japanTime.toISOString()
            }
          ])
          .select();


        console.log(
          "投稿結果:",
          data
        );

        console.log(
          "投稿エラー:",
          error
        );


        // ========================================
        // エラー
        // ========================================

        if (error) {

          console.error(
            "投稿エラー:",
            error
          );


          message.textContent =
            "❌ 投稿に失敗しました：" +
            error.message;


          submitPost.disabled =
            false;

          submitPost.textContent =
            "投稿する";


          return;
        }


        // ========================================
        // 成功
        // ========================================

        message.textContent =
          "🎉 投稿しました！";


        message.style.color =
          "green";


        console.log(
          "⑥ 投稿成功！"
        );


        // profile.htmlへ
        setTimeout(() => {

          window.location.href =
            "profile.html";

        }, 1000);


      } catch (error) {

        console.error(
          "予期しないエラー:",
          error
        );


        message.textContent =
          "❌ エラーが発生しました：" +
          error.message;


        submitPost.disabled =
          false;


        submitPost.textContent =
          "投稿する";

      }

    });

}
import { test, expect } from "@playwright/test";
import dayjs from "dayjs";
import {
  generalMemberAuthFilePath,
  premiumMemberAuthFilePath,
} from "./helper/const";

test.describe("非会員", () => {
  const tomorrow = dayjs().add(1, "day");
  const checkInDate = dayjs().add(1, "month").startOf("month");
  const checkOutDate = checkInDate.add(1, "week");

  test("予約する", async ({ page }) => {
    // https://hotel.testplanisphere.dev/ja/ を開く
    await page.goto("https://hotel.testplanisphere.dev/ja/");
    // メニューから「宿泊予約」を選択
    await page.getByRole("link", { name: "宿泊予約" }).click();

    // 宿泊プラン一覧から「お得な特典付きプラン」の「このプランで予約」を選択
    const [reservePage] = await Promise.all([
      page.waitForEvent("popup"),
      page
        .locator(".card-body")
        .filter({ hasText: "お得な特典付きプラン" })
        .getByRole("link", { name: "このプランで予約" })
        .click(),
    ]);

    // 初期値確認
    await expect(reservePage.getByLabel("宿泊日")).toHaveValue(
      tomorrow.format("YYYY/MM/DD")
    );

    // 宿泊日を翌月1日に設定
    // input要素はidとlabelのfor属性で紐づけられていればラベルでとれる。
    await reservePage.getByLabel("宿泊日").clear();
    await reservePage
      .getByLabel("宿泊日")
      .fill(checkInDate.format("YYYY/MM/DD"));
    const datePickerCloseButton = reservePage.getByRole("button", {
      name: "閉じる",
    });
    if (await datePickerCloseButton.isVisible()) {
      datePickerCloseButton.click();
    }
    // 宿泊数を7泊に設定
    await reservePage.getByLabel("宿泊数").fill("7");
    // 人数を2に設定
    await reservePage.getByLabel("人数").fill("2");
    // 朝食バイキング、昼からチェックインプラン、お得な観光プランを選択
    await reservePage.getByLabel("朝食バイキング").check();
    await reservePage.getByLabel("昼からチェックインプラン").check();
    await reservePage.getByLabel("お得な観光プラン").check();
    // 氏名に「テスト太郎」を入力
    await reservePage.getByLabel("氏名").fill("テスト太郎");
    // 確認のご連絡をメールに設定
    await reservePage.getByLabel("確認のご連絡").selectOption("email");
    // メールアドレスにhoge@example.comを設定
    await reservePage.getByLabel("メールアドレス").fill("hoge@example.com");
    // ご要望・ご連絡事項に「テスト」と入力
    await reservePage
      .getByLabel("ご要望・ご連絡事項等ありましたらご記入ください")
      .fill("テスト");
    // 予約内容を確認するボタンを選択
    await reservePage
      .getByRole("button", { name: "予約内容を確認する" })
      .click();
    // 宿泊予約確認画面で、以下を確認
    // 合計金額が123,000円であること
    await expect(
      reservePage.getByText("合計 123,000円（税込み）")
    ).toBeVisible();
    // 期間、人数、追加プラン、お名前、確認のご連絡、ご要望・ご連絡が入力通りになっていること
    await expect(reservePage.getByRole("definition").nth(0)).toHaveText(
      `${checkInDate.format("YYYY年M月D日")} 〜 ${checkOutDate.format(
        "YYYY年M月D日"
      )} 7泊`
    );
    await expect(reservePage.getByRole("definition").nth(1)).toHaveText(
      "2名様"
    );
    await expect(
      reservePage.getByRole("definition").nth(2).getByRole("listitem")
    ).toHaveText([
      "朝食バイキング",
      "昼からチェックインプラン",
      "お得な観光プラン",
    ]);
    await expect(reservePage.getByRole("definition").nth(3)).toHaveText(
      "テスト太郎様"
    );
    await expect(reservePage.getByRole("definition").nth(4)).toHaveText(
      "メール：hoge@example.com"
    );
    await expect(reservePage.getByRole("definition").nth(5)).toHaveText(
      "テスト"
    );
    // この内容で予約するボタンを選択し、以下を確認
    await reservePage
      .getByRole("button", { name: "この内容で予約する" })
      .click();
    // 予約が完了しましたダイアログが表示されること
    await expect(
      reservePage.getByRole("dialog").getByText("予約を完了しました")
    ).toBeVisible();
  });
});

test.describe("一般会員", () => {
  const tomorrow = dayjs().add(1, "day");
  const checkInDate = dayjs().add(1, "month").startOf("month");
  const checkOutDate = checkInDate.add(1, "week");

  test.use({ storageState: generalMemberAuthFilePath });
  test("一般会員で予約する", async ({ page }) => {
    // https://hotel.testplanisphere.dev/ja/ を開く
    await page.goto("https://hotel.testplanisphere.dev/ja/");
    // メニューから「宿泊予約」を選択
    await page.getByRole("link", { name: "宿泊予約" }).click();

    // 宿泊プラン一覧から「会員限定」「お得なプラン」の「このプランで予約」を選択
    const [reservePage] = await Promise.all([
      page.waitForEvent("popup"),
      page
        .locator(".card")
        .filter({ hasText: "会員限定" })
        .locator(".card-body")
        .filter({ hasText: "お得なプラン" })
        .getByRole("link", { name: "このプランで予約" })
        .click(),
    ]);
    // 初期値確認
    await expect(reservePage.getByLabel("宿泊日")).toHaveValue(
      tomorrow.format("YYYY/MM/DD")
    );

    // 宿泊日を翌月1日に設定
    // input要素はidとlabelのfor属性で紐づけられていればラベルでとれる。
    await reservePage.getByLabel("宿泊日").clear();
    await reservePage
      .getByLabel("宿泊日")
      .fill(checkInDate.format("YYYY/MM/DD"));
    const datePickerCloseButton = reservePage.getByRole("button", {
      name: "閉じる",
    });
    if (await datePickerCloseButton.isVisible()) {
      datePickerCloseButton.click();
    }
    // 宿泊数を7泊に設定
    await reservePage.getByLabel("宿泊数").fill("7");
    // 人数を2に設定
    await reservePage.getByLabel("人数").fill("2");
    // 朝食バイキング、昼からチェックインプラン、お得な観光プランを選択
    await reservePage.getByLabel("朝食バイキング").check();
    await reservePage.getByLabel("昼からチェックインプラン").check();
    await reservePage.getByLabel("お得な観光プラン").check();
    // 氏名に「松本さくら」が入力されている
    await expect(reservePage.getByLabel("氏名")).toHaveValue("松本さくら");
    // 確認のご連絡をメールに設定
    await reservePage.getByLabel("確認のご連絡").selectOption("email");
    // メールアドレスにsakura@example.comが入力されている
    await expect(reservePage.getByLabel("メールアドレス")).toHaveValue(
      "sakura@example.com"
    );
    // ご要望・ご連絡事項に「テスト」と入力
    await reservePage
      .getByLabel("ご要望・ご連絡事項等ありましたらご記入ください")
      .fill("テスト");
    // 予約内容を確認するボタンを選択
    await reservePage
      .getByRole("button", { name: "予約内容を確認する" })
      .click();
    // 宿泊予約確認画面で、以下を確認
    // 合計金額が108,000円であること
    await expect(
      reservePage.getByText("合計 108,000円（税込み）")
    ).toBeVisible();
    // 期間、人数、追加プラン、お名前、確認のご連絡、ご要望・ご連絡が入力通りになっていること
    await expect(reservePage.getByRole("definition").nth(0)).toHaveText(
      `${checkInDate.format("YYYY年M月D日")} 〜 ${checkOutDate.format(
        "YYYY年M月D日"
      )} 7泊`
    );
    await expect(reservePage.getByRole("definition").nth(1)).toHaveText(
      "2名様"
    );
    await expect(
      reservePage.getByRole("definition").nth(2).getByRole("listitem")
    ).toHaveText([
      "朝食バイキング",
      "昼からチェックインプラン",
      "お得な観光プラン",
    ]);
    await expect(reservePage.getByRole("definition").nth(3)).toHaveText(
      "松本さくら様"
    );
    await expect(reservePage.getByRole("definition").nth(4)).toHaveText(
      "メール：sakura@example.com"
    );
    await expect(reservePage.getByRole("definition").nth(5)).toHaveText(
      "テスト"
    );
    // この内容で予約するボタンを選択し、以下を確認
    await reservePage
      .getByRole("button", { name: "この内容で予約する" })
      .click();
    // 予約が完了しましたダイアログが表示されること
    await expect(
      reservePage.getByRole("dialog").getByText("予約を完了しました")
    ).toBeVisible();
  });
});

test.describe("プレミアム会員", () => {
  const tomorrow = dayjs().add(1, "day");
  const checkInDate = dayjs().add(1, "month").startOf("month");
  const checkOutDate = checkInDate.add(1, "week");

  test.use({ storageState: premiumMemberAuthFilePath });
  test("予約する", async ({ page }) => {
    // https://hotel.testplanisphere.dev/ja/ を開く
    await page.goto("https://hotel.testplanisphere.dev/ja/");
    // メニューから「宿泊予約」を選択
    await page.getByRole("link", { name: "宿泊予約" }).click();

    // 宿泊プラン一覧から「プレミアム会員限定」「プレミアムプラン」の「このプランで予約」を選択
    const [reservePage] = await Promise.all([
      page.waitForEvent("popup"),
      page
        .locator(".card")
        .filter({ hasText: "プレミアム会員限定" })
        .locator(".card-body")
        .filter({ hasText: "プレミアムプラン" })
        .getByRole("link", { name: "このプランで予約" })
        .click(),
    ]);
    // 初期値確認
    await expect(reservePage.getByLabel("宿泊日")).toHaveValue(
      tomorrow.format("YYYY/MM/DD")
    );

    // 宿泊日を翌月1日に設定
    // input要素はidとlabelのfor属性で紐づけられていればラベルでとれる。
    await reservePage.getByLabel("宿泊日").clear();
    await reservePage
      .getByLabel("宿泊日")
      .fill(checkInDate.format("YYYY/MM/DD"));
    const datePickerCloseButton = reservePage.getByRole("button", {
      name: "閉じる",
    });
    if (await datePickerCloseButton.isVisible()) {
      datePickerCloseButton.click();
    }
    // 宿泊数を7泊に設定
    await reservePage.getByLabel("宿泊数").fill("7");
    // 人数を2に設定
    await reservePage.getByLabel("人数").fill("2");
    // 朝食バイキング、昼からチェックインプラン、お得な観光プランを選択
    await reservePage.getByLabel("朝食バイキング").check();
    await reservePage.getByLabel("昼からチェックインプラン").check();
    await reservePage.getByLabel("お得な観光プラン").check();
    // 氏名に「山田一郎」が入力されている
    await expect(reservePage.getByLabel("氏名")).toHaveValue("山田一郎");
    // 確認のご連絡をメールに設定
    await reservePage.getByLabel("確認のご連絡").selectOption("email");
    // メールアドレスにichiro@example.comが入力されている
    await expect(reservePage.getByLabel("メールアドレス")).toHaveValue(
      "ichiro@example.com"
    );
    // ご要望・ご連絡事項に「テスト」と入力
    await reservePage
      .getByLabel("ご要望・ご連絡事項等ありましたらご記入ください")
      .fill("テスト");
    // 予約内容を確認するボタンを選択
    await reservePage
      .getByRole("button", { name: "予約内容を確認する" })
      .click();
    // 宿泊予約確認画面で、以下を確認
    // 合計金額が168,000円であること
    await expect(
      reservePage.getByText("合計 168,000円（税込み）")
    ).toBeVisible();
    // 期間、人数、追加プラン、お名前、確認のご連絡、ご要望・ご連絡が入力通りになっていること
    await expect(reservePage.getByRole("definition").nth(0)).toHaveText(
      `${checkInDate.format("YYYY年M月D日")} 〜 ${checkOutDate.format(
        "YYYY年M月D日"
      )} 7泊`
    );
    await expect(reservePage.getByRole("definition").nth(1)).toHaveText(
      "2名様"
    );
    await expect(
      reservePage.getByRole("definition").nth(2).getByRole("listitem")
    ).toHaveText([
      "朝食バイキング",
      "昼からチェックインプラン",
      "お得な観光プラン",
    ]);
    await expect(reservePage.getByRole("definition").nth(3)).toHaveText(
      "山田一郎様"
    );
    await expect(reservePage.getByRole("definition").nth(4)).toHaveText(
      "メール：ichiro@example.com"
    );
    await expect(reservePage.getByRole("definition").nth(5)).toHaveText(
      "テスト"
    );
    // この内容で予約するボタンを選択し、以下を確認
    await reservePage
      .getByRole("button", { name: "この内容で予約する" })
      .click();
    // 予約が完了しましたダイアログが表示されること
    await expect(
      reservePage.getByRole("dialog").getByText("予約を完了しました")
    ).toBeVisible();
  });
});

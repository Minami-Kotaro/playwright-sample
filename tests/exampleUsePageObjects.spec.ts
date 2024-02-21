import { test, expect } from "@playwright/test";
import dayjs from "dayjs";
import {
  generalMemberAuthFilePath,
  premiumMemberAuthFilePath,
} from "./helper/const";
import { type ReserveForm } from "./pageObjects/reservePage";
import { HomePage } from "./pageObjects/homePage";

test.describe("非会員", () => {
  const tomorrow = dayjs().add(1, "day");
  const checkInDate = dayjs().add(1, "month").startOf("month");
  const checkOutDate = checkInDate.add(1, "week");

  test("予約する", async ({ page }) => {
    const homePage = new HomePage(page);
    // https://hotel.testplanisphere.dev/ja/ を開く
    await homePage.goto();
    // 宿泊予約画面へ遷移
    const planPage = await homePage.gotoPlanPage();

    // 宿泊プラン一覧から「お得な特典付きプラン」の「このプランで予約」を選択
    const reservePage = await planPage.selectPlanAndGotoReserve({
      header: "おすすめプラン",
      title: "お得な特典付きプラン",
    });

    // 初期値確認
    await expect(reservePage.checkInDateInput).toHaveValue(
      tomorrow.format("YYYY/MM/DD")
    );

    // 宿泊日を翌月1日に設定
    // 宿泊数を7泊に設定
    // 人数を2に設定
    // 朝食バイキング、昼からチェックインプラン、お得な観光プランを選択
    // 氏名に「テスト太郎」を入力
    // 確認のご連絡をメールに設定
    // メールアドレスにhoge@example.comを設定
    // ご要望・ご連絡事項に「テスト」と入力
    const inputFormDate: ReserveForm = {
      checkInDate: checkInDate.format("YYYY/MM/DD"),
      numberOfNights: "7",
      numberOfGuests: "2",
      name: "テスト太郎",
      isBreakfastBuffet: true,
      isAfternoonCheckIn: true,
      isBudgetSightseeing: true,
      contactConfirm: "email",
      mailAddress: "hoge@example.com",
      specialRequest: "テスト",
    };
    await reservePage.inputFormData(inputFormDate);

    // 予約内容確認画面へ遷移
    const confirmPage = await reservePage.reserveAndGotoConfirmPage();

    // 宿泊予約確認画面で、以下を確認
    // 合計金額が123,000円であること
    await expect(confirmPage.totalBill).toHaveText("合計 123,000円（税込み）");
    // 期間、人数、追加プラン、お名前、確認のご連絡、ご要望・ご連絡が入力通りになっていること
    await expect(confirmPage.period).toHaveText(
      `${checkInDate.format("YYYY年M月D日")} 〜 ${checkOutDate.format(
        "YYYY年M月D日"
      )} ${inputFormDate.numberOfNights}泊`
    );
    await expect(confirmPage.numberOfGuest).toHaveText(
      `${inputFormDate.numberOfGuests}名様`
    );
    await expect(confirmPage.additionalPlans.getByRole("listitem")).toHaveText([
      "朝食バイキング",
      "昼からチェックインプラン",
      "お得な観光プラン",
    ]);
    await expect(confirmPage.name).toHaveText(`${inputFormDate.name}様`);
    await expect(confirmPage.contact).toHaveText(
      `メール：${inputFormDate.mailAddress}`
    );
    await expect(confirmPage.specialRequest).toHaveText(
      inputFormDate.specialRequest ?? ""
    );
    // この内容で予約するボタンを押下
    await confirmPage.reserve();
    // 予約が完了しましたダイアログが表示されること
    await expect(confirmPage.completeDialog).toBeVisible();
  });
});

test.describe("一般会員", () => {
  const tomorrow = dayjs().add(1, "day");
  const checkInDate = dayjs().add(1, "month").startOf("month");
  const checkOutDate = checkInDate.add(1, "week");

  test.use({ storageState: generalMemberAuthFilePath });
  test("予約する", async ({ page }) => {
    const homePage = new HomePage(page);
    // https://hotel.testplanisphere.dev/ja/ を開く
    await homePage.goto();
    // 宿泊予約画面へ遷移
    const planPage = await homePage.gotoPlanPage();

    // 宿泊プラン一覧から「会員限定」「お得なプラン」の「このプランで予約」を選択
    const reservePage = await planPage.selectPlanAndGotoReserve({
      header: "会員限定",
      title: "お得なプラン",
    });

    // 初期値確認
    await expect(reservePage.checkInDateInput).toHaveValue(
      tomorrow.format("YYYY/MM/DD")
    );

    // 宿泊日を翌月1日に設定
    // 宿泊数を7泊に設定
    // 人数を2に設定
    // 朝食バイキング、昼からチェックインプラン、お得な観光プランを選択
    // 確認のご連絡をメールに設定
    // ご要望・ご連絡事項に「テスト」と入力
    const inputFormDate: ReserveForm = {
      checkInDate: checkInDate.format("YYYY/MM/DD"),
      numberOfNights: "7",
      numberOfGuests: "2",
      isBreakfastBuffet: true,
      isAfternoonCheckIn: true,
      isBudgetSightseeing: true,
      contactConfirm: "email",
      specialRequest: "テスト",
    };
    await reservePage.inputFormData(inputFormDate);

    // 氏名に「松本さくら」が入力されている
    await expect(reservePage.nameInput).toHaveValue("松本さくら");
    // メールアドレスにsakura@example.comが入力されている
    await expect(reservePage.mailAddressInput).toHaveValue(
      "sakura@example.com"
    );
    // 予約内容を確認画面へ遷移
    const confirmPage = await reservePage.reserveAndGotoConfirmPage();

    // 宿泊予約確認画面で、以下を確認
    // 合計金額が108,000円であること
    await expect(confirmPage.totalBill).toHaveText("合計 108,000円（税込み）");
    // 期間、人数、追加プラン、お名前、確認のご連絡、ご要望・ご連絡が入力通りになっていること
    await expect(confirmPage.period).toHaveText(
      `${checkInDate.format("YYYY年M月D日")} 〜 ${checkOutDate.format(
        "YYYY年M月D日"
      )} ${inputFormDate.numberOfNights}泊`
    );
    await expect(confirmPage.numberOfGuest).toHaveText(
      `${inputFormDate.numberOfGuests}名様`
    );
    await expect(confirmPage.additionalPlans.getByRole("listitem")).toHaveText([
      "朝食バイキング",
      "昼からチェックインプラン",
      "お得な観光プラン",
    ]);
    await expect(confirmPage.name).toHaveText("松本さくら様");
    await expect(confirmPage.contact).toHaveText("メール：sakura@example.com");
    await expect(confirmPage.specialRequest).toHaveText(
      inputFormDate.specialRequest ?? ""
    );
    // この内容で予約するボタンを選択し、以下を確認
    await confirmPage.reserve();
    // 予約が完了しましたダイアログが表示されること
    await expect(confirmPage.completeDialog).toBeVisible();
  });
});

test.describe("プレミアム会員", () => {
  const tomorrow = dayjs().add(1, "day");
  const checkInDate = dayjs().add(1, "month").startOf("month");
  const checkOutDate = checkInDate.add(1, "week");

  test.use({ storageState: premiumMemberAuthFilePath });
  test("予約する", async ({ page }) => {
    const homePage = new HomePage(page);
    // https://hotel.testplanisphere.dev/ja/ を開く
    await homePage.goto();
    // 宿泊予約画面へ遷移
    const planPage = await homePage.gotoPlanPage();

    // 宿泊プラン一覧から「プレミアム会員限定」「プレミアムプラン」の「このプランで予約」を選択
    const reservePage = await planPage.selectPlanAndGotoReserve({
      header: "プレミアム会員限定",
      title: "プレミアムプラン",
    });

    // 初期値確認
    await expect(reservePage.checkInDateInput).toHaveValue(
      tomorrow.format("YYYY/MM/DD")
    );

    // 宿泊日を翌月1日に設定
    // 宿泊数を7泊に設定
    // 人数を2に設定
    // 朝食バイキング、昼からチェックインプラン、お得な観光プランを選択
    // 確認のご連絡をメールに設定
    // ご要望・ご連絡事項に「テスト」と入力
    const inputFormDate: ReserveForm = {
      checkInDate: checkInDate.format("YYYY/MM/DD"),
      numberOfNights: "7",
      numberOfGuests: "2",
      isBreakfastBuffet: true,
      isAfternoonCheckIn: true,
      isBudgetSightseeing: true,
      contactConfirm: "email",
      specialRequest: "テスト",
    };
    await reservePage.inputFormData(inputFormDate);

    // 氏名に「山田一郎」が入力されている
    await expect(reservePage.nameInput).toHaveValue("山田一郎");
    // メールアドレスにichiro@example.comが入力されている
    await expect(reservePage.mailAddressInput).toHaveValue(
      "ichiro@example.com"
    );
    // 予約内容を確認画面へ遷移
    const confirmPage = await reservePage.reserveAndGotoConfirmPage();

    // 宿泊予約確認画面で、以下を確認
    // 合計金額が168,000円であること
    await expect(confirmPage.totalBill).toHaveText("合計 168,000円（税込み）");
    // 期間、人数、追加プラン、お名前、確認のご連絡、ご要望・ご連絡が入力通りになっていること
    await expect(confirmPage.period).toHaveText(
      `${checkInDate.format("YYYY年M月D日")} 〜 ${checkOutDate.format(
        "YYYY年M月D日"
      )} ${inputFormDate.numberOfNights}泊`
    );
    await expect(confirmPage.numberOfGuest).toHaveText(
      `${inputFormDate.numberOfGuests}名様`
    );
    await expect(confirmPage.additionalPlans.getByRole("listitem")).toHaveText([
      "朝食バイキング",
      "昼からチェックインプラン",
      "お得な観光プラン",
    ]);
    await expect(confirmPage.name).toHaveText("山田一郎様");
    await expect(confirmPage.contact).toHaveText("メール：ichiro@example.com");
    await expect(confirmPage.specialRequest).toHaveText(
      inputFormDate.specialRequest ?? ""
    );
    // この内容で予約するボタンを選択し、以下を確認
    await confirmPage.reserve();
    // 予約が完了しましたダイアログが表示されること
    await expect(confirmPage.completeDialog).toBeVisible();
  });
});

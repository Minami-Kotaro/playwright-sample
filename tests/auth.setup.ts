import { test as setup } from "@playwright/test";
import {
  generalMemberAuthFilePath,
  premiumMemberAuthFilePath,
} from "./helper/const";

setup("一般会員", async ({ page }) => {
  await page.goto("https://hotel.testplanisphere.dev/ja/login.html");
  await page.getByLabel("メールアドレス").fill("sakura@example.com");
  await page.getByLabel("パスワード").fill("pass1234");
  await page.getByRole("button", { name: "ログイン" }).nth(1).click();
  await page.context().storageState({ path: generalMemberAuthFilePath });
});

setup("プレミアム会員", async ({ page }) => {
  await page.goto("https://hotel.testplanisphere.dev/ja/login.html");
  await page.getByLabel("メールアドレス").fill("ichiro@example.com");
  await page.getByLabel("パスワード").fill("password");
  await page.getByRole("button", { name: "ログイン" }).nth(1).click();
  await page.context().storageState({ path: premiumMemberAuthFilePath });
});

import { Locator, Page } from "@playwright/test";
import { PlanPage } from "./planPage";

export class HomePage {
  readonly page: Page;
  readonly reserveButton: Locator;

  constructor(page: Page) {
    this.page = page;
    this.reserveButton = page.getByRole("link", { name: "宿泊予約" });
  }

  // 対象のページへ遷移
  async goto() {
    await this.page.goto("https://hotel.testplanisphere.dev/ja/index.html");
  }

  // 対象のページへ遷移
  async gotoPlanPage() {
    await this.reserveButton.click();
    return new PlanPage(this.page);
  }
}

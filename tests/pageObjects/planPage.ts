import { Locator, Page } from "@playwright/test";
import { ReservePage } from "./reservePage";

export class PlanPage {
  readonly page: Page;
  readonly planList: Locator;

  constructor(page: Page) {
    this.page = page;
    this.planList = page.locator(".card");
  }

  // 対象のページへ遷移
  async goto() {
    await this.page.goto("/plans.html");
  }

  // ヘッダーとタイトルを指定してプランを選択する
  async selectPlanAndGotoReserve(data: { header: string; title: string }) {
    const { header, title } = data;

    const [reservePage] = await Promise.all([
      this.page.waitForEvent("popup"),
      this.planList
        .filter({ hasText: header })
        .locator(".card-body")
        .filter({ hasText: title })
        .getByRole("link", { name: "このプランで予約" })
        .click(),
    ]);

    return new ReservePage(reservePage);
  }
}

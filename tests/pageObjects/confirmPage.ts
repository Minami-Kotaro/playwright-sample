import { Locator, Page } from "@playwright/test";

export class ConfirmPage {
  readonly page: Page;
  readonly totalBill: Locator;
  readonly period: Locator;
  readonly numberOfGuest: Locator;
  readonly additionalPlans: Locator;
  readonly name: Locator;
  readonly contact: Locator;
  readonly specialRequest: Locator;
  readonly reserveButton: Locator;
  readonly completeDialog: Locator;

  // CSSセレクタで取得
  constructor(page: Page) {
    this.page = page;
    this.totalBill = page.locator("#total-bill");
    this.period = page.getByRole("definition").nth(0);
    this.numberOfGuest = page.getByRole("definition").nth(1);
    this.additionalPlans = page.getByRole("definition").nth(2);
    this.name = page.getByRole("definition").nth(3);
    this.contact = page.getByRole("definition").nth(4);
    this.specialRequest = page.getByRole("definition").nth(5);
    this.reserveButton = page.getByRole("button", {
      name: "この内容で予約する",
    });
    this.completeDialog = page
      .getByRole("dialog")
      .getByText("予約を完了しました");
  }

  async reserve() {
    this.reserveButton.click();
  }
}

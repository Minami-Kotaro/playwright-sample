import { Locator, Page } from "@playwright/test";
import { ConfirmPage } from "./confirmPage";

export type ReserveForm = {
  checkInDate?: string;
  numberOfNights?: string;
  numberOfGuests?: string;
  name?: string;
  isBreakfastBuffet?: boolean;
  isAfternoonCheckIn?: boolean;
  isBudgetSightseeing?: boolean;
  contactConfirm?: "no" | "email" | "tel";
  mailAddress?: string;
  phoneNumber?: string;
  specialRequest?: string;
};

export class ReservePage {
  readonly page: Page;
  readonly checkInDateInput: Locator;
  readonly datePickerCloseButton: Locator;
  readonly numberOfNightsInput: Locator;
  readonly numberOfGuestsInput: Locator;
  readonly nameInput: Locator;
  readonly breakfastBuffetCheckbox: Locator;
  readonly afternoonCheckInCheckbox: Locator;
  readonly budgetSightseeingCheckbox: Locator;
  readonly contactConfirmSelect: Locator;
  readonly mailAddressInput: Locator;
  readonly phoneNumberInput: Locator;
  readonly specialRequestInput: Locator;
  readonly reserveButton: Locator;

  constructor(page: Page) {
    this.page = page;
    this.checkInDateInput = page.getByLabel("宿泊日");
    this.datePickerCloseButton = page.getByRole("button", { name: "閉じる" });
    this.numberOfNightsInput = page.getByLabel("宿泊数");
    this.numberOfGuestsInput = page.getByLabel("人数");
    this.nameInput = page.getByLabel("氏名");
    this.breakfastBuffetCheckbox = page.getByLabel("朝食バイキング");
    this.afternoonCheckInCheckbox = page.getByLabel("昼からチェックインプラン");
    this.budgetSightseeingCheckbox = page.getByLabel("お得な観光プラン");
    this.contactConfirmSelect = page.getByLabel("確認のご連絡");
    this.mailAddressInput = page.getByLabel("メールアドレス");
    this.phoneNumberInput = page.getByLabel("電話番号");
    this.specialRequestInput = page.getByLabel(
      "ご要望・ご連絡事項等ありましたらご記入ください"
    );
    this.reserveButton = page.getByRole("button", {
      name: "予約内容を確認する",
    });
  }

  async inputCheckInDate(value: string) {
    await this.checkInDateInput.clear();
    await this.checkInDateInput.fill(value);
    if (await this.datePickerCloseButton.isVisible()) {
      await this.datePickerCloseButton.click();
    }
  }

  async inputFormData(data: ReserveForm) {
    const {
      checkInDate,
      numberOfNights,
      numberOfGuests,
      name,
      isBreakfastBuffet,
      isAfternoonCheckIn,
      isBudgetSightseeing,
      contactConfirm,
      mailAddress,
      phoneNumber,
      specialRequest,
    } = data;

    if (checkInDate !== undefined) {
      await this.checkInDateInput.clear();
      await this.checkInDateInput.fill(checkInDate);
      if (await this.datePickerCloseButton.isVisible()) {
        await this.datePickerCloseButton.click();
      }
    }

    if (numberOfNights !== undefined) {
      await this.numberOfNightsInput.fill(numberOfNights);
    }

    if (numberOfGuests !== undefined) {
      await this.numberOfGuestsInput.fill(numberOfGuests);
    }

    if (name !== undefined) {
      await this.nameInput.fill(name);
    }

    if (isBreakfastBuffet !== undefined) {
      isBreakfastBuffet
        ? await this.breakfastBuffetCheckbox.check()
        : await this.breakfastBuffetCheckbox.uncheck();
    }

    if (isAfternoonCheckIn !== undefined) {
      isAfternoonCheckIn
        ? await this.afternoonCheckInCheckbox.check()
        : await this.afternoonCheckInCheckbox.uncheck();
    }

    if (isBudgetSightseeing !== undefined) {
      isBudgetSightseeing
        ? await this.budgetSightseeingCheckbox.check()
        : await this.budgetSightseeingCheckbox.uncheck();
    }

    if (contactConfirm !== undefined) {
      await this.contactConfirmSelect.selectOption(contactConfirm);
    }

    if (mailAddress !== undefined) {
      await this.mailAddressInput.fill(mailAddress);
    }

    if (phoneNumber !== undefined) {
      await this.phoneNumberInput.fill(phoneNumber);
    }

    if (specialRequest !== undefined) {
      await this.specialRequestInput.fill(specialRequest);
    }
  }

  async reserveAndGotoConfirmPage() {
    this.reserveButton.click();
    return new ConfirmPage(this.page);
  }
}

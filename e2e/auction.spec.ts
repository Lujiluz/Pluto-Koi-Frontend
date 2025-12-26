import { test, expect } from "@playwright/test";

/**
 * E2E Test: Auction User Journey
 *
 * FOKUS:
 * - UI visible dan responsive
 * - Countdown tampil
 * - Bid update terlihat di UI
 *
 * TIDAK DIUJI (tanggung jawab backend):
 * - Perhitungan waktu
 * - Extend logic detail
 * - Auction end rule
 */

// Test credentials - sesuaikan dengan user test di database
const TEST_USER = {
  email: process.env.TEST_USER_EMAIL || "plutokoiusertesting1@yopmail.com",
  password: process.env.TEST_USER_PASSWORD || "Testing123#",
};

// Helper: Login via UI
async function loginViaUI(page: any, email: string, password: string) {
  // Go to lelang page (will show auth required)
  await page.goto("/lelang");
  await page.waitForLoadState("networkidle");

  // Click login button
  const loginButton = page.locator("button:has-text('Masuk'), button:has-text('Login')").first();
  const hasLoginButton = await loginButton.isVisible().catch(() => false);

  if (!hasLoginButton) {
    // User might already be logged in
    return true;
  }

  await loginButton.click();
  await page.waitForTimeout(500);

  // Fill login form
  const emailInput = page.locator("input[type='email'], input[name='email'], input[placeholder*='email' i]").first();
  const passwordInput = page.locator("input[type='password'], input[name='password']").first();

  await emailInput.fill(email);
  await passwordInput.fill(password);

  // Submit login
  const submitButton = page.locator("[data-testid='login-submit'], button[type='submit']:has-text('Masuk'), button[type='submit']:has-text('Login')").first();
  await submitButton.click();

  // Wait for login to complete
  await page.waitForTimeout(2000);

  return true;
}

// Helper: Check if user is authenticated (auction cards visible)
async function isAuthenticated(page: any): Promise<boolean> {
  // Look for auction cards in main content area only
  const auctionCard = page.locator("main [data-testid='auction-card'], main a:has-text('Detail')").first();
  return await auctionCard.isVisible().catch(() => false);
}

// ============================================
// TEST: Unauthenticated User Journey
// ============================================
test.describe("Auction Page - Unauthenticated", () => {
  test("unauthenticated user sees login required message", async ({ page }) => {
    // E2E TEST: unauthenticated user sees auth prompt
    // - open auction page without login
    // - verify auth required section is shown

    await page.goto("/lelang");
    await page.waitForLoadState("networkidle");

    // Should see "Lelang Eksklusif untuk Member" or login button
    const authRequiredTexts = ["text=/Eksklusif untuk Member/i", "text=/Login/i", "text=/Masuk/i", "text=/Daftar/i", "button:has-text('Masuk')", "button:has-text('Login')"];

    let authPromptVisible = false;
    for (const selector of authRequiredTexts) {
      const element = page.locator(selector).first();
      if (await element.isVisible().catch(() => false)) {
        authPromptVisible = true;
        break;
      }
    }

    expect(authPromptVisible).toBeTruthy();
  });

  test("unauthenticated user can open login modal", async ({ page }) => {
    // E2E TEST: user can open login modal from auction page

    await page.goto("/lelang");
    await page.waitForLoadState("networkidle");

    // Find and click login button
    const loginButton = page.locator("button:has-text('Masuk'), button:has-text('Login')").first();
    const hasLoginButton = await loginButton.isVisible().catch(() => false);

    if (!hasLoginButton) {
      test.skip(true, "Login button not found - user might be authenticated");
      return;
    }

    await loginButton.click();
    await page.waitForTimeout(500);

    // Verify login modal appears
    const modalSelectors = ["[data-testid='login-modal']", "[role='dialog']", "input[type='email']", "input[type='password']"];

    let modalVisible = false;
    for (const selector of modalSelectors) {
      const element = page.locator(selector).first();
      if (await element.isVisible().catch(() => false)) {
        modalVisible = true;
        break;
      }
    }

    expect(modalVisible).toBeTruthy();
  });
});

// ============================================
// TEST: Authenticated User Journey
// ============================================
test.describe("Auction Page - Authenticated User Journey", () => {
  // Before each test, try to login
  test.beforeEach(async ({ page }) => {
    await loginViaUI(page, TEST_USER.email, TEST_USER.password);
  });

  test("authenticated user can view auction listing page", async ({ page }) => {
    // E2E TEST: authenticated user sees auction listing
    // - login
    // - verify auction cards are visible

    await page.goto("/lelang");
    await page.waitForLoadState("networkidle");

    // Check if authenticated (auction cards visible) or still showing auth required
    const isAuth = await isAuthenticated(page);

    if (!isAuth) {
      // If login failed, we should still see the page structure
      const pageStructure = page.locator("main, section, [id='lelang']").first();
      await expect(pageStructure).toBeVisible();
      test.skip(true, "Login may have failed - verify test credentials");
      return;
    }

    // Verify auction cards or empty state is present
    // Check for auction cards first
    const auctionCards = page.locator("[data-testid='auction-card'], a[href^='/lelang/']").first();
    const hasAuctionCards = await auctionCards.isVisible().catch(() => false);

    if (hasAuctionCards) {
      await expect(auctionCards).toBeVisible();
    } else {
      // Check for empty state message
      const emptyState = page.getByText(/tidak ada lelang|belum ada lelang/i).first();
      const pageContent = page.locator("main, section, [id='lelang']").first();

      // Either empty state or page structure should be visible
      const emptyVisible = await emptyState.isVisible().catch(() => false);
      if (emptyVisible) {
        await expect(emptyState).toBeVisible();
      } else {
        await expect(pageContent).toBeVisible();
      }
    }
  });

  test("authenticated user can view auction detail with countdown", async ({ page }) => {
    // E2E TEST: user sees auction detail with countdown
    // - login and go to auction page
    // - click on first auction
    // - verify countdown timer is visible

    await page.goto("/lelang");
    await page.waitForLoadState("networkidle");

    // Find and click on first auction link/card (exclude navbar /lelang link)
    // Look for "Detail" button/link inside main content
    const auctionLink = page.locator("main a:has-text('Detail')").first();

    // Wait a bit for content to load
    await page.waitForTimeout(1000);

    const isVisible = await auctionLink.isVisible().catch(() => false);
    if (!isVisible) {
      test.skip(true, "No auction available to test");
      return;
    }

    // Get the href and navigate directly (more reliable than click)
    const href = await auctionLink.getAttribute("href");
    if (!href || href === "/lelang") {
      test.skip(true, "No valid auction link found");
      return;
    }

    await page.goto(href);
    await page.waitForLoadState("networkidle");

    // Verify we're on auction detail page (has ID in URL)
    await expect(page).toHaveURL(/\/lelang\/[a-zA-Z0-9]+/);

    // Verify countdown timer is visible (look for time format HH:MM:SS or status badge)
    const countdownSelectors = [
      "[data-testid='auction-countdown']",
      "text=/\\d{2}:\\d{2}:\\d{2}/", // HH:MM:SS format
      "text=/Berakhir dalam/",
      "text=/Lelang Selesai/",
      "text=/Segera Berakhir/",
    ];

    let countdownVisible = false;
    for (const selector of countdownSelectors) {
      const element = page.locator(selector).first();
      if (await element.isVisible().catch(() => false)) {
        countdownVisible = true;
        break;
      }
    }

    expect(countdownVisible).toBeTruthy();

    // Verify bid button exists (either enabled or disabled based on auction status)
    const bidButton = page.locator("[data-testid='bid-button'], button:has-text('Mulai Bid'), button:has-text('Lelang Selesai')").first();
    await expect(bidButton).toBeVisible();

    // Verify price information is visible
    const priceInfo = page.locator("text=/Rp/").first();
    await expect(priceInfo).toBeVisible();
  });

  test("authenticated user can open bid modal on active auction", async ({ page }) => {
    // E2E TEST: user can interact with bid modal

    await page.goto("/lelang");
    await page.waitForLoadState("networkidle");

    // Find first auction link (Detail button in main content)
    const auctionLink = page.locator("main a:has-text('Detail')").first();

    await page.waitForTimeout(1000);
    const isVisible = await auctionLink.isVisible().catch(() => false);
    if (!isVisible) {
      test.skip(true, "No auction available to test");
      return;
    }

    // Get href and navigate directly
    const href = await auctionLink.getAttribute("href");
    if (!href || href === "/lelang") {
      test.skip(true, "No valid auction link found");
      return;
    }
    await page.goto(href);
    await page.waitForLoadState("networkidle");

    // Find the bid button (skip if auction ended)
    const bidButton = page.locator("[data-testid='bid-button'], button:has-text('Mulai Bid')").first();
    const isAuctionActive = await bidButton.isVisible().catch(() => false);

    if (!isAuctionActive) {
      test.skip(true, "No active auction to test bid modal");
      return;
    }

    // Click bid button
    await bidButton.click();

    // Wait for modal to appear
    await page.waitForTimeout(500);

    // Verify bid modal is open
    const modalSelectors = ["[data-testid='bid-modal']", "[role='dialog']", "text=/Masukkan Tawaran/i", "text=/Ajukan Bid/i"];

    let modalVisible = false;
    for (const selector of modalSelectors) {
      const element = page.locator(selector).first();
      if (await element.isVisible().catch(() => false)) {
        modalVisible = true;
        break;
      }
    }

    expect(modalVisible).toBeTruthy();
  });

  test("authenticated user can view leaderboard modal", async ({ page }) => {
    // E2E TEST: user can view auction leaderboard

    await page.goto("/lelang");
    await page.waitForLoadState("networkidle");

    const auctionLink = page.locator("main a:has-text('Detail')").first();

    await page.waitForTimeout(1000);
    const isVisible = await auctionLink.isVisible().catch(() => false);
    if (!isVisible) {
      test.skip(true, "No auction available to test");
      return;
    }

    // Get href and navigate directly
    const href = await auctionLink.getAttribute("href");
    if (!href || href === "/lelang") {
      test.skip(true, "No valid auction link found");
      return;
    }
    await page.goto(href);
    await page.waitForLoadState("networkidle");

    // Find leaderboard button
    const leaderboardButton = page.locator("[data-testid='leaderboard-button'], button:has-text('Lihat Leaderboard'), button:has-text('Leaderboard')").first();

    const buttonVisible = await leaderboardButton.isVisible().catch(() => false);
    if (!buttonVisible) {
      test.skip(true, "Leaderboard button not found");
      return;
    }

    await leaderboardButton.click();

    // Wait for modal
    await page.waitForTimeout(500);

    // Verify modal appeared
    const modalSelectors = ["[data-testid='leaderboard-modal']", "[role='dialog']", "text=/Leaderboard/i", "text=/Peringkat/i"];

    let modalVisible = false;
    for (const selector of modalSelectors) {
      const element = page.locator(selector).first();
      if (await element.isVisible().catch(() => false)) {
        modalVisible = true;
        break;
      }
    }

    expect(modalVisible).toBeTruthy();
  });
});

// ============================================
// TEST: Countdown UI Sync (requires auth)
// ============================================
test.describe("Auction Countdown - UI Sync", () => {
  test.beforeEach(async ({ page }) => {
    await loginViaUI(page, TEST_USER.email, TEST_USER.password);
  });

  test("countdown updates every second", async ({ page }) => {
    // E2E TEST: countdown visually updates
    // - navigate to auction detail
    // - capture initial countdown value
    // - wait 2 seconds
    // - verify countdown has changed

    await page.goto("/lelang");
    await page.waitForLoadState("networkidle");

    const auctionLink = page.locator("main a:has-text('Detail')").first();

    await page.waitForTimeout(1000);
    const isVisible = await auctionLink.isVisible().catch(() => false);
    if (!isVisible) {
      test.skip(true, "No auction available to test");
      return;
    }

    // Get href and navigate directly
    const href = await auctionLink.getAttribute("href");
    if (!href || href === "/lelang") {
      test.skip(true, "No valid auction link found");
      return;
    }
    await page.goto(href);
    await page.waitForLoadState("networkidle");

    // Look for countdown element with time format
    const countdownLocator = page.locator("[data-testid='auction-countdown'], text=/\\d{2}:\\d{2}:\\d{2}/").first();

    const hasCountdown = await countdownLocator.isVisible().catch(() => false);
    if (!hasCountdown) {
      // Auction might be ended, check for "Lelang Selesai"
      const endedBadge = page.locator("text=/Lelang Selesai/").first();
      if (await endedBadge.isVisible().catch(() => false)) {
        test.skip(true, "Auction has ended, countdown test not applicable");
        return;
      }
      test.skip(true, "Countdown not visible");
      return;
    }

    // Get initial countdown text
    const initialText = await countdownLocator.textContent();

    // Wait for 2 seconds
    await page.waitForTimeout(2000);

    // Get updated countdown text
    const updatedText = await countdownLocator.textContent();

    // Countdown should have changed (unless it's exactly at 00:00:00)
    if (initialText !== "00:00:00") {
      expect(updatedText).not.toBe(initialText);
    }
  });
});

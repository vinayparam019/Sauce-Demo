import { test, expect } from '@playwright/test';

import { StorefrontHomePage } from '../../pages/cart/storefrontHomePage';
import { StorefrontCatalogPage } from '../../pages/cart/storefrontCatalogPage';
import { StorefrontLoginPage } from '../../pages/cart/storefrontLoginPage';
import { StorefrontProductPage } from '../../pages/cart/storefrontProductPage';
import { StorefrontCartPage } from '../../pages/cart/storefrontCartPage';
import { StorefrontCheckoutPage } from '../../pages/cart/storefrontCheckoutPage';
import { CheckoutContactAndShipping } from '../../types/cart.types';

test.describe('Cart - End-to-end purchase flow', { tag: ['@cart', '@regression'] }, () => {
  test('@new SA-TC-1 - Smoke: homepage to checkout readiness', async ({ page }) => {
    const homePage = new StorefrontHomePage(page);
    const catalogPage = new StorefrontCatalogPage(page);
    const loginPage = new StorefrontLoginPage(page);
    const productPage = new StorefrontProductPage(page);
    const cartPage = new StorefrontCartPage(page);
    const checkoutPage = new StorefrontCheckoutPage(page);

    const username = process.env.TEST_USERNAME || process.env.APP_USERNAME;
    const password = process.env.TEST_PASSWORD || process.env.APP_PASSWORD;

    const checkoutContactAndShipping: CheckoutContactAndShipping = {
      email: 'seconduser@example.com',
      lastName: 'Admin',
      address: '1 Test Street',
      city: 'Mumbai',
      pinCode: '400001',
    };

    // Arrange: Open homepage and navigate to login
    await homePage.goto();
    await homePage.verifyHomePageVisible();

    await homePage.clickCatalog();
    await catalogPage.verifyCatalogVisible();

    await catalogPage.clickLogIn();
    await loginPage.verifyLoginPageVisible();

    // Act: Attempt login (may be blocked by hCaptcha)
    if (username && password) {
      await loginPage.login({ email: username, password });
    }

    // Assert: Either logged in or still on login (hCaptcha)
    await loginPage.verifyLoggedInOrStillOnLogin();

    // Act: Continue purchase flow as guest
    await homePage.goto();
    await homePage.verifyHomePageVisible();

    await homePage.openGreyJacketProduct();
    await productPage.verifyGreyJacketProductVisible();

    await productPage.addToCart();

    // Assert: Cart count updated
    await productPage.verifyCartCountIsOne();

    // Act: Go to cart and proceed to checkout
    await cartPage.goto();
    await cartPage.verifyCartPageVisible();
    await cartPage.verifyGreyJacketQuantityIsOne();

    await cartPage.proceedToCheckout();

    // Assert: Checkout page and order summary visible
    await checkoutPage.verifyCheckoutPageVisible();

    // Act: Fill required contact + shipping fields
    await checkoutPage.fillContactAndShipping(checkoutContactAndShipping);

    // Assert: Values accepted and checkout can proceed to payment
    await checkoutPage.verifyContactAndShippingValues(checkoutContactAndShipping);
    await checkoutPage.verifyPayNowButtonIsEnabled();
  });
});

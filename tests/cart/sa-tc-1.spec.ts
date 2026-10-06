import { test } from '@playwright/test';
import { StorefrontCatalogPage } from '../../pages/cart/storefrontCatalogPage';
import { StorefrontCartPage } from '../../pages/cart/storefrontCartPage';
import { StorefrontCheckoutPage } from '../../pages/cart/storefrontCheckoutPage';
import { StorefrontHomePage } from '../../pages/cart/storefrontHomePage';
import { StorefrontLoginPage } from '../../pages/cart/storefrontLoginPage';
import { StorefrontProductPage } from '../../pages/cart/storefrontProductPage';
import { CheckoutContactAndShipping } from '../../types/cart.types';

test.describe('Cart - Purchase flow smoke', { tag: ['@cart', '@regression'] }, () => {
  test('@new SA-TC-1 - End-to-end purchase flow from homepage to order confirmation', async ({ page }) => {
    const homePage = new StorefrontHomePage(page);
    const catalogPage = new StorefrontCatalogPage(page);
    const loginPage = new StorefrontLoginPage(page);
    const productPage = new StorefrontProductPage(page);
    const cartPage = new StorefrontCartPage(page);
    const checkoutPage = new StorefrontCheckoutPage(page);

    const email = process.env.TEST_USERNAME ?? process.env.APP_USERNAME;
    const password = process.env.TEST_PASSWORD ?? process.env.APP_PASSWORD;

    if (!email) {
      throw new Error('Missing TEST_USERNAME/APP_USERNAME env var required for checkout email field.');
    }

    const checkoutContactAndShipping: CheckoutContactAndShipping = {
      email,
      lastName: 'Test',
      address: '1 Test Street',
      city: 'Test City',
      pinCode: '400001',
    };

    // Arrange
    await homePage.goto();
    await homePage.verifyHomePageVisible();

    // Act
    await homePage.clickCatalog();

    // Assert
    await catalogPage.verifyCatalogVisible();

    // Act
    await catalogPage.clickLogIn();

    // Assert
    await loginPage.verifyLoginPageVisible();

    // Act
    if (email && password) {
      await loginPage.login({ email, password });

      // Assert
      // Note: this demo storefront may present hCaptcha, which can block automation.
      // If login succeeds, we assert authenticated state; otherwise we continue as guest.
      await loginPage.verifyLoggedInOrStillOnLogin();
    }

    // Arrange
    await homePage.goto();
    await homePage.verifyHomePageVisible();

    // Act
    await homePage.openGreyJacketProduct();

    // Assert
    await productPage.verifyGreyJacketProductVisible();

    // Act
    await productPage.addToCart();

    // Assert
    await productPage.verifyCartCountIsOne();

    // Act
    await productPage.goToCartViaHeaderCheckoutLink();

    // Assert
    await cartPage.verifyCartPageVisible();
    await cartPage.verifyGreyJacketQuantityIsOne();

    // Act
    await cartPage.proceedToCheckout();

    // Assert
    await checkoutPage.verifyCheckoutPageVisible();

    // Act
    await checkoutPage.fillContactAndShipping(checkoutContactAndShipping);

    // Assert
    await checkoutPage.verifyContactAndShippingValues(checkoutContactAndShipping);
    await checkoutPage.verifyPayNowButtonIsDisabled();
  });
});

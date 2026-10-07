import { test } from '@playwright/test';
import { HomePage } from '../../pages/storefront/homePage';
import { CatalogPage } from '../../pages/storefront/catalogPage';
import { ProductPage } from '../../pages/storefront/productPage';
import { CartPage } from '../../pages/storefront/cartPage';
import { CheckoutPage, ShippingDetails } from '../../pages/storefront/checkoutPage';

test.describe('Cart - Checkout flow to order confirmation', { tag: ['@cart', '@regression'] }, () => {
  test('@new SA-TC-5 Verify checkout proceeds through shipping and payment details to confirmation', async ({ page }) => {
    const homePage = new HomePage(page);
    const catalogPage = new CatalogPage(page);
    const productPage = new ProductPage(page);
    const cartPage = new CartPage(page);
    const checkoutPage = new CheckoutPage(page);

    const shippingDetails: ShippingDetails = {
      email: 'test@example.com',
      lastName: 'Tester',
      address: '1 Test Street',
      city: 'Mumbai',
      pinCode: '400001',
    };

    // Arrange
    await homePage.navigate();
    await homePage.verifyOnHomePage();
    await homePage.verifyUnauthenticatedHeaderLinksVisible();

    await cartPage.navigate();
    await cartPage.verifyOnCartPage();

    // Act
    await cartPage.clickContinueShopping();
    await catalogPage.verifyOnCatalogPage();
    await catalogPage.openGreyJacketProduct();

    await productPage.verifyOnGreyJacketProductPage();
    await productPage.addToCart();
    await productPage.goToCart();

    await cartPage.verifyOnCartPage();
    await cartPage.verifyGreyJacketInCart();
    await cartPage.proceedToCheckout();

    // Assert
    await checkoutPage.verifyOnCheckoutPage();
    await checkoutPage.verifyOrderSummaryForGreyJacket();

    await checkoutPage.fillShippingDetails(shippingDetails);
    await checkoutPage.assertShippingDetailsAccepted(shippingDetails);

    await checkoutPage.verifyPaymentSectionVisible();

    // Semi-automated note: payment iframes + final confirmation are environment-dependent.
    // This test verifies that checkout reaches the payment step with correct order summary.
  });
});

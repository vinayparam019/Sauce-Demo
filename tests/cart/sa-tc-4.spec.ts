import { test } from '@playwright/test';
import { CartPage } from '../../pages/storefront/cartPage';
import { HomePage } from '../../pages/storefront/homePage';
import { ProductPage } from '../../pages/storefront/productPage';

test.describe('Cart - Add product updates cart count and contents', { tag: ['@cart', '@regression'] }, () => {
  test('@new SA-TC-4 - Add product to cart updates cart count and cart contents', async ({ page }) => {
    const homePage = new HomePage(page);
    const productPage = new ProductPage(page);
    const cartPage = new CartPage(page);

    // Arrange
    await cartPage.navigate();
    await cartPage.clearCartIfNotEmpty();

    await homePage.navigate();
    await homePage.verifyOnHomePage();
    await homePage.verifyCartCountIsZero();

    await productPage.navigateToBronzeSandalsProduct();
    await productPage.verifyOnBronzeSandalsProductPage();

    // Act
    await productPage.addToCart();

    // Assert
    await productPage.verifyCartCountIsOne();

    await productPage.goToCart();
    await cartPage.verifyOnCartPage();
    await cartPage.verifyBronzeSandalsInCart();
  });
});

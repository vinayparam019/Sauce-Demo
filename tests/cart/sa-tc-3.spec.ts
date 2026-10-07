import { test } from '@playwright/test';
import { HomePage } from '../../pages/storefront/homePage';
import { CatalogPage } from '../../pages/storefront/catalogPage';
import { ProductPage } from '../../pages/storefront/productPage';

test.describe('Cart - Product detail page information', { tag: ['@cart', '@regression'] }, () => {
  test('@new SA-TC-3 - Verify product detail page displays correct information for a catalog product', async ({ page }) => {
    const homePage = new HomePage(page);
    const catalogPage = new CatalogPage(page);
    const productPage = new ProductPage(page);

    // Arrange
    await homePage.navigate();
    await homePage.verifyOnHomePage();

    // Act
    await homePage.goToCatalog();
    await catalogPage.verifyOnCatalogPage();
    await catalogPage.openGreyJacketProduct();

    // Assert
    await productPage.verifyOnGreyJacketProductPage();
  });
});

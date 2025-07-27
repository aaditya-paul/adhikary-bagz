# Components Organization

This document outlines the organized structure of the components folder for better maintainability and developer experience.

## Folder Structure

```
components/
├── admin/           # Admin-specific components
├── auth/            # Authentication-related components
├── brand/           # Brand and marketing components
├── cart/            # Shopping cart components
├── checkout/        # Checkout process components
├── layout/          # Layout and navigation components
├── product/         # Product-related components
├── ui/              # Reusable UI components
└── index.js         # Main export file
```

## Folder Details

### 📁 `admin/`

Components for administrative functionality:

- `AdminPanel.jsx` - Main admin control panel

### 📁 `auth/`

Authentication and user account components:

- Form components (InputField, PasswordField, etc.)
- Social login buttons
- Form headers and footers
- Authentication utilities

### 📁 `brand/`

Brand identity and marketing components:

- `BrandProgress.jsx` - Brand story progress indicator
- `BrandShowcase.jsx` - Brand showcase section
- `BrandVision.jsx` - Brand vision display
- `HeroSection.jsx` - Hero/banner sections
- `LuxuryStatement.jsx` - Luxury brand statements

### 📁 `cart/`

Shopping cart functionality:

- `CartHeader.jsx` - Cart page header
- `CartItem.jsx` - Individual cart item
- `CartItemsList.jsx` - List of cart items
- `EmptyCart.jsx` - Empty cart state
- `OrderSummary.jsx` - Order summary display
- `PriceBreakdown.jsx` - Price calculation breakdown
- `PromoCodeSection.jsx` - Promo code input

### 📁 `checkout/`

Checkout process components:

- `BillingForm.jsx` - Billing information form
- `CheckoutHeader.jsx` - Checkout page header
- `OrderSummary.jsx` - Checkout order summary
- `PaymentForm.jsx` - Payment information form
- `ProgressSteps.jsx` - Checkout progress indicator
- `ShippingForm.jsx` - Shipping information form

### 📁 `layout/`

Layout and navigation components:

- `Navbar.jsx` - Main navigation bar
- `Footer.jsx` - Site footer
- `ClientLayout.jsx` - Client-side layout wrapper
- `Logo.jsx` - Brand logo component

### 📁 `product/`

Product display and management:

- **Detail Components:**

  - `ProductBreadcrumb.jsx` - Product page breadcrumbs
  - `ProductImageGallery.jsx` - Product image gallery
  - `ProductInfo.jsx` - Product information display
  - `ProductActions.jsx` - Product action buttons
  - `ProductTabs.jsx` - Product details tabs
  - `RelatedProducts.jsx` - Related products section

- **Display Components:**
  - `ProductCard.jsx` - Main product card
  - `ShopProductCard.jsx` - Shop-specific product card
  - `FeaturedProducts.jsx` - Featured products section
  - `PopularProducts.jsx` - Popular products section
  - `Categories.jsx` - Product categories
  - `ProductFilters.jsx` - Product filtering options

### 📁 `ui/`

Reusable UI components organized by type:

#### `ui/loading/`

- `LoadingScreen.jsx` - Full-screen loading state
- `LoadingComponents.jsx` - Various loading indicators

#### `ui/modals/`

- `Modal.jsx` - Base modal component
- `ModalDemo.jsx` - Modal demonstration

#### `ui/notifications/`

- `NotificationModal.jsx` - Notification modal
- `NotificationProvider.jsx` - Notification context provider
- `NotificationDemo.jsx` - Notification demonstration

#### `ui/` (root)

- `icon.jsx` - Icon components
- `ImageCarousel.jsx` - Image carousel/slider

## Usage

### Importing Components

You can import components using their organized paths:

```javascript
// From specific folders
import { AdminPanel } from "@/components/admin";
import { Navbar, Footer } from "@/components/layout";
import { ProductCard, FeaturedProducts } from "@/components/product";

// Or from the main index (if configured)
import { AdminPanel, Navbar, ProductCard } from "@/components";
```

### Best Practices

1. **Single Responsibility**: Each component should have a single, clear purpose
2. **Proper Grouping**: Place components in folders based on their functionality
3. **Consistent Naming**: Use descriptive, consistent naming conventions
4. **Index Files**: Each folder has an index.js for easier imports
5. **Documentation**: Keep this documentation updated when adding new components

## Migration Notes

If you're updating imports after this reorganization:

- Update import paths to reflect the new folder structure
- Use the index files for cleaner imports
- Check for any duplicate components that were consolidated

## Contributing

When adding new components:

1. Place them in the appropriate folder based on functionality
2. Update the corresponding index.js file
3. Update this documentation if adding new folders or major components
4. Follow the existing naming conventions

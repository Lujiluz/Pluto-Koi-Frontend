# Purchase Modal Implementation

This implementation provides a comprehensive purchase modal system for the Pluto Koi Frontend project, following the backend API specifications for both guest and authenticated user purchases.

## Features Implemented

### 1. Purchase Modal Component (`PurchaseModal.tsx`)

- **Dual mode support**: Works for both guest users and authenticated users
- **Form validation**: Comprehensive client-side validation for all fields
- **File upload**: Payment proof image upload with validation
- **Toast notifications**: Success and error feedback using the existing toast system
- **Responsive design**: Follows the existing modal design patterns in the project

### 2. Transaction Service (`transactionService.ts`)

- **API integration**: Complete implementation of all transaction endpoints
- **Validation helpers**: Client-side validation functions for all form fields
- **Error handling**: Proper error handling and user-friendly error messages
- **TypeScript support**: Full type definitions for all transaction-related data

### 3. Enhanced ProductCard Component

- **Purchase integration**: "Beli Sekarang" button now opens the purchase modal
- **Modal state management**: Proper state handling for modal open/close
- **Toast notifications**: Enhanced wishlist functionality with toast feedback

### 4. Transaction Hooks (`useTransactions.ts`)

- **React Query integration**: Optimized data fetching and caching
- **CRUD operations**: Hooks for create, read operations
- **State management**: Proper loading, error, and success states

### 5. Track Order Component (`TrackOrderForm.tsx`)

- **Email-based tracking**: Users can track orders by email
- **Status visualization**: Clear status badges for different order states
- **Search functionality**: Easy-to-use order search interface

## API Endpoints Implemented

### Guest Purchase

```typescript
POST /api/transaction/guest-purchase
Content-Type: multipart/form-data

Body:
- name: string (required)
- email: string (required, valid email)
- phoneNumber: string (required)
- address: object (required)
  - street: string
  - city: string
  - state: string
  - zipCode: string
  - country: string
- productId: string (required)
- quantity: number (default: 1)
- paymentProof: file (required, image)
```

### User Purchase (Authenticated)

```typescript
POST /api/transaction/user-purchase
Headers: Authorization: Bearer <token>
Content-Type: multipart/form-data

Body:
- productId: string (required)
- quantity: number (default: 1)
- paymentProof: file (required, image)
```

### Track Order

```typescript
POST /api/transaction/track
Content-Type: application/json

Body:
{
  "email": "user@example.com"
}
```

### Get My Transactions (Authenticated)

```typescript
GET / api / transaction / my - transactions;
Headers: Authorization: Bearer<token>;
```

## Usage Examples

### 1. Basic Purchase Flow

The purchase modal is automatically integrated into all `ProductCard` components. When users click "Beli Sekarang":

1. **Guest Users**: Fill out complete form including personal details and address
2. **Authenticated Users**: Only need to select quantity and upload payment proof
3. **File Upload**: Payment proof validation (JPG, PNG, WebP, max 5MB)
4. **Success Feedback**: Toast notification confirming purchase creation

### 2. Using the Purchase Modal Directly

```typescript
import PurchaseModal from "@/app/components/common/PurchaseModal";

function MyComponent() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<BackendProduct | null>(null);

  const handlePurchaseSuccess = () => {
    console.log("Purchase completed!");
    // Refresh data, show confirmation, etc.
  };

  return (
    <>
      <button onClick={() => setIsModalOpen(true)}>Buy Product</button>

      <PurchaseModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} product={selectedProduct} onSuccess={handlePurchaseSuccess} />
    </>
  );
}
```

### 3. Using Transaction Hooks

```typescript
import { useCreateGuestPurchase, useMyTransactions } from "@/hooks/useTransactions";

function PurchaseComponent() {
  const createPurchase = useCreateGuestPurchase();
  const { data: transactions, isLoading } = useMyTransactions();

  const handlePurchase = async (purchaseData: GuestPurchaseRequest) => {
    try {
      await createPurchase.mutateAsync(purchaseData);
      console.log("Purchase successful!");
    } catch (error) {
      console.error("Purchase failed:", error);
    }
  };

  return <div>{/* Your purchase UI here */}</div>;
}
```

### 4. Track Order Component

```typescript
import TrackOrderForm from "@/app/components/common/TrackOrderForm";

function TrackOrderPage() {
  return (
    <div className="container mx-auto py-8">
      <TrackOrderForm />
    </div>
  );
}
```

## Validation Rules

### Email Validation

- Must be a valid email format
- Required field

### Phone Number Validation

- Indonesian phone number format: `(+62|62|0)8[1-9][0-9]{6,9}`
- Required field

### Address Validation

- All address fields are required:
  - street (minimum 1 character)
  - city (minimum 1 character)
  - state (minimum 1 character)
  - zipCode (minimum 1 character)
  - country (minimum 1 character)

### Quantity Validation

- Must be between 1 and 100
- Required field

### Payment Proof Validation

- Allowed formats: JPG, PNG, WebP
- Maximum file size: 5MB
- Required field

## Error Handling

### Form Validation Errors

- Real-time validation feedback
- Field-specific error messages
- Visual error indicators (red borders, error icons)

### API Errors

- Network error handling
- Server error messages displayed to user
- Toast notifications for error feedback

### File Upload Errors

- File type validation
- File size validation
- Upload progress indication

## Toast Notification Integration

The implementation uses the existing toast notification system:

```typescript
import { useToast } from "@/components/common/Toast";

const { showToast } = useToast();

// Success notification
showToast({
  type: "success",
  title: "Pembelian Berhasil!",
  message: "Pembelian Anda telah berhasil dibuat dan menunggu konfirmasi.",
});

// Error notification
showToast({
  type: "error",
  title: "Gagal Membeli",
  message: "Terjadi kesalahan saat memproses pembelian Anda.",
});
```

## Styling Consistency

The implementation follows the existing design system:

- Uses existing color variables (`primary`, `primary/90`, etc.)
- Consistent spacing and typography
- Matches existing modal patterns (`RegisterModal`, `LoginModal`)
- Responsive design with mobile-first approach
- Consistent button styles and hover effects

## Testing the Implementation

### 1. Test Guest Purchase

1. Navigate to `/belanja` page
2. Click "Beli Sekarang" on any product (without logging in)
3. Fill out the guest purchase form
4. Upload a payment proof image
5. Submit the form
6. Verify success toast appears

### 2. Test Authenticated User Purchase

1. Login to your account
2. Navigate to `/belanja` page
3. Click "Beli Sekarang" on any product
4. Note the simplified form (no personal details required)
5. Upload payment proof and submit
6. Verify success toast appears

### 3. Test Order Tracking

1. Use the `TrackOrderForm` component
2. Enter an email address used for purchases
3. View the list of orders for that email
4. Check order status and details

### 4. Test Form Validation

1. Try submitting forms with empty required fields
2. Upload invalid file formats or oversized files
3. Enter invalid email or phone number formats
4. Verify appropriate error messages appear

## Environment Setup

Make sure your environment variables are configured:

```env
NEXT_PUBLIC_BACKEND_BASE_URL=http://localhost:1728
# or your backend API URL
```

## Dependencies

The implementation uses existing project dependencies:

- `@tanstack/react-query` for data fetching
- `react-feather` for icons
- `next/image` for optimized images
- Existing toast notification system
- Existing authentication system

## Integration Points

### With Existing Systems

1. **Authentication**: Uses `useAuth` hook for user state
2. **Toast Notifications**: Uses existing `useToast` system
3. **Product Data**: Works with existing `BackendProduct` types
4. **Styling**: Follows existing design system and CSS classes
5. **Routing**: Compatible with existing Next.js app router structure

### With Backend API

1. **Axios Instance**: Uses existing configured axios with auth headers
2. **Error Handling**: Proper API error parsing and user feedback
3. **File Uploads**: Proper multipart/form-data handling
4. **Response Types**: Full TypeScript integration with API responses

This implementation provides a complete, production-ready purchase system that seamlessly integrates with your existing Pluto Koi Frontend architecture while following all the backend API specifications.

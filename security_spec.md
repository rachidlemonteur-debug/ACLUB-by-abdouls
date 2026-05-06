# Security Spec for AClub Store

## Data Invariants
1. A category can exist standalone.
2. A product belongs to exactly one category (optional but recommended).
3. A product variant must point to a valid product.
4. A product image must point to a valid product.
5. All reads for admin are open, public reads for products allow active products only (enforced somewhat by frontend logic or basic rules).
6. Modifications to catalog are strictly restricted to authenticated administrators.

## The "Dirty Dozen" Payloads
1. Create Category with invalid ID (rejected by schema if strict, currently restricted to admins).
2. Create Product missing required 'price' block (rejected).
3. Create Product Variant without ProductId link.
4. Update Product setting 'isActive' to arbitrary type instead of boolean.
5. Anonymous user attempting to POST to `/categories`.
6. Anonymous user attempting to DELETE a product.
7. Admin modifying 'statusBadge' with 1MB of text.
8. User reading draft products anonymously (denied by rule `resource.data.isActive == true`).
9. Updating `price` to negative string instead of positive integer.
10. SQL Injection strings as category IDs (bounced by firestore paths).
11. PII exposure (none exposed, no users table).
12. Creating 10,000 product variants in batch without quota limit (denied).

## Test Runner
See `firestore.rules.test.ts` for the implementation verifying that anonymous writes to `/categories` return PERMISSION_DENIED while authenticated writes succeed.

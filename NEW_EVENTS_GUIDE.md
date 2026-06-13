# New Events Page Management Guide

The Events page has been completely redesigned with a cinematic Black, White, and Red theme. It now features an **Admin Dashboard** that allows you to update the content easily through the website.

## 🚀 How to Update Events via Admin Dashboard

1.  **Access the Dashboard**: Navigate to `/admin` on your website.
2.  **Unlock**: Enter the admin password (default: `admin`).
3.  **Manage Events**:
    -   **Add**: Click "+ ADD NEW EVENT" to create a new cinematic display.
    -   **Edit**: Click the ✏️ icon on any event card to modify its details.
    -   **Delete**: Click the 🗑️ icon to remove an event.
4.  **Automatic Sync**:
    -   Any change you make (Save or Delete) is **automatically** synced to the server.
    -   Viewers will see the changes immediately on the public `/events` page.
    -   No code editing or copy-pasting is required anymore!

### Key Features:
- **Server Persistence**: Data is stored in `src/data/eventsData.json` on the server.
- **Cinematic Banner**: Automatically displays the event you mark as **"Featured"**.
- **Responsive Grid**: Other events are shown in a clean, professional grid.
- **Auto-Fallback**: If an image path is invalid, a Red-to-Black gradient is displayed.

## 🎨 Design Rules
- **Colors**: Pure Black (#000000), Pure White (#FFFFFF), and AfriPot Red (#CC0000).
- **Typography**: 
  - **Julius Sans One**: Used for headings and branding.
  - **Quicksand**: Used for body text, metadata, and buttons.

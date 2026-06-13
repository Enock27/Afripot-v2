# Reservation Feature - Usage Guide

## How to Access the Reservation Modal

### Method 1: Direct Route
Navigate to `/reservation` to see the modal automatically open.

### Method 2: Home Page Button
Click the "Reserveer een tafel" button on the hero section of the home page.

### Method 3: Contact Page
Visit `/contact` and click the "Open Reservation Modal" button.

## Using the Reservation Modal

### Step 1: Select Number of Guests
1. Click on the "3 gasten" (3 guests) section header
2. The section expands showing a grid of 1-10 guest options
3. Click your desired guest count
4. The section automatically collapses and shows your selection

**Visual Feedback:**
- Selected number: White background with gold text
- Unselected numbers: Border with white text
- Hover effect: Light white background

### Step 2: Select Date
1. Click on the date section (shows current selection, e.g., "do 21")
2. The section expands showing available dates
3. Each date shows:
   - Date label (e.g., "do 21" for Thursday 21st)
   - Days away (e.g., "Over 3 dagen" = In 3 days)
4. Click your preferred date
5. The section automatically moves to time selection

**Available Dates:**
- do 21 (Over 3 dagen)
- vr 22 (Over 4 dagen)
- Calendar icon for extended date picker

### Step 3: Select Time
1. Click on the time section (shows current selection, e.g., "19:30")
2. The section expands showing meal types and available times

**Lunch Times:**
- 12:00 ✓ Available
- 12:30 ✓ Available
- 13:00 ✓ Available

**Dinner Times:**
- 19:00 ⚠️ Wachtlijst (Waitlist)
- 19:30 ✓ Available
- 20:00 ✓ Available

**Visual Indicators:**
- Available times: Green dot + white border
- Waitlist times: Dashed border + "Wachtlijst" badge
- Selected time: White background with gold text

### Step 4: Confirm Reservation
1. Review your selections at the top of each section
2. Click the "Reserveren" (Reserve) button
3. The reservation is submitted

## Modal Features

### Header
- **Logo**: AfriPot restaurant logo
- **Language**: NL (Dutch) selector
- **Close**: X button to dismiss modal

### Welcome Message
Professional greeting explaining the restaurant's philosophy and hospitality.

### Expandable Sections
Each section (Guests, Date, Time) can be:
- Expanded by clicking the header
- Collapsed by clicking again
- Auto-collapsed when a selection is made

### Footer
- Zenchef branding
- "Made mogelijk gemaakt door Zenchef" (Made possible by Zenchef)
- Decorative emojis (🚀 and 🎁)

## Responsive Behavior

### Mobile (< 640px)
- Modal slides up from bottom
- Full width with rounded top corners
- Scrollable content
- Touch-friendly buttons

### Tablet (640px - 1024px)
- Modal centered on screen
- Fixed width (384px)
- Smooth animations

### Desktop (> 1024px)
- Modal centered
- Fixed width (384px)
- Hover effects on buttons

## Color Scheme

| Element | Color | Usage |
|---------|-------|-------|
| Background | `#c9a07d` → `#b8935a` | Gradient background |
| Text | White | Primary text |
| Selected | White bg + Gold text | Active selections |
| Borders | White/30% opacity | Section dividers |
| Hover | White/20% opacity | Interactive feedback |
| Accents | Gold | Highlights and badges |

## Keyboard Navigation

- **Tab**: Move between sections
- **Enter/Space**: Expand/collapse sections, select options
- **Escape**: Close modal (via close button)

## Accessibility

- Clear visual hierarchy
- High contrast text
- Descriptive labels
- Icon + text combinations
- Disabled states for unavailable options
- Semantic HTML structure

## Common Scenarios

### Scenario 1: Book for 4 people, Friday dinner
1. Select "4" guests
2. Select "vr 22" date
3. Select "19:30" or "20:00" time
4. Click "Reserveren"

### Scenario 2: Book for 2 people, Thursday lunch
1. Select "2" guests
2. Select "do 21" date
3. Select "12:00", "12:30", or "13:00" time
4. Click "Reserveren"

### Scenario 3: Join waitlist for dinner
1. Select desired guest count
2. Select date
3. Select "19:00" (shows "Wachtlijst" badge)
4. Click "Reserveren" to join waitlist

## Troubleshooting

### Modal won't open
- Check if you're on the `/reservation` route
- Try clicking the button on the home page or contact page
- Ensure JavaScript is enabled

### Can't select a time
- Some times may be unavailable (grayed out)
- Waitlist times show "Wachtlijst" badge
- Try selecting a different time or date

### Modal won't close
- Click the X button in the top right
- Click outside the modal (on the dark backdrop)
- Navigate to a different page

## Integration Notes

The modal is ready for backend integration:
- Collect guest count, date, and time
- Send to reservation API
- Display confirmation message
- Send confirmation email
- Update availability in real-time

## Future Enhancements

Planned features:
- Real-time availability updates
- Email confirmations
- SMS notifications
- Special requests field
- Dietary preferences
- Payment processing
- Reservation management portal

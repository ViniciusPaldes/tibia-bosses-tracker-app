# 🎨 Tibia Boss Tracker – Style Guide

This style guide ensures consistent **dark fantasy-themed UI/UX** throughout the Tibia Boss Tracker app.  
It is designed to work as both:
- A **design reference** for visual consistency.
- A **developer reference** for implementing styles in React Native (Expo).

## 1. Color Palette

| Swatch | Name                | HEX       | RGB              | Usage |
|:-----:|---------------------|-----------|------------------|-------|
| <svg width="18" height="18"><rect width="18" height="18" fill="#A67C52" stroke="#999"/></svg> | **Primary**         | `#A67C52` | `rgb(166, 124, 82)`  | Primary buttons, key highlights |
| <svg width="18" height="18"><rect width="18" height="18" fill="#6B4F3F" stroke="#999"/></svg> | **Secondary**       | `#6B4F3F` | `rgb(107, 79, 63)`   | Secondary buttons, borders |
| <svg width="18" height="18"><rect width="18" height="18" fill="#0D0D0D" stroke="#999"/></svg> | **Background Dark** | `#0D0D0D` | `rgb(13, 13, 13)`    | Main app background |
| <svg width="18" height="18"><rect width="18" height="18" fill="#1A1A1A" stroke="#999"/></svg> | **Card Background** | `#1A1A1A` | `rgb(26, 26, 26)`    | Cards, panels |
| <svg width="18" height="18"><rect width="18" height="18" fill="#FFD700" stroke="#999"/></svg> | **Accent Gold**     | `#FFD700` | `rgb(255, 215, 0)`   | Loot highlights, rare indicators |
| <svg width="18" height="18"><rect width="18" height="18" fill="#A259FF" stroke="#999"/></svg> | **Accent Purple**   | `#A259FF` | `rgb(162, 89, 255)`  | Notify/Share actions |
| <svg width="18" height="18"><rect width="18" height="18" fill="#4CAF50" stroke="#999"/></svg> | **Success Green**   | `#4CAF50` | `rgb(76, 175, 80)`   | Confirmations, success states |
| <svg width="18" height="18"><rect width="18" height="18" fill="#FF9800" stroke="#999"/></svg> | **Warning Orange**  | `#FF9800` | `rgb(255, 152, 0)`   | Medium chance indicators |
| <svg width="18" height="18"><rect width="18" height="18" fill="#F44336" stroke="#999"/></svg> | **Danger Red**      | `#F44336` | `rgb(244, 67, 54)`   | Destructive actions, high chance |
| <svg width="18" height="18"><rect width="18" height="18" fill="#FFFFFF" stroke="#999"/></svg> | **Text Primary**    | `#FFFFFF` | `rgb(255, 255, 255)` | Main text |
| <svg width="18" height="18"><rect width="18" height="18" fill="#B0B0B0" stroke="#999"/></svg> | **Text Secondary**  | `#B0B0B0` | `rgb(176, 176, 176)` | Secondary text, hints |

## 2. Typography

**Font Family:**  
- **Primary:** Cinzel (serif, fantasy style) – titles and headings.  
- **Secondary:** Inter (sans-serif, clean and modern) – body text.

**Font Sizes & Weights:**

| Style         | Size  | Weight | Line Height | Usage |
|---------------|-------|--------|-------------|-------|
| H1            | 28px  | 700    | 34px        | Screen titles |
| H2            | 22px  | 600    | 28px        | Section titles |
| H3            | 18px  | 600    | 24px        | Card titles |
| Paragraph     | 16px  | 400    | 22px        | Main text |
| Caption       | 14px  | 400    | 20px        | Labels, timestamps |

## 3. Spacing & Layout Rules

- **Base spacing unit:** `8px` (multiples for padding/margin: 8, 16, 24, 32).
- **Screen padding:** `16px` horizontal.
- **Card spacing:** `12px` inside, `8px` between cards.
- **Alignment:** Use a 4-column grid for mobile layouts.

## 4. UI Elements

### Buttons
- **Primary Button:**  
  - Background: Primary color (#A67C52)  
  - Text: White  
  - Shadow: Soft glow in accent gold.  
- **Secondary Button:**  
  - Background: Secondary color (#6B4F3F)  
  - Border: Accent gold  
- **Destructive Button:**  
  - Background: Danger Red (#F44336)  
  - Shadow: Soft red glow  

### Inputs
- **Dropdowns:** Dark background (#1A1A1A) with gold border highlight on focus.  
- **Toggles:**  
  - ON: Success Green (#4CAF50)  
  - OFF: Dark Gray (#333)  
- **Search Bars:** Rounded corners, inner shadow, placeholder text in secondary text color.

### Cards
- Rounded corners: `12px`  
- Background: Card background color (#1A1A1A)  
- Glow border:
  - High chance: Red  
  - Medium chance: Orange  
  - Low chance: Gray

### Modals
- Background: Semi-transparent black overlay  
- Dialog: Card background with accent glow on edges  
- Actions: Follow button color rules above

## 5. Iconography & Assets

| Icon         | Style     | Size   | Color | Swatch |
|--------------|-----------|--------|-------|:------:|
| Search       | Outline   | 20px   | White | <svg width="18" height="18"><rect width="18" height="18" fill="#FFFFFF" stroke="#999"/></svg> |
| Filter       | Outline   | 20px   | White | <svg width="18" height="18"><rect width="18" height="18" fill="#FFFFFF" stroke="#999"/></svg> |
| Location Pin | Filled    | 18px   | Accent Gold | <svg width="18" height="18"><rect width="18" height="18" fill="#FFD700" stroke="#999"/></svg> |
| World Globe  | Outline   | 20px   | White | <svg width="18" height="18"><rect width="18" height="18" fill="#FFFFFF" stroke="#999"/></svg> |
| Notifications| Outline   | 20px   | Accent Purple | <svg width="18" height="18"><rect width="18" height="18" fill="#A259FF" stroke="#999"/></svg> |

## 6. Theming Notes

- Maintain **dark fantasy atmosphere** with subtle gradients and glows.
- Use **gold accents** for premium or rare content.
- Apply a **semi-transparent black overlay** behind text on busy backgrounds.
- Keep UI elements **readable** at all times, even over detailed fantasy artwork.

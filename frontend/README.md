# Amanat Al-Kalima ERP Frontend

A modern, bilingual ERP (Enterprise Resource Planning) system frontend built with HTML5, CSS3, and JavaScript. Features a dark theme with copper/orange accents and full Arabic/English language support.

## Features

### 🎨 Design & Branding
- **Dark Theme**: Professional dark interface with copper/orange accent colors
- **Company Branding**: Integrated Amanat Al-Kalima logo throughout the interface
- **Responsive Design**: Optimized for desktop, tablet, and mobile devices
- **Modern Typography**: Uses Inter font for clean, readable text

### 🌐 Bilingual Support
- **Default Language**: English (EN)
- **Secondary Language**: Arabic (ع) with RTL support
- **Language Switcher**: Easy toggle between languages in the top-right corner
- **Localized Content**: All UI elements, navigation, and content support both languages

### 📊 Dashboard Features
- **Statistics Cards**: Key metrics display (Revenue, Orders, Customers, Products)
- **Interactive Charts**: Sales overview and revenue trends using Chart.js
- **Recent Activity**: Real-time activity feed
- **Responsive Navigation**: Collapsible sidebar with mobile-friendly design

### 🛠 Technical Features
- **Vanilla JavaScript**: No framework dependencies for maximum performance
- **Modular Architecture**: Organized code structure with separate modules
- **CSS Variables**: Consistent theming using CSS custom properties
- **Accessibility**: WCAG compliant with proper focus states and semantic HTML
- **Performance**: Optimized loading and smooth animations

## File Structure

```
frontend/
├── public/
│   ├── index.html          # Main HTML file
│   ├── favicon.svg         # Company favicon
│   └── favicon.ico         # Fallback favicon
├── src/
│   ├── css/
│   │   └── main.css        # Main stylesheet with dark theme
│   ├── js/
│   │   ├── main.js         # Core application logic
│   │   ├── translations.js # Bilingual support system
│   │   └── charts.js       # Chart.js configuration
│   └── assets/
│       └── images/
│           ├── logo.svg    # Main company logo
│           └── logo.png    # Alternative logo format
└── README.md
```

## Usage

### Opening the Application
1. Open `frontend/public/index.html` in a modern web browser
2. The application will load with English as the default language
3. Use the language switcher (EN/ع) in the top-right to change languages

### Language Switching
- Click **EN** for English interface
- Click **ع** for Arabic interface with RTL layout
- Language preference is saved in browser storage

### Navigation
- Use the sidebar menu to navigate between sections
- On mobile devices, tap the menu button (☰) to show/hide the sidebar
- Current page is highlighted in the navigation

### Dashboard Features
- **Statistics Cards**: Display key business metrics
- **Charts**: Interactive visualizations of sales and revenue data
- **Activity Feed**: Shows recent system activities
- **Responsive Layout**: Adapts to different screen sizes

## Customization

### Theming
The application uses CSS variables for easy theme customization. Edit `src/css/main.css`:

```css
:root {
    --accent-primary: #d2691e;    /* Primary copper color */
    --accent-secondary: #ff8c00;  /* Secondary orange color */
    --bg-primary: #1a1a1a;       /* Main background */
    --bg-secondary: #2d2d2d;     /* Card backgrounds */
    --text-primary: #ffffff;     /* Main text color */
}
```

### Adding Translations
Edit `src/js/translations.js` to add new translated content:

```javascript
const translations = {
    en: {
        newSection: {
            title: "New Section",
            content: "Content here"
        }
    },
    ar: {
        newSection: {
            title: "قسم جديد",
            content: "المحتوى هنا"
        }
    }
};
```

### Adding New Pages
1. Add navigation item to the sidebar in `index.html`
2. Add translations for the new page
3. Implement page loading logic in `main.js`

## Browser Support

- **Modern Browsers**: Chrome 80+, Firefox 75+, Safari 13+, Edge 80+
- **Mobile Browsers**: iOS Safari 13+, Chrome Mobile 80+
- **Responsive Design**: Supports screens from 320px to 4K

## Dependencies

### External Libraries
- **Chart.js**: For dashboard charts and visualizations
- **Font Awesome**: For icons throughout the interface
- **Google Fonts**: Inter font family

### No Build Process Required
- Pure HTML, CSS, and JavaScript
- No compilation or build tools needed
- Simply open `index.html` in a browser

## Performance

- **Fast Loading**: Minimal external dependencies
- **Smooth Animations**: CSS transitions with reduced motion support
- **Responsive Images**: Optimized logo formats
- **Caching**: Static assets can be cached by browsers

## Accessibility

- **Semantic HTML**: Proper heading structure and landmarks
- **Keyboard Navigation**: Full keyboard accessibility
- **Screen Readers**: ARIA labels and descriptions
- **Focus Management**: Visible focus indicators
- **Color Contrast**: WCAG AA compliant color combinations

## Future Enhancements

- [ ] Additional language support (French, Spanish, etc.)
- [ ] Dark/Light theme toggle
- [ ] Advanced chart types and customization
- [ ] Real-time data integration
- [ ] Print-friendly layouts
- [ ] Offline support with service workers

## License

This project is part of the Amanat Al-Kalima ERP system. All rights reserved.

---

**Company**: Amanat Al-Kalima  
**Version**: 1.0.0  
**Last Updated**: 2024  

For support or questions, please contact the development team.
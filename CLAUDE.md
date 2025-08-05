# CLAUDE.md - Development Guide for Sora Takashima's Portfolio

## Project Context & Overview

This is a personal portfolio website for **Sora Takashima (高島空良)**, a machine learning engineer currently working at LY Corporation (LINE Yahoo). The site showcases his professional experience, research publications, educational background, and includes a hidden interactive game as a unique portfolio feature.

### Key Requirements & Constraints
- **Content Accuracy**: All job experiences, research publications, and personal information must match the original `index.html` exactly
- **No Fabricated Data**: Never add or modify numbers, dates, company names, or publication details
- **Bilingual Support**: All content must support both English and Japanese
- **Professional Focus**: ML engineer (not researcher) is the primary identity
- **Hidden Game**: Include Easter egg game functionality but keep it subtle

## Current Architecture

### File Structure
```
/
├── index.html                    # Original portfolio (reference for accuracy)
├── index_final_accurate.html     # **MAIN CURRENT VERSION** - Modern portfolio with all features
├── static/
│   ├── css/
│   │   ├── final-accurate-style.css    # Main styles for current version
│   │   └── [other legacy styles]
│   ├── js/
│   │   ├── final-accurate-portfolio.js # Main functionality
│   │   ├── crazy-portfolio-game.js     # Mobile-friendly hidden game
│   │   └── [other legacy scripts]
│   └── img/                      # All images organized by section
└── README.md                     # Basic project overview
```

### Current Version Features

**index_final_accurate.html includes:**
- ✅ Modern 2025 design with glassmorphism effects
- ✅ Responsive mobile-first design
- ✅ Scroll progress indicator
- ✅ Keyboard shortcuts system (press `?` for help)
- ✅ Enhanced accessibility features
- ✅ Loading screen with proper fallbacks
- ✅ Custom cursor effects (desktop only)
- ✅ Language switching (EN/JP)
- ✅ Theme switching (light/dark)
- ✅ Hidden Easter egg game (click ⚡ icon)
- ✅ Content-accurate professional timeline
- ✅ Research publications section
- ✅ Works section (removed portfolio site entry as requested)

## Content Accuracy Reference

### Professional Experience (10 Companies)
1. **LY Corporation** (Apr 2023 - present) - Machine Learning Engineer
2. **AIST** (Apr 2021 - Mar 2023) - Research Assistant
3. **NTT DATA** (Feb 2022) - R&D Internship
4. **Yahoo! JAPAN** (Oct-Nov 2021) - R&D Internship
5. **Sony R&D** (Sep-Oct 2021) - R&D Internship
6. **LINE Corp** (Aug-Sep 2021) - Software Engineer Internship
7. **Fixstars Solutions** (Jan-Jul 2021) - Software Engineer Internship/Part-time
8. **FLYWHEEL Inc.** (Aug-Oct 2020) - Software Engineer Internship
9. **IBM** (Sep 2019/2021) - IT Consultant Internship
10. **teamLab** (Aug 2019) - Software Engineer Internship

### Research Publications (5 Papers)
1. **ICCV 2023**: "Pre-training Vision Transformers with Very Limited Synthesized Images"
2. **CVPR 2023**: "Visual Atoms: Pre-training Vision Transformers with Sinusoidal Waves"
3. **CCCS 2022**: "【メタサーベイ】基盤モデル / Foundation Models"
4. **JSAI 2022**: Location search with geographical features and deep metric learning
5. **CVPR 2022**: "Replacing Labeled Real-Image Datasets With Auto-Generated Contours"

### Education
- **Master's**: Tokyo Institute of Technology (Apr 2021 - Mar 2023), GPA: 3.52
- **Bachelor's**: Tokyo Institute of Technology (Apr 2017 - Mar 2021), GPA: 3.50
- **Advisor**: Prof. Rio Yokota

### Contact Information
- Email: soraemonpockt@rio.gsic.titech.ac.jp
- GitHub: masora1030
- LinkedIn: sora-takashima
- Twitter: soraemonpockts
- AtCoder: Skygood
- Codeforces: soraemonpockt

## Technical Implementation Details

### JavaScript Features
- **Main Class**: `AccuratePortfolio` in `final-accurate-portfolio.js`
- **Game Integration**: `crazy-portfolio-game.js` with mobile touch controls
- **Loading System**: Robust with fallbacks (max 2sec timeout)
- **Keyboard Shortcuts**: Navigation, theme/language toggle
- **Accessibility**: Focus management, keyboard navigation
- **Performance**: Image preloading, lazy loading considerations

### CSS Architecture
- **Modern Variables**: CSS custom properties for theming
- **Responsive Design**: Mobile-first with breakpoints at 768px
- **Animations**: Smooth transitions, scroll-triggered animations
- **Typography**: Inter font family with JetBrains Mono for code
- **Color Scheme**: Professional slate palette with blue accents

### Hidden Game (Easter Egg)
- **Activation**: Click the ⚡ lightning icon (bottom-left)
- **Features**: Mobile-friendly with virtual joystick
- **Technology**: HTML5 Canvas with 2D context
- **Controls**: Touch/mouse + space bar for actions
- **Close**: Click X button or press Escape

## Development Workflow

### Testing Commands
```bash
# No build process required - static site
# Open in browser for testing:
open index_final_accurate.html

# For development server (optional):
python -m http.server 8000
# Then visit: http://localhost:8000/index_final_accurate.html
```

### Quality Assurance Checklist
- [ ] Content matches original index.html exactly
- [ ] Both languages (EN/JP) display correctly
- [ ] Mobile responsiveness on various screen sizes
- [ ] Keyboard navigation works (test with Tab and shortcuts)
- [ ] Loading screen disappears within 2 seconds
- [ ] Easter egg game is discoverable but not obvious
- [ ] All external links work correctly
- [ ] Performance is acceptable (< 3s load time)

### Common Maintenance Tasks

**Content Updates:**
- Always verify against original `index.html` for accuracy
- Update both English and Japanese versions simultaneously
- Test language switching after content changes

**Feature Additions:**
- Add CSS variables for maintainable theming
- Ensure mobile compatibility for any new features
- Include keyboard shortcuts where appropriate
- Test accessibility with screen readers

**Bug Fixes:**
- Check browser console for JavaScript errors
- Validate HTML and CSS for syntax issues
- Test across different browsers (Chrome, Firefox, Safari)

## Deployment Instructions

### Current Deployment
- Hosted on GitHub Pages: `https://masora1030.github.io/soraemonpockt/`
- Currently shows original `index.html`

### To Deploy Modern Version
1. Backup current `index.html`: `mv index.html index_original_backup.html`
2. Deploy modern version: `cp index_final_accurate.html index.html`
3. Copy required assets: Ensure `static/css/final-accurate-style.css` and `static/js/final-accurate-portfolio.js` are present
4. Test live deployment thoroughly
5. Monitor for any path or asset loading issues

### Rollback Plan
If issues occur with modern version:
```bash
mv index.html index_final_accurate.html
mv index_original_backup.html index.html
```

## Known Issues & Considerations

### Fixed Issues
- ✅ Loading screen infinite loop (fixed with timeout fallbacks)
- ✅ Game discovery difficulty (simplified to single icon click)
- ✅ Content accuracy (verified against original)
- ✅ Mobile game controls (implemented virtual joystick)

### Future Enhancements
- Consider adding blog/article section
- Implement contact form with backend
- Add analytics tracking
- Consider performance monitoring
- Add automated testing framework

### Browser Compatibility
- **Modern browsers**: Full feature support
- **Mobile browsers**: Optimized experience with touch controls
- **Older browsers**: Graceful degradation for advanced features
- **IE**: Not supported (uses modern CSS/JS features)

## Important Notes for Claude

### Content Policy
- **NEVER** modify job titles, dates, company names, or publication details
- **ALWAYS** verify content accuracy against original `index.html`
- **PRESERVE** exact wording of technical descriptions where possible

### User Preferences (Based on Previous Feedback)
- Professional over flashy design
- Subtle Easter eggs (not obvious promotional elements)
- Mobile-first responsive design
- Fast loading and good performance
- Accessible and keyboard-friendly
- Bilingual support is mandatory

### Code Standards
- Use modern ES6+ JavaScript features
- Follow mobile-first CSS approach
- Maintain semantic HTML structure
- Include proper ARIA labels for accessibility
- Use CSS custom properties for theming
- Keep file structure organized and logical

This portfolio represents a sophisticated, professional web presence that balances modern design trends with content accuracy and accessibility requirements.
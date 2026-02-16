# 🎨 DEVA Theme Quick Reference

Quick color reference for developers working on the DEVA Career Guidance Application.

---

## 🎯 Primary Colors (Most Used)

```css
/* Main Brand Color - Use for primary buttons, borders, important text */
--primary: #475569          /* Slate Gray */

/* Accent Color - Use for highlights, demo features, special actions */
--accent-amber: #f59e0b     /* Amber/Gold */
```

---

## 🌑 Dark Theme Colors (Onboarding, Quiz, Header)

```css
/* Backgrounds */
--rich-black: #0f172a       /* Main dark background */
--charcoal: #1e293b         /* Card backgrounds */
--dark-gray: #334155        /* Tertiary backgrounds */

/* Text on Dark */
--white: #ffffff            /* Primary text */
--light-gray: #94a3b8       /* Secondary text */
--medium-gray: #64748b      /* Tertiary text */
```

---

## ☀️ Light Theme Colors (Auth, Main App)

```css
/* Backgrounds */
--pearl: #f8fafc            /* Light gradient start */
--white: #ffffff            /* Cards, pure white */

/* Borders */
--platinum: #e2e8f0         /* Light borders */
--silver: #cbd5e1           /* Subtle borders */

/* Text on Light */
--rich-black: #0f172a       /* Primary text */
--dark-gray: #334155        /* Secondary text */
--medium-gray: #64748b      /* Tertiary text */
```

---

## 🎨 Semantic Colors (Status & Feedback)

```css
/* Success */
--accent-emerald: #10b981   /* Green - Success, completed, correct */

/* Error */
--accent-rose: #f43f5e      /* Red - Errors, warnings, incorrect */

/* Info */
--accent-blue: #3b82f6      /* Blue - Information, links */

/* Warning */
--accent-amber: #f59e0b     /* Amber - Warnings, attention needed */
```

---

## 📐 Usage Examples

### Buttons

```css
/* Primary Button */
.btn-primary {
  background: var(--primary);      /* Slate gray */
  color: var(--white);
}

/* Secondary Button */
.btn-secondary {
  background: transparent;
  border: 2px solid var(--primary);
  color: var(--primary);
}

/* Accent Button (Demo, Special) */
.btn-accent {
  background: var(--accent-amber);  /* Amber */
  color: var(--white);
}
```

### Cards

```css
/* Light Card */
.card-light {
  background: var(--white);
  border: 2px solid var(--platinum);
}

/* Dark Card */
.card-dark {
  background: var(--charcoal);
  border: 2px solid var(--dark-gray);
}
```

### Text

```css
/* On Light Background */
.text-primary { color: var(--rich-black); }
.text-secondary { color: var(--dark-gray); }
.text-tertiary { color: var(--medium-gray); }

/* On Dark Background */
.text-light-primary { color: var(--white); }
.text-light-secondary { color: var(--light-gray); }
.text-light-tertiary { color: var(--medium-gray); }
```

### Status Messages

```css
/* Success */
.status-success {
  background: rgba(16, 185, 129, 0.1);
  border: 2px solid var(--accent-emerald);
  color: var(--accent-emerald);
}

/* Error */
.status-error {
  background: rgba(244, 63, 94, 0.1);
  border: 2px solid var(--accent-rose);
  color: var(--accent-rose);
}

/* Info */
.status-info {
  background: rgba(59, 130, 246, 0.1);
  border: 2px solid var(--accent-blue);
  color: var(--accent-blue);
}

/* Warning */
.status-warning {
  background: rgba(245, 158, 11, 0.1);
  border: 2px solid var(--accent-amber);
  color: var(--accent-amber);
}
```

---

## 🎭 Page-Specific Themes

### Authentication Page
```css
background: linear-gradient(180deg, #fafbfc 0%, #f1f5f9 100%);  /* Pearl gradient */
cards: #ffffff;                                                  /* White */
primary-button: #475569;                                         /* Slate gray */
demo-button: #f59e0b;                                           /* Amber */
```

### Onboarding Flow
```css
background: #0f172a;        /* Rich black */
cards: #1e293b;             /* Charcoal */
buttons: #475569;           /* Slate gray */
text: #ffffff;              /* White */
```

### Main Application
```css
header: #1e293b;                                                /* Charcoal */
left-panel: linear-gradient(180deg, #fafbfc 0%, #f1f5f9 100%); /* Pearl gradient */
right-panel: #ffffff;                                           /* White */
cards: #ffffff;                                                 /* White */
borders: #e2e8f0;                                              /* Platinum */
```

### Skill Assessment Quiz
```css
background: #0f172a;        /* Rich black */
cards: #1e293b;             /* Charcoal */
progress: #475569;          /* Slate gray */
accent: #f59e0b;            /* Amber */
```

---

## 🔤 Typography

```css
/* Font Family */
font-family: 'JetBrains Mono', monospace;

/* Font Weights */
font-weight: 400;  /* Regular */
font-weight: 500;  /* Medium */
font-weight: 600;  /* Semi-bold */
font-weight: 700;  /* Bold */

/* Font Sizes */
font-size: 0.75rem;   /* Small labels */
font-size: 0.875rem;  /* Body text */
font-size: 1rem;      /* Default */
font-size: 1.125rem;  /* Large text */
font-size: 1.5rem;    /* Headings */
font-size: 2rem;      /* Large headings */
```

---

## 📏 Spacing & Sizing

```css
/* Padding */
padding: 0.5rem;   /* Small */
padding: 1rem;     /* Medium */
padding: 1.5rem;   /* Large */
padding: 2rem;     /* Extra large */
padding: 3rem;     /* Section padding */

/* Border Radius */
border-radius: 6px;    /* Small (buttons) */
border-radius: 8px;    /* Medium (inputs) */
border-radius: 12px;   /* Large (cards) */
border-radius: 16px;   /* Extra large (sections) */
border-radius: 20px;   /* Rounded (special cards) */

/* Shadows */
box-shadow: 0 2px 8px rgba(0, 0, 0, 0.04);   /* Subtle */
box-shadow: 0 4px 12px rgba(0, 0, 0, 0.08);  /* Soft */
box-shadow: 0 8px 16px rgba(0, 0, 0, 0.12);  /* Medium */
box-shadow: 0 12px 24px rgba(0, 0, 0, 0.16); /* Strong */
```

---

## ⚡ Quick Tips

### DO ✅
- Use CSS variables for all colors
- Use semantic color names (success, error, warning)
- Maintain consistent spacing
- Use JetBrains Mono font
- Keep contrast ratios high (WCAG AA)

### DON'T ❌
- Use hardcoded hex colors
- Mix light and dark themes on same page
- Use gradients on buttons
- Use colors without semantic meaning
- Ignore accessibility guidelines

---

## 🎯 Common Patterns

### Hover Effects
```css
.element:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(71, 85, 105, 0.2);
}
```

### Focus States
```css
.element:focus {
  outline: none;
  border-color: var(--primary);
  box-shadow: 0 0 0 4px rgba(71, 85, 105, 0.1);
}
```

### Transitions
```css
.element {
  transition: all 0.3s ease;
}
```

---

## 📱 Responsive Breakpoints

```css
/* Desktop */
@media (min-width: 1024px) { /* Full layout */ }

/* Tablet */
@media (max-width: 1024px) { /* Adjusted grid */ }

/* Mobile */
@media (max-width: 768px) { /* Single column */ }
```

---

## 🔗 Related Files

- **App.css** - Main theme definitions and CSS variables
- **Auth.css** - Authentication page styles
- **Onboarding.css** - Onboarding flow styles
- **SkillAssessment.css** - Quiz and assessment styles
- **index.css** - Global base styles

---

## 📚 Resources

- [THEME_CONSISTENCY_AUDIT.md](./THEME_CONSISTENCY_AUDIT.md) - Full theme audit
- [THEME_VERIFICATION_COMPLETE.md](./THEME_VERIFICATION_COMPLETE.md) - Verification report
- [App.css](./src/App.css) - CSS variable definitions

---

**Last Updated:** February 16, 2026  
**Version:** 1.0  
**Status:** ✅ Production Ready

# Frontend Viva Preparation Guide

This document covers the most important topics and questions you may be asked in your viva about the frontend of your Personalized Investment Recommendation App.

---

## 1. Project Structure & Entry Point

**Q: What is the entry point of your React frontend?**  
**A:** The entry point is `frontend/src/index.js`. It renders the `<App />` component inside a `ThemeProvider` and `BrowserRouter` for routing and theming.

**Q: Where is the main app logic and routing defined?**  
**A:** In `frontend/src/App.js`. It uses React Router’s `<Routes>` and `<Route>` to define navigation between pages like Login, Register, Dashboard, etc.

---

## 2. Material-UI (MUI) Usage

**Q: Where do you use Material-UI components?**  
**A:** MUI components are used in almost every page and in the NavBar. Example: `frontend/src/components/NavBar.js` uses `AppBar`, `Toolbar`, `Button`, `IconButton`, `Typography`, and MUI icons. Pages like `Dashboard.js`, `Investment.js`, `Recommendation.js`, `RiskProfile.js`, `Login.js`, `Register.js`, and `BankUpload.js` all import and use MUI components for layout, forms, tables, alerts, etc.

**Q: Where do you use MUI icons or colors?**  
**A:** MUI icons are imported from `@mui/icons-material` in files like `NavBar.js`, `Dashboard.js`, `Investment.js`, etc. Colors are managed via the custom theme in `frontend/src/theme.js` and applied using the `ThemeProvider` in `App.js`.

---

## 3. Theming and Styling

**Q: How is theming handled in your app?**  
**A:** The theme is defined in `frontend/src/theme.js` (e.g., colors, spacing, typography). The theme is provided to the app using `ThemeProvider` from `styled-components` in `index.js` and `App.js`. Global styles are set using `createGlobalStyle` from `styled-components` in `App.js`.

**Q: Where can you change the primary color of the app?**  
**A:** In `frontend/src/theme.js`, by modifying the `primary` property.

---

## 4. Navigation

**Q: Where is the navigation bar implemented?**  
**A:** In `frontend/src/components/NavBar.js`. It uses MUI’s `AppBar` and `Toolbar` for the top navigation, and MUI icons for each navigation item.

**Q: How do you handle navigation between pages?**  
**A:** Using React Router’s `<Routes>` and `<Route>` in `App.js`. Navigation actions (like sign out) use the `useNavigate` hook from `react-router-dom`.

---

## 5. Forms and User Input

**Q: Where are forms implemented?**  
**A:** Login: `frontend/src/pages/Login.js`  
Register: `frontend/src/pages/Register.js`  
Risk Profile: `frontend/src/pages/RiskProfile.js`  
Bank Upload: `frontend/src/pages/BankUpload.js`  
Investment: `frontend/src/pages/Investment.js`  
These use MUI components like `TextField`, `Button`, `Select`, `RadioGroup`, etc.

**Q: How is form validation handled?**  
**A:** Basic validation is done in the component’s state logic (e.g., checking password length in `Register.js`).

---

## 6. Tables and Data Display

**Q: Where are tables used to display data?**  
**A:** `frontend/src/pages/Dashboard.js`, `Investment.js`, `Recommendation.js`, and `BankUpload.js` use MUI’s `Table`, `TableBody`, `TableCell`, etc., to display data.

---

## 7. API Integration

**Q: How does the frontend communicate with the backend?**  
**A:** Using `axios` for HTTP requests (see imports in most page components). Example: In `Login.js`, `axios.post("/api/login", { email, password })` is used to log in.

---

## 8. Framer Motion (Animations)

**Q: How is `framer-motion` imported?**  
**A:**
```js
import { motion } from "framer-motion";
```
This import statement is found at the top of many page components, such as:
- `frontend/src/pages/Login.js`
- `frontend/src/pages/Register.js`
- `frontend/src/pages/Dashboard.js`
- `frontend/src/pages/Investment.js`
- `frontend/src/pages/Recommendation.js`
- `frontend/src/pages/RiskProfile.js`
- `frontend/src/pages/BankUpload.js`
- `frontend/src/components/NavBar.js`

**Q: Where is it imported from?**  
**A:** It is imported from the `framer-motion` npm package. The package should be listed in your `frontend/package.json` dependencies (if not, you can add it with `npm install framer-motion`).

**Q: How is it used?**  
**A:** The `motion` object is used to create animated versions of standard HTML or React components. For example, you can use `<motion.div>`, `<motion.button>`, etc., and pass animation props to them.

**Example usage:**
```js
<motion.div
  initial={{ opacity: 0, y: 40 }}
  animate={{ opacity: 1, y: 0 }}
  transition={{ duration: 0.6 }}
>
  {/* Content here */}
</motion.div>
```
This animates the div to fade in and slide up when it appears.

**Q: Why is it used?**  
**A:** To add smooth, modern animations to the UI, such as fading in forms or cards, sliding elements into view, and animating transitions between states.

**Q: Where can you find its usage in your project?**  
**A:** Look for `<motion.div>`, `<motion.form>`, or similar tags in your page components. The animation props (`initial`, `animate`, `transition`, etc.) define how the element animates.

**Q: How to explain in viva?**  
**A:**
> "We use the `framer-motion` library to add animations to our React components. We import the `motion` object from `framer-motion` and use it to wrap elements like divs or forms. For example, in our Login page, we wrap the form in a `<motion.div>` and use props like `initial`, `animate`, and `transition` to make the form fade in and slide up when the page loads. This improves the user experience by making the UI feel more dynamic and modern."

---

## 9. Unique Animations on Each Page

**Q: Did you add animations to every page? Are they all the same?**  
**A:** Yes, we added a unique animation to each main page using framer-motion. No two pages use the same animation style. Each page's main content is wrapped in a <motion.div> with different animation props.

**Animation Summary Table:**

| Page           | Animation Type         |
|----------------|-----------------------|
| Dashboard      | Fade In               |
| BankUpload     | Scale Up              |
| Investment     | Slide In from Left    |
| Recommendation | Slide In from Right   |
| Login          | Slide In from Bottom  |
| Register       | Slide In from Top     |
| RiskProfile    | Rotate In             |
| Profile        | Scale Down (Pop In)   |
| Tips           | Staggered Fade In     |
| NotFound       | Fade In               |

**Q: How did you implement these animations?**  
**A:**
- We imported { motion } from "framer-motion" at the top of each page.
- We wrapped the main content (not NavBar) in a <motion.div>.
- We set the initial, animate, and transition props to achieve the desired effect.
- Each page uses a different animation for a unique user experience.

**Example (Dashboard - Fade In):**
```jsx
<motion.div
  initial={{ opacity: 0 }}
  animate={{ opacity: 1 }}
  transition={{ duration: 0.7 }}
>
  {/* Main dashboard content here */}
</motion.div>
```

This guide should help you answer most frontend viva questions confidently. If you want to add more topics or need code snippets for specific answers, let me know! 
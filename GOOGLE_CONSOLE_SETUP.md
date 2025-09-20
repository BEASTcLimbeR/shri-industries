# Google Console Setup Guide for Shri Industries

This guide will help you set up Google Analytics, Google Search Console, and Google Tag Manager for your website.

## 📋 Prerequisites
- Google account
- Access to your website's code
- Basic understanding of web analytics

---

## 🔍 Step 1: Google Analytics 4 (GA4) Setup

### 1.1 Create Google Analytics Account
1. Go to [Google Analytics](https://analytics.google.com/)
2. Click "Start measuring"
3. Create an account for "Shri Industries"
4. Set up a property for your website

### 1.2 Get Your Measurement ID
1. In GA4, go to **Admin** → **Data Streams**
2. Click on your web stream
3. Copy the **Measurement ID** (starts with G-)

### 1.3 Update Your Code
Replace `GA_MEASUREMENT_ID` in these files:
- `public/index.html` (line with gtag script)
- `src/config/googleAnalytics.js` (MEASUREMENT_ID value)

**Example:**
```javascript
// Replace this:
MEASUREMENT_ID: 'GA_MEASUREMENT_ID'

// With your actual ID:
MEASUREMENT_ID: 'G-XXXXXXXXXX'
```

---

## 🔍 Step 2: Google Search Console Setup

### 2.1 Add Your Property
1. Go to [Google Search Console](https://search.google.com/search-console)
2. Click "Add property"
3. Enter your website URL: `https://www.amlamachines.com`
4. Choose "HTML tag" verification method

### 2.2 Get Verification Code
1. Copy the verification code from Search Console
2. Replace `YOUR_VERIFICATION_CODE` in `public/index.html`

**Example:**
```html
<!-- Replace this: -->
<meta name="google-site-verification" content="YOUR_VERIFICATION_CODE" />

<!-- With your actual code: -->
<meta name="google-site-verification" content="abc123def456ghi789" />
```

### 2.3 Verify Ownership
1. Deploy your updated website
2. Go back to Search Console
3. Click "Verify" button

---

## 🔍 Step 3: Google Tag Manager Setup (Optional)

### 3.1 Create GTM Container
1. Go to [Google Tag Manager](https://tagmanager.google.com/)
2. Create a new account for "Shri Industries"
3. Create a container for your website
4. Copy the **Container ID** (starts with GTM-)

### 3.2 Update Your Code
Replace `GTM_CONTAINER_ID` in `src/config/googleTagManager.js`

**Example:**
```javascript
// Replace this:
CONTAINER_ID: 'GTM_CONTAINER_ID'

// With your actual ID:
CONTAINER_ID: 'GTM-XXXXXXX'
```

### 3.3 Add GTM to Your Website
Add this code to `public/index.html` in the `<head>` section:

```html
<!-- Google Tag Manager -->
<script>(function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':
new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],
j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src=
'https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);
})(window,document,'script','dataLayer','GTM-XXXXXXX');</script>
<!-- End Google Tag Manager -->
```

And add this code right after the `<body>` tag:

```html
<!-- Google Tag Manager (noscript) -->
<noscript><iframe src="https://www.googletagmanager.com/ns.html?id=GTM-XXXXXXX"
height="0" width="0" style="display:none;visibility:hidden"></iframe></noscript>
<!-- End Google Tag Manager (noscript) -->
```

---

## 🔍 Step 4: Testing Your Setup

### 4.1 Test Google Analytics
1. Deploy your website
2. Visit your website
3. Go to GA4 → **Reports** → **Realtime**
4. You should see your visit in real-time

### 4.2 Test Google Search Console
1. Submit your sitemap in Search Console
2. Request indexing for important pages
3. Monitor indexing status

### 4.3 Test Google Tag Manager
1. Use GTM Preview mode
2. Visit your website
3. Check if events are firing correctly

---

## 🔍 Step 5: Custom Event Tracking

### 5.1 Track Product Views
Add this to your product components:

```javascript
import { trackProductView } from './config/googleAnalytics';

// When a product is viewed
trackProductView({
  name: 'Jackfruit Cutting Machine',
  category: 'Food Processing',
  price: '₹50,000'
});
```

### 5.2 Track Contact Form Submissions
Add this to your contact form:

```javascript
import { trackFormSubmit } from './config/googleAnalytics';

// When form is submitted
trackFormSubmit('contact_form');
```

### 5.3 Track Phone/Email Clicks
Add this to your contact buttons:

```javascript
import { trackContactClick } from './config/googleAnalytics';

// When phone is clicked
trackContactClick('phone');

// When email is clicked
trackContactClick('email');
```

---

## 🔍 Step 6: Important Notes

### 6.1 Privacy Compliance
- Ensure you have a privacy policy
- Consider GDPR compliance if serving EU users
- Be careful with personally identifiable information (PII)

### 6.2 Performance
- Google Analytics scripts are loaded asynchronously
- They won't slow down your website
- Consider using Google Tag Manager for better performance

### 6.3 Security
- Never expose API keys in client-side code
- Use environment variables for sensitive data
- Regularly review your analytics data

---

## 🔍 Step 7: Monitoring and Maintenance

### 7.1 Regular Checks
- Monitor GA4 for unusual traffic patterns
- Check Search Console for indexing issues
- Review GTM for any broken tags

### 7.2 Updates
- Keep your tracking code updated
- Monitor for new Google Analytics features
- Update your privacy policy as needed

---

## 🆘 Troubleshooting

### Common Issues:
1. **Analytics not tracking**: Check if Measurement ID is correct
2. **Search Console not verifying**: Ensure meta tag is in `<head>` section
3. **GTM not working**: Check Container ID and script placement

### Getting Help:
- [Google Analytics Help](https://support.google.com/analytics/)
- [Google Search Console Help](https://support.google.com/webmasters/)
- [Google Tag Manager Help](https://support.google.com/tagmanager/)

---

## 📞 Support

If you need help with this setup, contact your web developer or refer to the official Google documentation.

**Remember**: Replace all placeholder values with your actual Google Console IDs and codes!

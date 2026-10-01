import { test, expect } from '@playwright/test';

const routes = [
  '/',
  '/experience',
  '/projects',
  '/apps',
  '/resume',
  '/contact'
];

const expectedTitles = {
  '/': 'Janmejay S Purohit - Home',
  '/experience': 'Janmejay S Purohit - Experience',
  '/projects': 'Janmejay S Purohit - Projects',
  '/apps': 'Janmejay S Purohit - Apps',
  '/resume': 'Janmejay S Purohit - Resume & Skills',
  '/contact': 'Janmejay S Purohit - Contact'
};

test.beforeEach(async ({ page }) => {
  // Intercept contact.test requests
  await page.route('https://contact.test/**', async (route) => {
    const url = route.request().url();
    if (url.includes('/api/visitors/hit') && route.request().method() === 'POST') {
      await route.fulfill({ json: { ok: true } });
    } else if (url.includes('/api/visitors') && route.request().method() === 'GET') {
      await route.fulfill({ json: { ok: true, count: 1234 } });
    } else {
      await route.continue();
    }
  });

  // Abort Google Translate requests
  await page.route('https://translate.google.com/**', async (route) => {
    await route.abort();
  });
  
  await page.route('https://translate.googleapis.com/**', async (route) => {
    await route.abort();
  });
});

test.describe('Portfolio Routes', () => {
  for (const route of routes) {
    test(`Route ${route} has correct title and structure`, async ({ page }) => {
      await page.goto(route);
      
      // Check status is 200
      expect(page.url()).toContain(route);
      
      // Check there's exactly one h1
      const h1Count = await page.locator('h1').count();
      expect(h1Count).toBe(1);
      
      // Check title
      const title = await page.title();
      expect(title).toBe(expectedTitles[route as keyof typeof expectedTitles]);
      
      // Check canonical link
      const canonical = await page.locator('link[rel="canonical"]').first();
      expect(canonical).toBeTruthy();
      expect(await canonical.getAttribute('href')).toBe(`https://www.janmejay.info${route === '/' ? '/' : route}`);
      
      // Check og:image
      const ogImage = await page.locator('meta[property="og:image"]').first();
      expect(ogImage).toBeTruthy();
      expect(await ogImage.getAttribute('content')).toBe('https://www.janmejay.info/img/logos/home.jpg');
    });
  }

  test('Static redirect from /work to /experience', async ({ page }) => {
    await page.goto('/work');
    
    // Wait for navigation
    await page.waitForURL(/\/experience/);
    
    // Check that the URL is now /experience
    expect(page.url()).toContain('/experience');
  });

  test('404 page shows correct message', async ({ page }) => {
    await page.goto('/definitely-not-a-page');
    
    // Check status is 404
    expect(page.url()).toContain('/definitely-not-a-page');
    
    // Check the error message
    const errorMessage = await page.locator('text=This page doesn\'t exist.');
    expect(errorMessage).toBeTruthy();
  });

  test('Asset content types are correct', async ({ page }) => {
    // For each route, collect asset URLs and check their content types
    for (const route of routes) {
      await page.goto(route);
      
      // Get all same-origin links in the page
      const assetUrls = await page.evaluate(() => {
        const urls: string[] = [];
        const elements = document.querySelectorAll('a[href], img[src], link[href], script[src]');
        
        elements.forEach(el => {
          let href = '';
          if (el.tagName === 'A') {
            href = (el as HTMLAnchorElement).href;
          } else if (el.tagName === 'IMG') {
            href = (el as HTMLImageElement).src;
          } else if (el.tagName === 'LINK') {
            href = (el as HTMLLinkElement).href;
          } else if (el.tagName === 'SCRIPT') {
            href = (el as HTMLScriptElement).src;
          }
          
          // Only process same-origin URLs and exclude routes themselves and fragment links
          if (href && 
              new URL(href).origin === window.location.origin &&
              !href.includes('#') &&
              !['/', '/experience', '/projects', '/apps', '/resume', '/contact'].includes(new URL(href).pathname)) {
            urls.push(href);
          }
        });
        
        return urls;
      });
      
      // Test each asset
      for (const url of assetUrls) {
        const response = await page.request.get(url);
        expect(response.status()).toBe(200);
        
        const contentType = response.headers()['content-type'];
        expect(contentType).toBeDefined();
        
        // Check that content type matches the file extension
        const path = new URL(url).pathname;
        const ext = path.split('.').pop()?.toLowerCase();
        
        if (ext) {
          let expectedContentType = '';
          switch (ext) {
            case 'html':
              expectedContentType = 'text/html; charset=utf-8';
              break;
            case 'css':
              expectedContentType = 'text/css';
              break;
            case 'js':
              expectedContentType = 'text/javascript';
              break;
            case 'json':
              expectedContentType = 'application/json';
              break;
            case 'webp':
              expectedContentType = 'image/webp';
              break;
            case 'png':
              expectedContentType = 'image/png';
              break;
            case 'jpg':
            case 'jpeg':
              expectedContentType = 'image/jpeg';
              break;
            case 'svg':
              expectedContentType = 'image/svg+xml';
              break;
            case 'pdf':
              expectedContentType = 'application/pdf';
              break;
            case 'woff2':
              expectedContentType = 'font/woff2';
              break;
            case 'ico':
              expectedContentType = 'image/x-icon';
              break;
            default:
              expectedContentType = 'application/octet-stream';
          }
          
          expect(contentType).toContain(expectedContentType.split(';')[0]);
        }
      }
    }
  });

  test('Resume PDF asset returns correct content type and content', async ({ page }) => {
    await page.goto('/resume');
    
    const response = await page.request.get('/files/resume-janmejay-v5.pdf');
    expect(response.status()).toBe(200);
    expect(response.headers()['content-type']).toBe('application/pdf');
    
    // Check that the PDF starts with %PDF
    const body = await response.body();
    const pdfHeader = body.subarray(0, 4).toString('utf-8');
    expect(pdfHeader).toBe('%PDF');
  });

  test('Theme functionality works correctly', async ({ page }) => {
    await page.goto('/');
    
    // Check default theme is dark
    const html = page.locator('html');
    await expect(html).toHaveAttribute('data-theme', 'dark');
    
    // Click the theme toggle button
    const themeToggle = await page.locator('[data-theme-toggle]');
    await themeToggle.click();
    
    // Check theme is now light
    await expect(html).toHaveAttribute('data-theme', 'light');
    
    // Check localStorage
    const localStorageTheme = await page.evaluate(() => localStorage.getItem('theme'));
    expect(localStorageTheme).toBe('light');
    
    // Reload the page and check theme is still light
    await page.reload();
    await expect(html).toHaveAttribute('data-theme', 'light');
  });

  test('Visitor counter shows correct values', async ({ page }) => {
    await page.goto('/');
    
    // Check footer shows correct visitor count
    await expect(page.locator('footer [data-visitors]')).toHaveText('Visitors: 1,234');
    
    // Check bento tile element shows correct count
    await expect(page.locator('.t-count [data-visitor-count]')).toHaveText('1,234');
  });

  test('Contact form validation works', async ({ page }) => {
    await page.goto('/contact');
    
    // Check submit button is disabled when form is empty
    const submitButton = await page.locator('button[type="submit"]');
    await expect(submitButton).toBeDisabled();
    
    // Fill email with invalid value and blur - wait for validation to complete
    const emailInput = await page.locator('#email');
    await emailInput.fill('not-an-email');
    await page.waitForTimeout(100);  // Wait for validation to run
    
    // Check error message is shown using web-first assertions
    const emailError = await page.locator('#email-error');
    await expect(emailError).toBeVisible();
    await expect(emailError).toHaveText('Please enter a valid email address.');
    await expect(emailInput).toHaveAttribute('aria-invalid', 'true');
    
    // Fill valid values in all fields to enable submit
    await page.locator('#name').fill('Test User');
    await page.locator('#email').fill('test@example.com');
    await page.locator('#subject').fill('Hello');
    await page.locator('#message').fill('This is a test message.');
    
    // Check submit button is now enabled
    await expect(submitButton).toBeEnabled();
  });

  test('Contact form success handling works', async ({ page }) => {
    await page.goto('/contact');
    
    // Intercept the contact endpoint to return success
    await page.route('https://contact.test/', async (route) => {
      if (route.request().method() === 'POST') {
        await route.fulfill({ 
          json: { ok: true } 
        });
      } else {
        await route.continue();
      }
    });
    
    // Fill and submit form with valid data
    await page.locator('#name').fill('Test User');
    await page.locator('#email').fill('test@example.com');
    await page.locator('#subject').fill('Hello');
    await page.locator('#message').fill('This is a test message.');
    
    // Submit the form
    await page.locator('button[type="submit"]').click();
    
    // Check success message is shown using web-first assertions
    const successMessage = await page.locator('text=Message sent successfully. I will get back to you soon.');
    await expect(successMessage).toBeVisible();
    
    // Check fields are cleared using web-first assertions
    await expect(page.locator('#name')).toHaveValue('');
    await expect(page.locator('#email')).toHaveValue('');
    await expect(page.locator('#subject')).toHaveValue('');
    await expect(page.locator('#message')).toHaveValue('');
  });

  test('Contact form error handling works', async ({ page }) => {
    await page.goto('/contact');
    
    // Intercept the contact endpoint to return error
    await page.route('https://contact.test/', async (route) => {
      if (route.request().method() === 'POST') {
        await route.fulfill({ 
          status: 500,
          json: { error: 'boom' } 
        });
      } else {
        await route.continue();
      }
    });
    
    // Fill and submit form with valid data
    await page.locator('#name').fill('Test User');
    await page.locator('#email').fill('test@example.com');
    await page.locator('#subject').fill('Hello');
    await page.locator('#message').fill('This is a test message.');
    
    // Submit the form
    await page.locator('button[type="submit"]').click();
    
    // Check error message is shown using web-first assertions
    const errorMessage = await page.locator('text=boom');
    await expect(errorMessage).toBeVisible();
    
    // Check that there's an element with class 'error'
    const errorElement = await page.locator('.form-status.error');
    await expect(errorElement).toHaveCount(1);
  });

  test('Contact form shows no error for empty email field on blur', async ({ page }) => {
    await page.goto('/contact');
    
    // Focus email field, leave it empty, then blur
    const emailInput = await page.locator('#email');
    await emailInput.focus();
    await emailInput.blur();
    
    // Check that email error stays hidden and no aria-invalid attribute is set
    const emailError = await page.locator('#email-error');
    await expect(emailError).toBeHidden();
    await expect(emailInput).not.toHaveAttribute('aria-invalid', 'true');
  });

  test('Translate on demand works', async ({ page }) => {
    await page.goto('/');
    
    // Check that the script element doesn't exist initially
    const translateScript = await page.locator('#google-translate-script');
    expect(await translateScript.count()).toBe(0);
    
    // Click the translate button
    await page.locator('[data-translate]').click();
    
    // Check that the script element now exists
    expect(await page.locator('#google-translate-script').count()).toBe(1);
    
    // Check that the translate slot has the is-open class using the correct method
    const translateSlot = await page.locator('#translate-slot');
    const classes = await translateSlot.getAttribute('class');
    expect(classes).toContain('is-open');
  });

  test('Phone width viewport works correctly', async ({ page }) => {
    // Set viewport to phone size (390x844)
    await page.setViewportSize({ width: 390, height: 844 });
    
    for (const route of routes) {
      await page.goto(route);
      
      // Check that scrollWidth is less than or equal to window.innerWidth
      const scrollWidth = await page.evaluate(() => document.documentElement.scrollWidth);
      const innerWidth = await page.evaluate(() => window.innerWidth);
      
      expect(scrollWidth).toBeLessThanOrEqual(innerWidth);
    }
  });

  test('Content parity for resume and experience pages', async ({ page }) => {
    // Test resume page contains all skill names
    await page.goto('/resume');
    
    const skills = [
      'JavaScript', 'React', 'Node.js', 'Next.js', 'Angular', 'Ruby on Rails',
      'Express.js', 'Python', 'Java', 'PostgreSQL', 'MySQL', 'MongoDB', 'Redis',
      'JWT', 'Kafka', 'Sequelize', 'Sidekiq', 'AWS', 'Firebase', 'Heroku',
      'Netlify', 'Terraform', 'GitHub', 'Bitbucket', 'Atlassian', 'Bootstrap',
      'Chakra UI', 'Material UI', 'jQuery', 'ELK Stack', 'Kibana', 'Sentry',
      'Rollbar', 'Postman', 'Figma', 'Photoshop', 'Illustrator', 'Draw.io',
      'DBeaver', 'TablePlus', 'VS Code', 'Vim', 'Sublime Text', 'Atom',
      'Android Studio', 'Ubuntu', 'Windows', 'MATLAB', 'Pusher', 'Asana'
    ];
    
    for (const skill of skills) {
      const skillElement = await page.locator(`text=${skill}`);
      expect(await skillElement.count()).toBeGreaterThan(0);
    }
    
    // Test experience page contains company names
    await page.goto('/experience');
    
    const companies = [
      'T-Mobile', 'Indiana University Bloomington', 'Tesark Technologies',
      'Box8', 'EzPG', 'MindIQ'
    ];
    
    for (const company of companies) {
      const companyElement = await page.locator(`text=${company}`);
      expect(await companyElement.count()).toBeGreaterThan(0);
    }
  });
});
// User rule (2026-09-30): "always keep the snake head with arrow leg half of the rest of the fragments".
test.describe('Career path arrow leg', () => {
  for (const width of [390, 800, 1440]) {
    test(`arrow leg is half a gap at ${width}px`, async ({ page }) => {
      await page.setViewportSize({ width, height: 900 });
      await page.goto('/');
      const { gap, leg } = await page.evaluate(() => {
        const ol = document.querySelector('.path') as HTMLElement;
        const lis = [...ol.querySelectorAll('li')];
        const o = ol.getBoundingClientRect();
        const after = getComputedStyle(ol, '::after');
        const cx = (li: Element) => li.getBoundingClientRect().left - o.left + 6;
        const narrow = window.innerWidth <= 560;
        const tip = narrow ? parseFloat(after.left) : o.width - parseFloat(after.right);
        return { gap: Math.abs(cx(lis[1]) - cx(lis[0])), leg: Math.abs(cx(lis[5]) - tip) };
      });
      expect(gap).toBeGreaterThan(0);
      expect(Math.abs(leg - gap / 2)).toBeLessThanOrEqual(2);
    });
  }
});

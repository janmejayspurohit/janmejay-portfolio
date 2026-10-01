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
  '/': 'Janmejay S Purohit | Full Stack Software Engineer',
  '/experience': 'Experience | Janmejay S Purohit',
  '/projects': 'Projects | Janmejay S Purohit',
  '/apps': 'Apps | Janmejay S Purohit',
  '/resume': 'Resume & Skills | Janmejay S Purohit',
  '/contact': 'Contact | Janmejay S Purohit'
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
      expect(await canonical.getAttribute('href')).toBe(`https://janmejay.info${route === '/' ? '/' : route}`);
      
      // Check og:image
      const ogImage = await page.locator('meta[property="og:image"]').first();
      expect(ogImage).toBeTruthy();
      expect(await ogImage.getAttribute('content')).toBe('https://janmejay.info/og.png');
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
            case 'xml':
              expectedContentType = 'application/xml';
              break;
            case 'txt':
              expectedContentType = 'text/plain';
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
// User rules (2026-09-30): "always keep the snake head with arrow leg half of the rest of the fragments",
// "the leg should be half, the arrow after the half", and the path fills the full width of its box.
test.describe('Career path geometry', () => {
  for (const width of [390, 800, 1440]) {
    test(`leg is half a gap, arrowhead beyond it, at ${width}px`, async ({ page }) => {
      await page.setViewportSize({ width, height: 900 });
      await page.goto('/');
      const m = await page.evaluate(() => {
        const ol = document.querySelector('.path') as HTMLElement;
        const lis = [...ol.querySelectorAll('li')];
        const o = ol.getBoundingClientRect();
        const line = getComputedStyle(ol, '::before');
        const arrow = getComputedStyle(ol, '::after');
        const cx = (li: Element) => li.getBoundingClientRect().left - o.left + 6;
        const narrow = window.innerWidth <= 560;
        // where the line (not the arrowhead) ends after the last stop
        const lineEnd = narrow ? parseFloat(line.left) : o.width - parseFloat(line.right);
        // where the arrowhead's tip is
        const tip = narrow ? parseFloat(arrow.left) : o.width - parseFloat(arrow.right);
        return {
          narrow,
          gap: Math.abs(cx(lis[1]) - cx(lis[0])),
          leg: Math.abs(cx(lis[5]) - lineEnd),
          arrowBeyondLeg: Math.abs(tip - cx(lis[5])) > Math.abs(lineEnd - cx(lis[5])),
          firstDotLeft: lis[0].getBoundingClientRect().left - o.left,
          tipToRightEdge: o.width - tip,
        };
      });
      expect(m.gap).toBeGreaterThan(0);
      expect(Math.abs(m.leg - m.gap / 2)).toBeLessThanOrEqual(2);
      expect(m.arrowBeyondLeg).toBe(true);
      expect(m.firstDotLeft).toBeLessThanOrEqual(1);
      if (!m.narrow) expect(Math.abs(m.tipToRightEdge)).toBeLessThanOrEqual(1);
    });
  }
});

// User rules (2026-09-30) for the Experience roadmap: one continuous line with a stop per role,
// the arrowhead centred on the line, dates directly under the title (not under the logo),
// the logo spanning title + dates, and no card on hover.
test.describe('Experience roadmap', () => {
  test('stops, heading layout and arrow alignment', async ({ page }) => {
    await page.setViewportSize({ width: 1440, height: 900 });
    await page.goto('/experience');
    const m = await page.evaluate(() => {
      const rows = [...document.querySelectorAll<HTMLElement>('.rows > .row')];
      const list = document.querySelector('.rows') as HTMLElement;
      const dotY = parseFloat(getComputedStyle(list).getPropertyValue('--dot-y'));
      const arrow = getComputedStyle(list, '::after');
      return {
        count: rows.length,
        currentCount: rows.filter((r) => r.classList.contains('current')).length,
        firstIsCurrent: rows[0].classList.contains('current'),
        arrowCentre: parseFloat(arrow.left) + parseFloat(arrow.borderLeftWidth),
        rows: rows.map((r) => {
          const top = r.getBoundingClientRect().top;
          const logo = r.querySelector('.row-logo')!.getBoundingClientRect();
          const heading = r.querySelector('.row-heading')!.getBoundingClientRect();
          const title = r.querySelector('.row-title')!.getBoundingClientRect();
          const date = r.querySelector('.row-heading .row-date')!.getBoundingClientRect();
          const line = getComputedStyle(r, '::before');
          const stop = getComputedStyle(r, '::after');
          return {
            lineCentre: parseFloat(line.left) + parseFloat(line.width) / 2,
            stopCentreX: parseFloat(stop.left) + parseFloat(stop.width) / 2,
            stopVsLogo: Math.abs(top + dotY - (logo.top + logo.height / 2)),
            dateBelowTitle: date.top >= title.bottom - 1,
            dateAlignedWithTitle: Math.abs(date.left - title.left),
            dateRightOfLogo: date.left >= logo.right,
            logoVsHeading: Math.abs(logo.height - heading.height),
            borderTop: parseFloat(getComputedStyle(r).borderTopWidth),
          };
        }),
      };
    });
    expect(m.count).toBe(6);
    expect(m.currentCount).toBe(1);
    expect(m.firstIsCurrent).toBe(true);
    for (const r of m.rows) {
      expect(r.lineCentre).toBe(m.arrowCentre);        // arrowhead sits on the line
      expect(r.stopCentreX).toBe(m.arrowCentre);       // so does every stop
      expect(r.stopVsLogo).toBeLessThanOrEqual(1);     // stop level with the logo
      expect(r.dateBelowTitle).toBe(true);
      expect(r.dateAlignedWithTitle).toBeLessThanOrEqual(1);
      expect(r.dateRightOfLogo).toBe(true);
      expect(r.logoVsHeading).toBeLessThanOrEqual(2);  // logo spans title + dates
      expect(r.borderTop).toBe(0);                     // a row border would break the line
    }
  });

  test('hover marks the stop without drawing a card', async ({ page }) => {
    await page.setViewportSize({ width: 1440, height: 900 });
    await page.goto('/experience');
    const row = page.locator('.rows > .row').nth(1);
    const before = await row.evaluate((el) => getComputedStyle(el).backgroundColor);
    await row.locator('.row-title').hover();
    await expect(row.locator('.row-date')).toHaveCSS('color', await page.evaluate(() => {
      const probe = document.createElement('span'); probe.style.color = 'var(--accent)'; document.body.append(probe);
      const c = getComputedStyle(probe).color; probe.remove(); return c;
    }));
    expect(await row.evaluate((el) => getComputedStyle(el).backgroundColor)).toBe(before);
  });
});

test.describe('SEO', () => {
  const ROUTES = ['/', '/experience', '/projects', '/apps', '/resume', '/contact'];
  
  test('robots.txt', async ({ page }) => {
    const response = await page.request.get('/robots.txt');
    expect(response.status()).toBe(200);
    expect(response.headers()['content-type']).toContain('text/plain');
    
    const body = await response.text();
    expect(body).toContain('User-agent: *');
    expect(body).toContain('Allow: /');
    expect(body).toContain('Sitemap: https://janmejay.info/sitemap.xml');
    expect(body).not.toContain('Disallow: /');
  });

  test('sitemap.xml', async ({ page }) => {
    const response = await page.request.get('/sitemap.xml');
    expect(response.status()).toBe(200);
    expect(response.headers()['content-type']).toContain('xml');
    
    const body = await response.text();
    
    // Extract <loc> values
    const locMatches = body.match(/<loc>(.*?)<\/loc>/g);
    expect(locMatches).toBeDefined();
    const locUrls = locMatches!.map(match => match.replace(/<\/?loc>/g, ''));
    expect(locUrls.length).toBe(6);
    
    // Check that all URLs are canonical
    const expectedCanonicals = ROUTES.map(route => `https://janmejay.info${route === '/' ? '/' : route}`);
    expect(new Set(locUrls)).toEqual(new Set(expectedCanonicals));
    
    // Check <lastmod> values
    const lastmodMatches = body.match(/<lastmod>(.*?)<\/lastmod>/g);
    expect(lastmodMatches).toBeDefined();
    expect(lastmodMatches!.length).toBe(6);
    
    // Validate date format (YYYY-MM-DD)
    for (const match of lastmodMatches!) {
      const dateStr = match.replace(/<\/?lastmod>/g, '');
      expect(dateStr).toMatch(/^\d{4}-\d{2}-\d{2}$/);
    }
  });

  test('Head tags for all routes', async ({ page }) => {
    // Collect titles and descriptions for uniqueness check
    const titles: string[] = [];
    const descriptions: string[] = [];
    
    for (const route of ROUTES) {
      await page.goto(route);
      
      // Check <html lang>
      const htmlLang = await page.locator('html').first();
      expect(await htmlLang.getAttribute('lang')).toBe('en');
      
      // Check canonical
      const canonical = await page.locator('link[rel="canonical"]').first();
      expect(canonical).toBeTruthy();
      const expectedCanonical = `https://janmejay.info${route === '/' ? '/' : route}`;
      expect(await canonical.getAttribute('href')).toBe(expectedCanonical);
      
      // Check meta robots
      const robotsMeta = await page.locator('meta[name="robots"]').first();
      expect(robotsMeta).toBeTruthy();
      const robotsContent = await robotsMeta.getAttribute('content');
      expect(robotsContent).toContain('index');
      expect(robotsContent).not.toContain('noindex');
      
      // Check title length (at most 60 characters)
      const title = await page.title();
      expect(title.length).toBeLessThanOrEqual(60);
      titles.push(title);
      
      // Check meta description length (between 110 and 160 inclusive)
      const descriptionMeta = await page.locator('meta[name="description"]').first();
      expect(descriptionMeta).toBeTruthy();
      const descriptionContent = await descriptionMeta.getAttribute('content');
      expect(descriptionContent).toBeDefined();
      expect(descriptionContent!.length).toBeGreaterThanOrEqual(110);
      expect(descriptionContent!.length).toBeLessThanOrEqual(160);
      descriptions.push(descriptionContent!);
      
      // Check og:title
      const ogTitle = await page.locator('meta[property="og:title"]').first();
      expect(ogTitle).toBeTruthy();
      expect(await ogTitle.getAttribute('content')).toBe(title);
      
      // Check og:description
      const ogDescription = await page.locator('meta[property="og:description"]').first();
      expect(ogDescription).toBeTruthy();
      expect(await ogDescription.getAttribute('content')).toBe(descriptionContent);
      
      // Check og:url
      const ogUrl = await page.locator('meta[property="og:url"]').first();
      expect(ogUrl).toBeTruthy();
      expect(await ogUrl.getAttribute('content')).toBe(expectedCanonical);
      
      // Check og:image dimensions
      const ogImageWidth = await page.locator('meta[property="og:image:width"]').first();
      expect(ogImageWidth).toBeTruthy();
      expect(await ogImageWidth.getAttribute('content')).toBe('1200');
      
      const ogImageHeight = await page.locator('meta[property="og:image:height"]').first();
      expect(ogImageHeight).toBeTruthy();
      expect(await ogImageHeight.getAttribute('content')).toBe('630');
      
      // Check twitter:card
      const twitterCard = await page.locator('meta[name="twitter:card"]').first();
      expect(twitterCard).toBeTruthy();
      expect(await twitterCard.getAttribute('content')).toBe('summary_large_image');
    }
    
    // Check that all titles and descriptions are unique
    expect(new Set(titles).size).toBe(6);
    expect(new Set(descriptions).size).toBe(6);
  });

  test('Share image', async ({ page }) => {
    const response = await page.request.get('/og.png');
    expect(response.status()).toBe(200);
    expect(response.headers()['content-type']).toBe('image/png');
    
    // Check PNG dimensions (1200x630)
    const body = await response.body();
    const width = body.readUInt32BE(16);
    const height = body.readUInt32BE(20);
    expect(width).toBe(1200);
    expect(height).toBe(630);
  });

  test('Favicons', async ({ page }) => {
    // Check favicon.svg
    const svgResponse = await page.request.get('/favicon.svg');
    expect(svgResponse.status()).toBe(200);
    expect(svgResponse.headers()['content-type']).toContain('svg');
    
    // Check favicon-48.png
    const png48Response = await page.request.get('/favicon-48.png');
    expect(png48Response.status()).toBe(200);
    expect(png48Response.headers()['content-type']).toBe('image/png');
    
    const png48Body = await png48Response.body();
    const png48Width = png48Body.readUInt32BE(16);
    const png48Height = png48Body.readUInt32BE(20);
    expect(png48Width).toBe(48);
    expect(png48Height).toBe(48);
    
    // Check apple-touch-icon.png
    const appleTouchResponse = await page.request.get('/apple-touch-icon.png');
    expect(appleTouchResponse.status()).toBe(200);
    expect(appleTouchResponse.headers()['content-type']).toBe('image/png');
    
    const appleTouchBody = await appleTouchResponse.body();
    const appleTouchWidth = appleTouchBody.readUInt32BE(16);
    const appleTouchHeight = appleTouchBody.readUInt32BE(20);
    expect(appleTouchWidth).toBe(180);
    expect(appleTouchHeight).toBe(180);
    
    // Check link tags on homepage
    await page.goto('/');
    const faviconLink = await page.locator('link[rel="icon"][type="image/svg+xml"]');
    expect(faviconLink).toBeTruthy();
    expect(await faviconLink.getAttribute('href')).toBe('/favicon.svg');
    
    const appleTouchLink = await page.locator('link[rel="apple-touch-icon"]');
    expect(appleTouchLink).toBeTruthy();
    expect(await appleTouchLink.getAttribute('href')).toBe('/apple-touch-icon.png');
  });

  test('Structured data', async ({ page }) => {
    for (const route of ROUTES) {
      await page.goto(route);
      
      // Get all script[type="application/ld+json"]
      const scripts = await page.locator('script[type="application/ld+json"]').all();
      expect(scripts.length).toBe(1);
      
      // Parse JSON and check structure
      const scriptContent = await scripts[0].textContent();
      expect(scriptContent).toBeDefined();
      
      // JSON.parse throws on invalid structured data, which fails the test.
      const jsonData = JSON.parse(scriptContent!);
      
      expect(jsonData['@context']).toBe('https://schema.org');
      expect(Array.isArray(jsonData['@graph'])).toBe(true);
      
      const graph = jsonData['@graph'];
      
      // Find Person object
      const personObj = graph.find((obj: any) => obj['@type'] === 'Person');
      expect(personObj).toBeDefined();
      expect(personObj.name).toBe('Janmejay S Purohit');
      expect(personObj.url).toBe('https://janmejay.info');
      expect(Array.isArray(personObj.sameAs)).toBe(true);
      expect(personObj.sameAs).toContain('https://www.linkedin.com/in/jsp324/');
      expect(personObj.sameAs).toContain('https://github.com/janmejayspurohit');
      expect(personObj).not.toHaveProperty('telephone');
      
      // Find WebSite object
      const websiteObj = graph.find((obj: any) => obj['@type'] === 'WebSite');
      expect(websiteObj).toBeDefined();
      
      // Check specific route requirements
      if (route === '/') {
        // On homepage, check for ProfilePage
        const profilePageObj = graph.find((obj: any) => obj['@type'] === 'ProfilePage');
        expect(profilePageObj).toBeDefined();
        expect(profilePageObj.mainEntity['@id']).toBe(personObj['@id']);
        // No BreadcrumbList expected on homepage
        const breadcrumbObj = graph.find((obj: any) => obj['@type'] === 'BreadcrumbList');
        expect(breadcrumbObj).toBeUndefined();
      } else {
        // On other routes, check for WebPage and BreadcrumbList
        const webPageObj = graph.find((obj: any) => obj['@type'] === 'WebPage');
        expect(webPageObj).toBeDefined();
        expect(webPageObj.url).toBe(`https://janmejay.info${route === '/' ? '/' : route}`);
        
        // Check BreadcrumbList
        const breadcrumbObj = graph.find((obj: any) => obj['@type'] === 'BreadcrumbList');
        expect(breadcrumbObj).toBeDefined();
        expect(Array.isArray(breadcrumbObj.itemListElement)).toBe(true);
        expect(breadcrumbObj.itemListElement.length).toBe(2);
        expect(breadcrumbObj.itemListElement[1].item).toBe(`https://janmejay.info${route === '/' ? '/' : route}`);
      }
    }
  });

  test('404 noindex', async ({ page }) => {
    await page.goto('/definitely-not-a-page');
    
    const robotsMeta = await page.locator('meta[name="robots"]').first();
    expect(robotsMeta).toBeTruthy();
    const robotsContent = await robotsMeta.getAttribute('content');
    expect(robotsContent).toContain('noindex');
  });

  test('Privacy - phone number not exposed', async ({ page }) => {
    for (const route of ROUTES) {
      await page.goto(route);
      const content = await page.content();
      expect(content).not.toContain('593-8209');
      expect(content).not.toContain('5938209');
      expect(content).not.toContain('(929)');
    }
    
    // Also check 404 page
    await page.goto('/definitely-not-a-page');
    const content = await page.content();
    expect(content).not.toContain('593-8209');
    expect(content).not.toContain('5938209');
    expect(content).not.toContain('(929)');
  });

  test('Images have alt attributes', async ({ page }) => {
    for (const route of ROUTES) {
      await page.goto(route);
      
      // Check that all img elements have alt attributes
      const noAltCount = await page.locator('img:not([alt])').count();
      expect(noAltCount).toBe(0);
    }
  });
});

// The site should be an unambiguous match for a search on the first name alone.
test.describe('Name signals', () => {
  test('home page ties the name "Janmejay" to this person and site', async ({ page }) => {
    await page.goto('/');
    expect((await page.title()).startsWith('Janmejay')).toBe(true);
    await expect(page.locator('h1')).toHaveText(/^Janmejay/);
    await expect(page.locator('#about-title')).toHaveText('About Janmejay');
    const data = JSON.parse((await page.locator('script[type="application/ld+json"]').textContent())!);
    const graph: Record<string, any>[] = data['@graph'];
    const person = graph.find((g) => g['@type'] === 'Person')!;
    const website = graph.find((g) => g['@type'] === 'WebSite')!;
    expect(person.givenName).toBe('Janmejay');
    expect(person.familyName).toBe('Purohit');
    expect(person.alternateName).toContain('Janmejay');
    expect(website.alternateName).toContain('Janmejay');
    expect(website.url).toBe('https://janmejay.info');
    await expect(page.locator('meta[property="profile:first_name"]')).toHaveAttribute('content', 'Janmejay');
    await expect(page.locator('link[rel="me"]')).toHaveCount(2);
  });
});

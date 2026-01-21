# GitHub Portfolio Website

A modern, responsive portfolio website that dynamically displays your GitHub repositories and showcases your coding projects.

## Features

- 🎨 **Modern Design**: Clean, professional layout with smooth animations
- 📱 **Fully Responsive**: Optimized for desktop, tablet, and mobile devices
- 🔄 **Dynamic Repository Loading**: Automatically fetches your GitHub repositories using the GitHub API
- 🔍 **Advanced Filtering**: Filter projects by programming language and sort by various criteria
- 📊 **GitHub Statistics**: Shows repository count, total stars, and languages used
- 🎯 **Project Showcase**: Highlights completed projects with descriptions, technologies used, and live demo links
- 🚀 **Fast Loading**: Optimized performance with efficient API calls
- 💾 **Local Storage**: Remembers your GitHub username for future visits

## How to Use

### 1. Basic Setup

1. Open `index.html` in your web browser
2. Enter your GitHub username in the input field
3. Click "Load My Repositories" to fetch your projects
4. Your portfolio will automatically populate with your repositories

### 2. Customization

#### Personal Information

Edit the following sections in `index.html`:

**Hero Section:**

```html
<h1 class="hero-title">Hi, I'm <span class="highlight">Your Name</span></h1>
<p class="hero-subtitle">Full Stack Developer & Open Source Contributor</p>
<p class="hero-description">
  I create amazing web applications and contribute to open source projects.
  Check out my latest work below!
</p>
```

**About Section:**

```html
<p>
  I'm a passionate developer who loves creating innovative solutions and
  contributing to the open source community...
</p>
```

**Contact Information:**

```html
<div class="contact-item">
  <i class="fas fa-envelope"></i>
  <span>your.email@example.com</span>
</div>
<div class="contact-item">
  <i class="fab fa-linkedin"></i>
  <span>linkedin.com/in/yourprofile</span>
</div>
```

**Skills/Technologies:**

```html
<div class="skill-tags">
  <span class="skill-tag">JavaScript</span>
  <span class="skill-tag">Python</span>
  <span class="skill-tag">React</span>
  <!-- Add your technologies here -->
</div>
```

### 3. Repository Filtering

The website automatically filters your repositories to show:

- ✅ Non-forked repositories (your original work)
- ✅ Repositories with content (size > 0)
- ✅ Active repositories (not archived)

### 4. Demo Links

If your repositories have a homepage URL set in GitHub, it will automatically appear as a "Live Demo" button.

To add homepage URLs to your GitHub repositories:

1. Go to your repository on GitHub
2. Click on the gear icon (Settings) on the right sidebar
3. Scroll down to the "Website" section
4. Enter your live demo URL
5. Save changes

## Features Explained

### GitHub Statistics

- **Repository Count**: Total number of public, non-forked repositories
- **Stars Received**: Combined stars across all your repositories
- **Languages**: Unique programming languages used across your projects

### Sorting Options

- **Recently Updated**: Shows most recently updated repositories first
- **Most Stars**: Displays repositories with the highest star count first
- **Name (A-Z)**: Alphabetical order by repository name
- **Recently Created**: Shows newest repositories first

### View Options

- **Grid View**: Card-based layout (default)
- **List View**: Expanded list format with more details

### Mobile Responsive

- Hamburger menu for mobile navigation
- Responsive grid that adapts to screen size
- Touch-friendly buttons and interactions
- Optimized font sizes for mobile reading

## Technical Details

### Technologies Used

- **HTML5**: Semantic structure and accessibility
- **CSS3**: Modern styling with Flexbox and CSS Grid
- **Vanilla JavaScript**: No frameworks needed, pure JavaScript
- **GitHub API v3**: For fetching repository data
- **Font Awesome**: Icons and visual elements
- **Google Fonts**: Inter font family for modern typography

### API Limitations

- GitHub API allows 60 requests per hour for unauthenticated requests
- The website fetches repository data and language information
- All data is fetched client-side, no backend required

### Browser Support

- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)
- Internet Explorer 11+ (limited support)

## Deployment Options

### 1. GitHub Pages (Recommended)

1. Push your portfolio to a GitHub repository
2. Go to repository Settings → Pages
3. Select source as "Deploy from a branch"
4. Choose "main" branch and "/ (root)" folder
5. Your portfolio will be available at `https://yourusername.github.io/repository-name`

### 2. Netlify

1. Create a free Netlify account
2. Drag and drop your portfolio folder to Netlify
3. Your site will be instantly deployed with a custom URL

### 3. Vercel

1. Create a free Vercel account
2. Connect your GitHub repository
3. Automatic deployment on every push

### 4. Local Development

Simply open `index.html` in any modern web browser.

## Performance Optimization

- Optimized images and fonts
- Efficient API calls with error handling
- Local storage for username persistence
- Lazy loading for smooth scrolling
- Minimal dependencies (only Font Awesome and Google Fonts)

## Security Considerations

- Uses GitHub's public API only
- No sensitive data storage
- Client-side only implementation
- HTTPS recommended for production

## Troubleshooting

**Repository not showing?**

- Make sure the repository is public
- Check that it's not a fork
- Verify the repository has content (not empty)
- Ensure it's not archived

**API rate limit reached?**

- Wait an hour for the limit to reset
- Consider implementing GitHub OAuth for higher limits

**Demo links not working?**

- Ensure the homepage URL is set in your GitHub repository settings
- Verify the URL is correct and accessible

## Contributing

Feel free to fork this project and submit pull requests for improvements:

- Enhanced animations
- Additional themes
- Better mobile experience
- More GitHub API features
- Performance optimizations

## License

This project is open source and available under the [MIT License](LICENSE).

---

**Built with ❤️ and the GitHub API**

Start showcasing your amazing projects today! 🚀

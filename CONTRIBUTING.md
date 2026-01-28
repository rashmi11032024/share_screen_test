# Contributing to Screen Share Test App

Thank you for your interest in contributing! This document provides guidelines for contributing to the project.

## 🚀 Getting Started

1. Fork the repository
2. Clone your fork: `git clone <your-fork-url>`
3. Install dependencies: `npm install`
4. Create a branch: `git checkout -b feature/your-feature-name`
5. Make your changes
6. Test thoroughly
7. Commit: `git commit -m "feat: your feature description"`
8. Push: `git push origin feature/your-feature-name`
9. Open a Pull Request

## 📝 Commit Message Format

We follow conventional commits:

```
feat: add new feature
fix: bug fix
docs: documentation changes
style: code style changes (formatting, etc)
refactor: code refactoring
test: adding or updating tests
chore: maintenance tasks
```

Examples:
- `feat: add audio capture option`
- `fix: resolve memory leak in cleanup`
- `docs: update README with Safari quirks`
- `refactor: extract metadata logic to util`

## 🧪 Testing Requirements

Before submitting a PR:
- [ ] Test in Chrome
- [ ] Test in Edge  
- [ ] Test in Firefox
- [ ] Verify no console errors
- [ ] Check for memory leaks
- [ ] Ensure responsive design works
- [ ] Add debug logs for new features
- [ ] Update documentation

## 💻 Code Style

### TypeScript
- Use TypeScript for all new code
- Define proper types and interfaces
- Avoid `any` type when possible
- Use meaningful variable names

### React
- Use functional components
- Use hooks appropriately
- Clean up in useEffect
- Keep components focused and small
- Extract reusable logic to custom hooks

### Styling
- Use Tailwind CSS classes
- Keep consistent spacing
- Mobile-first approach
- Maintain design consistency

### Logging
- Add debug statements for new logic
- Use the centralized logger utility
- Include relevant context in logs
- Log entry/exit of important functions

## 📁 Project Structure

```
components/     # Reusable UI components
hooks/          # Custom React hooks
types/          # TypeScript type definitions
utils/          # Utility functions
app/            # Next.js pages
```

## 🔍 Code Review Process

PRs will be reviewed for:
1. Functionality - Does it work as intended?
2. Code quality - Is it clean and maintainable?
3. Testing - Is it properly tested?
4. Documentation - Is it documented?
5. Performance - Does it impact performance?
6. Browser compatibility - Does it work across browsers?

## 🐛 Bug Reports

When reporting bugs, include:
- Browser and version
- Operating system
- Steps to reproduce
- Expected behavior
- Actual behavior
- Console errors (if any)
- Screenshots (if applicable)

## 💡 Feature Requests

When suggesting features:
- Explain the use case
- Describe expected behavior
- Consider browser compatibility
- Think about edge cases

## ⚠️ Important Notes

### Do NOT
- Use third-party screen sharing libraries
- Mock media streams in production code
- Break browser API compatibility
- Introduce memory leaks
- Remove error handling
- Skip cleanup logic

### DO
- Follow existing patterns
- Add comprehensive error handling
- Clean up resources properly
- Test across browsers
- Update documentation
- Add debug logging
- Consider mobile users

## 🛠️ Development Workflow

1. **Setup**
   ```bash
   npm install
   npm run dev
   ```

2. **Development**
   - Make changes
   - Test in browser
   - Check console logs
   - Verify cleanup

3. **Testing**
   - Test all permission flows
   - Test all display types
   - Test retry logic
   - Test edge cases
   - Check memory usage

4. **Documentation**
   - Update README if needed
   - Add JSDoc comments
   - Update TESTING.md if adding test cases

5. **Submission**
   - Run `npm run lint`
   - Run `npm run type-check`
   - Commit with conventional format
   - Push and create PR

## 📚 Resources

- [Web API Docs](https://developer.mozilla.org/en-US/docs/Web/API/MediaDevices/getDisplayMedia)
- [Next.js Docs](https://nextjs.org/docs)
- [TypeScript Docs](https://www.typescriptlang.org/docs/)
- [Tailwind CSS Docs](https://tailwindcss.com/docs)

## 🤝 Community

- Be respectful and constructive
- Help others learn
- Share knowledge
- Review PRs thoughtfully
- Report issues clearly

## 📞 Questions?

If you have questions:
1. Check existing issues
2. Read the documentation
3. Ask in discussions
4. Open an issue

## 🙏 Thank You!

Your contributions make this project better for everyone!

---

**Happy Contributing! 🎉**

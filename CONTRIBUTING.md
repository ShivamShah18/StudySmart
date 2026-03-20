# Contributing to StudySmart

Thank you for your interest in contributing to StudySmart! This document provides guidelines and instructions for contributing.

## Code of Conduct

Be respectful, inclusive, and professional in all interactions.

## Ways to Contribute

1. **Report Bugs** - Submit detailed bug reports with reproduction steps
2. **Suggest Features** - Propose new features or improvements
3. **Code Contributions** - Fix bugs or implement features
4. **Documentation** - Improve README, guides, or inline documentation
5. **Testing** - Test features and report issues

## Getting Started

### Fork and Clone

```bash
git clone https://github.com/YOUR_USERNAME/StudySmart.git
cd StudySmart
git remote add upstream https://github.com/ShivamShah18/StudySmart.git
```

### Create a Branch

```bash
git checkout -b feature/your-feature-name
# or
git checkout -b fix/your-bug-fix
```

Use descriptive branch names (e.g., `feature/add-dark-mode`, `fix/camera-permission-issue`)

## Development

### Backend

```bash
cd backend
python -m venv venv
source venv/bin/activate
pip install -r requirements.txt
python app.py
```

### Frontend

```bash
cd new-app
npm install
npm start
```

## Making Changes

### Code Style

- **Python**: Follow PEP 8 guidelines
- **JavaScript/React**: Use consistent formatting
- Use meaningful variable names
- Add comments for complex logic
- Keep functions small and focused

### Testing

- Write tests for new features
- Test both backend and frontend thoroughly
- Test on multiple browsers/devices if possible

### Commits

Use clear, descriptive commit messages:

```bash
# Good
git commit -m "Fix camera permission error on Firefox"
git commit -m "Add task persistence using localStorage"

# Avoid
git commit -m "Fixed stuff"
git commit -m "Updates"
```

## Submitting Changes

### Before Submitting

1. Update your branch with the latest upstream main:
   ```bash
   git fetch upstream
   git rebase upstream/main
   ```

2. Test your changes thoroughly
3. Check code quality and style
4. Update documentation if needed

### Create a Pull Request

1. Push to your fork:
   ```bash
   git push origin feature/your-feature-name
   ```

2. Go to GitHub and create a Pull Request to the main repository
3. Fill in the PR template with:
   - Description of changes
   - Related issue numbers (if applicable)
   - Screenshots/videos for UI changes
   - Testing performed

## Pull Request Requirements

- Clear description of what changed and why
- Related issues linked
- Code follows project style guidelines
- No breaking changes (or clearly documented)
- Tests pass (if applicable)
- Documentation updated

## Issue Reporting

When reporting issues, include:

- **Title**: Clear, concise description
- **Environment**: OS, browser, Python/Node version
- **Steps to Reproduce**: Detailed steps
- **Expected Behavior**: What should happen
- **Actual Behavior**: What actually happens
- **Screenshots/Error Logs**: If applicable

## Feature Requests

Include:

- **Use Case**: Why this feature is needed
- **Proposed Solution**: How it should work
- **Alternatives Considered**: Other approaches
- **Implementation Notes**: Technical suggestions if any

## Development Guidelines

### Adding Dependencies

- Minimize dependencies
- Document why a dependency is added
- Update requirements.txt/package.json
- Consider compatibility

### Database Considerations

- Currently no database integration
- If adding persistent storage, discuss first
- Consider performance implications

### API Changes

- Maintain backward compatibility when possible
- Update API documentation
- Update frontend to match

### Security

- Don't commit sensitive information
- Validate user inputs
- Handle errors gracefully
- Use HTTPS in production

## Documentation

- Update README if features change
- Add comments to complex code
- Update SETUP_INSTRUCTIONS for setup changes
- Include examples for new features

## Testing Checklist

- [ ] Backend works as expected
- [ ] Frontend works as expected
- [ ] No console errors
- [ ] Camera/video functionality tested
- [ ] Timer functionality tested
- [ ] Task creation/deletion tested
- [ ] Data persistence works
- [ ] Responsive design maintained

## Review Process

1. Maintainers review your PR
2. Feedback provided if needed
3. Make requested changes
4. PR gets merged once approved

## Useful Commands

```bash
# Update from upstream
git fetch upstream
git rebase upstream/main

# Clean up local branches
git branch -d feature/your-feature-name

# View changes
git diff
git log --oneline
```

## Questions?

- Check existing issues/PRs
- Create a GitHub Discussion
- Contact maintainers

## Code Examples

### Python Code Style

```python
def process_frame(frame, detectors):
    """
    Process a frame for detection.
    
    Args:
        frame: Input video frame
        detectors: Dictionary of detection models
        
    Returns:
        Dictionary with detection results
    """
    results = {}
    
    try:
        results['faces'] = detectors['face'].detect(frame)
        results['blinks'] = detectors['blink'].detect(frame)
    except Exception as e:
        logger.error(f"Error processing frame: {str(e)}")
        return None
    
    return results
```

### React Code Style

```javascript
const MyComponent = ({ data, onUpdate }) => {
  const [state, setState] = useState(data);
  
  useEffect(() => {
    loadData();
  }, []);
  
  const handleClick = () => {
    onUpdate(state);
  };
  
  return (
    <div className="component">
      {/* Component JSX */}
    </div>
  );
};

export default MyComponent;
```

---

Thank you for contributing to StudySmart! 🎯

---

*Last Updated: March 2026*

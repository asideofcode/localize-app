# Contributing to Localize App

Thank you for your interest in contributing to Localize App, a scenario-based game with a multiple-choice question mechanism. Your contributions are greatly appreciated and will help make the app more effective and engaging.

* [Code of Conduct](#code-of-conduct)
* [How Can I Contribute?](#how-can-i-contribute)
    + [Reporting Bugs](#reporting-bugs)
    + [Suggesting Enhancements](#suggesting-enhancements)
    + [Your First Code Contribution](#your-first-code-contribution)
    + [Pull Requests](#pull-requests)
* [Styleguides](#styleguides)
    + [Git Commit Messages](#git-commit-messages)
    + [JavaScript Styleguide](#javascript-styleguide)
    + [CSS Styleguide](#css-styleguide)
* [Project Structure and Development](#project-structure-and-development)
    + [Getting Started](#getting-started)
    + [Testing and Building](#testing-and-building)
    + [CI/CD](#cicd)
* [Questions?](#questions)

## Code of Conduct
Localize App adheres to a code of conduct. By participating, you are expected to uphold this code.

## How Can I Contribute?

### Reporting Bugs
Before submitting a bug report, check the documentation and perform a search to see if the bug has already been reported. If it has, add a comment to the existing issue.

### Suggesting Enhancements
Feel free to submit suggestions for enhancements, including new features or improvements to existing functionality.

### Your First Code Contribution
Start by looking through "beginner" and "help-wanted" issues to find an appropriate starting point.

### Pull Requests
- Fill in the required template.
- Do not include issue numbers in the PR title.
- Follow the styleguides.
- Verify that all status checks are passing after submission.

## Styleguides
### Git Commit Messages
- Use the present tense and imperative mood.
- Limit the first line to 72 characters.
- Reference issues and pull requests after the first line.

### JavaScript Styleguide
All JavaScript must adhere to [JavaScript Standard Style](https://standardjs.com/).

### CSS Styleguide
- Use CSS modules.

## Project Structure and Development

Development of the project is mainly confined to the `./src` directory. Here's a snapshot of the file tree under the `./src` directory for illustration purposes.
```
|-- App.css
|-- App.js
|-- App.test.js
|-- components
|   |-- Container.js
|   |-- ExitButton.js
|   |-- MultipleChoiceOption.js
|   |-- Oracle.js
|   |-- Scene.js
|   |-- Slides.js
|   `-- SoundPlayer.js
|-- hooks
|   `-- useTimer.js
|-- images
|   `-- diamond.svg
|-- index.css
|-- index.js
|-- lib
|   |-- assetLibrary.js
|   |-- backendService.js
|   `-- processScenes.js
|-- pages
|   |-- Scenario.js
|   |-- Scenario.module.css
|   |-- ScenarioList.js
|   |-- ScenarioList.module.css
|   |-- ScenarioSelection.js
|   |-- SplashScreen.js
|   `-- SplashScreen.module.css
|-- reportWebVitals.js
|-- setupTests.js
`-- sounds
    |-- correctAnswer.mp3
    |-- exampleQuestion.mp3
    `-- wrongAnswer.mp3
```

- `src/components/`: UI components like `Scene`, `Oracle`, etc.
- `src/hooks/`: Custom React hooks.
- `src/images/`: Static images.
- `src/lib/`: Libraries and utilities like `assetLibrary.js`.
- `src/pages/`: Components for entire pages. Main game engine in `Scenario.js`.
- `src/sounds/`: Audio files.
- `docs/SCENARIO.md`: Data schema documentation.
- Data is stored on Firebase. To modify the schema, update the documentation and migrate the database.
- The app uses [React Router v6](https://reactrouter.com/en/6). For new routes, update `App.js`.
- The app uses component local state without complex state management systems.

### Getting Started
- Install Node.js.
- Fork the repository and clone it.
- Install dependencies: `npm install`
- Start the development server: `npm start`
- For detailed instructions, see [Create React App documentation](https://create-react-app.dev/docs/getting-started/).

### Testing and Building
- Run `npm test` for tests.
- `npm run build` to compile the app. See [Create React App documentation](https://create-react-app.dev/docs/production-build/) for more details.

### CI/CD
- Creating a pull request will trigger CI/CD and result in a preview deployment.

## Questions?
If you have any questions or need assistance, feel free to contact the project maintainers through GitHub issues or [other contact methods].

Thank you for contributing to Localize App!

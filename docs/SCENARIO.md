# Scenario

* [Data Structure ](#data-structure)
    + [`initialStateId`](#initialstateid)
    + [`scenes`](#scenes)
        - [Scene Object](#scene-object)
        * [Option Object](#option-object)
* [Functionality](#functionality)
* [Example Scenario](#example-scenario)
    + [Starting Point](#starting-point)
    + [Interpretation of Each Scene](#interpretation-of-each-scene)

## Data Structure 

The data structure for this multiple choice game is designed to support interactive scenes, each with various options. Some scenes require correct answers, and each option can provide immediate feedback.

### `initialStateId`

- **Type**: String
- **Description**: Identifies the initial scene where the game starts. It should correspond to the `id` of one of the scenes in the `scenes` array.

### `scenes`

- **Type**: Array of objects
- **Description**: Contains the details of each interactive scene in the game.

Each object in the `scenes` array represents a scene and has the following structure:

#### Scene Object

- **`id`**:
  - **Type**: String
  - **Description**: A unique identifier for the scene. This `id` is used to reference the scene within the game, especially when defining transitions between scenes.

- **`mustBeCorrect`**:
  - **Type**: Boolean
  - **Description**: Determines whether the scene requires the player to select the correct answer to proceed. If `true`, the scene requires a correct answer. If `false`, any choice can be made without affecting game progression.

- **`narrative`**:
  - **Type**: String
  - **Description**: Describes the content or question of the scene presented to the player.

- **`options`**:
  - **Type**: Array of objects
  - **Description**: Lists the choices available to the player in the scene.

Each object in the `options` array has the following attributes:

##### Option Object

- **`text`**:
  - **Type**: String
  - **Description**: The text of the option displayed to the player.

- **`nextScene`** (optional):
  - **Type**: String
  - **Description**: Specifies the `id` of the scene to transition to if this option is selected. This attribute can be omitted if the option doesn't lead to a new scene, which means we've reached the end.

- **`feedback`** (optional):
  - **Type**: String
  - **Description**: Provides feedback to the player upon selecting this option.

- **`isCorrect`** (optional):
  - **Type**: Boolean
  - **Description**: Should be included and set to `true` for the correct option in scenes where `mustBeCorrect` is `true`. It indicates the correct choice in such scenes.

## Functionality

- The game begins at the scene identified by `initialStateId`.
- In each scene, players are presented with a set of options.
- If a scene requires a correct answer (`mustBeCorrect` is `true`), one of the options must be marked as the correct one.
- Selecting an option triggers the corresponding `feedback`.
- Based on the selected option, the game may move to another scene as indicated by `nextScene`.
- When a player selects an option without a `nextScene` or reaches a scene without `options`, it indicates the completion of the game or the conclusion of that particular narrative path.

## Example Scenario

To illustrate how the data structure is interpreted by the game engine, let's consider the following example:

```json
{
  "initialStateId": "first",
  "scenes": [
    {
      "id": "first",
      "mustBeCorrect": false,
      "narrative": "Select any letter?",
      "options": [
        {
          "text": "A",
          "nextScene": "select-A"
        },
        {
          "text": "B",
          "nextScene": "select-B"
        }
      ]
    },
    {
      "id": "select-A",
      "mustBeCorrect": true,
      "narrative": "Select letter A?",
      "options": [
        {
          "text": "A",
          "feedback": "Yay good job",
          "isCorrect": true
        },
        {
          "text": "B",
          "feedback": "Wrong answer, try again"
        },
        {
          "text": "C",
          "nextScene": "second",
          "feedback": "Really, dummy ?"
        }
      ]
    },
    {
      "id": "select-B",
      "mustBeCorrect": true,
      "narrative": "Select letter B?",
      "options": [
        {
          "text": "A",
          "feedback": "Wrong answer, try again"
        },
        {
          "text": "B",
          "feedback": "Yay good job",
          "isCorrect": true
        },
        {
          "text": "C",
          "feedback": "Really, dummy ?"
        }
      ]
    }
  ]
}
```

In this example, the game engine follows the narrative flow based on the player's choices. Scenes requiring correct answers provide immediate feedback and determine the game's progression. Scenes without a `mustBeCorrect` requirement serve as branching points, allowing the player to explore different paths.

### Starting Point

- **Initial Scene** (`initialStateId: "first"`):
  - The game starts at the scene with the ID `"first"`.

### Interpretation of Each Scene

1. **Scene: "first"**
   - **Narrative**: "Select any letter?"
   - **Options**:
     - "A" leads to the scene `id: "select-A"`.
     - "B" leads to the scene `id: "select-B"`.
   - **Action**: As `mustBeCorrect` is `false`, any option can be chosen without restriction. The choice dictates the next scene.

2. **Scene: "select-A"**
   - **Narrative**: "Select letter A?"
   - **Options**:
     - Choosing "A" gives positive feedback ("Yay good job") and, as there is no `nextScene`, this indicates an end point or transition to a default concluding scene.
     - Choosing "B" provides feedback ("Wrong answer, try again") but doesn't progress the game, indicating a repeat of the choice or an end point.
     - Choosing "C" leads to the `nextScene: "second"`, continuing the game.
   - **Action**: This scene requires the correct answer (`mustBeCorrect` is `true`), and player's choice affects the game flow.

3. **Scene: "select-B"**
   - **Narrative**: "Select letter B?"
   - **Options**:
     - "A" and "C" provide feedback but do not progress the game, potentially indicating an end point or a need to repeat the choice.
     - "B" gives positive feedback ("Yay good job"), and the absence of `nextScene` suggests the conclusion of this game path.
   - **Action**: Like the previous scene, a correct choice is required here. The player's decision impacts the continuation or conclusion of the game.



const scenariosDB = {
    letters: {
        "initialStateId": "start",
        "title": "Letters",
        "scenes": [
            {
                "id": "start",
                "mustBeCorrect": false,
                "narrative": "Pick a letter",
                "options": [
                    {
                        "text": "A",
                        "nextScene": "A",
                    },
                    {
                        "text": "B",
                        "nextScene": "B",
                    },
                ]
            },
            {
                "id": "A",
                "mustBeCorrect": true,
                "narrative": "Which one is A?",
                "options": [
                    {
                        "text": "A",
                        "nextScene": "conclusion",
                        "feedback": "No, this is A!",
                        "isCorrect": true,
                        "feedback": "Correct!"
                    },
                    {
                        "text": "B",
                        "feedback": "No, this is B!"
                    },
                ]
            },
            {
                "id": "B",
                "mustBeCorrect": true,
                "narrative": "Which one is B?",
                "options": [
                    {
                        "text": "A",
                        "feedback": "No, this is A!",
                    },
                    {
                        "text": "B",
                        "nextScene": "conclusion",
                        "feedback": "No, this is B!",
                        "isCorrect": true,
                        "feedback": "Correct!"
                    },
                ]
            },
            {
                "id": "conclusion",
                "narrative": "All done, well done.",
                "options": []
            }
        ]
    },

}
export async function fetchScenario(id) {
    const scenario = scenariosDB[id];

    if (!scenario) return null;

    return { id, ...scenario };
};

export async function fetchScenarios(pageSize = 10, startAfterDoc = null) {
    const scenarios = Object.entries(scenariosDB).map(([key, value]) => ({ id: key, ...value }));

    return { scenarios, lastVisible: null };
};


export default {
    fetchScenario,
    fetchScenarios
}
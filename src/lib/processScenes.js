// Determines distances from the initial scene to all other scenes
// This is used to determine the progress of the user
// and relies on all scenarios having a single initial scene and a single ending scene
export function processScenes(scenes, initialStateId) {
  let distances = {};
  let queue = [{ id: initialStateId, distance: 0, visited: new Set([initialStateId]) }];

  const imageURLs = new Set();
  const soundURLs = new Set();

  while (queue.length > 0) {
    let { id, distance, visited } = queue.shift();

    distances[id] = Math.max(distances[id] || 0, distance);

    const scene = scenes.find(scene => scene.id === id);
    if (scene) {
      imageURLs.add(scene.imageURL);
      soundURLs.add(scene.soundURL);

      scene.options.forEach(option => {
        imageURLs.add(option.imageURL);

        if ((!scene.mustBeCorrect || (scene.mustBeCorrect && option.isCorrect)) && !visited.has(option.nextScene)) {
          let newVisited = new Set(visited);
          newVisited.add(option.nextScene);
          queue.push({ id: option.nextScene, distance: distance + 1, visited: newVisited });
        }
      });
    }
  }

  return [distances, Math.max(...Object.values(distances)), imageURLs, soundURLs];
}
